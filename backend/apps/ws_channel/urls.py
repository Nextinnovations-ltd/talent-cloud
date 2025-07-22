from django.urls import path
# Import all views from the organized views package
from .views import (
    # Chat views
    UserChatListAPIView,
    ChatRoomInfoAPIView,
    
    # Notification views
    NotificationListAPIView,
    NotificationDetailAPIView,
    NotificationByChannelAPIView,
    NotificationMarkAllReadAPIView,
    NotificationMarkAsReadByIDAPIView,
    NotificationUnreadCountAPIView,
    TestAPIView,
    
    # Admin views
    AdminNotificationAPIView,
    AdminCompanyApprovalAPIView,
    AdminSystemMaintenanceAPIView
)

urlpatterns = [
    # Notification endpoints
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/', NotificationDetailAPIView.as_view(), name='notification-detail'),
    path('notifications/mark-all-read/', NotificationMarkAllReadAPIView.as_view(), name='notification-mark-all-read'),
    path('notifications/mark-as-read/<int:notification_id>', NotificationMarkAsReadByIDAPIView.as_view(), name='notification-mark-as-read-by-id'),
    path('notifications/unread-count/', NotificationUnreadCountAPIView.as_view(), name='notification-unread-count'),
    path('notifications/channel/<str:channel>/', NotificationByChannelAPIView.as_view(), name='notification-list-by-channel'),
    
    # Chat endpoints
    path('chat-room-list/', UserChatListAPIView.as_view(), name='user-chat-room-list'),
    path('chat-room-info/<int:receiver_id>/', ChatRoomInfoAPIView.as_view(), name='chat-room'),
    
    # Admin endpoints
    path('admin/notifications/send/', AdminNotificationAPIView.as_view(), name='admin-send-notification'),
    path('admin/companies/<int:company_id>/approval/', AdminCompanyApprovalAPIView.as_view(), name='admin-company-approval'),
    path('admin/maintenance/notify/', AdminSystemMaintenanceAPIView.as_view(), name='admin-maintenance-notification'),
    
    # Test endpoint (remove in production)
    path('test/', TestAPIView.as_view(), name='test'),
]