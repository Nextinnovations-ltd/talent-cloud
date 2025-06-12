from apps.audit_log.models import UserActivityLog

class AuditLogService:
     @staticmethod
     def log_user_activity(request, action):
          """
          Logs user actions details.
          """
          if request.user.is_authenticated:
               UserActivityLog.objects.create(user=request.user, action=action)
