"""
Streamlined Notification Service for TalentCloud Platform

This service provides a clean, simple, and unified approach to sending notifications
with support for multiple channels (email, websocket, push) and dynamic configuration.

This is the main notification service that should be used throughout the application.
"""
from datetime import timedelta
from typing import List, Optional, Dict, Any
from enum import Enum
from rest_framework.exceptions import NotFound
from django.db import transaction
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from apps.ws_channel.serializers import NotificationListSerializer
from apps.job_posting.models import JobApplication, JobPost, SalaryModeType
from apps.job_seekers.models import JobSeeker
from utils.notification.types import NotificationType, NotificationChannel
from core.constants.constants import ROLES
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class NotificationTarget(str, Enum):
    """Define who should receive notifications"""
    SUPERADMIN = "superadmin"
    ADMIN = "admin" 
    USER = "user"
    ALL_ROLES = "all_roles"

class NotificationService:
    """
    Unified notification service that handles all notification types and channels
    """
    @staticmethod
    def get_users_by_roles(target_roles: List[NotificationTarget], company_id: Optional[int] = None) -> List[TalentCloudUser]:
        """
        Get users based on roles and company context
        
        Args:
            target_roles: List of roles to target
            company_id: Specific company ID for admin users (None for all companies)
            
        Returns:
            List of TalentCloudUser objects
        """
        users = set()  # Use set to avoid duplicates
        
        for role in target_roles:
            if role == NotificationTarget.SUPERADMIN:
                superadmins = TalentCloudUser.objects.filter(
                    role__name=ROLES.SUPERADMIN, 
                    is_active=True
                )
                users.update(superadmins)
                
            elif role == NotificationTarget.ADMIN:
                admin_filter = {'role__name': ROLES.ADMIN, 'is_active': True}
                if company_id:
                    admin_filter['company_id'] = company_id
                    
                admins = TalentCloudUser.objects.filter(**admin_filter)
                users.update(admins)
                
            elif role == NotificationTarget.USER:
                regular_users = TalentCloudUser.objects.filter(
                    role__name=ROLES.USER,
                    is_active=True
                )
                users.update(regular_users)
                
            elif role == NotificationTarget.ALL_ROLES:
                all_users = TalentCloudUser.objects.filter(is_active=True)
                users.update(all_users)
        
        return list(users)
    
    @staticmethod
    def send_notification(
        title: str,
        message: str,
        notification_type: NotificationType,
        target_roles: Optional[List[NotificationTarget]] = None,
        target_users: Optional[List[TalentCloudUser]] = None,
        target_emails: Optional[List[str]] = None,
        company_id: Optional[int] = None,
        destination_url: Optional[str] = None,
        channel: NotificationChannel = NotificationChannel.BOTH,
        email_template: Optional[str] = None,
        email_context: Optional[Dict[str, Any]] = None,
        is_urgent: bool = False
    ) -> List[Notification]:
        """
        Universal method to send notifications to users
        
        Args:
            title: Notification title
            message: Notification message
            notification_type: Type of notification
            target_roles: List of roles to target
            target_users: Specific users to target
            target_emails: Specific emails to target
            company_id: Company context for admin users
            destination_url: URL to redirect when clicked
            channel: Delivery channel(s)
            email_template: Custom email template name
            email_context: Additional context for email template
            is_urgent: Whether this is an urgent notification
            
        Returns:
            List of created Notification objects
        """
        users = NotificationService._resolve_target_user_list(target_roles, target_users, target_emails, company_id)
        
        if not users:
            logger.warning("No target users found for notification")
            return []
        
        channels = NotificationService._resolve_channels(channel)
        
        return NotificationService._send_to_users(
            users, 
            channels, 
            notification_type,
            lambda user, ch: (title, message, destination_url, is_urgent),
            lambda user, ch, notification: NotificationService._send_channel_notifications(
                user, ch, notification, email_template, email_context, is_urgent
            )
        )
    
    @staticmethod
    def send_notification_with_template(
        notification_type: NotificationType,
        target_roles: Optional[List[NotificationTarget]] = None,
        target_users: Optional[List[TalentCloudUser]] = None,
        target_emails: Optional[List[str]] = None,
        company_id: Optional[int] = None,
        channel: NotificationChannel = NotificationChannel.BOTH,
        template_context: Optional[Dict[str, Any]] = None,
        override_title: Optional[str] = None,
        override_message: Optional[str] = None,
        override_destination_url: Optional[str] = None,
        override_is_urgent: Optional[bool] = None
    ) -> List[Notification]:
        """
        Send notifications using database templates
        
        Args:
            notification_type: Type of notification
            target_roles: List of roles to target
            target_users: Specific users to target
            target_emails: Specific emails to target
            company_id: Company context for admin users
            channel: Delivery channel(s)
            template_context: Context variables for template rendering
            override_title: Override template title
            override_message: Override template message
            override_destination_url: Override template destination URL
            override_is_urgent: Override template urgency setting
            
        Returns:
            List of created Notification objects
        """
        users = NotificationService._resolve_target_user_list(target_roles, target_users, target_emails, company_id)
        
        if not users:
            logger.warning("No target users found for notification")
            return []
        
        channels = NotificationService._resolve_channels(channel)

        template_context = template_context or {}
        
        NotificationService._send_to_users(
            users, 
            channels, 
            notification_type, 
            lambda user, ch: NotificationService._get_template_content(
                user, ch, notification_type, template_context, override_title, override_message, override_destination_url, override_is_urgent
            ),
            lambda user, ch, notification: NotificationService._send_channel_notifications_with_template(
                user, ch, notification_type, notification, override_is_urgent, template_context
            )
        )
        
        
    @staticmethod
    def _send_email_notification(
        user: TalentCloudUser, 
        notification: Notification, 
        email_template: Optional[str] = None,
        email_context: Optional[Dict[str, Any]] = None,
        is_urgent: bool = False
    ):
        """Send email notification"""
        try:
            from services.notification.email_service import EmailService
            
            # Prepare email context
            context = {
                'user': user,
                'title': notification.title,
                'message': notification.message,
                'destination_url': notification.destination_url,
                'notification_id': notification.id,
                'is_urgent': is_urgent,
                **(email_context or {})
            }
            
            # Determine email template
            template = email_template or EmailService.get_template_for_notification_type(
                NotificationType(notification.notification_type)
            )
            
            # Send email
            EmailService.send_email(
                recipient_email=user.email,
                subject=notification.title,
                template=template,
                context=context,
                is_urgent=is_urgent
            )
            
        except Exception as e:
            logger.error(f"Error sending email notification to {user.email}: {str(e)}")
    
    @staticmethod
    def _send_email_notification_with_template(
        user: TalentCloudUser, 
        notification: Notification,
        email_template_name: Optional[str] = None,
        email_subject: Optional[str] = None,
        email_context: Optional[Dict[str, Any]] = None,
        is_urgent: bool = False
    ):
        """Send email notification using template from database"""
        try:
            from services.notification.email_service import EmailService
            
            # Use provided template or fall back to default
            template = email_template_name or EmailService.get_template_for_notification_type(
                NotificationType(notification.notification_type)
            )
            
            # Use provided subject or notification title
            subject = email_subject or notification.title
            
            # Prepare email context
            context = {
                'user': user,
                'title': notification.title,
                'message': notification.message,
                'destination_url': notification.destination_url,
                'notification_id': notification.id,
                'is_urgent': is_urgent,
                **(email_context or {})
            }
            
            # Send email
            EmailService.send_email(
                recipient_email=user.email,
                subject=subject,
                template=template,
                context=context,
                is_urgent=is_urgent
            )
            
        except Exception as e:
            logger.error(f"Error sending templated email notification to {user.email}: {str(e)}")

    @staticmethod
    def _send_websocket_notification(user: TalentCloudUser, notification: Notification):
        """Send real-time notification via WebSocket"""
        try:
            channel_layer = get_channel_layer()
            group_name = f"user_{user.id}_notifications"
            
            notification_data = {
                'type': 'notification_message',
                'notification': {
                    'id': notification.id,
                    'title': notification.title,
                    'message': notification.message,
                    'destination_url': notification.destination_url,
                    'notification_type': notification.notification_type,
                    'is_read': notification.is_read,
                    'created_at': notification.created_at.isoformat()
                }
            }
            
            async_to_sync(channel_layer.group_send)(group_name, notification_data)
            
        except Exception as e:
            logger.error(f"Error sending WebSocket notification to user {user.id}: {str(e)}")
    
    @staticmethod
    def _send_push_notification(
        user: TalentCloudUser, 
        notification: Notification, 
        is_urgent: bool = False
    ):
        """Send push notification (placeholder for future implementation)"""
        try:
            # TODO: Implement push notification service
            # This could integrate with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNS)
            logger.info(f"Push notification placeholder for user {user.email}: {notification.title}")
            
            # Future implementation might look like:
            # from services.notification.push_service import PushService
            # PushService.send_notification(
            #     user_token=user.push_notification_token,
            #     title=notification.title,
            #     message=notification.message,
            #     data={'notification_id': notification.id, 'destination_url': notification.destination_url},
            #     is_urgent=is_urgent
            # )
            
        except Exception as e:
            logger.error(f"Error sending push notification to user {user.id}: {str(e)}")

    # region Notification Sending Utilities
    @staticmethod
    def _resolve_target_user_list(roles=[], target_users=[], emails=[], company_id=None) -> List[TalentCloudUser]:
        # Collect all target users
        users = set()
        
        # Add users by roles
        if roles:
            role_users = NotificationService.get_users_by_roles(roles, company_id)
            users.update(role_users)
        
        # Add specific users
        if target_users:
            users.update(target_users)
        
        # Add users by email
        if emails:
            email_users = TalentCloudUser.objects.filter(email__in=emails, is_active=True)
            users.update(email_users)
        
        return list(users)
    
    @staticmethod
    def _resolve_channels(channel):        
        if channel == NotificationChannel.BOTH:
            return [NotificationChannel.WEBSOCKET, NotificationChannel.EMAIL]
        return [channel]

    @staticmethod
    def _send_to_users(users, channels, notification_type, content_fn, send_fn):
        notifications = []
        
        try:
            with transaction.atomic():
                for user in users:
                    for ch in channels:
                        title, message, destination_url, is_urgent = content_fn(user, ch)
                        
                        notification = Notification.objects.create(
                            user=user,
                            title=title,
                            message=message,
                            destination_url=destination_url,
                            notification_type=notification_type.value,
                            channel=ch.value
                        )
                        
                        notifications.append(notification)
                        
                        # Send via the specific channel
                        send_fn(user, ch, notification)
            return notifications
        except Exception as e:
            logger.error(f"Error sending notifications: {str(e)}")
            return []

    @staticmethod
    def _get_template_content(user, ch, notification_type, context, override_title, override_message, override_destination_url, override_is_urgent):
        from apps.ws_channel.models import NotificationTemplate
        
        enhanced_context = {
            'user_name': user.name or user.email,
            'user_email': user.email,
            'platform_name': 'Talent Cloud',
            **context
        }
        
        template = NotificationTemplate.get_template(
            notification_type, ch
        )
        
        # Determine title, message, and destination URL
        if template:
            title = override_title or template.render_title(enhanced_context)
            message = override_message or template.render_message(enhanced_context)
            destination_url = override_destination_url or template.render_destination_url(enhanced_context)
            is_urgent = override_is_urgent if override_is_urgent is not None else template.is_urgent_by_default
        else:
            # Fallback if no template found
            title = override_title or f"{notification_type.name} Notification"
            message = override_message or "You have a new notification."
            destination_url = override_destination_url
            is_urgent = override_is_urgent or False
        
        return title, message, destination_url, is_urgent
    
    @staticmethod
    def _send_channel_notifications(user, channel, notification, email_template = None, email_context = None, is_urgent = False):
        # Send via the specific channel
        if channel == NotificationChannel.WEBSOCKET:
            NotificationService._send_websocket_notification(user, notification)
        elif channel == NotificationChannel.EMAIL:
            NotificationService._send_email_notification(
                user, 
                notification, 
                email_template, 
                email_context,
                is_urgent
            )
        elif channel == NotificationChannel.PUSH:
            NotificationService._send_push_notification(user, notification, is_urgent)
            
    
    @staticmethod
    def _send_channel_notifications_with_template(user, channel, notification_type, notification, override_is_urgent, context = None):
        from apps.ws_channel.models import NotificationTemplate
        
        enhanced_context = {
            'user_name': user.name or user.email,
            'user_email': user.email,
            'platform_name': 'Talent Cloud',
            'base_url': settings.BACKEND_BASE_URL,
            **context
        }
        
        template = NotificationTemplate.get_template(
            notification_type, channel
        )
        
        if not template:
            NotificationService._send_channel_notifications(
                user, channel, notification, email_context=enhanced_context
            )
            return
        
        if channel == NotificationChannel.WEBSOCKET:
            NotificationService._send_websocket_notification(user, notification)
        elif channel == NotificationChannel.EMAIL:
            # Use email template if available
            template_name = template.email_template_name
            subject = template.render_subject(enhanced_context)
            is_urgent = override_is_urgent if override_is_urgent is not None else template.is_urgent_by_default
            
            NotificationService._send_email_notification_with_template(
                user, 
                notification,
                template_name,
                subject,
                enhanced_context,
                is_urgent
            )
        elif channel == NotificationChannel.PUSH:
            NotificationService._send_push_notification(user, notification, is_urgent)

    # endregion Notification Sending Utilities
    
    
    # region Utility methods for common notification operations
    @staticmethod
    def mark_as_read(notification_id: int, user_id: int) -> Optional[Notification]:
        """Mark notification as read"""
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.is_read = True
            notification.save()
            return notification
        except Notification.DoesNotExist:
            logger.error(f"Notification {notification_id} not found for user {user_id}")
            raise NotFound("Notification not found.")
    
    @staticmethod
    def mark_all_as_read(user_id: int) -> int:
        """Mark all notifications as read for a user"""
        return Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
    
    @staticmethod
    def mark_notification_as_read(notification_id: int) -> int:
        """Mark notification as read by notification ID"""
        return Notification.objects.filter(id=notification_id, is_read=False).update(is_read=True)
    
    @staticmethod
    def get_unread_count(user_id: int, channel: Optional[NotificationChannel] = None) -> int:
        """Get count of unread notifications for a user, optionally filtered by channel"""
        queryset = Notification.objects.filter(user_id=user_id, is_read=False)
        if channel:
            queryset = queryset.filter(channel=channel.value)
        return queryset.count()
    
    @staticmethod
    def get_total_count(user_id: int, channel: Optional[NotificationChannel] = None) -> int:
        """Get count of notifications for a user, optionally filtered by channel"""
        queryset = Notification.objects.filter(user_id=user_id)
        
        if channel:
            queryset = queryset.filter(channel=channel.value)
        return queryset.count()
    
    @staticmethod
    def get_in_app_notification_count(user_id: int) -> int:
        """Get count of in-app (websocket) notifications for a user"""
        return NotificationService.get_total_count(user_id, NotificationChannel.WEBSOCKET)
    
    @staticmethod
    def get_unread_in_app_count(user_id: int) -> int:
        """Get count of unread in-app (websocket) notifications for a user"""
        return NotificationService.get_unread_count(user_id, NotificationChannel.WEBSOCKET)
    
    @staticmethod
    def delete_notification(notification_id: int, user_id: int) -> bool:
        """Delete a notification"""
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.delete()
            return True
        except Notification.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_notifications(
        user_id: int, 
        limit: int = 20, 
        offset: int = 0, 
        unread_only: bool = False,
        channel: Optional[NotificationChannel] = None
    ):
        """Get notifications for a user with pagination, optionally filtered by channel"""
        queryset = Notification.objects.filter(user_id=user_id)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        if channel:
            queryset = queryset.filter(channel=channel.value)
        
        queryset = queryset.order_by('-created_at')[offset:offset+limit]
        
        serializer = NotificationListSerializer(queryset, many=True)
        
        return serializer.data
    
    @staticmethod
    def get_user_in_app_notifications(
        user_id: int, 
        limit: int = 20, 
        offset: int = 0, 
        unread_only: bool = False
    ):
        """Get in-app (websocket) notifications for a user - this is what should be shown in the user feed"""
        return NotificationService.get_user_notifications(
            user_id=user_id,
            limit=limit,
            offset=offset,
            unread_only=unread_only,
            channel=NotificationChannel.WEBSOCKET
        )

    # endregion Utility methods for common notification operations


# Convenience methods for common notification scenarios
class NotificationHelpers:
    """
    Helper methods for sending common types of notifications using database templates
    """
    
    @staticmethod
    def notify_job_posted(job: JobPost, user):
        """Notify admins when a new job is posted"""
        company = user.company if hasattr(user, 'company') else None
        
        if not company:
            raise NotFound("Company associated to user not found.")
        
        is_salary_mode_range = job.salary_mode == SalaryModeType.Range
        
        context = {
            'job_title': job.title,
            'job_id': job.id,
            'job_location': job.location, 
            'job_salary_min': job.salary_min if is_salary_mode_range else None, 
            'job_salary_max': job.salary_max if is_salary_mode_range else None,
            'job_salary_fixed': job.salary_fixed if not is_salary_mode_range else None,
            'job_created_at': job.created_at,
            'company_name': company.name,
            'posted_by_name': user.name or user.email,
            'job_url': f"{settings.FRONTEND_BASE_URL}/admin/dashboard/allJobs/{job.id}",
            'job_description': getattr(job, 'description', ''),
            'base_url': settings.BACKEND_BASE_URL
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.ADMIN_JOB_POSTING,
            target_roles=[NotificationTarget.SUPERADMIN, NotificationTarget.ADMIN],
            template_context=context,
            company_id=company.id,
            channel=NotificationChannel.BOTH
        )
    
    @staticmethod
    def notify_job_application(job, applicant, company, application):
        """Notify company admins when someone applies for a job"""
        context = {
            'job_title': job.title,
            'job_id': job.id,
            'applicant_name': applicant.name,
            'applicant_email': applicant.email,
            'applied_date': application.created_at,
            'application_id': application.id,
            'company_name': company.name,
            'application_url': f"{settings.FRONTEND_BASE_URL}/admin/dashboard/candidates/profile/{applicant.id}?application_id={application.id}",
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.JOB_APPLIED,
            target_roles=[NotificationTarget.ADMIN, NotificationTarget.SUPERADMIN],
            company_id=company.id,
            template_context=context
        )
    
    # region Yet to implement
    
    @staticmethod
    def notify_application_submitted(job: JobPost, application: JobApplication):
        """Notify job seeker when their application is submitted successfully"""
        
        context = {
            'job_title': job.title,
            'job_id': job.id,
            'company_name': job.get_company_name,
            'applied_date': application.created_at,
            'application_id': application.id,
            'job_url': f"{settings.FRONTEND_BASE_URL}?jobId={job.id}",
        }
        
        job_seeker: JobSeeker = application.job_seeker
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.APPLICATION_SUBMITTED,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )

    @staticmethod
    def notify_application_status_changed(application, new_status):
        """Notify job seeker when application status changes"""
        context = {
            'user_name': application.job_seeker.name or application.job_seeker.email,
            'platform_name': 'Talent Cloud',
            'job_title': application.job_post.title,
            'company_name': application.job_post.get_company_name,
            'application_status': new_status.lower(),  # Ensure lowercase
            'status_changed_date': timezone.now(),
            'job_url': f"{settings.FRONTEND_BASE_URL}?jobId={application.job_post.id}",
            'application_id': application.id,
        }
        
        target_user = application.job_seeker.user
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.APPLICATION_SHORTLISTED,
            target_users=[target_user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )
        
    @staticmethod
    def notify_application_shortlisted(application, new_status):
        """Notify job seeker when application shortlist"""
        context = {
            'user_name': application.job_seeker.name or application.job_seeker.email,
            'platform_name': 'Talent Cloud',
            'job_title': application.job_post.title,
            'company_name': application.job_post.get_company_name,
            'application_status': new_status,
            'status_changed_date': timezone.now(),
            'job_url': f"{settings.FRONTEND_BASE_URL}?jobId={application.job_post.id}",
            'application_id': application.id,
        }
        
        target_user = application.job_seeker.user
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.APPLICATION_SHORTLISTED,
            target_users=[target_user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )
    
    @staticmethod
    def notify_application_rejected(application):
        """Notify job seeker when application shortlist"""
        context = {
            'user_name': application.job_seeker.name or application.job_seeker.email,
            'platform_name': 'Talent Cloud',
            'job_title': application.job_post.title,
            'company_name': application.job_post.get_company_name,
            'status_changed_date': timezone.now(),
            'job_url': f"{settings.FRONTEND_BASE_URL}",
            'application_id': application.id,
        }
        
        target_user = application.job_seeker.user
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.APPLICATION_REJECTED,
            target_users=[target_user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )
    
    @staticmethod
    def notify_new_job_matches(job_seeker, matched_jobs):
        """Notify job seeker about new job matches based on their profile"""
        context = {
            'job_seeker_name': job_seeker.name,
            'matched_jobs_count': len(matched_jobs),
            'matched_jobs': [
                {
                    'title': job.title,
                    'company': job.company.name,
                    'location': job.location,
                    'job_url': f"{settings.FRONTEND_BASE_URL}?jobId={job.id}"
                } for job in matched_jobs[:5]  # Limit to 5 jobs
            ],
            'view_all_url': f"{settings.FRONTEND_BASE_URL}",
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.NEW_JOB_MATCHES,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )
    
    @staticmethod
    def notify_profile_completion_reminder(job_seeker, missing_fields):
        """Remind job seeker to complete their profile"""
        context = {
            'job_seeker_name': job_seeker.name,
            'missing_fields': missing_fields,
            'profile_completion_percentage': job_seeker.get_profile_completion_percentage(),
            'profile_url': f"{settings.FRONTEND_BASE_URL}/user/mainProfile",
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.PROFILE_COMPLETION_REMINDER,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.EMAIL  # Email only for reminders
        )

    @staticmethod
    def notify_profile_viewed(job_seeker, company, view_count=1):
        """Notify job seeker when their profile is viewed by employers"""
        context = {
            'job_seeker_name': job_seeker.name,
            'company_name': company.name,
            'view_count': view_count,
            'profile_url': f"{settings.FRONTEND_BASE_URL}/user/mainProfile",
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.PROFILE_VIEWED,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.WEBSOCKET  # In-app only to avoid spam
        )
    
    @staticmethod
    def notify_interview_scheduled(job_seeker, interview):
        """Notify job seeker about scheduled interview"""
        context = {
            'job_seeker_name': job_seeker.name,
            'job_title': interview.application.job_post.title,
            'company_name': interview.application.job_post.company.name,
            'interview_date': interview.scheduled_date,
            'interview_time': interview.scheduled_time,
            'interview_type': interview.interview_type,
            'interview_location': interview.location,
            'interviewer_name': interview.interviewer.name if interview.interviewer else '',
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.INTERVIEW_SCHEDULED,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.BOTH
        )

    @staticmethod
    def notify_interview_reminder(job_seeker, interview, hours_before=24):
        """Send interview reminder"""
        context = {
            'job_seeker_name': job_seeker.name,
            'job_title': interview.application.job_post.title,
            'company_name': interview.application.job_post.company.name,
            'interview_date': interview.scheduled_date,
            'interview_time': interview.scheduled_time,
            'hours_until_interview': hours_before,
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.INTERVIEW_REMINDER,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.BOTH,
            override_is_urgent=True
        )
    
    @staticmethod
    def notify_job_expiring_soon(job_seeker, saved_jobs):
        """Notify about saved jobs expiring soon"""
        context = {
            'job_seeker_name': job_seeker.name,
            'expiring_jobs': [
                {
                    'title': job.title,
                    'company': job.company.name,
                    'expires_in_days': (job.deadline - timezone.now().date()).days,
                    'job_url': f"{settings.FRONTEND_BASE_URL}?jobId={job.id}"
                } for job in saved_jobs
            ],
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.JOB_EXPIRING_SOON,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.EMAIL
        )

    @staticmethod
    def notify_weekly_job_digest(job_seeker, new_jobs_count, trending_jobs):
        """Send weekly digest of new jobs"""
        context = {
            'job_seeker_name': job_seeker.name,
            'new_jobs_count': new_jobs_count,
            'trending_jobs': trending_jobs[:5],
            'week_start': (timezone.now() - timedelta(days=7)).strftime('%B %d'),
            'week_end': timezone.now().strftime('%B %d, %Y'),
            'browse_jobs_url': f"{settings.FRONTEND_BASE_URL}",
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.WEEKLY_JOB_DIGEST,
            target_users=[job_seeker.user],
            template_context=context,
            channel=NotificationChannel.EMAIL
        )

    # endregion Yet to implement
    
    @staticmethod
    def notify_company_registration(company):
        """Notify superadmins when a new company registers"""
        context = {
            'company_name': company.company_name,
            'company_id': company.id,
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.ADMIN_COMPANY_REGISTRATION,
            target_roles=[NotificationTarget.SUPERADMIN],
            template_context=context
        )
    
    @staticmethod
    def notify_company_approved(company, admin_users):
        """Notify company admins when their company is approved"""
        context = {
            'company_name': company.company_name,
            'company_id': company.id,
        }
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.COMPANY_APPROVED,
            target_users=admin_users,
            template_context=context
        )
    
    @staticmethod
    def notify_system_maintenance(title, message, affected_users=None, is_urgent=False, maintanence_context=None):
        """Send system maintenance notifications"""
        context = {
            'maintenance_info': message,
        }
        
        if maintanence_context:
            context.update(maintanence_context)
        
        return NotificationService.send_notification_with_template(
            notification_type=NotificationType.ADMIN_MAINTENANCE,
            target_roles=[NotificationTarget.ALL_ROLES] if not affected_users else None,
            target_users=affected_users,
            channel=NotificationChannel.BOTH,
            template_context=context,
            override_title=title,
            override_message=message,
            override_is_urgent=is_urgent
        )


# Legacy compatibility methods for backward compatibility
def send_notification_to_roles(title: str, message: str, notification_type: NotificationType, target_roles: List[NotificationTarget], company_id: Optional[int] = None, destination_url: Optional[str] = None, channel: NotificationChannel = NotificationChannel.BOTH):
    """Legacy compatibility method"""
    logger.warning("Using legacy send_notification_to_roles. Use NotificationService.send_notification instead.")
    return NotificationService.send_notification(
        title=title,
        message=message,
        notification_type=notification_type,
        target_roles=target_roles,
        company_id=company_id,
        destination_url=destination_url,
        channel=channel
    )

def send_notification_to_users(title: str, message: str, notification_type: NotificationType, target_users: List[TalentCloudUser], destination_url: Optional[str] = None, channel: NotificationChannel = NotificationChannel.BOTH):
    """Legacy compatibility method"""
    logger.warning("Using legacy send_notification_to_users. Use NotificationService.send_notification instead.")
    return NotificationService.send_notification(
        title=title,
        message=message,
        notification_type=notification_type,
        target_users=target_users,
        destination_url=destination_url,
        channel=channel
    )

def send_notification_to_emails(title: str, message: str, notification_type: NotificationType, target_emails: List[str], destination_url: Optional[str] = None, channel: NotificationChannel = NotificationChannel.BOTH):
    """Legacy compatibility method"""
    logger.warning("Using legacy send_notification_to_emails. Use NotificationService.send_notification instead.")
    return NotificationService.send_notification(
        title=title,
        message=message,
        notification_type=notification_type,
        target_emails=target_emails,
        destination_url=destination_url,
        channel=channel
    )
