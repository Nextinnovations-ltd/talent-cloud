from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from apps.job_seekers.models import JobSeekerSpecialSkill
from apps.job_seekers.serializers.special_skills_serializer import (
    JobSeekerSpecialSkillDisplaySerializer,
    JobSeekerSpecialSkillCreateUpdateSerializer
)
from core.middleware.permission import TalentCloudUserPermission
from core.middleware.authentication import TokenAuthentication
from utils.response import CustomResponse


@extend_schema(tags=["Job Seeker Special Skills"])
class JobSeekerSpecialSkillListAPIView(APIView):
     """
     List all special skills for the authenticated job seeker
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          """Get all special skills for the authenticated job seeker"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          special_skills = JobSeekerSpecialSkill.objects.filter(
               user=job_seeker
          ).select_related('skill').order_by('-year_of_experience')
          
          serializer = JobSeekerSpecialSkillDisplaySerializer(
               special_skills, 
               many=True,
               context={'request': request}
          )
          
          return Response(
               CustomResponse.success(
                    "Special skills retrieved successfully.",
                    serializer.data
               ),
               status=status.HTTP_200_OK
          )
     
     def post(self, request):
          """Create a new special skill"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          serializer = JobSeekerSpecialSkillCreateUpdateSerializer(
               data=request.data,
               context={'request': request}
          )
          
          if serializer.is_valid():
               serializer.save()
               
               return Response(
                    CustomResponse.success(
                         "Special skill created successfully.",
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


@extend_schema(tags=["Job Seeker Special Skills"])
class JobSeekerSpecialSkillDetailAPIView(APIView):
     """
     Retrieve, update or delete a specific special skill
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get_object(self, request, skill_id):
          """Get special skill object ensuring it belongs to the authenticated user"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return None
               
          return get_object_or_404(
               JobSeekerSpecialSkill,
               id=skill_id,
               user=job_seeker
          )

     def get(self, request, skill_id):
          """Get a specific special skill"""
          special_skill = self.get_object(request, skill_id)
          if not special_skill:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          serializer = JobSeekerSpecialSkillDisplaySerializer(
               special_skill,
               context={'request': request}
          )
          
          return Response(
               CustomResponse.success(
                    "Special skill retrieved successfully.",
                    serializer.data
               ),
               status=status.HTTP_200_OK
          )
     
     def put(self, request, skill_id):
          """Update a special skill"""
          special_skill = self.get_object(request, skill_id)
          if not special_skill:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          serializer = JobSeekerSpecialSkillCreateUpdateSerializer(
               instance=special_skill,
               data=request.data,
               partial=True,
               context={'request': request}
          )
          
          if serializer.is_valid():
               serializer.save()
               return Response(
                    CustomResponse.success(
                         "Special skill updated successfully.",
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

     def delete(self, request, skill_id):
          """Delete a special skill"""
          special_skill = self.get_object(request, skill_id)
          if not special_skill:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          special_skill.delete()
          
          return Response(
               CustomResponse.success("Special skill deleted successfully."),
               status=status.HTTP_200_OK
          )
