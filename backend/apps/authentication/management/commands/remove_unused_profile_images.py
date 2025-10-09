import logging
from django.core.management.base import BaseCommand
from django.db.models.functions import Coalesce
from django.db.models import Max
from django.utils import timezone
from django.db import models
from apps.authentication.models import FileUpload
from services.storage.s3_service import S3Service

logger = logging.getLogger(__name__)

class Command(BaseCommand):
     help = 'Identifies and deletes all but the latest profile image for every user.'

     def handle(self, *args, **options):
          self.stdout.write("Starting cleanup of old profile images...")
          
          latest_uploads_sq = FileUpload.objects.filter(
               file_type='profile_image',
               upload_status__in=['uploaded', 'pending_application', 'pending'], 
               user_id__isnull=False
          ).values('user_id').annotate(
               latest_time=Max(Coalesce('uploaded_at', 'created_at'))
          ).order_by()
          
          files_to_keep_ids = FileUpload.objects.filter(
               file_type='profile_image',
               upload_status__in=['uploaded', 'pending_application', 'pending'],
               user_id__isnull=False
          ).annotate(
               latest_time=models.Subquery(
                    latest_uploads_sq.filter(user_id=models.OuterRef('user_id')).values('latest_time')[:1]
               )
          ).filter(
               uploaded_at=models.F('latest_time')
          ).values_list('id', flat=True)


          all_profile_image_ids = FileUpload.objects.filter(
               file_type='profile_image',
               upload_status__in=['uploaded', 'pending_application', 'pending'],
               user_id__isnull=False
          ).values_list('id', flat=True)

          files_to_delete_ids = all_profile_image_ids.difference(files_to_keep_ids)
                    
          if not files_to_delete_ids.exists():
               self.stdout.write(self.style.SUCCESS("Cleanup completed: No old profile images found for deletion."))
               return

          unused_files = FileUpload.objects.filter(id__in=files_to_delete_ids).select_related('user')
          total_count = unused_files.count()
          deleted_count = 0
          
          self.stdout.write(f"Found {total_count} old profile images to delete...")

          for file_upload in unused_files.iterator():
               try:
                    # 1. Delete from S3
                    S3Service.delete_file(file_upload.file_path)
                    
                    # 2. Update DB
                    file_upload.upload_status = 'deleted'
                    file_upload.marked_for_deletion_at = timezone.now()
                    file_upload.deletion_reason = "cleanup-old-profile-image"
                    file_upload.deleted_at = timezone.now()
                    file_upload.save(update_fields=['upload_status', 'marked_for_deletion_at', 'deletion_reason', 'deleted_at'])
                    
                    deleted_count += 1
                    logger.info(f"Successfully deleted profile image: {file_upload.file_path} for user {file_upload.user_id}")
                    
               except Exception as e:
                    logger.error(f"Failed to delete old profile image {file_upload.id} from S3/DB: {str(e)}")
                    file_upload.upload_status = 'deletion_failed'
                    file_upload.save(update_fields=['upload_status'])


          self.stdout.write(self.style.SUCCESS(
               f"\nCleanup finished: Successfully deleted {deleted_count} out of {total_count} files."
          ))