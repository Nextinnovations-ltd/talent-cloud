from datetime import datetime
from django.shortcuts import get_object_or_404
from apps.job_posting.models import ApplicationStatus, JobApplication, JobPost, StatusChoices
from apps.job_seekers.models import JobSeeker
from apps.authentication.models import FileUpload
from services.storage.upload_service import UploadService
from core.constants.s3.constants import FILE_TYPES, UPLOAD_STATUS
from services.notification.notification_service import NotificationHelpers
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

class JobApplicationService:
     @staticmethod
     def generate_application_cover_letter_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.COVER_LETTER)
     
     @staticmethod
     def generate_application_resume_upload_url(user, filename, file_size, content_type=None):
          return UploadService.generate_file_upload_url(user, filename, file_size, content_type, file_type = FILE_TYPES.APPLICATION_RESUME)
     
     @staticmethod
     def perform_application_submission(user, job_post_id, cover_letter_upload_id, resume_upload_id, is_cover_letter_skipped=False):
          try:
               # Get required objects
               job_post = get_object_or_404(JobPost, id=job_post_id)
               job_seeker = get_object_or_404(JobSeeker, user=user)

               # Validate application process
               JobApplicationService._validate_application_eligibility(job_post, job_seeker)
               
               with transaction.atomic():
                    cover_letter_upload_path = None
                    resume_upload_path = None
                    
                    if resume_upload_id:
                         # Change upload status from pending_application to uploaded
                         resume_upload = JobApplicationService.update_file_upload_status(user, resume_upload_id, old_upload_status=UPLOAD_STATUS.PENDING_APPLICATION)
                         resume_upload_path = resume_upload.file_path
                    
                    if not is_cover_letter_skipped:
                         # Update File Upload
                         cover_letter_upload = JobApplicationService.update_file_upload_status(user, cover_letter_upload_id)
                         cover_letter_upload_path = cover_letter_upload.file_path
                    
                    # Create application
                    application = JobApplicationService._create_application(
                         job_post,
                         job_seeker,
                         cover_letter_file_path=cover_letter_upload_path,
                         resume_file_path=resume_upload_path
                    )
                    
                    # Send notification about the new application
                    JobApplicationService._send_application_notifications(application, job_post, user)
                    
                    logger.info(f"Job application created successfully - ID: {application.id}, Job: {job_post.title}")
                    
                    return application
          except Http404:
               logger.error(f"Job Post Not found.")
               raise ValidationError("Job post not found.")
          except Exception as e:
               logger.error(f"Failed to create job application: str{e}")
               raise

     @staticmethod
     def _create_application(job_post: JobPost, job_seeker: JobSeeker, cover_letter_file_path, resume_file_path=None):
          """Create the job application instance"""
          
          if not resume_file_path:
               resume_file_path = job_seeker.resume_url
          
          application = JobApplication.objects.create(
               job_post=job_post,
               job_seeker=job_seeker,
               application_status=ApplicationStatus.APPLIED,
               cover_letter_url = cover_letter_file_path,
               resume_url=resume_file_path
          )
          
          return application

     @staticmethod
     def update_file_upload_status(user, upload_id, old_upload_status = UPLOAD_STATUS.PENDING, new_upload_status = None) -> FileUpload:
          try:
               file_upload = FileUpload.objects.get(
                    id=upload_id,
                    user=user,
                    upload_status=old_upload_status
               )
          except FileUpload.DoesNotExist:
               raise ValidationError("Invalid upload_id or upload already processed")

          # Update upload record
          new_upload_status = new_upload_status if new_upload_status else UPLOAD_STATUS.UPLOADED
          file_upload.upload_status = new_upload_status
          file_upload.uploaded_at = datetime.now()
          file_upload.save()
          
          return file_upload

     @staticmethod
     def confirm_job_application_resume_upload(user, upload_id):
          # Update upload record
          file_upload = JobApplicationService.update_file_upload_status(user, upload_id, new_upload_status=UPLOAD_STATUS.PENDING_APPLICATION)

          response_data = {
               'upload_id': str(file_upload.id),
               'uploaded_at': file_upload.uploaded_at.isoformat(),
               'upload_status': file_upload.upload_status
          }
          
          logger.info(f"Confirmed job application resume upload {file_upload.id} for user {user.id}")
          
          return response_data
          
     @staticmethod
     def _validate_application_eligibility(job_post: JobPost, job_seeker: JobSeeker):
          """Validate if job seeker can apply for this job"""
          
          # Check if already applied
          if JobApplication.objects.filter(job_post=job_post, job_seeker=job_seeker).exists():
               raise ValidationError("You have already applied for this job post.")
          
          # Check if job is still accepting applications
          if not job_post.is_accepting_applications:
               raise ValidationError("This job post is no longer accepting applications.")
          
          # Check if job is active
          if job_post.job_post_status != StatusChoices.ACTIVE:
               raise ValidationError("This job post is not currently active.")
          
          # Check application deadline
          from datetime import date
          if job_post.last_application_date and job_post.last_application_date < date.today():
               raise ValidationError("The application deadline for this job has passed.")
          
          # Check if positions are available
          if job_post.number_of_positions <= 0:
               raise ValidationError("No positions are currently available for this job.")

     @staticmethod
     def _send_application_notifications(application, job_post, user):
          """Send notifications for the new application"""
          
          try:
               # Notify company about new application
               company = job_post.posted_by.company if hasattr(job_post.posted_by, 'company') else None
               
               if company:
                    NotificationHelpers.notify_job_application(
                         job_post, 
                         user,
                         company,
                         application
                    )
               
               # Notify job seeker about successful submission
               NotificationHelpers.notify_application_submitted(
                    job_post,
                    application
               )
               
               logger.info(f"Application notifications sent successfully for job: {job_post.title}")
               
          except Exception as e:
               logger.error(f"Failed to send application notifications: {str(e)}")
               # Don't fail the application creation if notification fails
               pass
     