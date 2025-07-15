from django.urls import path
from apps.ws_channel.views.notification_views import TestAPIView
from .views import ChatRoomInfoAPIView, NotificationListAPIView, UserChatListAPIView
from .admin_views import (
    AdminNotificationAPIView, 
    AdminCompanyApprovalAPIView,
    AdminSystemMaintenanceAPIView
)

urlpatterns = [
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
    path('chat-room-list/', UserChatListAPIView.as_view(), name='user-chat-room-list'),
    path('chat-room-info/<int:receiver_id>/', ChatRoomInfoAPIView.as_view(), name='chat-room'),
    
    # Admin endpoints
    path('admin/notifications/send/', AdminNotificationAPIView.as_view(), name='admin-send-notification'),
    path('admin/companies/<int:company_id>/approval/', AdminCompanyApprovalAPIView.as_view(), name='admin-company-approval'),
    path('admin/maintenance/notify/', AdminSystemMaintenanceAPIView.as_view(), name='admin-maintenance-notification'),
    
    path('test/', TestAPIView.as_view(), name='test'),
]