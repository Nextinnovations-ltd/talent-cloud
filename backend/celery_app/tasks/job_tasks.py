from celery import shared_task
from django.utils import timezone
from django.db import transaction
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import date, datetime
from apps.job_posting.models import JobPost, StatusChoices
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, name='job_tasks.update_expired_jobs')
def update_expired_jobs(self):
    """
    Celery task to update job statuses to expired based on last_application_date.
    Runs daily at 12:00 PM to check and update expired jobs.
    """
    try:
        logger.info("Starting Job Expiration Status Validation Task.")
        today = timezone.localdate()
        execution_time = timezone.now()
        
        logger.info(f"Python datetime.now(): {datetime.now()}")
        logger.info(f"Django timezone.now(): {timezone.now()}")
        logger.info(f"Django timezone.localdate(): {timezone.localdate()}")
        
        # Find jobs that should be expired but aren't marked as expired yet
        expired_jobs = JobPost.objects.filter(
            last_application_date__lt=today,
            job_post_status__in=[StatusChoices.ACTIVE, StatusChoices.PENDING]
        ).select_related('posted_by')
        
        total_jobs = expired_jobs.count()
        total_active_jobs = JobPost.objects.filter(
            job_post_status__in=[StatusChoices.ACTIVE, StatusChoices.PENDING]
        ).count()
        
        updated_job_details = []
        
        if total_jobs == 0:
            logger.info("No jobs found that need to be marked as expired.")
            print("No jobs found that need to be marked as expired.")
            
            result = {
                'status': 'success',
                'message': 'No jobs to update',
                'updated_count': 0,
                'total_checked': total_active_jobs,
                'execution_time': execution_time.isoformat(),
                'updated_jobs': []
            }
        else:
            logger.info(f"Found {total_jobs} jobs that need to be marked as expired.")
            
            # Store job details before updating for email report
            for job in expired_jobs:
                updated_job_details.append({
                    'id': job.id,
                    'title': job.title,
                    'last_application_date': job.last_application_date,
                    'posted_by_email': job.posted_by.email,
                    'days_overdue': (today - job.last_application_date).days
                })
            
            # Update jobs in batches for better performance
            updated_count = 0
            batch_size = 100
            
            with transaction.atomic():
                # Get job IDs first to avoid issues with queryset evaluation
                expired_job_ids = list(expired_jobs.values_list('id', flat=True))
                
                # Update in batches
                for i in range(0, len(expired_job_ids), batch_size):
                    batch_ids = expired_job_ids[i:i + batch_size]
                    
                    batch_updated = JobPost.objects.filter(
                        id__in=batch_ids
                    ).update(
                        job_post_status=StatusChoices.EXPIRED,
                        is_accepting_applications=False,
                        updated_at=timezone.now()
                    )
                    
                    updated_count += batch_updated
                    logger.info(f"Updated batch {i//batch_size + 1}: {batch_updated} jobs")
            
            # Log the updated jobs for audit purposes
            for job_detail in updated_job_details:
                logger.info(
                    f"Job expired - ID: {job_detail['id']}, Title: '{job_detail['title']}', "
                    f"Last Application Date: {job_detail['last_application_date']}, "
                    f"Posted By: {job_detail['posted_by_email']}"
                )
            
            result = {
                'status': 'success',
                'message': f'Successfully updated {updated_count} expired jobs',
                'updated_count': updated_count,
                'total_found': total_jobs,
                'execution_time': execution_time.isoformat(),
                'updated_job_ids': expired_job_ids,
                'updated_jobs': updated_job_details
            }
        
        # Send email notification with results
        # send_job_expiration_report.delay(result, total_active_jobs)
        
        logger.info(f"Task completed successfully: {result}")
        return result
        
    except Exception as e:
        error_message = f"Error updating expired jobs: {str(e)}"
        logger.error(error_message, exc_info=True)
        
        # Send error notification email
        # send_job_expiration_error_notification.delay(str(e), datetime.now().isoformat())
        
        # Re-raise the exception so Celery can handle retries
        raise self.retry(
            exc=e,
            countdown=300,  # Retry after 5 minutes
            max_retries=3
        )

@shared_task(name='job_tasks.send_job_expiration_report')
def send_job_expiration_report(task_result, total_active_jobs):
    """
    Send email report about job expiration task results
    """
    try:
        # Email recipients - you can configure this in settings
        recipients = getattr(settings, 'JOB_EXPIRATION_REPORT_RECIPIENTS', ['admin@talentcloud.com'])
        
        # Prepare email context
        context = {
            'execution_date': date.today(),
            'execution_time': task_result.get('execution_time'),
            'total_jobs_checked': total_active_jobs,
            'jobs_expired_count': task_result.get('updated_count', 0),
            'jobs_expired': task_result.get('updated_jobs', []),
            'status': task_result.get('status'),
            'message': task_result.get('message'),
            'has_updates': task_result.get('updated_count', 0) > 0
        }
        
        # Render email templates
        subject = f"TalentCloud Job Expiration Report - {date.today()}"
        
        # Text version
        text_content = render_to_string('emails/job_expiration_report.txt', context)
        
        # HTML version
        html_content = render_to_string('emails/job_expiration_report.html', context)
        
        # Send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.EMAIL_FROM,
            to=recipients
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Job expiration report sent to {recipients}")
        
        return {
            'status': 'success',
            'message': f'Report sent to {len(recipients)} recipients',
            'recipients': recipients
        }
        
    except Exception as e:
        logger.error(f"Failed to send job expiration report: {str(e)}", exc_info=True)
        raise

@shared_task(name='job_tasks.send_job_expiration_error_notification')
def send_job_expiration_error_notification(error_message, execution_time):
    """
    Send email notification when job expiration task fails
    """
    try:
        recipients = getattr(settings, 'JOB_EXPIRATION_ERROR_RECIPIENTS', ['admin@talentcloud.com'])
        
        context = {
            'error_message': error_message,
            'execution_time': execution_time,
            'execution_date': date.today()
        }
        
        subject = f"⚠️ TalentCloud Job Expiration Task Failed - {date.today()}"
        
        text_content = render_to_string('emails/job_expiration_error.txt', context)
        html_content = render_to_string('emails/job_expiration_error.html', context)
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.EMAIL_FROM,
            to=recipients
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Job expiration error notification sent to {recipients}")
        
    except Exception as e:
        logger.error(f"Failed to send error notification: {str(e)}", exc_info=True)
