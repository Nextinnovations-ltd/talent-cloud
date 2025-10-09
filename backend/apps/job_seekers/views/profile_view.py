from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from services.job_seeker.profile_service import ProfileService
from services.job_seeker.job_seeker_service import JobSeekerService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from services.job_seeker.profile_score_service import ProfileScoreService
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerResumeAPIView(APIView):
     """Retrieve job seeker resume"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          response = JobSeekerService.get_job_seeker_resume_info(request.user)
          
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerResumeListAPIView(APIView):
     """Retrieve job seeker resume"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          resume_list = ProfileService.get_user_resume_list(request.user)
          
          return Response(CustomResponse.success('Successfully retrieved resume list', resume_list), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerDefaultResumeAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def post(self, request, resume_id):
          default_resume = ProfileService.set_default_resume(request.user, resume_id)
          
          return Response(CustomResponse.success('Successfully set the resume as default.', default_resume), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerDeleteResumeAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def post(self, request, resume_id):
          ProfileService.delete_uploaded_resume(request.user, resume_id)
          
          return Response(CustomResponse.success('Successfully delete the resume.'), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerProfileSelectionOptionsAPIView(APIView):
     """Retrieve selection option for specialization and experience level in profile section"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          response = JobSeekerService.get_job_seeker_profile_section_options()
          
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerProfileAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          user = request.user
          
          response = JobSeekerService.get_job_seeker_profile_info(user)

          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)
     
     def post(self, request, *args, **kwargs):
          """Update job seeker's profile"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          user = request.user

          response = JobSeekerService.perform_job_seeker_profile_info_update(user, request.data)

          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerVideoAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get(self, request):
          response = JobSeekerService.get_job_seeker_video_url(request.user)
               
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

     def post(self, request):
          """Update job seeker's video url"""
          response = JobSeekerService.update_job_seeker_video_url(request.user, request.data)

          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)
     
     def delete(self, request):
          """Delete job seeker's video url"""
          response = JobSeekerService.delete_job_seeker_video_url(request.user)

          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerSkillAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = JobSeekerService.get_job_seeker_skills(request.user)
          
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

     def post(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = JobSeekerService.perform_job_seeker_skills_update(request.user, request.data)
          
          return Response(CustomResponse.success(
               response['message'], response['data']
          ), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerSettingAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = JobSeekerService.get_job_seeker_setting_info(request.user)
          
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerLanguageAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = JobSeekerService.get_job_seeker_langauges(request.user)
     
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

     def post(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = JobSeekerService.perform_job_seeker_languages_update(request.user, request.data)

          return Response(CustomResponse.success(response['message']), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Profile Score"])
class ProfileScoreAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          response = ProfileScoreService.generate_profile_completion_percentage(request.user)
          
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)
          