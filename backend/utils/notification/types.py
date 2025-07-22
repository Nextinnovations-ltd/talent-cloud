from enum import Enum

class NotificationType(str, Enum):
     GENERIC = "generic"
     ACCOUNT_CREATED = "account_created"
     JOB_POSTED = "job_posted"
     JOB_APPLIED = "job_applied"
     APPLICATION_STATUS_UPDATE = "application_status_update"
     COMPANY_APPROVED = "company_approved"
     COMPANY_REJECTED = "company_rejected"
     
     # Admin/SuperAdmin notifications
     ADMIN_COMPANY_REGISTRATION = "admin_company_registration"
     ADMIN_USER_REGISTRATION = "admin_user_registration"
     ADMIN_JOB_POSTING = "admin_job_posting"
     ADMIN_SYSTEM_ALERT = "admin_system_alert"
     ADMIN_PLATFORM_ACTIVITY = "admin_platform_activity"
     ADMIN_REPORT_GENERATED = "admin_report_generated"
     ADMIN_COMPANY_VERIFICATION = "admin_company_verification"
     ADMIN_CONTENT_MODERATION = "admin_content_moderation"
     ADMIN_VIOLATION_REPORT = "admin_violation_report"
     ADMIN_MAINTENANCE = "admin_maintenance"

class NotificationChannel(str, Enum):
     EMAIL = "email"
     WEBSOCKET = "websocket"  # Real-time in-app notifications
     BOTH = "both"  # Email + WebSocket
     PUSH = "push"  # Mobile push notifications (for future use)

class NotificationTarget(str, Enum):
    """Define who should receive notifications"""
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    USER = "user"
    ALL_ROLES = "all_roles"
