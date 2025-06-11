from django.db import models
from django.utils.timezone import now
from .constants import ActivityActions
from apps.users.models import TalentCloudUser

class UserActivityLog(models.Model):
    user = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=255, choices=ActivityActions.CHOICES)
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"
