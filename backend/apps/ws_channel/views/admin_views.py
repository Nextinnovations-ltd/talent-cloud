"""
Admin views for ws_channel app
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
from utils.notification.types import NotificationType, NotificationChannel
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

            # Send notification using the new channel-aware system
            NotificationService.send_notification(
                title=subject,
                message=message,
                notification_type=NotificationType.ADMIN_SYSTEM_ALERT if is_urgent else NotificationType.GENERIC,
                target_roles=notification_targets if notification_targets else None,
                target_users=specific_users if specific_users else None,
                channel=channel,
                is_urgent=is_urgent
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
                company_users = TalentCloudUser.objects.filter(
                    company=company, 
                    role__name='admin', 
                    is_active=True
                )
                
                NotificationService.send_notification(
                    title="Company Registration Approved",
                    message=f"Congratulations! Your company '{company.company_name}' has been approved and is now active on TalentCloud.",
                    notification_type=NotificationType.COMPANY_APPROVED,
                    target_users=list(company_users),
                    destination_url="/company/dashboard",
                    channel=channel,
                    email_context={'company': company}
                )
                
                return Response(
                    CustomResponse.success(f"Company '{company.company_name}' has been approved"),
                    status=status.HTTP_200_OK
                )
                
            elif action == 'reject':
                company.is_verified = False
                company.save()
                
                # Send rejection notification
                company_users = TalentCloudUser.objects.filter(
                    company=company, 
                    role__name='admin', 
                    is_active=True
                )
                
                NotificationService.send_notification(
                    title="Company Registration Rejected",
                    message=f"Your company '{company.company_name}' registration has been rejected." + (f" Reason: {reason}" if reason else ""),
                    notification_type=NotificationType.COMPANY_REJECTED,
                    target_users=list(company_users),
                    destination_url="/company/dashboard",
                    channel=channel,
                    email_context={'company': company, 'reason': reason}
                )
                
                return Response(
                    CustomResponse.success(f"Company '{company.company_name}' has been rejected"),
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

            # Send maintenance notification using the helper
            NotificationHelpers.notify_system_maintenance(
                title="System Maintenance Notification",
                message=message,
                is_urgent=is_urgent
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
