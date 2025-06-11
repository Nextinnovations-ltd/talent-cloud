from unittest import TestCase
from unittest.mock import MagicMock, patch
from apps.audit_log.models import UserActivityLog
from services.audit_log.services import AuditLogService

class TestAuditLogService(TestCase):
     def setUp(self):
          self.request = MagicMock()
          self.request.user.is_authenticated = True
          self.request.user = MagicMock()
          self.request.user.id = 1
          self.action = 'LOGIN'
     
     @patch('apps.audit_log.models.UserActivityLog.objects.create')
     def test_log_user_activitysuccess(self, mock_create):
          AuditLogService.log_user_activity(self.request, self.action)

          mock_create.assert_called_once_with(user=self.request.user, action=self.action)
     
     @patch('apps.audit_log.models.UserActivityLog.objects.create')
     def test_log_user_activity_when_user_not_authenticated(self, mock_create):
          self.request.user.is_authenticated = False
          
          AuditLogService.log_user_activity(self.request, self.action)

          mock_create.assert_not_called()