from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from apps.ws_channel.models import Notification
from apps.ws_channel.serializers import (
    NotificationListSerializer,
    NotificationDetailSerializer,
    NotificationUpdateSerializer
)
from services.notification.notification_service import NotificationService, NotificationHelpers
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse


class TestAPIView(APIView):
    def get(self, request):
        NotificationHelpers.notify_system_maintenance(title="System maintenance", message="System Maintanence will be tonight 12:00 AM.")
        
        return Response(
            CustomResponse.success(
                message="Notifications sent successfully.",
            ),
            status=status.HTTP_200_OK
        )

@extend_schema(tags=["Notifications"])
class NotificationListAPIView(APIView):
    """
    List notifications for authenticated user and get unread count
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Get user notifications",
        description="Retrieve notifications for the authenticated user with pagination",
        parameters=[
            OpenApiParameter(
                name='limit',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of notifications to return (default: 20)'
            ),
            OpenApiParameter(
                name='offset',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of notifications to skip (default: 0)'
            ),
            OpenApiParameter(
                name='unread_only',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Return only unread notifications (default: false)'
            )
        ],
        responses={
            200: NotificationListSerializer(many=True),
            401: "Unauthorized"
        }
    )
    def get(self, request):
        """Get in-app notifications for authenticated user"""
        limit = int(request.query_params.get('limit', 10))
        offset = int(request.query_params.get('offset', 0))
        unread_only = request.query_params.get('unread_only', 'false').lower() == 'true'
        
        # Only get in-app (websocket) notifications for the user feed
        notifications = NotificationService.get_user_in_app_notifications(
            user_id=request.user.id,
            limit=limit,
            offset=offset,
            unread_only=unread_only
        )
        
        # Only count unread in-app notifications
        unread_count = NotificationService.get_unread_in_app_count(request.user.id)
        
        # Only count total in-app notifications
        notification_counts = NotificationService.get_in_app_notification_count(request.user.id)
        
        return Response(
            CustomResponse.success(
                "Notifications retrieved successfully.",
                {
                    'notifications': notifications,
                    'total_count': notification_counts,
                    'unread_count': unread_count,
                }
            ),
            status=status.HTTP_200_OK
        )


@extend_schema(tags=["Notifications"])
class NotificationDetailAPIView(APIView):
    """
    Retrieve, update, or delete a specific notification
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    def get_object(self, notification_id, user_id):
        """Get notification ensuring it belongs to the authenticated user"""
        return get_object_or_404(Notification, id=notification_id, user_id=user_id)
    
    @extend_schema(
        summary="Get notification details",
        description="Retrieve details of a specific notification",
        parameters=[
            OpenApiParameter(
                name='notification_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID of the notification'
            )
        ],
        responses={
            200: NotificationDetailSerializer,
            404: "Not Found",
            401: "Unauthorized"
        }
    )
    
    def get(self, request, notification_id):
        """Get specific notification"""
        notification = self.get_object(notification_id, request.user.id)
        
        serializer = NotificationDetailSerializer(notification)
        
        return Response(
            CustomResponse.success(
                "Notification retrieved successfully.",
                serializer.data
            ),
            status=status.HTTP_200_OK
        )
    
    @extend_schema(
        summary="Update notification",
        description="Update notification (typically to mark as read)",
        request=NotificationUpdateSerializer,
        parameters=[
            OpenApiParameter(
                name='notification_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID of the notification to update'
            )
        ],
        responses={
            200: NotificationDetailSerializer,
            400: "Bad Request",
            404: "Not Found",
            401: "Unauthorized"
        }
    )
    def put(self, request, notification_id):
        """Update notification (mark as read/unread)"""
        notification = self.get_object(notification_id, request.user.id)
        
        serializer = NotificationUpdateSerializer(
            instance=notification,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated notification
            detail_serializer = NotificationDetailSerializer(notification)
            
            return Response(
                CustomResponse.success(
                    "Notification updated successfully.",
                    detail_serializer.data
                ),
                status=status.HTTP_200_OK
            )
        
        return Response(
            CustomResponse.error(
                "Validation failed.",
                serializer.errors
            ),
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @extend_schema(
        summary="Delete notification",
        description="Delete a notification",
        parameters=[
            OpenApiParameter(
                name='notification_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID of the notification to delete'
            )
        ],
        responses={
            200: "Successfully deleted",
            404: "Not Found",
            401: "Unauthorized"
        }
    )
    def delete(self, request, notification_id):
        """Delete notification"""
        success = NotificationService.delete_notification(notification_id, request.user.id)
        
        if success:
            return Response(
                CustomResponse.success("Notification deleted successfully."),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                CustomResponse.error("Notification not found."),
                status=status.HTTP_404_NOT_FOUND
            )


@extend_schema(tags=["Notifications"])
class NotificationMarkAllReadAPIView(APIView):
    """
    Mark all notifications as read for authenticated user
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Mark all notifications as read",
        description="Mark all unread notifications as read for the authenticated user",
        responses={
            200: "Successfully marked all as read",
            401: "Unauthorized"
        }
    )
    def post(self, request):
        """Mark all notifications as read"""
        count = NotificationService.mark_all_as_read(request.user.id)
        
        return Response(
            CustomResponse.success(
                f"Successfully marked {count} notifications as read.",
                {"marked_count": count}
            ),
            status=status.HTTP_200_OK
        )
        
@extend_schema(tags=["Notifications"])
class NotificationMarkAsReadByIDAPIView(APIView):
    """
    Mark all notifications as read for authenticated user
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Mark a single notification as read by its ID",
        description="Mark unread notification as read by ID",
        responses={
            200: "Successfully marked as read",
            401: "Unauthorized"
        }
    )
    def post(self, request, notification_id):
        """Mark notification as read by ID"""
        NotificationService.mark_as_read(notification_id, request.user.id)
        
        return Response(
            CustomResponse.success(
                f"Successfully marked notification as read.",
            ),
            status=status.HTTP_200_OK
        )

@extend_schema(tags=["Notifications"])
class NotificationUnreadCountAPIView(APIView):
    """
    Get unread notification count for authenticated user
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Get unread notification count",
        description="Get the count of unread notifications for the authenticated user",
        responses={
            200: "Unread count retrieved successfully",
            401: "Unauthorized"
        }
    )
    def get(self, request):
        """Get unread notification count"""
        unread_count = NotificationService.get_unread_count(request.user.id)
        
        return Response(
            CustomResponse.success(
                "Unread count retrieved successfully.",
                {"unread_count": unread_count}
            ),
            status=status.HTTP_200_OK
        )


@extend_schema(tags=["Notifications"])
class NotificationByChannelAPIView(APIView):
    """
    Get notifications filtered by specific channel
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserPermission]
    
    @extend_schema(
        summary="Get notifications by channel",
        description="Retrieve notifications for the authenticated user filtered by channel",
        parameters=[
            OpenApiParameter(
                name='channel',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description='Channel type: email, websocket, or both'
            ),
            OpenApiParameter(
                name='limit',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of notifications to return (default: 20)'
            ),
            OpenApiParameter(
                name='offset',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of notifications to skip (default: 0)'
            ),
            OpenApiParameter(
                name='unread_only',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Return only unread notifications (default: false)'
            )
        ],
        responses={
            200: NotificationListSerializer(many=True),
            400: "Invalid channel",
            401: "Unauthorized"
        }
    )
    def get(self, request, channel):
        """Get notifications for authenticated user filtered by channel"""
        from utils.notification.types import NotificationChannel
        
        # Validate channel
        valid_channels = [c.value for c in NotificationChannel]
        if channel not in valid_channels:
            return Response(
                CustomResponse.error(
                    f"Invalid channel. Valid channels are: {', '.join(valid_channels)}"
                ),
                status=status.HTTP_400_BAD_REQUEST
            )
        
        limit = int(request.query_params.get('limit', 10))
        offset = int(request.query_params.get('offset', 0))
        unread_only = request.query_params.get('unread_only', 'false').lower() == 'true'
        
        # Get notifications for the specific channel
        if channel == 'both':
            # If 'both' is requested, get all notifications
            notifications = NotificationService.get_user_notifications(
                user_id=request.user.id,
                limit=limit,
                offset=offset,
                unread_only=unread_only
            )
            unread_count = NotificationService.get_unread_count(request.user.id)
        else:
            # Get notifications for specific channel
            channel_enum = NotificationChannel(channel)
            notifications = NotificationService.get_user_notifications(
                user_id=request.user.id,
                limit=limit,
                offset=offset,
                unread_only=unread_only,
                channel=channel_enum
            )
            unread_count = NotificationService.get_unread_count(request.user.id, channel_enum)
        
        serializer = NotificationListSerializer(notifications, many=True)
        
        return Response(
            CustomResponse.success(
                f"Notifications for {channel} channel retrieved successfully.",
                {
                    'notifications': serializer.data,
                    'unread_count': unread_count,
                    'channel': channel
                }
            ),
            status=status.HTTP_200_OK
        )
