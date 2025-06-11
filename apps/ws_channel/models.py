from django.db import models
from django.conf import settings
from apps.users.models import TalentCloudUser
from services.models import TimeStampModel
import uuid

class Notification(TimeStampModel):
    user = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    destination_url = models.URLField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}"


class Chat(TimeStampModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    participants = models.ManyToManyField(TalentCloudUser, related_name="chat_rooms")
    created_at = models.DateTimeField(auto_now_add=True)

class Message(TimeStampModel):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
