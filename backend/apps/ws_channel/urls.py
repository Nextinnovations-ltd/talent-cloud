from django.urls import path
from .views import ChatRoomInfoAPIView, NotificationListAPIView, UserChatListAPIView

urlpatterns = [
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
    path('chat-room-list/', UserChatListAPIView.as_view(), name='user-chat-room-list'),
    path('chat-room-info/<int:receiver_id>/', ChatRoomInfoAPIView.as_view(), name='chat-room'),
]