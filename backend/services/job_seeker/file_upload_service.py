from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
from apps.authentication.models import FileUpload
from core.constants.s3.constants import FILE_TYPES, UPLOAD_STATUS, OVERRIDE_FILE_TYPES
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

          # Cancel previous pending
          FileUploadService.cancel_pending_uploads(user, file_type)
          
          # Generate unique file path
          file_path = S3Service.generate_unique_file_path(
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
               upload_status=UPLOAD_STATUS.PENDING,
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
     
     @staticmethod
     def cancel_pending_uploads(user, file_type):
          # Cancel any pending uploads
          pending_upload = FileUpload.objects.filter(
               user=user,
               file_type=file_type,
               upload_status=UPLOAD_STATUS.PENDING
          ).first()
          
          if pending_upload:
               pending_upload.upload_status = UPLOAD_STATUS.CANCELLED
               pending_upload.save()
               logger.info(f"Cancelled pending file upload {pending_upload.id} for user {user.id}")
          
          # if file_type in OVERRIDE_FILE_TYPES:
          #      # Delete previous uploaded file
          #      previous_files = FileUpload.objects.filter(
          #           user=user,
          #           file_type=file_type,
          #           upload_status=UPLOAD_STATUS.UPLOADED
          #      )
               
          #      for file in previous_files:
          #           is_deleted = S3Service.delete_file(file.file_path)
                    
          #           file.upload_status = UPLOAD_STATUS.DELETED if is_deleted else UPLOAD_STATUS.DELETION_FAILED
          #           file.save()
                    
          #           logger.info(f"Deleted previous file {file.id} for user {user.id}")

     @staticmethod
     def update_file_upload_status(file_upload: FileUpload, file_size=None, upload_status=UPLOAD_STATUS.UPLOADED):
          # Update upload record
          file_upload.upload_status = upload_status
          file_upload.uploaded_at = datetime.now()
          
          if file_size:
               file_upload.file_size = file_size
          
          file_upload.save()
          
          return file_upload
     
     @staticmethod
     def soft_delete_upload_file(user, file_path):
          try:
               uploaded_file = FileUpload.objects.filter(
                    user=user,
                    file_path=file_path,
                    upload_status=UPLOAD_STATUS.UPLOADED
               ).first()
               
               if not uploaded_file:
                    raise ValidationError("File record not found.")

               # Update upload record
               uploaded_file.upload_status = 'deleted'
               uploaded_file.save()
               
               logger.info(f"Soft-deleted file {uploaded_file.id} for user {user.id}")
          except Exception as e:
               logger.error(f"Error soft-deleting file: {str(e)}")
               raise ValidationError(f"Error soft-deleting file: {str(e)}")