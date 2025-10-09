from celery import shared_task
from django.db import transaction
from apps.authentication.models import FileUpload
from apps.job_seekers.models import Resume
from core.constants.s3.constants import UPLOAD_STATUS
from services.storage.s3_service import S3Service
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def delete_resume_from_s3(self, resume_id, file_path, file_upload_id=None):
     """
     Immediate S3 deletion when user removes resume
     """
     try:
          S3Service.delete_file(file_path)
          logger.info(f"Successfully deleted resume file from S3: {file_path}")
          
          if file_upload_id:
               try:
                    file_upload = FileUpload.objects.get(id=file_upload_id, file_path=file_path)
                    file_upload.upload_status = UPLOAD_STATUS.DELETED
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
               logger.warning(f"Marking resume {resume_id} for bulk cleanup")
               return {'success': False, 'marked_for_cleanup': True}
     
@shared_task(name='upload_tasks.weekly_resumes_cleanup')
def weekly_resumes_cleanup():
     """
     Weekly cleanup task for unused resume files
     Cleans up files where:
     1. Resume status = False (soft deleted)
     2. FileUpload status is not already deleted(Deletion Failed files)
     """
     cleanup_results = {
          'files_processed': 0,
          'files_deleted_from_s3': 0,
          'files_soft_deleted': 0,
          'already_deleted': 0,
          'errors': [],
          'failed_deletions': []
     }
     
     try:
          # Find resumes that are soft deleted (status=False) with grace period
          unused_resumes = Resume.objects.filter(
               status=False,
          ).select_related('file_upload').exclude(
               file_upload__isnull=True
          ).exclude(
               file_upload__upload_status=UPLOAD_STATUS.DELETED
          )
          
          logger.info(f"Found {unused_resumes.count()} unused resume files for cleanup")
          
          for resume in unused_resumes:
               cleanup_results['files_processed'] += 1
               file_upload = resume.file_upload
               
               try:
                    if file_upload.upload_status == UPLOAD_STATUS.DELETED:
                         cleanup_results['already_deleted'] += 1
                         continue
                    
                    if file_upload.file_path:
                         try:
                              S3Service.delete_file(file_upload.file_path)
                              cleanup_results['files_deleted_from_s3'] += 1
                              logger.info(f"Weekly cleanup: Deleted S3 file {file_upload.file_path} for resume {resume.id}")
                         except Exception as s3_error:
                              error_msg = f"Failed to delete S3 file {file_upload.file_path}: {str(s3_error)}"
                              cleanup_results['errors'].append(error_msg)
                              cleanup_results['failed_deletions'].append({
                                   'resume_id': resume.id,
                                   'file_path': file_upload.file_path,
                                   'error': str(s3_error)
                              })
                              logger.error(error_msg)
                              continue
                    
                    file_upload.upload_status = UPLOAD_STATUS.DELETED
                    file_upload.marked_for_deletion_at = timezone.now()
                    file_upload.deletion_reason = "weekly_cleanup_unused_files"
                    file_upload.deleted_at = timezone.now()
                    file_upload.save()
                    
                    cleanup_results['files_soft_deleted'] += 1
                    logger.info(f"Weekly cleanup: Soft deleted FileUpload {file_upload.id} for resume {resume.id}")
                    
               except Exception as e:
                    error_msg = f"Error processing resume {resume.id}: {str(e)}"
                    cleanup_results['errors'].append(error_msg)
                    logger.error(error_msg)
          
          logger.info(f"Weekly cleanup completed: {cleanup_results}")
          
          if cleanup_results['errors']:
               logger.warning(f"Weekly cleanup had {len(cleanup_results['errors'])} errors")
          
          return cleanup_results
          
     except Exception as e:
          error_msg = f"Weekly cleanup task failed: {str(e)}"
          logger.error(error_msg)
          cleanup_results['errors'].append(error_msg)
          return cleanup_results

@shared_task
def generate_cleanup_report():
     """
     Generate a cleanup report for monitoring purposes
     """
     try:        
          # Generate statistics
          report_data = {
               'timestamp': timezone.now().isoformat(),
               'total_resumes': Resume.objects.count(),
               'active_resumes': Resume.objects.filter(status=True).count(),
               'deleted_resumes': Resume.objects.filter(status=False).count(),
               'total_file_uploads': FileUpload.objects.filter(file_type='resume').count(),
               'active_file_uploads': FileUpload.objects.filter(
                    file_type='resume',
                    upload_status__in=[UPLOAD_STATUS.UPLOADED]
               ).count(),
               'deleted_file_uploads': FileUpload.objects.filter(
                    file_type='resume',
                    upload_status=UPLOAD_STATUS.DELETED
               ).count(),
               'failed_deletions': FileUpload.objects.filter(
                    file_type='resume',
                    upload_status=UPLOAD_STATUS.DELETION_FAILED
               ).count(),
               'orphaned_file_uploads': FileUpload.objects.filter(
                    file_type='resume',
                    resume__isnull=True
               ).count()
          }
          
          logger.info(f"Cleanup report generated: {report_data}")
          return report_data
          
     except Exception as e:
          logger.error(f"Failed to generate cleanup report: {str(e)}")
          return {'error': str(e)}
     
@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def delete_file_from_s3(self, deletion_reason = "removed_by_user", file_upload_id = None):
     """
     Immediate S3 deletion when user removes file
     """
     file_upload = None
     
     if not file_upload_id:
          logger.error("Called delete_file_from_s3 without file_upload_id.")
          return {'success': False, 'message': 'File ID is required.'}
     try:
          try:
               file_upload = FileUpload.objects.get(id=file_upload_id)
          except FileUpload.DoesNotExist:
               logger.warning(f"FileUpload {file_upload_id} not found")

          S3Service.delete_file(file_upload.file_path)
          logger.info(f"Successfully deleted file from S3: {file_upload.file_path}")
          
          with transaction.atomic():
               file_upload.upload_status = UPLOAD_STATUS.DELETED
               file_upload.marked_for_deletion_at = timezone.now()
               file_upload.deletion_reason = deletion_reason
               file_upload.deleted_at = timezone.now()
               file_upload.save(update_fields=['upload_status', 'marked_for_deletion_at', 'deletion_reason', 'deleted_at'])
               
               return {
                    'success': True,
                    'message': 'File deleted immediately.',
                    'file_upload_id': file_upload.id
               }
     except Exception as e:
          logger.error(f"Failed immediate S3 deletion for file {file_upload_id}: {str(e)}")
          if self.request.retries < self.max_retries:
               raise self.retry(exc=e)
          else:
               logger.warning(f"Max retries reached for file {file_upload_id}. Marking for bulk cleanup.")
               return {'success': False, 'marked_for_cleanup': True, 'file_upload_id': file_upload_id}