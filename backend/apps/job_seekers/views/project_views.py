from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from apps.job_seekers.models import JobSeekerProject
from apps.job_seekers.serializers.project_serializer import (
    JobSeekerProjectDisplaySerializer,
    JobSeekerProjectCreateUpdateSerializer
)
from services.job_seeker.project_service import ProjectService
from core.constants.s3.constants import FILE_TYPES
from services.job_seeker.file_upload_service import FileUploadService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["Cover Upload"])
class ProjectImageUploadUrlAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Generate presigned URL for project image upload",
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                        'filename': {'type': 'string', 'description': 'Original filename'},
                        'file_size': {'type': 'integer', 'description': 'File size in bytes'},
                        'content_type': {'type': 'string', 'description': 'MIME type (optional)'},
                },
                'required': ['filename', 'file_size']
            }
        }
    )
    def post(self, request):
        """
        Generate presigned URL when user confirms project image upload
        """
        try:
            filename = request.data.get('filename')
            file_size = request.data.get('file_size')
            content_type = request.data.get('content_type')
            
            # Validation
            if not filename:
                raise ValidationError("filename is required")
            if not file_size:
                raise ValidationError("file_size is required")
            if len(filename.strip()) == 0:
                raise ValidationError("filename cannot be empty")
            
            response_data = FileUploadService.generate_file_upload_url(request.user, filename, file_size, content_type, FILE_TYPES.PROJECT_IMAGE)
            
            logger.info(f"Generated project image upload URL for user {request.user.id}")
            
            return Response(
                CustomResponse.success("project image upload URL generated", response_data),
                status=status.HTTP_200_OK
            )
            
        except ValidationError as e:
            logger.warning(f"Validation error in project image upload: {str(e)}")
            return Response(
                CustomResponse.error(str(e)),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error generating project image upload URL: {str(e)}")
            return Response(
                CustomResponse.error("Failed to generate upload URL"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
        
        upload_id = request.data.get('project_image_upload_id')
        
        if not upload_id:
            raise ValidationError("Project Image file required.")
        
        serializer = JobSeekerProjectCreateUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # serializer.save()
            project_data = ProjectService.performed_project_creation(job_seeker, serializer.validated_data, upload_id)
            
            return Response(
                CustomResponse.success(
                    "Project created successfully.",
                    project_data
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
