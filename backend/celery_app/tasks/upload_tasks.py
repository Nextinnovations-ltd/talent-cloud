# from celery import shared_task
# from apps.authentication.models import FileUpload
# from core.constants.s3.constants import UPLOAD_STATUS
# from services.storage.s3_service import S3Service
# import logging

# logger = logging.getLogger(__name__)

# @shared_task(bind=True, max_retries=3, name='upload_tasks.delete_expired_uploads')
# def delete_expired_uploads(self, user_id, file_type, exclude_upload_id=None):
#      """
#      Asynchronously delete expired uploads - All uploads file type
#      """
#      try:
#           cancelled_file_uploads = FileUp
          
#      except Exception as exc:
#           logger.error(f"Error in delete_previous_files_task: {str(exc)}")
#           raise self.retry(exc=exc, countdown=60)