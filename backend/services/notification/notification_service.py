from django.db import transaction
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from utils.notification.types import NotificationType, NotificationChannel
from core.constants.constants import ROLES
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging
from typing import List, Optional, Union, Any
from enum import Enum

logger = logging.getLogger(__name__)

class NotificationTarget(str, Enum):
    """Define who should receive notifications"""
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    USER = "user"
    ALL_ROLES = "all_roles"

class NotificationService:
    """Enhanced service for managing notifications with dynamic role-based targeting"""
    
    @staticmethod
    def get_users_by_roles(target_roles: List[NotificationTarget], company_id: Optional[int] = None):
        """
        Get users based on roles and company context
        
        Args:
            target_roles: List of roles to target
            company_id: Specific company ID for admin users (None for all companies)
        """
        users = []
        
        for role in target_roles:
            if role == NotificationTarget.SUPERADMIN:
                # Get all superadmin users (they belong to NI company)
                superadmins = TalentCloudUser.objects.filter(
                    role__name=ROLES.SUPERADMIN, 
                    is_active=True
                )
                users.extend(superadmins)
                
            elif role == NotificationTarget.ADMIN:
                # Get admin users
                admin_filter = {
                    'role__name': ROLES.ADMIN,
                    'is_active': True
                }
                
                # If company_id is specified, get admins from that company only
                if company_id:
                    admin_filter['company_id'] = company_id
                
                admins = TalentCloudUser.objects.filter(**admin_filter)
                users.extend(admins)
                
            elif role == NotificationTarget.USER:
                # Get regular users (job seekers)
                user_filter = {
                    'role__name': ROLES.USER,
                    'is_active': True
                }
                
                regular_users = TalentCloudUser.objects.filter(**user_filter)
                users.extend(regular_users)
                
            elif role == NotificationTarget.ALL_ROLES:
                # Get all active users regardless of role
                all_users = TalentCloudUser.objects.filter(is_active=True)
                users.extend(all_users)
        
        # Remove duplicates
        return list(set(users))
    
    @staticmethod
    def create_notification_by_roles(
        target_roles: List[NotificationTarget],
        title: str,
        message: str,
        notification_type: NotificationType,
        destination_url: Optional[str] = None,
        channel: NotificationChannel = NotificationChannel.BOTH,
        company_id: Optional[int] = None,
        specific_users: Optional[List[Any]] = None
    ):
        """
        Create notifications for users based on roles
        
        Args:
            target_roles: List of roles to target
            title: Notification title
            message: Notification message
            notification_type: Type of notification
            destination_url: URL to redirect when clicked
            channel: Delivery channel
            company_id: Company context for admin users
            specific_users: Additional specific users to include
        """
        target_users = []
        
        # Get users by roles
        if target_roles:
            target_users.extend(NotificationService.get_users_by_roles(target_roles, company_id))
        
        # Add specific users if provided
        if specific_users:
            target_users.extend(specific_users)
        
        # Remove duplicates
        target_users = list(set(target_users))
        
        return NotificationService.create_notification(
            users=target_users,
            title=title,
            message=message,
            destination_url=destination_url,
            notification_type=notification_type,
            channel=channel
        )
    
    @staticmethod
    def create_notification(
        user_id=None,
        users=None,
        title="Notification",
        message="",
        destination_url=None,
        notification_type=NotificationType.GENERIC,
        channel=NotificationChannel.BOTH
    ):
        """
        Create notification(s) for user(s)
        
        Args:
            user_id: Single user ID
            users: List of user objects or IDs
            title: Notification title
            message: Notification message
            destination_url: URL to redirect when clicked
            notification_type: Type of notification
            channel: Delivery channel (email, websocket, both)
        """
        notifications = []
        
        try:
            with transaction.atomic():
                # Determine target users
                target_users = []
                
                if user_id:
                    try:
                        user = TalentCloudUser.objects.get(id=user_id)
                        target_users = [user]
                    except TalentCloudUser.DoesNotExist:
                        logger.error(f"User with ID {user_id} not found")
                        return []
                
                elif users:
                    # Handle list of users or user IDs
                    for user in users:
                        if isinstance(user, int):
                            try:
                                user_obj = TalentCloudUser.objects.get(id=user)
                                target_users.append(user_obj)
                            except TalentCloudUser.DoesNotExist:
                                logger.error(f"User with ID {user} not found")
                        else:
                            target_users.append(user)
                
                # Create notifications
                for user in target_users:
                    notification = Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        destination_url=destination_url,
                        notification_type=notification_type.value
                    )
                    notifications.append(notification)
                    
                    # Send real-time notification
                    if channel in [NotificationChannel.WEBSOCKET, NotificationChannel.BOTH]:
                        NotificationService._send_websocket_notification(user, notification)
                    
                    # Send email notification
                    if channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
                        NotificationService._send_email_notification(user, notification)
        
        except Exception as e:
            logger.error(f"Error creating notifications: {str(e)}")
            
        return notifications
    
    @staticmethod
    def _send_websocket_notification(user, notification):
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
            logger.error(f"Error sending WebSocket notification: {str(e)}")
    
    @staticmethod
    def _send_email_notification(user, notification):
        """Send email notification (implement based on your email service)"""
        # TODO: Implement email sending logic
        logger.info(f"Email notification sent to {user.email}: {notification.title}")
    
    @staticmethod
    def mark_as_read(notification_id, user_id):
        """Mark notification as read"""
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.is_read = True
            notification.save()
            return notification
        except Notification.DoesNotExist:
            logger.error(f"Notification {notification_id} not found for user {user_id}")
            return None
    
    @staticmethod
    def mark_all_as_read(user_id):
        """Mark all notifications as read for a user"""
        count = Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
        return count
    
    @staticmethod
    def get_unread_count(user_id):
        """Get count of unread notifications for a user"""
        return Notification.objects.filter(user_id=user_id, is_read=False).count()
    
    @staticmethod
    def delete_notification(notification_id, user_id):
        """Delete a notification"""
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.delete()
            return True
        except Notification.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_notifications(user_id, limit=20, offset=0, unread_only=False):
        """Get notifications for a user with pagination"""
        queryset = Notification.objects.filter(user_id=user_id)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        return queryset.order_by('-created_at')[offset:offset+limit]


# Dynamic Action-Based Notification Service
class ActionBasedNotificationService:
    """Service for handling specific actions with predefined role targeting"""
    
    # Define notification configurations for different actions
    NOTIFICATION_CONFIGS = {
        'company_registration': {
            'target_roles': [NotificationTarget.SUPERADMIN],
            'title': 'New Company Registration',
            'type': NotificationType.ADMIN_COMPANY_REGISTRATION,
            'destination_template': '/admin/companies/{company_id}/verify'
        },
        'job_posted_by_outside_company': {
            'target_roles': [NotificationTarget.ADMIN, NotificationTarget.SUPERADMIN],
            'title': 'New Job Posted',
            'type': NotificationType.JOB_POSTED,
            'destination_template': '/jobs/{job_id}'
        },
        'job_application_received': {
            'target_roles': [NotificationTarget.ADMIN],
            'title': 'New Job Application',
            'type': NotificationType.JOB_APPLIED,
            'destination_template': '/company/applications/{job_id}',
            'company_specific': True
        },
        'company_status_changed': {
            'target_roles': [NotificationTarget.ADMIN],
            'title': 'Company Status Update',
            'type': NotificationType.COMPANY_APPROVED,
            'destination_template': '/company/dashboard',
            'company_specific': True
        },
        'job_post_approval_status': {
            'target_roles': [NotificationTarget.ADMIN],
            'title': 'Job Post Status Update',
            'type': NotificationType.JOB_POSTED,
            'destination_template': '/company/jobs/{job_id}',
            'company_specific': True
        },
        'system_maintenance': {
            'target_roles': [NotificationTarget.ALL_ROLES],
            'title': 'System Maintenance',
            'type': NotificationType.ADMIN_SYSTEM_ALERT,
            'destination_template': '/maintenance'
        },
        'platform_activity_summary': {
            'target_roles': [NotificationTarget.SUPERADMIN],
            'title': 'Platform Activity Summary',
            'type': NotificationType.ADMIN_PLATFORM_ACTIVITY,
            'destination_template': '/admin/analytics'
        },
        'user_violation_report': {
            'target_roles': [NotificationTarget.SUPERADMIN],
            'title': 'User Violation Report',
            'type': NotificationType.ADMIN_VIOLATION_REPORT,
            'destination_template': '/admin/violations/{user_id}'
        },
        'content_moderation_required': {
            'target_roles': [NotificationTarget.SUPERADMIN],
            'title': 'Content Moderation Required',
            'type': NotificationType.ADMIN_CONTENT_MODERATION,
            'destination_template': '/admin/moderation/{content_type}/{content_id}'
        },
        'high_volume_job_posting': {
            'target_roles': [NotificationTarget.SUPERADMIN],
            'title': 'High Volume Job Posting Alert',
            'type': NotificationType.ADMIN_JOB_POSTING,
            'destination_template': '/admin/companies/{company_id}/job-posts'
        }
    }
    
    @staticmethod
    def send_notification(action: str, message: str, **kwargs):
        """
        Send notification based on predefined action configuration
        
        Args:
            action: Action key from NOTIFICATION_CONFIGS
            message: Custom message for the notification
            **kwargs: Additional parameters for URL formatting and context
        """
        if action not in ActionBasedNotificationService.NOTIFICATION_CONFIGS:
            logger.error(f"Unknown action: {action}")
            return []
        
        config = ActionBasedNotificationService.NOTIFICATION_CONFIGS[action]
        
        # Format destination URL
        destination_url = config['destination_template']
        if destination_url and kwargs:
            try:
                destination_url = destination_url.format(**kwargs)
            except KeyError as e:
                logger.warning(f"Missing parameter for URL formatting: {e}")
        
        # Determine company context
        company_id = None
        
        if config.get('company_specific', False):
            company_id = kwargs.get('company_id')
        
        return NotificationService.create_notification_by_roles(
            target_roles=config['target_roles'],
            title=config['title'],
            message=message,
            notification_type=config['type'],
            destination_url=destination_url,
            company_id=company_id
        )
    
    @staticmethod
    def update_notification_config(action: str, config: dict):
        """Update notification configuration for an action"""
        ActionBasedNotificationService.NOTIFICATION_CONFIGS[action] = config
    
    @staticmethod
    def get_notification_config(action: str):
        """Get notification configuration for an action"""
        return ActionBasedNotificationService.NOTIFICATION_CONFIGS.get(action)
    
    @staticmethod
    def add_custom_action(action: str, target_roles: List[NotificationTarget], 
                         title: str, notification_type: NotificationType, 
                         destination_template: str = None, company_specific: bool = False):
        """
        Add a custom notification action configuration
        
        Args:
            action: Unique action identifier
            target_roles: List of roles to target
            title: Notification title
            notification_type: Type of notification
            destination_template: URL template with placeholders
            company_specific: Whether this is company-specific
        """
        ActionBasedNotificationService.NOTIFICATION_CONFIGS[action] = {
            'target_roles': target_roles,
            'title': title,
            'type': notification_type,
            'destination_template': destination_template,
            'company_specific': company_specific
        }


# Company Notification
class CompanyNotificationService:
    """Service for company-related notifications"""
    
    @staticmethod
    def notify_company_registration(company):
        """Notify superadmins about new company registration"""
        return ActionBasedNotificationService.send_notification(
            action='company_registration',
            message=f"A new company '{company.name}' has been registered and requires verification.",
            company_id=company.id
        )
    
    @staticmethod
    def notify_company_status_changed(company, status):
        """Notify company admins about status change"""
        return ActionBasedNotificationService.send_notification(
            action='company_status_changed',
            message=f"Your company '{company.name}' has been {status}.",
            company_id=company.id
        )

# Job Notification
class JobNotificationService:
    """Service for job-related notifications"""
    
    @staticmethod
    def notify_job_posted_by_outside_company(job_post):
        """Notify admins and superadmins about new job posting"""
        return ActionBasedNotificationService.send_notification(
            action='job_posted_by_outside_company',
            message=f"A new job '{job_post.title}' has been posted by {job_post.company.name}.",
            job_id=job_post.id
        )
    
    @staticmethod
    def notify_job_application_received(job_post, applicant):
        """Notify company admins about job application"""
        return ActionBasedNotificationService.send_notification(
            action='job_application_received',
            message=f"{applicant.name or applicant.username} applied for '{job_post.title}'",
            job_id=job_post.id,
            company_id=job_post.company.id
        )
    
    @staticmethod
    def notify_job_post_approval_status(job_post, status):
        """Notify company admins about job post approval status"""
        return ActionBasedNotificationService.send_notification(
            action='job_post_approval_status',
            message=f"Your job post '{job_post.title}' has been {status}.",
            job_id=job_post.id,
            company_id=job_post.company.id
        )
    
    @staticmethod
    def notify_high_volume_job_posting(company, job_count):
        """Notify superadmins about high volume job posting"""
        return ActionBasedNotificationService.send_notification(
            action='high_volume_job_posting',
            message=f"Company '{company.name}' has posted {job_count} jobs recently. Please review for policy compliance.",
            company_id=company.id
        )

# System Notification
class SystemNotificationService:
    """Service for system-wide notifications"""
    
    @staticmethod
    def notify_system_maintenance(maintenance_type, scheduled_time):
        """Notify all users about system maintenance"""
        return ActionBasedNotificationService.send_notification(
            action='system_maintenance',
            message=f"{maintenance_type} maintenance scheduled for {scheduled_time}. Please save your work."
        )
    
    @staticmethod
    def notify_platform_activity_summary(metrics):
        """Notify superadmins about platform activity"""
        message = f"Platform Activity Summary: {metrics.get('new_users', 0)} new users, {metrics.get('new_companies', 0)} new companies, {metrics.get('new_jobs', 0)} new job posts."
        return ActionBasedNotificationService.send_notification(
            action='platform_activity_summary',
            message=message
        )

# Admin Notification
class AdminNotificationService:
    """Service for admin-specific notifications"""
    
    @staticmethod
    def notify_user_violation_report(reported_user, reporter, violation_type):
        """Notify superadmins about user violation"""
        return ActionBasedNotificationService.send_notification(
            action='user_violation_report',
            message=f"User '{reported_user.email}' has been reported for {violation_type} by '{reporter.email}'",
            user_id=reported_user.id
        )
    
    @staticmethod
    def notify_content_moderation_required(content_type, content_id, reason):
        """Notify superadmins about content moderation"""
        return ActionBasedNotificationService.send_notification(
            action='content_moderation_required',
            message=f"{content_type} (ID: {content_id}) has been flagged for review. Reason: {reason}",
            content_type=content_type,
            content_id=content_id
        )
