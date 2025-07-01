from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from services.job_seeker.job_seeker_service import JobSeekerService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from services.job_seeker.profile_score_service import ProfileScoreService
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

# region Profile Section One

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

# endregion Profile Section One


# region Profile Section Two
@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerSkillSelectionOptionAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          response = JobSeekerService.get_skill_options()
          
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

# region Profile Section Two

@extend_schema(tags=["Job Seeker Profile"])
class JobSeekerSocialLinkAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          response = JobSeekerService.get_job_seeker_social_link(request.user)
               
          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

     def post(self, request):
          """Update job seeker's social links"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          response = JobSeekerService.perform_job_seeker_social_link_update(request.user, request.data)

          return Response(CustomResponse.success(response['message'], response['data']), status=status.HTTP_200_OK)

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
class LanguageOptionAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          response = JobSeekerService.get_language_options()
          
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
          