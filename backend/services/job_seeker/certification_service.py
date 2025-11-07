from apps.job_seekers.serializers.certification_serializer import CertificationCreateUpdateSerializer
from services.storage.s3_service import S3Service
from services.storage.upload_service import UploadService
from apps.job_seekers.models import JobSeekerCertification
from core.constants.s3.constants import FILE_TYPES
from rest_framework.exceptions import ValidationError
from services.storage.upload_service import UploadService
from services.storage.s3_service import S3Service
from django.db import transaction
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class CertificationService:
     @staticmethod
     def generate_certification_image_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.CERTIFICATION_IMAGE)

     @staticmethod
     def performed_certification_creation(user, validated_data, upload_id=None):
          try:
               with transaction.atomic():
                    file_upload = None
                    
                    if upload_id:
                         file_upload = UploadService.update_file_upload_status(user, upload_id)

                    return CertificationService.create_certification(user.jobseeker, validated_data, file_upload)
          except Exception as e:
               logger.error(f"Failed to create certification: {str(e)}")
               raise ValidationError(f"Failed to create certification: {str(e)}")
     
     @staticmethod
     def performed_certification_update(user, certification: JobSeekerCertification, validated_data, upload_id=None):
          """
          Update a certification with optional image update
          """
          try:
               # old_image_path = certification.certification_image_file
               
               if upload_id:
                    # Update upload status and get file info
                    file_upload = UploadService.update_file_upload_status(user, upload_id)
                    
                    # Update the image URL
                    validated_data['certification_image_file'] = file_upload
                    
                    logger.info(f"Updated certification image for certification {certification.id}")
               
               # Update certification fields
               for field, value in validated_data.items():
                    setattr(certification, field, value)
               
               certification.save()

               serializer = CertificationCreateUpdateSerializer(certification)
               
               logger.info(f"Successfully updated certification {certification.id}")
               
               return serializer.data
          except Exception as e:
               logger.error(f"Error updating certification {certification.id}: {str(e)}")
               raise ValidationError(f"Failed to update certification: {str(e)}")
     
     @staticmethod
     def performed_certification_image_deletion(user, certification: JobSeekerCertification):
          """
          Delete a certification image 
          
          Args:
               certification: JobSeekerCertification instance to delete
          """
          try:
               image_file = certification.certification_image_file
               
               # Clean up image file if it exists
               if image_file and image_file.file_path:
                    try:
                         image_file_path = image_file.file_path
                         
                         is_deleted = S3Service.delete_file(image_file_path)
                         
                         if is_deleted:
                              UploadService.soft_delete_upload_file(user, image_file_path)
                              
                              certification.certification_image_file = None
                              certification.save()
                              
                              logger.info(f"Deleted certification image: {image_file_path}")
                         else:
                              logger.warning(f"Failed to delete certification image.")
                              raise ValidationError("Error deleting certification image.")
                    except Exception as e:
                         logger.warning(f"Failed to delete certification image {image_file_path}: {str(e)}")
               
               logger.info(f"Successfully deleted certification image.")
               
          except Exception as e:
               logger.error(f"Error deleting certification image: {str(e)}")
               raise ValidationError(f"Failed to delete certification image: {str(e)}")
     
     @staticmethod
     def create_certification(user, validated_data, file_upload=None):
          certification = JobSeekerCertification.objects.create(
               user=user,
               certification_image_file = file_upload,
               **validated_data
          )

          return CertificationCreateUpdateSerializer(certification).data
     
     
     @staticmethod
     def get_certifications(user_id):
          return JobSeekerCertification.objects.filter(user__id=user_id)
     
     @staticmethod
     def validate_date_range(issued_date, expiration_date, has_expiration):
          if not issued_date:
               raise ValidationError("Issued date is required.")
          
          today = timezone.now().date()
          
          # Check if dates are not in the future
          if issued_date and issued_date > today:
               raise ValidationError("Issued date cannot be in the future.")
          
          if has_expiration and not expiration_date:
               raise ValidationError('Expiration date is required.')
          
          if not has_expiration and expiration_date:
               raise ValidationError("Cannot set expiration date for non-expiring certification.")
          
          if issued_date and expiration_date and issued_date >= expiration_date:
                    raise ValidationError("Issued date must be before expiration date.")
