from typing import Dict, Any
from apps.authentication.models import FileUpload
from apps.job_seekers.models import Resume
import logging

logger = logging.getLogger(__name__)

class FileTrackingService:
     """Service to track file usage across the application"""
     
     # Models that reference FileUpload
     FILE_REFERENCE_MODELS = {
          'resume': {
               'model': Resume,
               'file_upload_field': 'file_upload',
               'additional_fields': ['resume_path']
          },
          # Add other models as needed
          # 'cover_letter': {
          #     'model': CoverLetter,
          #     'file_upload_field': 'file_upload',
          # },
          # 'profile_image': {
          #     'model': ProfileImage,
          #     'file_upload_field': 'file_upload',
          # }
     }
     
     @classmethod
     def update_reference_counts(cls) -> Dict[str, int]:
          """Update reference counts for all files"""
          updated_count = 0
          orphaned_count = 0
          
          logger.info("Starting reference count update...")
          
          # Get all uploaded files
          files = FileUpload.objects.filter(upload_status='uploaded')
          
          for file_upload in files:
               reference_count = cls._count_references(file_upload)
               
               if reference_count != file_upload.reference_count:
                    file_upload.reference_count = reference_count
                    file_upload.save(update_fields=['reference_count'])
                    updated_count += 1
               
               # Mark as orphaned if no references
               if reference_count == 0 and file_upload.upload_status != 'orphaned':
                    file_upload.upload_status = 'orphaned'
                    file_upload.save(update_fields=['upload_status'])
                    orphaned_count += 1
               elif reference_count > 0 and file_upload.upload_status == 'orphaned':
                    file_upload.upload_status = 'in_use'
                    file_upload.save(update_fields=['upload_status'])
          
          logger.info(f"Reference count update completed. Updated: {updated_count}, Orphaned: {orphaned_count}")
          
          return {
               'updated_files': updated_count,
               'orphaned_files': orphaned_count,
               'total_processed': len(files)
          }
     
     @classmethod
     def _count_references(cls, file_upload: FileUpload) -> int:
          """Count how many models reference this file"""
          total_references = 0
          
          for model_config in cls.FILE_REFERENCE_MODELS.values():
               model_class = model_config['model']
               file_upload_field = model_config['file_upload_field']
               
               # Count direct FileUpload references
               count = model_class.objects.filter(
                    **{file_upload_field: file_upload}
               ).count()
               total_references += count
               
               # Count additional field references (like resume_path)
               additional_fields = model_config.get('additional_fields', [])
               for field in additional_fields:
                    if file_upload.file_path:
                         count = model_class.objects.filter(
                         **{field: file_upload.file_path}
                         ).count()
                         total_references += count
          
          return total_references
     
     @classmethod
     def mark_orphaned_files_for_deletion(cls, older_than_days: int = 7) -> int:
          """Mark orphaned files for deletion"""
          orphaned_files = FileUpload.get_orphaned_files(older_than_days)
          marked_count = 0
          
          for file_upload in orphaned_files:
               file_upload.mark_for_deletion("Orphaned file cleanup")
               marked_count += 1
          
          logger.info(f"Marked {marked_count} orphaned files for deletion")
          return marked_count
     
     @classmethod
     def get_cleanup_statistics(cls) -> Dict[str, Any]:
          """Get statistics about files that need cleanup"""
          from django.db.models import Count
          
          stats = FileUpload.objects.values('upload_status').annotate(
               count=Count('id')
          ).order_by('upload_status')
          
          return {
               'by_status': list(stats),
               'total_orphaned': FileUpload.objects.filter(upload_status='orphaned').count(),
               'marked_for_deletion': FileUpload.objects.filter(upload_status='marked_for_deletion').count(),
               'ready_for_deletion': FileUpload.get_files_marked_for_deletion().count(),
          }