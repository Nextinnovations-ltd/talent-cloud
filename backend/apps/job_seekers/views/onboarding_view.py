from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from services.job_seeker.job_seeker_service import JobSeekerService
from services.storage.s3_service import S3Service
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["S3 Upload"])
class S3UploadAPIView(APIView):
     def get(self, request):
          file_path = f"orders/dlfjd.jpeg"
          
          url = S3Service.generate_presigned_url(file_path)
          
          return Response(CustomResponse.success("Presigned url is successfully generated.", { 'presigned_url': url }), status = status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker"])
class ModifyUsernameAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def post(self, request):
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          user = request.user
          
          JobSeekerService.modify_jobseeker_username(user, request.data.get('username'))
          
          return Response(CustomResponse.success("Username has changed successfully."), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker Onboarding"])
class OnboardingAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          data = request.query_params

          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          user = request.user
          step = int(data.get('step', None))

          if not step:
               raise ValidationError("Step is required.")
          
          result = JobSeekerService.get_onboarding_data(user, step)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

     def post(self, request):
          data = request.data
          
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")

          user = request.user
          step = int(data.get('step', '0'))

          result = JobSeekerService.perform_onboarding(user, step, data)
          return Response(CustomResponse.success(result['message']), status=status.HTTP_200_OK)