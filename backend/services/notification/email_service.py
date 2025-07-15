"""
Email Service for the Unified Notification System

This service handles all email notifications with template support and
integrates with the MailService for actual email delivery.
"""

from typing import Dict, Any, Optional
from django.conf import settings
from django.template.loader import render_to_string
from services.notification.mail.mail_service import MailService
from utils.notification.types import NotificationType
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """
    Unified email service for notification delivery
    """
    
    # Email template mappings for different notification types
    TEMPLATE_MAPPING = {
        NotificationType.GENERIC: 'emails/generic_notification.html',
        NotificationType.JOB_POSTED: 'emails/job_posted.html',
        NotificationType.JOB_APPLIED: 'emails/job_applied.html',
        NotificationType.COMPANY_APPROVED: 'emails/company_approved.html',
        NotificationType.ADMIN_COMPANY_REGISTRATION: 'emails/admin_company_registration.html',
        NotificationType.ADMIN_USER_REGISTRATION: 'emails/admin_user_registration.html',
        NotificationType.ADMIN_JOB_POSTING: 'emails/admin_job_posting.html',
        NotificationType.ADMIN_SYSTEM_ALERT: 'emails/admin_system_alert.html',
        NotificationType.ADMIN_PLATFORM_ACTIVITY: 'emails/admin_platform_activity.html',
        NotificationType.ADMIN_REPORT_GENERATED: 'emails/admin_report_generated.html',
        NotificationType.ADMIN_COMPANY_VERIFICATION: 'emails/admin_company_verification.html',
        NotificationType.ADMIN_CONTENT_MODERATION: 'emails/admin_content_moderation.html',
        NotificationType.ADMIN_VIOLATION_REPORT: 'emails/admin_violation_report.html',
        NotificationType.ADMIN_MAINTENANCE: 'emails/admin_maintenance.html',
    }
    
    @staticmethod
    def send_email(
        recipient_email: str,
        subject: str,
        template: str,
        context: Dict[str, Any],
        is_urgent: bool = False
    ) -> bool:
        """
        Send an email notification using the specified template
        
        Args:
            recipient_email: Recipient's email address
            subject: Email subject line
            template: Template name/path
            context: Template context variables
            is_urgent: Whether this is an urgent notification
            
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            # Add urgent prefix to subject if needed
            if is_urgent:
                subject = f"[URGENT] {subject}"
            
            # Enhance context with common variables
            enhanced_context = {
                'platform_name': getattr(settings, 'PLATFORM_NAME', 'TalentCloud'),
                'frontend_url': getattr(settings, 'FRONTEND_URL', ''),
                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@talentcloud.com'),
                'contact_url': f"{getattr(settings, 'FRONTEND_URL', '')}/contact",
                'unsubscribe_url': f"{getattr(settings, 'FRONTEND_URL', '')}/unsubscribe",
                'is_urgent': is_urgent,
                **context
            }
            
            # Send using MailService
            MailService.send_template_email(
                subject=subject,
                template_name=template,
                context=enhanced_context,
                recipient_list=[recipient_email]
            )
            
            logger.info(f"Email sent successfully to {recipient_email}: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
            return False
    
    @staticmethod
    def get_template_for_notification_type(notification_type: NotificationType) -> str:
        """
        Get the email template path for a specific notification type
        
        Args:
            notification_type: The type of notification
            
        Returns:
            str: Template path
        """
        return EmailService.TEMPLATE_MAPPING.get(
            notification_type, 
            EmailService.TEMPLATE_MAPPING[NotificationType.GENERIC]
        )
    
    @staticmethod
    def send_bulk_email(
        recipient_emails: list,
        subject: str,
        template: str,
        context: Dict[str, Any],
        is_urgent: bool = False
    ) -> Dict[str, int]:
        """
        Send bulk emails to multiple recipients
        
        Args:
            recipient_emails: List of recipient email addresses
            subject: Email subject line
            template: Template name/path
            context: Template context variables
            is_urgent: Whether this is an urgent notification
            
        Returns:
            Dict with success and failure counts
        """
        success_count = 0
        failure_count = 0
        
        for email in recipient_emails:
            if EmailService.send_email(email, subject, template, context, is_urgent):
                success_count += 1
            else:
                failure_count += 1
        
        logger.info(f"Bulk email completed: {success_count} successful, {failure_count} failed")
        
        return {
            'success_count': success_count,
            'failure_count': failure_count,
            'total_count': len(recipient_emails)
        }
    
    @staticmethod
    def send_notification_email(
        recipient_email: str,
        notification_type: NotificationType,
        context: Dict[str, Any],
        subject: Optional[str] = None,
        is_urgent: bool = False
    ) -> bool:
        """
        Send a notification email using the appropriate template for the notification type
        
        Args:
            recipient_email: Recipient's email address
            notification_type: Type of notification
            context: Template context variables
            subject: Custom subject (uses default from context if not provided)
            is_urgent: Whether this is an urgent notification
            
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        template = EmailService.get_template_for_notification_type(notification_type)
        email_subject = subject or context.get('title', 'Notification from TalentCloud')
        
        return EmailService.send_email(
            recipient_email=recipient_email,
            subject=email_subject,
            template=template,
            context=context,
            is_urgent=is_urgent
        )
