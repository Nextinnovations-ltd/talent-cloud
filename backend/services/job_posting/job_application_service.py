from datetime import datetime
from django.shortcuts import get_object_or_404
from apps.job_posting.models import ApplicationStatus, JobApplication, JobPost, StatusChoices
from apps.job_seekers.models import JobSeeker
from apps.authentication.models import FileUpload
from services.notification.notification_service import NotificationHelpers
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.http import Http404
import logging


logger = logging.getLogger(__name__)

class JobApplicationService:
     @staticmethod
     def perform_application_submission(user, job_post_id, cover_letter_upload_id):
          try:
               # Get required objects
               job_post = get_object_or_404(JobPost, id=job_post_id)
               job_seeker = get_object_or_404(JobSeeker, user=user)

               # Validate application process
               JobApplicationService._validate_application_eligibility(job_post, job_seeker)
               
               with transaction.atomic():
                    # Update File Upload
                    file_upload = JobApplicationService.update_cover_upload_status(user, cover_letter_upload_id)
                    
                    # Create application
                    application = JobApplicationService._create_application(
                         job_post,
                         job_seeker,
                         file_upload.file_path
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
     def _create_application(job_post: JobPost, job_seeker: JobSeeker, cover_letter_file_path):
          """Create the job application instance"""
          
          application = JobApplication.objects.create(
               job_post=job_post,
               job_seeker=job_seeker,
               application_status=ApplicationStatus.APPLIED,
               cover_letter_url = cover_letter_file_path,
               resume_url=job_seeker.resume_url
          )
          
          return application

     @staticmethod
     def update_cover_upload_status(user, upload_id) -> FileUpload:
          try:
               file_upload = FileUpload.objects.get(
                    id=upload_id,
                    user=user,
                    upload_status='pending'
               )
          except FileUpload.DoesNotExist:
               raise ValidationError("Invalid upload_id or upload already processed")

          # Update upload record
          file_upload.upload_status = 'uploaded'
          file_upload.uploaded_at = datetime.now()
          file_upload.save()
          
          return file_upload
               

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
     