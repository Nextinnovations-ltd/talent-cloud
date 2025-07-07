from django.urls import path
from .views.chat_views import ChatRoomInfoAPIView, UserChatListAPIView
from .views.notification_views import (
    NotificationListAPIView,
    NotificationDetailAPIView,
    NotificationMarkAllReadAPIView,
    NotificationUnreadCountAPIView
)

urlpatterns = [
    path('chat-room-list/', UserChatListAPIView.as_view(), name='user-chat-room-list'),
    path('chat-room-info/<int:receiver_id>/', ChatRoomInfoAPIView.as_view(), name='chat-room'),

    path('notifications/', NotificationListAPIView.as_view(), name='notifications-list'), # List notifications and get unread count    
    path('notifications/unread-count/', NotificationUnreadCountAPIView.as_view(), name='notifications-unread-count'), # Get unread count only
    path('notifications/mark-all-read/', NotificationMarkAllReadAPIView.as_view(), name='notifications-mark-all-read'), # Mark all as read
    path('notifications/<int:notification_id>/', NotificationDetailAPIView.as_view(), name='notifications-detail'), # Individual notification operations
]