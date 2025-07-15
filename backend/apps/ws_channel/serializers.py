from rest_framework import serializers
from apps.ws_channel.models import Chat, Message, Notification
from apps.users.models import TalentCloudUser

class TalentCloudUserSerializer(serializers.ModelSerializer):
    """Basic user serializer for notifications"""
    class Meta:
        model = TalentCloudUser
        fields = ['id', 'username', 'email', 'name', 'profile_image_url']

class NotificationListSerializer(serializers.ModelSerializer):
    """Serializer for listing notifications"""
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'destination_url', 
            'notification_type', 'channel', 'is_read', 'created_at'
        ]

class NotificationDetailSerializer(serializers.ModelSerializer):
    """Detailed notification serializer"""
    user = TalentCloudUserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message', 'destination_url', 
            'notification_type', 'channel', 'is_read', 'created_at', 'updated_at'
        ]

class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications"""
    class Meta:
        model = Notification
        fields = ['title', 'message', 'destination_url', 'notification_type', 'channel']
    
    def create(self, validated_data):
        user = self.context['user']
        return Notification.objects.create(user=user, **validated_data)

class NotificationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating notification read status"""
    class Meta:
        model = Notification
        fields = ['is_read']

class MessageSerializer(serializers.ModelSerializer):
     class Meta:
          model = Message
          fields = ['id', 'sender', 'message', 'created_at']

class ChatSerializer(serializers.ModelSerializer):
     messages = MessageSerializer(many=True, read_only=True)
     
     class Meta:
          model=Chat
          fields = ['uuid', 'created_at', 'participants', 'messages']

class LastMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message', 'sender', 'created_at']

class ChatListSerializer(serializers.ModelSerializer):
     last_message = serializers.SerializerMethodField()
     
     class Meta:
          model=Chat
          fields = ['uuid', 'created_at', 'last_message']
     
     def get_last_message(self, obj):
          last_msg = obj.messages.order_by('-created_at').first()
          return LastMessageSerializer(last_msg).data if last_msg else None