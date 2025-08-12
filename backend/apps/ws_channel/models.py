from django.db import models
from utils.notification.types import NotificationType, NotificationChannel
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
    channel = models.CharField(
        max_length=20,
        choices=[(channel.value, channel.name) for channel in NotificationChannel],
        default=NotificationChannel.WEBSOCKET.value,
        help_text="The channel through which this notification was/will be delivered"
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'channel', 'is_read']),
            models.Index(fields=['user', 'notification_type', 'channel']),
        ]

    def __str__(self):
        return f"Notification for {self.user.username} ({self.channel}): {self.message[:50]}"


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


class NotificationTemplate(TimeStampModel):
    """Template for different notification types and channels"""
    type = models.CharField(
        max_length=50, 
        choices=[(tag.value, tag.name) for tag in NotificationType],
        help_text="Type of notification this template is for"
    )
    channel = models.CharField(
        max_length=20, 
        choices=[(channel.value, channel.name) for channel in NotificationChannel],
        help_text="Channel this template applies to"
    )
    
    # Email specific fields
    subject_template = models.CharField(
        max_length=255, 
        blank=True,
        help_text="Email subject template with placeholders like {user_name}, {company_name}"
    )
    email_template_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Path to the HTML email template file (e.g., 'emails/job_posted.html')"
    )
    
    # WebSocket/In-app notification fields
    title_template = models.CharField(
        max_length=255, 
        blank=True,
        help_text="Title template for in-app notifications with placeholders"
    )
    message_template = models.TextField(
        blank=True,
        help_text="Message template for in-app notifications with placeholders"
    )
    
    # Common fields
    destination_url_template = models.CharField(
        max_length=500,
        blank=True,
        help_text="URL template for notification links (e.g., '/jobs/{job_id}')"
    )
    
    # Template configuration
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this template is currently active"
    )
    is_urgent_by_default = models.BooleanField(
        default=False,
        help_text="Whether notifications using this template should be marked as urgent by default"
    )
    
    # Template variables documentation
    available_variables = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON object documenting available template variables (for reference)"
    )
    
    class Meta:
        unique_together = ['type', 'channel']
        verbose_name = "Notification Template"
        verbose_name_plural = "Notification Templates"
        ordering = ['type', 'channel']
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.get_channel_display()}"
    
    def render_subject(self, context: dict) -> str:
        """Render the subject template with given context"""
        return self.subject_template.format(**context) if self.subject_template else ""
    
    def render_title(self, context: dict) -> str:
        """Render the title template with given context"""
        return self.title_template.format(**context) if self.title_template else ""
    
    def render_message(self, context: dict) -> str:
        """Render the message template with given context"""
        return self.message_template.format(**context) if self.message_template else ""
    
    def render_destination_url(self, context: dict) -> str:
        """Render the destination URL template with given context"""
        return self.destination_url_template.format(**context) if self.destination_url_template else ""
    
    @classmethod
    def get_template(cls, notification_type: NotificationType, channel: NotificationChannel):
        """Get active template for given type and channel"""
        try:
            return cls.objects.get(
                type=notification_type.value, 
                channel=channel.value, 
                is_active=True
            )
        except cls.DoesNotExist:
            return None
    
    @classmethod
    def get_or_create_default(cls, notification_type: NotificationType, channel: NotificationChannel):
        """Get existing template or create a default one"""
        template, created = cls.objects.get_or_create(
            type=notification_type.value,
            channel=channel.value,
            defaults={
                'subject_template': f'[{notification_type.name}] Notification',
                'title_template': f'{notification_type.name} Notification',
                'message_template': 'You have a new notification.',
                'is_active': True,
            }
        )
        return template, created
