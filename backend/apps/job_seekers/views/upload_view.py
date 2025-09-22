from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from services.job_seeker.profile_service import ProfileService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["Profile Upload"])
class ProfileImageUploadAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Generate presigned URL for profile image upload"
     )
     def post(self, request):
          """
          Generate presigned URL when user confirms profile image upload
          """
          try:
               filename = request.data.get('filename')
               file_size = request.data.get('file_size')
               content_type = request.data.get('content_type')
               
               if not filename:
                    raise ValidationError("filename is required")
               if not file_size:
                    raise ValidationError("file_size is required")
               if len(filename.strip()) == 0:
                    raise ValidationError("filename cannot be empty")
               
               response_data = ProfileService.generate_profile_image_upload_url(request.user, filename, file_size, content_type)
               
               logger.info(f"Generated profile image upload URL for user {request.user.id}, upload_id: {response_data['upload_id']}")
               
               return Response(
                    CustomResponse.success("Profile image upload URL generated", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in profile image upload: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error generating profile image upload URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate upload URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Resume Upload"])
class ProfileResumeUploadAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Generate presigned URL for resume/CV upload",
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
     def post(self, request):  # Changed from GET to POST
          """
          Generate presigned URL when user confirms resume upload
          """
          try:
               filename = request.data.get('filename')  # Changed from query_params
               file_size = request.data.get('file_size')
               content_type = request.data.get('content_type')
               
               if not filename:
                    raise ValidationError("filename is required")
               if not file_size:
                    raise ValidationError("file_size is required")
               if len(filename.strip()) == 0:
                    raise ValidationError("filename cannot be empty")
               
               response_data = ProfileService.generate_profile_resume_upload_url(request.user, filename, file_size, content_type)
               
               logger.info(f"Generated resume upload URL for user {request.user.id}, upload_id: {response_data['upload_id']}")
               
               return Response(
                    CustomResponse.success("Resume upload URL generated", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in resume upload: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error generating resume upload URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate upload URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Profile Upload"])
class ConfirmProfileUploadAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Confirm profile file upload and update user profile"
     )
     def post(self, request):
          """
          Confirm profile file upload and update TalentCloudUser profile
          """
          try:
               upload_id = request.data.get('upload_id')
               
               if not upload_id:
                    raise ValidationError("upload_id is required")
                    
               response_data = ProfileService.confirm_profile_upload(request.user, upload_id)
               
               logger.info(f"Confirmed upload {response_data['upload_id']} for user {request.user.id}")
               
               return Response(
                    CustomResponse.success("Profile file uploaded and profile updated", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in upload confirmation: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error confirming profile upload: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to confirm upload"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )