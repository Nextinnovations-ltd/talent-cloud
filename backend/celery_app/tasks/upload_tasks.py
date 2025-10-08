from celery import shared_task
from apps.authentication.models import FileUpload
from core.constants.s3.constants import UPLOAD_STATUS
from services.storage.s3_service import S3Service
from apps.job_seekers.models import Resume
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def delete_resume_from_s3(self, resume_id, file_path, file_upload_id=None):
     """
     Immediate S3 deletion when user removes resume
     """
     try:
          # Delete from S3
          S3Service.delete_file(file_path)
          logger.info(f"Successfully deleted resume file from S3: {file_path}")
          
          # Update file upload status
          if file_upload_id:
               try:
                    file_upload = FileUpload.objects.get(id=file_upload_id, file_path=file_path)
                    file_upload.status = UPLOAD_STATUS.DELETED
                    file_upload.upload_status = UPLOAD_STATUS.MARKED_FOR_DELETION
                    file_upload.marked_for_deletion_at = timezone.now()
                    file_upload.deletion_reason = "resume_removed_by_user"
                    file_upload.deleted_at = timezone.now()
                    file_upload.save()
               except FileUpload.DoesNotExist:
                    logger.warning(f"FileUpload {file_upload_id} not found")
          
          return {
               'success': True,
               'message': 'Resume deleted immediately.',
               'resume_id': resume_id
          }
          
     except Exception as e:
          logger.error(f"Failed immediate S3 deletion for resume {resume_id}: {str(e)}")
          if self.request.retries < self.max_retries:
               raise self.retry(exc=e)
          else:
               # Mark for bulk cleanup if immediate deletion fails
               logger.warning(f"Marking resume {resume_id} for bulk cleanup")
               return {'success': False, 'marked_for_cleanup': True}