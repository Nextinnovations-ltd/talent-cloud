from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
from backend.apps.authentication.models import FileUpload
from services.storage.s3_service import S3Service
import logging

logger = logging.getLogger(__name__)

class FileUploadService:
     @staticmethod
     def upload_file(user, filename, file_size, upload_file_type = 'resume'):
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
               user=user,
               file_type='resume',
               upload_status='pending'
          ).first()
          
          if pending_upload:
               pending_upload.upload_status = 'cancelled'
               pending_upload.save()
               logger.info(f"Cancelled pending resume upload {pending_upload.id} for user {user.id}")
          
          # Delete previous uploaded resume
          previous_resumes = FileUpload.objects.filter(
               user=user,
               file_type='resume',
               upload_status='uploaded'
          )
          
          for prev_resume in previous_resumes:
               S3Service.delete_file(prev_resume.file_path)
               prev_resume.upload_status = 'deleted'
               prev_resume.save()
               logger.info(f"Deleted previous resume {prev_resume.id} for user {user.id}")
          
          # Generate unique file path
          file_path = S3Service.generate_unique_file_path(
               user_id=user.id,
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
               user=user,
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