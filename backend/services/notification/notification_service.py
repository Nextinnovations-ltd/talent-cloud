"""
Streamlined Notification Service for TalentCloud Platform

This service provides a clean, simple, and unified approach to sending notifications
with support for multiple channels (email, websocket, push) and dynamic configuration.

This is the main notification service that should be used throughout the application.
"""

from typing import List, Optional, Dict, Any, Union
from enum import Enum
from django.db import transaction
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from utils.notification.types import NotificationType, NotificationChannel
from core.constants.constants import ROLES
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
        # Collect all target users
        all_target_users = set()
        
        # Add users by roles
        if target_roles:
            role_users = NotificationService.get_users_by_roles(target_roles, company_id)
            all_target_users.update(role_users)
        
        # Add specific users
        if target_users:
            all_target_users.update(target_users)
        
        # Add users by email
        if target_emails:
            email_users = TalentCloudUser.objects.filter(email__in=target_emails, is_active=True)
            all_target_users.update(email_users)
        
        target_users_list = list(all_target_users)
        
        if not target_users_list:
            logger.warning("No target users found for notification")
            return []
        
        notifications = []
        
        try:
            with transaction.atomic():
                # Create in-app notifications
                for user in target_users_list:
                    notification = Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        destination_url=destination_url,
                        notification_type=notification_type.value
                    )
                    notifications.append(notification)
                    
                    # Send via appropriate channels
                    if channel in [NotificationChannel.WEBSOCKET, NotificationChannel.BOTH]:
                        NotificationService._send_websocket_notification(user, notification)
                    
                    if channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
                        NotificationService._send_email_notification(
                            user, 
                            notification, 
                            email_template, 
                            email_context,
                            is_urgent
                        )
                    
                    if channel == NotificationChannel.PUSH:
                        NotificationService._send_push_notification(user, notification, is_urgent)
                        
            logger.info(f"Sent {len(notifications)} notifications: {title}")
            
        except Exception as e:
            logger.error(f"Error sending notifications: {str(e)}")
            
        return notifications
    
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

    # Utility methods for common notification operations
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
            return None
    
    @staticmethod
    def mark_all_as_read(user_id: int) -> int:
        """Mark all notifications as read for a user"""
        return Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
    
    @staticmethod
    def get_unread_count(user_id: int) -> int:
        """Get count of unread notifications for a user"""
        return Notification.objects.filter(user_id=user_id, is_read=False).count()
    
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
    def get_user_notifications(user_id: int, limit: int = 20, offset: int = 0, unread_only: bool = False):
        """Get notifications for a user with pagination"""
        queryset = Notification.objects.filter(user_id=user_id)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        return queryset.order_by('-created_at')[offset:offset+limit]


# Convenience methods for common notification scenarios
class NotificationHelpers:
    """
    Helper methods for sending common types of notifications
    """
    
    @staticmethod
    def notify_job_posted(job, company):
        """Notify admins when a new job is posted"""
        return NotificationService.send_notification(
            title=f"New Job Posted: {job.title}",
            message=f"Company {company.company_name} has posted a new job: {job.title}",
            notification_type=NotificationType.ADMIN_JOB_POSTING,
            target_roles=[NotificationTarget.ADMIN, NotificationTarget.SUPERADMIN],
            destination_url=f"/admin/jobs/{job.id}",
            email_context={'job': job, 'company': company}
        )
    
    @staticmethod
    def notify_job_application(job, applicant, company):
        """Notify company admins when someone applies for a job"""
        return NotificationService.send_notification(
            title=f"New Application for {job.title}",
            message=f"{applicant.get_full_name()} has applied for the position: {job.title}",
            notification_type=NotificationType.JOB_APPLIED,
            target_roles=[NotificationTarget.ADMIN],
            company_id=company.id,
            destination_url=f"/company/applications/{job.id}",
            email_context={'job': job, 'applicant': applicant, 'company': company}
        )
    
    @staticmethod
    def notify_company_registration(company):
        """Notify superadmins when a new company registers"""
        return NotificationService.send_notification(
            title=f"New Company Registration: {company.company_name}",
            message=f"A new company '{company.company_name}' has registered and is pending approval.",
            notification_type=NotificationType.ADMIN_COMPANY_REGISTRATION,
            target_roles=[NotificationTarget.SUPERADMIN],
            destination_url=f"/admin/companies/{company.id}",
            email_context={'company': company}
        )
    
    @staticmethod
    def notify_company_approved(company, admin_users):
        """Notify company admins when their company is approved"""
        return NotificationService.send_notification(
            title="Company Registration Approved",
            message=f"Congratulations! Your company '{company.company_name}' has been approved and is now active on TalentCloud.",
            notification_type=NotificationType.COMPANY_APPROVED,
            target_users=admin_users,
            destination_url="/company/dashboard",
            email_context={'company': company}
        )
    
    @staticmethod
    def notify_system_maintenance(title, message, affected_users=None, is_urgent=False):
        """Send system maintenance notifications"""
        target_roles = [NotificationTarget.ALL_ROLES] if not affected_users else None
        
        return NotificationService.send_notification(
            title=title,
            message=message,
            notification_type=NotificationType.ADMIN_MAINTENANCE,
            target_roles=target_roles,
            target_users=affected_users,
            channel=NotificationChannel.BOTH,
            is_urgent=is_urgent,
            email_context={'maintenance_info': message}
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
