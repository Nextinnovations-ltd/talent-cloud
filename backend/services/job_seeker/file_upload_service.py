from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
from apps.authentication.models import FileUpload
from core.constants.s3.constants import FILE_TYPES, OVERRIDE_FILE_TYPES
from services.storage.s3_service import S3Service
import logging

logger = logging.getLogger(__name__)

class FileUploadService:
     @staticmethod
     def generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.PROFILE_IMAGE):
          try:
               # Convert file_size to integer and validate
               file_size = int(file_size)
               
               if not content_type:
                    content_type = S3Service.get_content_type_from_filename(filename)
                    
               allowed_content_types, max_size = S3Service.validate_file_upload(content_type, file_size, file_type)
          except ValueError:
               raise ValidationError("Invalid file_size format")
          
          # Cancel any pending resume uploads
          pending_upload = FileUpload.objects.filter(
               user=user,
               file_type=file_type,
               upload_status='pending'
          ).first()
          
          if pending_upload:
               pending_upload.upload_status = 'cancelled'
               pending_upload.save()
               logger.info(f"Cancelled pending file upload {pending_upload.id} for user {user.id}")
          
          if file_type in OVERRIDE_FILE_TYPES:
               # Delete previous uploaded file
               previous_files = FileUpload.objects.filter(
                    user=user,
                    file_type=file_type,
                    upload_status='uploaded'
               )
               
               for file in previous_files:
                    S3Service.delete_file(file.file_path)
                    file.upload_status = 'deleted'
                    file.save()
                    logger.info(f"Deleted previous file {file.id} for user {user.id}")
          
          # Generate unique file path
          file_path = S3Service.generate_unique_file_path(
               user_id=user.id,
               file_type=file_type,
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
               user=user,
               file_type=file_type,
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
               'max_file_size': max_size,
               'allowed_types': allowed_content_types
          }
          
          return response_data