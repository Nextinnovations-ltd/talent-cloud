from django.db import models
from utils.notification.types import NotificationType
from services.models import TimeStampModel
import uuid

class Notification(TimeStampModel):
    user = models.ForeignKey('users.TalentCloudUser', on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255, default="Notification")
    message = models.TextField()
    destination_url = models.URLField(null=True, blank=True)
    notification_type = models.CharField(
        max_length=50,
        choices=[(tag.value, tag.name) for tag in NotificationType],
        default=NotificationType.GENERIC.value
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}"


class Chat(TimeStampModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    participants = models.ManyToManyField('users.TalentCloudUser', related_name="chat_rooms")
    created_at = models.DateTimeField(auto_now_add=True)


class Message(TimeStampModel):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('users.TalentCloudUser', on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
