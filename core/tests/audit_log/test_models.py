import pytest
from django.utils.timezone import now
from apps.audit_log.constants import ActivityActions
from apps.audit_log.models import UserActivityLog
from apps.job_seekers.models import JobSeeker
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES

@pytest.fixture
def create_job_seeker() -> JobSeeker:
     return TalentCloudUser.objects.create_user_with_role(email="jobseeker@tc.io", password="default", role_name=ROLES.USER)


class TestAuditLogModels:
     @pytest.mark.django_db
     def test_create_user_activity_log(self, create_job_seeker):
          activity_log = UserActivityLog.objects.create(
               user=create_job_seeker,
               action=ActivityActions.LOGIN,
               timestamp=now()
          )

          assert activity_log.user == create_job_seeker
          assert activity_log.action == ActivityActions.LOGIN
          assert activity_log.timestamp is not None
