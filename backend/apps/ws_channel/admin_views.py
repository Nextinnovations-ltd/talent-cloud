"""
Admin views for managing notifications and company approvals
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudSuperAdminPermission
from services.notification.notification_service import (
    NotificationService, 
    NotificationHelpers,
    NotificationTarget
)
from apps.companies.models import Company
from apps.users.models import TalentCloudUser
from utils.response import CustomResponse
from utils.notification.types import NotificationChannel
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["Admin - Notifications"])
class AdminNotificationAPIView(APIView):
    """
    API endpoint for admins to send custom notifications
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudSuperAdminPermission]

    def post(self, request):
        """
        Send custom notification to users
        Expected payload:
        {
            "subject": "Notification subject",
            "message": "Notification message", 
            "target_roles": ["USER", "ADMIN"],  // optional
            "specific_emails": ["user@example.com"],  // optional
            "channel": "BOTH",  // EMAIL, WEBSOCKET, or BOTH
            "is_urgent": false  // optional
        }
        """
        try:
            subject = request.data.get('subject')
            message = request.data.get('message')
            target_roles = request.data.get('target_roles', [])
            specific_emails = request.data.get('specific_emails', [])
            channel_str = request.data.get('channel', 'BOTH')
            is_urgent = request.data.get('is_urgent', False)

            if not subject or not message:
                raise ValidationError("Subject and message are required")

            # Convert channel string to enum
            try:
                channel = NotificationChannel(channel_str.upper())
            except ValueError:
                channel = NotificationChannel.BOTH

            # Convert role strings to NotificationTarget if provided
            notification_targets = []
            if target_roles:
                for role in target_roles:
                    if hasattr(NotificationTarget, role.upper()):
                        notification_targets.append(getattr(NotificationTarget, role.upper()))

            # Get specific users by email if provided
            specific_users = []
            if specific_emails:
                specific_users = list(TalentCloudUser.objects.filter(email__in=specific_emails))

            # Send custom notification
            if channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
                # Get target users
                target_users = []
                if notification_targets:
                    target_users.extend(NotificationService.get_users_by_roles(notification_targets))
                if specific_users:
                    target_users.extend(specific_users)
                
                # Remove duplicates
                target_users = list(set(target_users))
                
                if target_users:
                    from utils.notification.types import NotificationType
                    
                    NotificationService.send_notification(
                        title=subject,
                        message=message,
                        notification_type=NotificationType.ADMIN_SYSTEM_ALERT if is_urgent else NotificationType.GENERIC,
                        target_users=target_users,
                        channel=NotificationChannel.EMAIL,
                        is_urgent=is_urgent
                    )

            # Send in-app notification if required
            if channel in [NotificationChannel.WEBSOCKET, NotificationChannel.BOTH]:
                from utils.notification.types import NotificationType
                
                NotificationService.create_notification_by_roles(
                    target_roles=notification_targets if notification_targets else None,
                    title=subject,
                    message=message,
                    notification_type=NotificationType.GENERIC,
                    channel=NotificationChannel.WEBSOCKET,
                    specific_users=specific_users if specific_users else None
                )

            return Response(
                CustomResponse.success("Notification sent successfully"),
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Failed to send admin notification: {str(e)}")
            return Response(
                CustomResponse.error(f"Failed to send notification: {str(e)}"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@extend_schema(tags=["Admin - Company Management"])
class AdminCompanyApprovalAPIView(APIView):
    """
    API endpoint for admins to approve/reject company registrations
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudSuperAdminPermission]

    def patch(self, request, company_id):
        """
        Approve or reject a company registration
        Expected payload:
        {
            "action": "approve" | "reject",
            "reason": "Optional reason for rejection",
            "channel": "BOTH"  // EMAIL, WEBSOCKET, or BOTH
        }
        """
        try:
            company = get_object_or_404(Company, id=company_id)
            action = request.data.get('action')
            reason = request.data.get('reason', '')
            channel_str = request.data.get('channel', 'BOTH')

            if action not in ['approve', 'reject']:
                raise ValidationError("Action must be either 'approve' or 'reject'")

            # Convert channel string to enum
            try:
                channel = NotificationChannel(channel_str.upper())
            except ValueError:
                channel = NotificationChannel.BOTH

            if action == 'approve':
                company.is_verified = True
                company.save()
                
                # Send approval notification
                from apps.users.models import TalentCloudUser
                from utils.notification.types import NotificationType
                
                company_users = TalentCloudUser.objects.filter(
                    company=company, 
                    role__name='admin', 
                    is_active=True
                )
                
                NotificationService.send_notification(
                    title="Company Registration Approved",
                    message=f"Congratulations! Your company '{company.name}' has been approved and is now active on TalentCloud.",
                    notification_type=NotificationType.COMPANY_APPROVED,
                    target_users=list(company_users),
                    destination_url="/company/dashboard",
                    channel=channel,
                    email_context={'company': company}
                )
                
                return Response(
                    CustomResponse.success(f"Company '{company.name}' has been approved"),
                    status=status.HTTP_200_OK
                )
                
            elif action == 'reject':
                company.is_verified = False
                company.save()
                
                # Send rejection notification
                from apps.users.models import TalentCloudUser
                from utils.notification.types import NotificationType
                
                company_users = TalentCloudUser.objects.filter(
                    company=company, 
                    role__name='admin', 
                    is_active=True
                )
                
                NotificationService.send_notification(
                    title="Company Registration Rejected",
                    message=f"Your company '{company.name}' registration has been rejected." + (f" Reason: {reason}" if reason else ""),
                    notification_type=NotificationType.COMPANY_APPROVED,  # We can add a COMPANY_REJECTED type later
                    target_users=list(company_users),
                    destination_url="/company/dashboard",
                    channel=channel,
                    email_context={'company': company, 'reason': reason}
                )
                
                return Response(
                    CustomResponse.success(f"Company '{company.name}' has been rejected"),
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            logger.error(f"Failed to process company approval: {str(e)}")
            return Response(
                CustomResponse.error(f"Failed to process company approval: {str(e)}"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@extend_schema(tags=["Admin - System Notifications"])
class AdminSystemMaintenanceAPIView(APIView):
    """
    API endpoint for admins to send system maintenance notifications
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudSuperAdminPermission]

    def post(self, request):
        """
        Send system maintenance notification
        Expected payload:
        {
            "message": "Maintenance message",
            "start_time": "2025-07-15T02:00:00Z",
            "end_time": "2025-07-15T04:00:00Z",
            "is_urgent": false,
            "channel": "BOTH"
        }
        """
        try:
            message = request.data.get('message')
            start_time_str = request.data.get('start_time')
            end_time_str = request.data.get('end_time')
            is_urgent = request.data.get('is_urgent', False)
            channel_str = request.data.get('channel', 'BOTH')

            if not message or not start_time_str or not end_time_str:
                raise ValidationError("Message, start_time, and end_time are required")

            # Parse datetime strings
            try:
                start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
                end_time = datetime.fromisoformat(end_time_str.replace('Z', '+00:00'))
            except ValueError:
                raise ValidationError("Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SSZ)")

            # Convert channel string to enum
            try:
                channel = NotificationChannel(channel_str.upper())
            except ValueError:
                channel = NotificationChannel.BOTH

            # Send maintenance notification
            from utils.notification.types import NotificationType
            
            maintenance_message = f"Scheduled maintenance: {start_time.strftime('%B %d, %Y at %I:%M %p')}"
            if end_time:
                maintenance_message += f" until {end_time.strftime('%B %d, %Y at %I:%M %p')}"
            maintenance_message += ". Please save your work and expect temporary service interruption."
            
            NotificationService.send_notification(
                title="System Maintenance Notification",
                message=maintenance_message,
                notification_type=NotificationType.ADMIN_MAINTENANCE,
                target_roles=[NotificationTarget.ALL_ROLES],
                channel=channel,
                is_urgent=is_urgent,
                email_context={
                    'maintenance_type': "Scheduled",
                    'start_time': start_time,
                    'end_time': end_time
                }
            )

            return Response(
                CustomResponse.success("System maintenance notification sent successfully"),
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Failed to send maintenance notification: {str(e)}")
            return Response(
                CustomResponse.error(f"Failed to send maintenance notification: {str(e)}"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
