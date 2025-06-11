from rest_framework import serializers
from apps.ws_channel.models import Chat, Message, Notification

class NotificationListSerializer(serializers.ModelSerializer):
     class Meta:
          model = Notification
          fields = ['id', 'message', 'destination_url', 'is_read', 'created_at']

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