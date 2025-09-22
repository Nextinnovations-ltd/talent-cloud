from apps.job_seekers.models import JobSeeker, JobSeekerCertification, JobSeekerEducation, JobSeekerExperience, Resume
from apps.job_seekers.serializers.profile_serializer import ResumeSerializer
from core.constants.s3.constants import FILE_TYPES, UPLOAD_STATUS
from rest_framework.exceptions import ValidationError
from services.storage.upload_service import UploadService
from services.storage.s3_service import S3Service
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class ProfileService:
     @staticmethod
     def generate_profile_image_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.PROFILE_IMAGE)
     
     @staticmethod
     def generate_profile_resume_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.RESUME)
     
     @staticmethod
     def confirm_profile_upload(user, upload_id):
          # Update upload record
          file_upload = UploadService.update_file_upload_status(user, upload_id)
          
          # Update TalentCloudUser profile based on file type
          try:
               from apps.job_seekers.models import TalentCloudUser
               job_seeker = JobSeeker.objects.get(id=user.id)
               
               if file_upload.file_type == 'profile_image':
                    job_seeker.profile_image_path = file_upload.file_path
                    
                    logger.info(f"Updated profile image path for user {user.id}")
               
               # Need to fix due to latest multiple resume change
               elif file_upload.file_type == 'resume':
                    # job_seeker.resume_url = file_upload.file_path
                    ProfileService._upload_resume(job_seeker, file_upload)
                    
                    logger.info(f"Updated resume for user {user.id}")
               
               job_seeker.save()
               profile_updated = True
               
          except TalentCloudUser.DoesNotExist:
               logger.warning(f"TalentCloudUser not found for user {user.id}")
               profile_updated = False
          
          # if file_upload.file_type in OVERRIDE_FILE_TYPES:
          # delete_previous_files_task.delay(
          #      user_id=request.user.id,
          #      file_type=file_upload.file_type,
          #      exclude_upload_id=file_upload.id
          # )

          # Generate download URL for response
          public_url = S3Service.get_public_url(
               file_upload.file_path
          )
          
          return {
               'upload_id': str(file_upload.id),
               'file_type': file_upload.file_type,
               'file_path': file_upload.file_path,
               'url': public_url,
               'uploaded_at': file_upload.uploaded_at.isoformat(),
               'upload_status': UPLOAD_STATUS.UPLOADED,
               'profile_updated': profile_updated
          }
     
     @staticmethod
     def _upload_resume(user, file_upload):
          try:
               resume = Resume.objects.create(
                    job_seeker = user,
                    file_upload = file_upload,
                    resume_path = file_upload.file_path
               )
               
               return resume
          except:
               raise ValidationError("Failed to upload resume.")
     
     @staticmethod
     def get_user_resume_list(user):
          try:
               resumes = Resume.objects.filter(
                    job_seeker = user,
                    status=True
               ).order_by('-created_at')
               
               # Return resume data list
               return ResumeSerializer(resumes, many=True).data
          except Resume.DoesNotExist:
               raise ValidationError("Failed to retrieve resume list.")
     
     @staticmethod
     def set_default_resume(user, resume_id):
          try:
               resume = Resume.objects.get(
                    job_seeker = user,
                    id = resume_id
               )
               
               resume.is_default = True
               resume.save()
               
               # Return resume data 
               return ResumeSerializer(resume).data
          except Resume.DoesNotExist:
               raise ValidationError("Failed to set resume as default.")
     
     @staticmethod
     def delete_uploaded_resume(user, resume_id):
          try:
               resume = Resume.objects.get(
                    job_seeker = user,
                    id = resume_id
               )
               
               resume.status = False
               resume.save()
               
               # Return resume data 
               return ResumeSerializer(resume).data
          except Resume.DoesNotExist:
               raise ValidationError("Failed to delete resume.")

class ExperienceService:
     @staticmethod
     def get_experiences(user_id):
          return JobSeekerExperience.objects.filter(user__id=user_id).order_by('-start_date')

class EducationService:
     @staticmethod
     def get_educations(user_id):
          return JobSeekerEducation.objects.filter(user__id=user_id).order_by('-start_date')

class CertificationService:
     @staticmethod
     def get_certifications(user_id):
          return JobSeekerCertification.objects.filter(user__id=user_id).order_by('-issued_date')
     
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
