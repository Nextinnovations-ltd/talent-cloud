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
     
     # New Feature to implement
     APPLICATION_STATUS_CHANGED = "application_status_changed"
     NEW_JOB_MATCHES = "new_job_matches"
     PROFILE_COMPLETION_REMINDER = "profile_completion_reminder"
     PROFILE_VIEWED = "profile_viewed"
     INTERVIEW_SCHEDULED = "interview_scheduled"
     INTERVIEW_REMINDER = "interview_reminder"
     JOB_EXPIRING_SOON = "job_expiring_soon"
     WEEKLY_JOB_DIGEST = "weekly_job_digest"
     SAVED_JOB_UPDATE = "saved_job_update"
     APPLICATION_DEADLINE_REMINDER = "application_deadline_reminder"
     
     # Application Related Notifications
     APPLICATION_SUBMITTED = "application_submitted"
     APPLICATION_PENDING = "application_pending"
     APPLICATION_UNDER_REVIEW = "application_under_review"
     APPLICATION_SHORTLISTED = "application_shortlisted"
     APPLICATION_INTERVIEW_SCHEDULED = "application_interview_scheduled"
     APPLICATION_ACCEPTED = "application_accepted"
     APPLICATION_OFFER_EXTENDED = "application_offer_extended"
     APPLICATION_REJECTED = "application_rejected"
     APPLICATION_WITHDRAWN = "application_withdrawn"

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
