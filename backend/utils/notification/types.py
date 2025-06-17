from enum import Enum

class NotificationType(str, Enum):
     GENERIC = "generic"
     JOB_POSTED = "job_posted"
     JOB_APPLIED = "job_applied"
     COMPANY_APPROVED = "company_approved"

class NotificationChannel(str, Enum):
     EMAIL = "email"
     WEBSOCKET = "websocket"
     BOTH = "both"
