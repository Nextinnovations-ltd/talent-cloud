from unittest import TestCase
from unittest.mock import MagicMock, patch
from apps.job_seekers.models import JobSeekerRole, JobSeekerSpecialization
from services.job_seeker.occupation_service import JobSeekerRoleService

class TestJobSeekerRoleService(TestCase):
     def setUp(self):
          self.instance = MagicMock()
          self.specialization = MagicMock(spec=JobSeekerSpecialization)
          self.instance.name = 'Old Name'
          self.instance.specialization = self.specialization
          self.specialization_id = 1

     def test_update_job_seeker_role_success(self):
          validated_data = {'name': 'New Name', 'specialization': self.specialization}

          result = JobSeekerRoleService.update_job_seeker_role(self.instance, validated_data)

          self.instance.save.assert_called_once()
          self.assertEqual(result.name, 'New Name')
     
     def test_update_job_seeker_role_fail_specialization_update(self):
          validated_data = {'name': 'New Name', 'specialization': MagicMock(spec=JobSeekerSpecialization)}

          with self.assertRaises(ValueError) as context:
               JobSeekerRoleService.update_job_seeker_role(self.instance, validated_data)

          self.assertEqual(str(context.exception), "The 'specialization' field cannot be updated.")

     @patch('apps.job_seekers.models.JobSeekerRole.objects.filter')
     def test_get_roles_by_specialization_success(self, mock_filter):
          role_1 = MagicMock(spec=JobSeekerRole, name="Backend Developer", specialization_id=self.specialization_id)
          role_2 = MagicMock(spec=JobSeekerRole, name="Frontend Developer", specialization_id=self.specialization_id)

          mock_filter.return_value = [role_1, role_2]

          result = JobSeekerRoleService.get_roles_by_specialization(self.specialization_id)

          assert list(result) == [role_1, role_2]
          mock_filter.assert_called_once_with(specialization_id=self.specialization_id)

     def test_get_roles_by_specialization_without_specialization_id(self):
          with self.assertRaises(ValueError) as context:
               JobSeekerRoleService.get_roles_by_specialization(None)

          assert str(context.exception) == "Specialization can't be empty."
