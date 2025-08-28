from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from apps.job_seekers.models import JobSeeker
from core.constants.s3.constants import FILE_TYPES, UPLOAD_STATUS, OVERRIDE_FILE_TYPES
from services.job_seeker.file_upload_service import FileUploadService
from services.storage.s3_service import S3Service
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema
from apps.authentication.models import FileUpload
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["Profile Upload"])
class ProfileImageUploadAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Generate presigned URL for profile image upload",
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
               
               response_data = FileUploadService.generate_file_upload_url(request.user, filename, file_size, content_type, FILE_TYPES.PROFILE_IMAGE)
               
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
               
               # Validation
               if not filename:
                    raise ValidationError("filename is required")
               if not file_size:
                    raise ValidationError("file_size is required")
               
               # Convert file_size to integer and validate
               try:
                    file_size = int(file_size)
                    if file_size > 10 * 1024 * 1024:  # 10MB limit for resumes
                         raise ValidationError("File size cannot exceed 10MB")
                    if file_size < 1:
                         raise ValidationError("File size must be greater than 0")
               except ValueError:
                    raise ValidationError("Invalid file_size format")
               
               # Auto-detect content type if not provided
               if not content_type:
                    content_type = S3Service.get_content_type_from_filename(filename)
               
               # Validate document content type
               allowed_doc_types = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain'
               ]
               if content_type not in allowed_doc_types:
                    raise ValidationError(f"Only document files are allowed. Supported: PDF, DOC, DOCX, TXT")
               
               # Cancel any pending resume uploads
               pending_upload = FileUpload.objects.filter(
                    user=request.user,
                    file_type='resume',
                    upload_status='pending'
               ).first()
               
               if pending_upload:
                    pending_upload.upload_status = 'cancelled'
                    pending_upload.save()
                    logger.info(f"Cancelled pending resume upload {pending_upload.id} for user {request.user.id}")
               
               # Delete previous uploaded resume
               previous_resumes = FileUpload.objects.filter(
                    user=request.user,
                    file_type='resume',
                    upload_status='uploaded'
               )
               
               for prev_resume in previous_resumes:
                    S3Service.delete_file(prev_resume.file_path)
                    prev_resume.upload_status = 'deleted'
                    prev_resume.save()
                    logger.info(f"Deleted previous resume {prev_resume.id} for user {request.user.id}")
               
               # Generate unique file path
               file_path = S3Service.generate_unique_file_path(
                    file_type='resume',
                    original_filename=filename
               )
               
               # Generate presigned URL
               upload_data = S3Service.generate_presigned_upload_url(
                    file_path=file_path,
                    file_type=content_type,
                    file_size=file_size,
                    expiration=3600
               )
               
               if not upload_data:
                    raise ValidationError("Failed to generate upload URL")
               
               # Create tracking record
               file_upload = FileUpload.objects.create(
                    user=request.user,
                    file_type='resume',
                    original_filename=filename,
                    file_path=file_path,
                    file_size=file_size,
                    content_type=content_type,
                    upload_status='pending',
                    upload_url_expires_at=datetime.now() + timedelta(hours=1)
               )
               
               response_data = {
                    'upload_id': str(file_upload.id),
                    'upload_url': upload_data['upload_url'],
                    'fields': upload_data['fields'],
                    'file_path': file_path,
                    'expires_in': 3600,
                    'max_file_size': '10MB',
                    'allowed_types': allowed_doc_types
               }
               
               logger.info(f"Generated resume upload URL for user {request.user.id}, upload_id: {file_upload.id}")
               
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
          summary="Confirm profile file upload and update user profile",
          request={
               'application/json': {
                    'type': 'object',
                    'properties': {
                         'upload_id': {'type': 'string', 'description': 'Upload ID from generate URL endpoint'},
                         'file_size': {'type': 'integer', 'description': 'Actual uploaded file size (optional)'},
                    },
                    'required': ['upload_id']
               }
          }
     )
     def post(self, request):
          """
          Confirm profile file upload and update TalentCloudUser profile
          """
          try:
               upload_id = request.data.get('upload_id')
               file_size = request.data.get('file_size')
               
               if not upload_id:
                    raise ValidationError("upload_id is required")
               
               # Get upload record
               try:
                    file_upload = FileUpload.objects.get(
                         id=upload_id,
                         user=request.user,
                         upload_status=UPLOAD_STATUS.PENDING
                    )
               except FileUpload.DoesNotExist:
                    raise ValidationError("Invalid upload_id or upload already processed")

               # Update upload record
               file_upload = FileUploadService.update_file_upload_status(file_upload, file_size)
               
               # Generate download URL for response
               public_url = S3Service.get_public_url(
                    file_upload.file_path
               )
               
               # Update TalentCloudUser profile based on file type
               try:
                    from apps.job_seekers.models import TalentCloudUser
                    job_seeker = JobSeeker.objects.get(id=request.user.id)
                    
                    if file_upload.file_type == 'profile_image':
                         job_seeker.profile_image_url = file_upload.file_path
                         logger.info(f"Updated profile image for user {request.user.id}")
                    elif file_upload.file_type == 'resume':
                         job_seeker.resume_url = file_upload.file_path
                         logger.info(f"Updated resume for user {request.user.id}")
                    
                    job_seeker.save()
                    profile_updated = True
                    
               except TalentCloudUser.DoesNotExist:
                    logger.warning(f"TalentCloudUser not found for user {request.user.id}")
                    profile_updated = False
               
               # if file_upload.file_type in OVERRIDE_FILE_TYPES:
               # delete_previous_files_task.delay(
               #      user_id=request.user.id,
               #      file_type=file_upload.file_type,
               #      exclude_upload_id=file_upload.id
               # )
                    
               response_data = {
                    'upload_id': str(file_upload.id),
                    'file_type': file_upload.file_type,
                    'file_path': file_upload.file_path,
                    'url': public_url,
                    'uploaded_at': file_upload.uploaded_at.isoformat(),
                    'upload_status': UPLOAD_STATUS.UPLOADED,
                    'profile_updated': profile_updated
               }
               
               logger.info(f"Confirmed upload {file_upload.id} for user {request.user.id}")
               
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