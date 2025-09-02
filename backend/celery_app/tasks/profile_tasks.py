from celery import shared_task
from apps.authentication.models import FileUpload
from core.constants.s3.constants import UPLOAD_STATUS
from services.storage.s3_service import S3Service
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def delete_previous_files_task(self, user_id, file_type, exclude_upload_id=None):
     """
     Asynchronously delete previous uploaded files - Profile and Resume
     """
     try:
          from apps.users.models import TalentCloudUser
          user = TalentCloudUser.objects.get(id=user_id)
          
          # Get previous uploads to delete, excluding the current upload
          filters = {
               'user': user,
               'file_type': file_type,
               'upload_status': UPLOAD_STATUS.UPLOADED
          }
          
          # Exclude the current upload if provided
          previous_uploads = FileUpload.objects.filter(**filters)
          
          if exclude_upload_id:
               previous_uploads = previous_uploads.exclude(id=exclude_upload_id)
          
          deleted_count = 0
          failed_count = 0
          
          for prev_upload in previous_uploads:
               try:
                    delete_success = S3Service.delete_file(prev_upload.file_path)
                    
                    if delete_success:
                         prev_upload.upload_status = UPLOAD_STATUS.DELETED
                         prev_upload.save()
                         deleted_count += 1
                         logger.info(f"Deleted previous upload {prev_upload.id} for user {user_id}")
                    else:
                         prev_upload.upload_status = UPLOAD_STATUS.DELETION_FAILED
                         prev_upload.save()
                         failed_count += 1
                         
               except Exception as e:
                    prev_upload.upload_status = UPLOAD_STATUS.DELETION_FAILED
                    prev_upload.save()
                    failed_count += 1
                    logger.error(f"Error deleting previous upload {prev_upload.id}: {str(e)}")
          
          logger.info(f"File cleanup completed for user {user_id}: {deleted_count} deleted, {failed_count} failed")
          
          return {
               'deleted_count': deleted_count,
               'failed_count': failed_count,
               'user_id': user_id,
               'file_type': file_type,
               'excluded_upload_id': exclude_upload_id
          }
          
     except Exception as exc:
          logger.error(f"Error in delete_previous_files_task: {str(exc)}")
          raise self.retry(exc=exc, countdown=60)

@shared_task
def cleanup_expired_uploads_task():
     """
     Periodic task to clean up expired upload records
     """
     try:
          from datetime import datetime, timedelta
          
          # Find uploads that expired more than 1 hour ago
          expired_time = datetime.now() - timedelta(hours=1)
          
          expired_uploads = FileUpload.objects.filter(
               upload_status='pending',
               upload_url_expires_at__lt=expired_time
          )
          
          expired_count = 0
          for upload in expired_uploads:
               upload.upload_status = 'expired'
               upload.save()
               expired_count += 1
          
          logger.info(f"Cleaned up {expired_count} expired upload records")
          
          return {'expired_count': expired_count}
          
     except Exception as e:
          logger.error(f"Error in cleanup_expired_uploads_task: {str(e)}")
          raise