from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from apps.job_seekers.models import JobSeekerProject
from apps.job_seekers.serializers.project_serializer import (
    JobSeekerProjectDisplaySerializer,
    JobSeekerProjectCreateUpdateSerializer
)
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse


@extend_schema(tags=["Job Seeker Projects"])
class JobSeekerProjectListAPIView(APIView):
    """
    List all projects for the authenticated job seeker and create new projects
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    def get(self, request):
        """Get all projects for the authenticated job seeker"""
        try:
            job_seeker = request.user.jobseeker
        except AttributeError:
            return Response(
                CustomResponse.error("Job seeker profile not found."),
                status=status.HTTP_404_NOT_FOUND
            )
        
        projects = JobSeekerProject.objects.filter(
            user=job_seeker
        ).order_by('-start_date', '-created_at')
        
        serializer = JobSeekerProjectDisplaySerializer(
            projects, 
            many=True,
            context={'request': request}
        )
        
        return Response(
            CustomResponse.success(
                "Projects retrieved successfully.",
                serializer.data
            ),
            status=status.HTTP_200_OK
        )
    
    def post(self, request):
        """Create a new project"""
        try:
            job_seeker = request.user.jobseeker
        except AttributeError:
            return Response(
                CustomResponse.error("Job seeker profile not found."),
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = JobSeekerProjectCreateUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                CustomResponse.success(
                    "Project created successfully.",
                    serializer.data
                ),
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            CustomResponse.error(
                "Validation failed.",
                serializer.errors
            ),
            status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(tags=["Job Seeker Projects"])
class JobSeekerProjectDetailAPIView(APIView):
    """
    Retrieve, update or delete a specific project
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]

    def get_object(self, request, project_id):
        """Get project object ensuring it belongs to the authenticated user"""
        try:
            job_seeker = request.user.jobseeker
        except AttributeError:
            return None

        return get_object_or_404(
            JobSeekerProject,
            id=project_id,
            user=job_seeker
        )

    def get(self, request, project_id):
        """Get a specific project"""
        project = self.get_object(request, project_id)
        
        if not project:
            return Response(
                CustomResponse.error("Job seeker profile not found."),
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = JobSeekerProjectDisplaySerializer(
            project,
            context={'request': request}
        )
        
        return Response(
            CustomResponse.success(
                "Project retrieved successfully.",
                serializer.data
            ),
            status=status.HTTP_200_OK
        )

    def put(self, request, project_id):
        """Update a project (full update)"""
        project = self.get_object(request, project_id)
        
        if not project:
            return Response(
                CustomResponse.error("Job seeker profile not found."),
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = JobSeekerProjectCreateUpdateSerializer(
            instance=project,
            data=request.data,
            partial=True,  # Allow partial updates
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                CustomResponse.success(
                    "Project updated successfully.",
                    serializer.data
                ),
                status=status.HTTP_200_OK
            )
        
        return Response(
            CustomResponse.error(
                "Validation failed.",
                serializer.errors
            ),
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, project_id):
        """Delete a project"""
        project = self.get_object(request, project_id)

        if not project:
            return Response(
                CustomResponse.error("Job seeker profile not found."),
                status=status.HTTP_404_NOT_FOUND
            )

        project.delete()

        return Response(
            CustomResponse.success("Project deleted successfully."),
            status=status.HTTP_200_OK
        )
