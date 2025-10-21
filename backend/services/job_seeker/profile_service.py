from apps.job_seekers.models import JobSeeker, JobSeekerCertification, JobSeekerEducation, JobSeekerExperience, Resume
from apps.job_seekers.serializers.profile_serializer import ResumeSerializer
from celery_app.tasks.upload_tasks import delete_file_from_s3, delete_resume_from_s3
from core.constants.s3.constants import FILE_TYPES, UPLOAD_STATUS
from rest_framework.exceptions import ValidationError
from services.storage.upload_service import UploadService
from services.storage.s3_service import S3Service
from django.db import transaction
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class ProfileService:
     @staticmethod
     def generate_profile_image_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.PROFILE_IMAGE)
     
     @staticmethod
     def generate_profile_resume_upload_url(user, filename, file_size, content_type=None):
          job_seeker: JobSeeker = None
          
          if hasattr(user, 'jobseeker'):
               job_seeker = user.jobseeker
          
          resume_file_list = job_seeker.resume_file_list
          
          if len(resume_file_list) >= 3:
               raise ValidationError("You can't upload more than 3 resumes.")
          
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.RESUME)
     
     @staticmethod
     def confirm_profile_upload(user, upload_id):
          file_upload = UploadService.update_file_upload_status(user, upload_id)
          
          try:
               from apps.job_seekers.models import TalentCloudUser
               job_seeker = JobSeeker.objects.get(id=user.id)
               
               if file_upload.file_type == 'profile_image':
                    if job_seeker.profile_image_file:
                         ProfileService.delete_profile_image(job_seeker.profile_image_file.id)
                    
                    job_seeker.profile_image_file = file_upload
                    
                    logger.info(f"Updated profile image path for user {user.id}")
               
               elif file_upload.file_type == 'resume':
                    ProfileService._upload_resume(job_seeker, file_upload)
                    
                    logger.info(f"Updated resume for user {user.id}")
               
               job_seeker.save()
               profile_updated = True
               
          except TalentCloudUser.DoesNotExist:
               logger.warning(f"TalentCloudUser not found for user {user.id}")
               profile_updated = False

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
               with transaction.atomic():
                    job_seeker:JobSeeker = user.jobseeker
                    
                    resume: Resume = Resume.objects.get(
                         job_seeker = job_seeker,
                         id = resume_id,
                         status=True
                    )
                    
                    file_path_to_delete = None
                    file_upload_id = None
                    
                    if resume.file_upload and resume.file_upload.file_path:
                         file_path_to_delete = resume.file_upload.file_path
                         file_upload_id = resume.file_upload.id
                    
                    if resume.is_default:
                         resume.is_default = False # Remove default resume 
                         
                         # Set active most recent resume as default if exists
                         most_recent_resume: Resume = job_seeker.resume_documents.filter(is_default=False, status=True).order_by('-created_at').first()

                         if most_recent_resume:
                              most_recent_resume.is_default = True
                              most_recent_resume.save()

                    resume.status = False
                    resume.save()
                    
                    if file_path_to_delete:
                         try:
                              # Try immediate deletion
                              delete_resume_from_s3.delay(
                                   resume_id=resume.id,
                                   file_path=file_path_to_delete,
                                   file_upload_id=file_upload_id
                              )
                              logger.info(f"Scheduled immediate S3 deletion for resume {resume_id}: {file_path_to_delete}")
                         except Exception as e:
                              logger.error(f"Failed to schedule S3 deletion for resume {resume_id}: {str(e)}")
                              
                    return ResumeSerializer(resume).data
          except Resume.DoesNotExist:
               raise ValidationError("Failed to delete resume.")
     
     @staticmethod
     def delete_profile_image(upload_id):
          try:
               with transaction.atomic():                                      
                    if upload_id:
                         try:
                              delete_file_from_s3.delay(
                                   deletion_reason="user-profile-image-removal",
                                   file_upload_id=upload_id
                              )
                              logger.info(f"Scheduled immediate S3 deletion for profile image {upload_id}")
                         except Exception as e:
                              logger.error(f"Failed to schedule S3 deletion for profile image {upload_id}: {str(e)}")
                              
                    return False
          except Resume.DoesNotExist:
               raise ValidationError("Failed to delete profile image.")

class ExperienceService:
     @staticmethod
     def get_experiences(user_id):
          return JobSeekerExperience.objects.filter(user__id=user_id)

class EducationService:
     @staticmethod
     def get_educations(user_id):
          return JobSeekerEducation.objects.filter(user__id=user_id)