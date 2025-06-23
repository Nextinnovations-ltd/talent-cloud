from unittest.mock import MagicMock, patch
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.job_seekers.models import JobSeeker, JobSeekerExperienceLevel, JobSeekerLanguageProficiency, JobSeekerOccupation, JobSeekerRole
from apps.job_seekers.serializers.occupation_serializer import JobSeekerExperienceLevelSerializer, JobSeekerRoleSerializer, JobSeekerSkillSerializer, SpokenLanguageSerializer
from apps.users.models import TalentCloudUser
from services.job_seeker.job_seeker_service import JobSeekerService

class TestModifyJobSeekerUsername(TestCase):
     def setUp(self):
          self.user = MagicMock(spec=TalentCloudUser)
          self.job_seeker = MagicMock(spec=JobSeeker)
          self.user.username = 'old_username'
          self.user.jobseeker = self.job_seeker
          self.new_username = "new_username"

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeeker.objects.filter')
     def test_modify_username_successfully(self, mock_filter, mock_get_job_seeker_user):
          mock_get_job_seeker_user.return_value = self.job_seeker
          mock_filter.return_value.exists.return_value = False
          
          updated_job_seeker = JobSeekerService.modify_jobseeker_username(self.user, self.new_username)
          
          self.assertEqual(updated_job_seeker, self.job_seeker)
          self.assertEqual(updated_job_seeker.username, self.new_username)
          self.job_seeker.save.assert_called_once()
     
     def test_modify_username_fail_username_empty(self):
          self.new_username = None
          
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.modify_jobseeker_username(self.user, None)

          self.assertEqual(str(context.exception.detail[0]), "Username cannot be empty.")

     @patch('apps.job_seekers.models.JobSeeker.objects.filter')
     def test_modify_username_fail_username_exists(self, mock_filter):
          mock_filter.return_value.exists.return_value = True

          # Try to modify the username and assert that the ValidationError is raised
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.modify_jobseeker_username(self.user, self.new_username)

          # Assert that the error message is as expected
          self.assertEqual(str(context.exception.detail[0]), "Username already exists.")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_modify_username_fail_jobseeker_does_not_exist(self, mock_get_job_seeker_user):
          # Mock the get_job_seeker_user method to raise a JobSeeker.DoesNotExist exception
          mock_get_job_seeker_user.side_effect = JobSeeker.DoesNotExist

          with self.assertRaises(ValidationError) as context:
               JobSeekerService.modify_jobseeker_username(self.user, self.new_username)

          self.assertEqual(str(context.exception.detail[0]), "Job seeker user does not exist.")

class TestGetOnboardingData(TestCase):
     def setUp(self):
          patcher = patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
          self.addCleanup(patcher.stop)
          self.mock_get_job_seeker_user = patcher.start()
          
          # Create mock user and job seeker
          self.mock_user = MagicMock(spec=TalentCloudUser)
          self.mock_job_seeker = MagicMock(spec=JobSeeker)
          self.mock_occupation = MagicMock(spec=JobSeekerOccupation)

          # Set default job_seeker return value
          self.mock_get_job_seeker_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = self.mock_occupation

          # Common mock attributes
          self.mock_job_seeker.profile_image_url = "http://example.com/profile.jpg"
          self.mock_job_seeker.name = "John Doe"
          self.mock_job_seeker.tagline = "Software Developer"

          self.mock_occupation.experience_level_id = 1
          self.mock_occupation.specialization.id = 3
          self.mock_occupation.role.id = 4

     def test_step_1_with_data(self):
          response = JobSeekerService.get_onboarding_data(self.mock_user, 1)
          self.assertEqual(response['data']['name'], "John Doe")
          self.assertEqual(response['data']['experience_level_id'], 1)

     def test_step_2_with_occupation(self):
          response = JobSeekerService.get_onboarding_data(self.mock_user, 2)
          self.assertEqual(response['data']['specialization_id'], 3)

     def test_step_2_without_occupation(self):
          self.mock_job_seeker.occupation = None
          response = JobSeekerService.get_onboarding_data(self.mock_user, 2)
          self.assertIsNone(response['data'])
          self.assertEqual(response['message'], "No data existed yet.")

     def test_step_3_with_occupation(self):
          response = JobSeekerService.get_onboarding_data(self.mock_user, 3)
          self.assertEqual(response['data']['role_id'], 4)

     def test_step_4_with_skills(self):
          mock_skill1 = MagicMock(id=101)
          mock_skill2 = MagicMock(id=102)
          self.mock_occupation.skills.all.return_value = [mock_skill1, mock_skill2]

          response = JobSeekerService.get_onboarding_data(self.mock_user, 4)
          self.assertEqual(response['data']['skills'], [101, 102])

     def test_step_4_without_skills(self):
          self.mock_occupation.skills.all.return_value = []
          response = JobSeekerService.get_onboarding_data(self.mock_user, 4)
          self.assertEqual(response['data']['skills'], [])

     def test_invalid_step(self):
          with self.assertRaises(ValidationError):
               JobSeekerService.get_onboarding_data(self.mock_user, 99)

class TestPerformOnboarding(TestCase):
     def setUp(self):
          # Patch the method that fetches the job seeker
          patcher = patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
          self.addCleanup(patcher.stop)
          self.mock_get_job_seeker_user = patcher.start()

          # Create mocks
          self.mock_user = MagicMock(spec=TalentCloudUser)
          self.mock_job_seeker = MagicMock(spec=JobSeeker)
          self.mock_occupation = MagicMock(spec=JobSeekerOccupation)

          # Mock service method return
          self.mock_get_job_seeker_user.return_value = self.mock_job_seeker

          # Set up occupation logic
          self.mock_job_seeker.occupation = self.mock_occupation
          
          self.step_1_data = {
               'name': 'Alice',
               'tagline': 'Software Dev',
               'experience_level_id': 1
          }
          self.step_2_data = {'specialization_id': 99}

     def test_step_1_with_existing_occupation(self):
          result = JobSeekerService.perform_onboarding(self.mock_user, 1, self.step_1_data)

          self.assertEqual(result['message'], 'Step 1 succeed.')
          self.mock_occupation.save.assert_called_once()
          self.mock_job_seeker.save.assert_called_once()

     def test_step_1_without_existing_occupation(self):
          self.mock_job_seeker.occupation = None

          with patch('services.job_seeker.job_seeker_service.JobSeekerOccupation.objects.create') as mock_create:
               result = JobSeekerService.perform_onboarding(self.mock_user, 1, self.step_1_data)
               mock_create.assert_called_once()
               self.assertEqual(result['message'], 'Step 1 succeed.')

     def test_step_2_success(self):
          result = JobSeekerService.perform_onboarding(self.mock_user, 2, self.step_2_data)
          
          self.assertEqual(result['message'], 'Step 2 succeed.')

     def test_step_2_missing_specialization(self):
          data = {}
          
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.perform_onboarding(self.mock_user, 2, data)
          
          self.assertEqual(str(context.exception.detail[0]), "Specialization can't be empty.")

     def test_step_3_success(self):
          data = {'role_id': 42}
          
          result = JobSeekerService.perform_onboarding(self.mock_user, 3, data)
          
          self.assertEqual(result['message'], 'Step 3 succeed.')

     def test_step_3_missing_role(self):
          data = {}
          
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.perform_onboarding(self.mock_user, 3, data)
          
          self.assertEqual(str(context.exception.detail[0]), "Role can't be empty.")

     def test_step_4_valid_skill_list(self):
          data = {'skill_id_list': '[1,2,3,4,5]'}
          self.mock_occupation.skills.add = MagicMock()

          result = JobSeekerService.perform_onboarding(self.mock_user, 4, data)
          
          self.assertEqual(result['message'], 'Step 4 succeed.')
          self.mock_occupation.skills.add.assert_called_once()

     def test_step_4_insufficient_skills(self):
          data = {'skill_id_list': '[1, 2]'}
          
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.perform_onboarding(self.mock_user, 4, data)
          
          self.assertEqual(str(context.exception.detail[0]), "Choose minimum 5 skillsets.")

     def test_invalid_step_raises(self):
          with self.assertRaises(ValidationError) as context:
               JobSeekerService.perform_onboarding(self.mock_user, 999, {})
          
          self.assertEqual(str(context.exception.detail[0]), "Invalid step number.")

class TestJobSeekerProfileOption(TestCase):
     def setUp(self):
          # Create mock model instances
          self.mock_role = MagicMock(spec=JobSeekerRole)
          self.mock_role.id = 1
          self.mock_role.name = "Frontend Developer"
          self.mock_role.specialization = "React"

          self.mock_level = MagicMock(spec=JobSeekerExperienceLevel)
          self.mock_level.id = 1
          self.mock_level.level = "Mid"

          # Expected serialized data
          self.role_data = JobSeekerRoleSerializer([self.mock_role], many=True).data
          self.level_data = JobSeekerExperienceLevelSerializer([self.mock_level], many=True).data

     @patch("apps.job_seekers.models.JobSeekerRole.objects.all")
     @patch("apps.job_seekers.models.JobSeekerExperienceLevel.objects.all")
     def test_get_job_seeker_profile_section_options(self, mock_levels, mock_roles):
          mock_roles.return_value = [self.mock_role]
          mock_levels.return_value = [self.mock_level]

          response = JobSeekerService.get_job_seeker_profile_section_options()

          self.assertEqual(response["message"], "Successfully fetched job seeker profile selection options.")
          self.assertEqual(response["data"]["role_list"], self.role_data)
          self.assertEqual(response["data"]["experience_level_list"], self.level_data)
     
     @patch("apps.job_seekers.models.JobSeekerRole.objects.all", return_value=[])
     @patch("apps.job_seekers.models.JobSeekerExperienceLevel.objects.all", return_value=[])
     def test_get_job_seeker_profile_section_options_empty(self, *_):
          response = JobSeekerService.get_job_seeker_profile_section_options()

          assert response["data"]["role_list"] == []
          assert response["data"]["experience_level_list"] == []

     @patch("apps.job_seekers.models.JobSeekerRole.objects.all", side_effect=Exception("Unexpected failure"))
     def test_get_job_seeker_profile_section_options_exception_handling(self, mock_roles):
          with self.assertRaises(Exception) as context:
               JobSeekerService.get_job_seeker_profile_section_options()
          assert "Unexpected failure" in str(context.exception)

class TesttJobSeekerProfileInfo(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock()
          self.mock_occupation = MagicMock()

          # Default attributes
          self.mock_job_seeker.profile_image_url = "https://example.com/profile.jpg"
          self.mock_job_seeker.name = "Jane Doe"
          self.mock_job_seeker.username = "janedoe"
          self.mock_job_seeker.tagline = "Aspiring Developer"
          self.mock_job_seeker.country_code = "+1"
          self.mock_job_seeker.phone_number = "1234567890"
          self.mock_job_seeker.date_of_birth = "1990-01-01"
          self.mock_job_seeker.address = "123 Main St"
          self.mock_job_seeker.bio = "Bio here"

          # Occupation details
          mock_role = MagicMock()
          mock_role.id = 1
          mock_role.name = "Full Stack Developer"  # Actual string value
          self.mock_occupation.role = mock_role
          
          mock_exp_level = MagicMock()
          mock_exp_level.id = 2
          mock_exp_level.level = "Intermediate"
          self.mock_occupation.experience_level = mock_exp_level

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_profile_info(self, mock_get_user):
          # Setup mock returns
          self.mock_job_seeker.occupation = self.mock_occupation
          mock_get_user.return_value = self.mock_job_seeker

          result = JobSeekerService.get_job_seeker_profile_info(self.mock_user)
          
          self.assertEqual(result['message'], "Profile information is generated.")
          self.assertEqual(result['data']['name'], "Jane Doe")
          self.assertEqual(result['data']['role']['name'], "Full Stack Developer")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_profile_info_validation_error(self, mock_get_user):
          self.mock_job_seeker.occupation = None
          mock_get_user.return_value = self.mock_job_seeker

          with self.assertRaises(ValidationError) as context:
               JobSeekerService.get_job_seeker_profile_info(self.mock_user)
          self.assertIn(str(context.exception.detail[0]), "No occupation related data existed yet.")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_profile_info_missing_field(self, mock_get_user):
          # Simulate missing nested fields
          self.mock_occupation.role = None
          self.mock_occupation.experience_level = None

          self.mock_job_seeker.occupation = self.mock_occupation
          mock_get_user.return_value = self.mock_job_seeker

          result = JobSeekerService.get_job_seeker_profile_info(self.mock_user)

          self.assertIsNone(result['data']['role'])
          self.assertIsNone(result['data']['experience_level'])
     
     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_successful_profile_update(self, mock_get_job_seeker_user):
          data = {
               "name": "John Doe",
               "username": "johndoe",
               "tagline": "Experienced Developer"
          }
          
          mock_get_job_seeker_user.return_value=self.mock_job_seeker
          
          response = JobSeekerService.perform_job_seeker_profile_info_update(self.mock_user, data)

          self.mock_job_seeker.save.assert_called_once()
          self.assertEqual(response['message'], "Profile updated successfully.")
          self.assertEqual(response['data']['name'], "John Doe")
          self.assertEqual(response['data']['username'], "johndoe")
          self.assertEqual(response['data']['tagline'], "Experienced Developer")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerOccupation.objects.create')
     def test_create_new_occupation_if_none_exists(self, mock_occupation_create, mock_get_job_seeker_user):
          # Mock that the job seeker does not have any occupation
          mock_get_job_seeker_user.return_value=self.mock_job_seeker
          self.mock_job_seeker.occupation = None

          data = {
               "role_id": 1,
               "experience_level_id": 2
          }
          
          response = JobSeekerService.perform_job_seeker_profile_info_update(self.mock_user, data)
          
          mock_occupation_create.assert_called_once()
          self.assertEqual(response['message'], "Profile updated successfully.")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_update_role_experience_and_year(self, mock_get_job_seeker_user):
          data = {
               "role_id": 2,
               "experience_level_id": 3
          }
          
          mock_get_job_seeker_user.return_value=self.mock_job_seeker
          self.mock_job_seeker.occupation = self.mock_occupation
          self.mock_occupation.role.id = 2
          self.mock_occupation.experience_level.id = 3
          
          # When save is called, return the updated occupation
          self.mock_occupation.save.return_value = self.mock_occupation

          response = JobSeekerService.perform_job_seeker_profile_info_update(self.mock_user, data)

          self.mock_occupation.save.assert_called_once()
          self.assertEqual(response['message'], "Profile updated successfully.")
          self.assertEqual(response['data']['role']['id'], 2)
          self.assertEqual(response['data']['experience_level']['id'], 3)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_partial_profile_update(self, mock_get_job_seeker_user):
          data = {
               "name": "Alex Smith",
               "phone_number": "9876543210"
          }
          
          mock_get_job_seeker_user.return_value=self.mock_job_seeker
          self.mock_job_seeker.save.return_value = self.mock_job_seeker
          
          response = JobSeekerService.perform_job_seeker_profile_info_update(self.mock_user, data)

          self.assertEqual(response['message'], "Profile updated successfully.")
          self.assertEqual(response['data']['name'], "Alex Smith")
          self.assertEqual(response['data']['phone_number'], "9876543210")
          self.assertEqual(response['data']['tagline'], "Aspiring Developer")
          self.mock_job_seeker.save.assert_called_once()
     
     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_user_not_found(self, mock_get_job_seeker_user):
          mock_get_job_seeker_user.side_effect = JobSeeker.DoesNotExist

          data = {
               "name": "John Doe"
          }

          with self.assertRaises(JobSeeker.DoesNotExist):
               JobSeekerService.perform_job_seeker_profile_info_update(self.mock_user, data)

class TestJobSeekerSkillOptions(TestCase):
     def setUp(self):
          self.mock_skill1 = MagicMock(id=1, name="Python", description="Python programming")
          self.mock_skill2 = MagicMock(id=2, name="JavaScript", description="Frontend development")
          self.sample_skills = [self.mock_skill1, self.mock_skill2]
          self.empty_skills = []
          
          # Create serialized data
          self.skill_data = JobSeekerSkillSerializer(self.sample_skills, many=True).data
          self.empty_skill_data = JobSeekerSkillSerializer(self.empty_skills, many=True).data

     # Test Case 1: Successfully fetch skills (using serialized data)
     @patch('apps.job_seekers.models.JobSeekerSkill.objects.all')
     @patch('apps.job_seekers.serializers.occupation_serializer.JobSeekerSkillSerializer')
     def test_get_skill_options_success(self, mock_serializer, mock_objects_all):
          mock_objects_all.return_value = self.sample_skills
          mock_serializer.return_value.data = self.skill_data

          result = JobSeekerService.get_skill_options()

          self.assertEqual(result['message'], "Successfully fetched job seeker skills options.")
          self.assertEqual(result['data']['skills'], self.skill_data)

     # Test Case 2: Empty skill list (using serialized empty data)
     @patch('apps.job_seekers.models.JobSeekerSkill.objects.all')
     @patch('apps.job_seekers.serializers.occupation_serializer.JobSeekerSkillSerializer')
     def test_get_skill_options_empty(self, mock_serializer, mock_objects_all):
          mock_objects_all.return_value = self.empty_skills
          mock_serializer.return_value.data = self.empty_skill_data

          result = JobSeekerService.get_skill_options()
          self.assertEqual(result['data']['skills'], self.empty_skill_data)

class TestJobSeekerSkills(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock(spec=JobSeeker)
          self.mock_occupation = MagicMock(spec=JobSeekerOccupation)
          
          # Create mock skills data
          self.sample_skills = [
               {"id": 1, "title": "Python"},
               {"id": 2, "title": "Django"},
               {"id": 3, "title": "React"}
          ]
          self.empty_skills = []
          self.skill_id_list = [1, 2, 3]

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_skills_with_skills(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = self.mock_occupation
          self.mock_occupation.skills.exists.return_value = True
          self.mock_occupation.skills.values.return_value = self.sample_skills

          # Call method
          result = JobSeekerService.get_job_seeker_skills(self.mock_user)

          # Assertions
          self.assertEqual(result['data']['skills'], self.sample_skills)
          self.mock_occupation.skills.values.assert_called_once_with("id", "title")
          mock_get_user.assert_called_once_with(self.mock_user)

     # Test Case 2: No occupation exists
     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_skills_no_occupation(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = None

          result = JobSeekerService.get_job_seeker_skills(self.mock_user)

          self.assertEqual(result['data']['skills'], self.empty_skills)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_skills_empty_skills(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = self.mock_occupation
          self.mock_occupation.skills.exists.return_value = False

          result = JobSeekerService.get_job_seeker_skills(self.mock_user)

          self.assertEqual(result['data']['skills'], self.empty_skills)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_job_seeker_skills_user_error(self, mock_get_user):
          mock_get_user.side_effect = Exception("Database error")

          with self.assertRaises(Exception) as context:
               JobSeekerService.get_job_seeker_skills(self.mock_user)
          
          self.assertEqual(str(context.exception), "Database error")

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerOccupation.objects.create')
     def test_perform_skills_update_new_occupation(self, mock_create, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = None
          mock_create.return_value = self.mock_occupation

          data = {"skill_list": self.skill_id_list}

          result = JobSeekerService.perform_job_seeker_skills_update(self.mock_user, data)

          self.assertEqual(result['message'], "Successfully updated job seeker skills.")
          self.assertEqual(result['data'], self.skill_id_list)
          self.mock_occupation.skills.add.assert_called_once_with(*self.skill_id_list)
          mock_create.assert_called_once_with(user=self.mock_job_seeker)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_perform_skills_update_existing_occupation(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.occupation = self.mock_occupation

          data = {"skill_list": self.skill_id_list}

          result = JobSeekerService.perform_job_seeker_skills_update(self.mock_user, data)

          self.assertEqual(result['message'], "Successfully updated job seeker skills.")
          self.mock_occupation.skills.add.assert_called_once_with(*self.skill_id_list)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_perform_skills_update_no_jobseeker(self, mock_get_user):
          mock_get_user.return_value = None

          data = {"skill_list": self.skill_id_list}

          with self.assertRaises(ValidationError) as context:
               JobSeekerService.perform_job_seeker_skills_update(self.mock_user, data)
          
          self.assertEqual(str(context.exception.detail[0]), "User is not a job seeker")
          
class TestJobSeekerSocialLinks(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock()
          self.mock_social_links = MagicMock()
          
          self.sample_social_data = {
               'facebook_url': 'https://facebook.com/user',
               'linkedin_url': 'https://linkedin.com/user',
               'behance_url': 'https://behance.net/user',
               'portfolio_url': 'https://portfolio.site',
               'github_url': 'https://github.com/user'
          }
          
          self.mock_social_links.facebook_social_url = self.sample_social_data['facebook_url']
          self.mock_social_links.linkedin_social_url = self.sample_social_data['linkedin_url']
          self.mock_social_links.behance_social_url = self.sample_social_data['behance_url']
          self.mock_social_links.portfolio_social_url = self.sample_social_data['portfolio_url']
          self.mock_social_links.github_social_url = self.sample_social_data['github_url']

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.filter')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.get')
     def test_get_job_seeker_social_link_exists(self, mock_get, mock_filter, mock_get_job_seeker_user):
          mock_get_job_seeker_user.return_value = self.mock_job_seeker
          mock_filter.return_value.exists.return_value = True
          mock_get.return_value = self.mock_social_links

          result = JobSeekerService.get_job_seeker_social_link(self.mock_user)

          self.assertEqual(result['message'], "Social Link information is generated.")
          self.assertEqual(result['data'], self.sample_social_data)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.filter')
     def test_get_job_seeker_social_link_not_exists(self, mock_filter, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          mock_filter.return_value.exists.return_value = False

          expected_data = {
               'facebook_url': None,
               'linkedin_url': None,
               'behance_url': None,
               'portfolio_url': None,
               'github_url': None
          }

          result = JobSeekerService.get_job_seeker_social_link(self.mock_user)
          
          self.assertEqual(result['data'], expected_data)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.update_or_create')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.filter')
     def test_perform_job_seeker_social_link_update_new(self, mock_filter, mock_update, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          mock_filter.return_value.exists.return_value = False
          mock_update.return_value = (self.mock_social_links, True)  # created=True

          result = JobSeekerService.perform_job_seeker_social_link_update(
               self.mock_user, 
               self.sample_social_data
          )

          self.assertEqual(result['message'], "Social links updated successfully.")
          self.assertEqual(result['data'], self.sample_social_data)
          mock_update.assert_called_once_with(
               user=self.mock_job_seeker,
               defaults={
                    'facebook_social_url': self.sample_social_data['facebook_url'],
                    'linkedin_social_url': self.sample_social_data['linkedin_url'],
                    'behance_social_url': self.sample_social_data['behance_url'],
                    'portfolio_social_url': self.sample_social_data['portfolio_url'],
                    'github_social_url': self.sample_social_data['github_url']
               }
          )

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.update_or_create')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.filter')
     @patch('apps.job_seekers.models.JobSeekerSocialLink.objects.get')
     def test_perform_job_seeker_social_link_update_partial(self, mock_get, mock_filter, mock_update, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          mock_filter.return_value.exists.return_value = True
          mock_get.return_value = self.mock_social_links
          mock_update.return_value = (self.mock_social_links, False) # update = True

          partial_data = {
               'facebook_url': 'https://facebook.com/new',
               'github_url': 'https://github.com/new'
          }

          result = JobSeekerService.perform_job_seeker_social_link_update(
               self.mock_user, 
               partial_data
          )
          
          self.assertEqual(result['message'], "Social links updated successfully.")
          mock_update.assert_called_once_with(
               user=self.mock_job_seeker,
               defaults={
                    'facebook_social_url': partial_data['facebook_url'],
                    'linkedin_social_url': self.mock_social_links.linkedin_social_url,
                    'behance_social_url': self.mock_social_links.behance_social_url,
                    'portfolio_social_url': self.mock_social_links.portfolio_social_url,
                    'github_social_url': partial_data['github_url']
               }
          )

class TestJobSeekerSettingInfo(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock(spec=JobSeeker)
          self.mock_job_seeker.email = "test@tc.io"

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_setting_info_success(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker

          result = JobSeekerService.get_job_seeker_setting_info(self.mock_user)

          self.assertEqual(result['message'], "Setting information is successfully retrieved.")
          self.assertEqual(result['data']['email'], "test@tc.io")
          mock_get_user.assert_called_once_with(self.mock_user)

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_setting_info_no_jobseeker(self, mock_get_user):
          mock_get_user.return_value = None

          with self.assertRaises(AttributeError):
               JobSeekerService.get_job_seeker_setting_info(self.mock_user)

class TestLanguageOptions(TestCase):
     def setUp(self):
          self.sample_languages = [
               MagicMock(id=1, name="English", code="en"),
               MagicMock(id=2, name="Spanish", code="es")
          ]
          self.serialized_data = SpokenLanguageSerializer(self.sample_languages, many=True).data

     @patch('apps.job_seekers.models.SpokenLanguage.objects.all')
     @patch('apps.job_seekers.serializers.occupation_serializer.SpokenLanguageSerializer')
     def test_get_language_options_success(self, mock_serializer, mock_objects_all):
          mock_objects_all.return_value = self.sample_languages
          mock_serializer.return_value.data = self.serialized_data

          result = JobSeekerService.get_language_options()

          self.assertEqual(result['message'], "Successfully generated all language options.")
          self.assertEqual(result['data']['languages'], self.serialized_data)
          mock_objects_all.assert_called_once()

     @patch('apps.job_seekers.models.SpokenLanguage.objects.all')
     def test_get_language_options_empty(self, mock_objects_all):
          mock_objects_all.return_value = []

          result = JobSeekerService.get_language_options()

          self.assertEqual(result['message'], "Successfully generated all language options.")
          self.assertEqual(len(result['data']['languages']), 0)
          
class TestGetJobSeekerLanguage(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock(spec=JobSeeker)
          self.mock_language_proficiency = MagicMock(spec=JobSeekerLanguageProficiency)
          
          # Sample data for get_languages
          self.sample_language_data = [
               {
                    'proficiency_level': 'fluent',
                    'language__id': 1,
                    'language__name': 'English'
               },
               {
                    'proficiency_level': 'intermediate',
                    'language__id': 2,
                    'language__name': 'Spanish'
               }
          ]
          
          self.expected_language_output = [
               {
                    'proficiency': 'fluent',
                    'language_id': 1,
                    'language_name': 'English'
               },
               {
                    'proficiency': 'intermediate',
                    'language_id': 2,
                    'language_name': 'Spanish'
               }
          ]

          # Sample data for update_languages
          self.valid_update_data = {
               "language_list": [
                    {"language_id": 1, "proficiency": "fluent"},
                    {"language_id": 2, "proficiency": "intermediate"}
               ]
          }
          
          self.empty_update_data = {"language_list": []}

     # Tests for get_job_seeker_languages
     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_languages_with_data(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.language_proficiencies.exists.return_value = True
          self.mock_job_seeker.language_proficiencies.values.return_value = self.sample_language_data

          result = JobSeekerService.get_job_seeker_langauges(self.mock_user)

          self.assertEqual(result['message'], "Successfully generated user occupation")
          self.assertEqual(result['data']['language_list'], self.expected_language_output)
          self.mock_job_seeker.language_proficiencies.values.assert_called_once_with(
               "proficiency_level", "language__id", "language__name"
          )

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_get_languages_empty(self, mock_get_user):
          mock_get_user.return_value = self.mock_job_seeker
          self.mock_job_seeker.language_proficiencies.exists.return_value = False

          result = JobSeekerService.get_job_seeker_langauges(self.mock_user)

          self.assertEqual(result['message'], "Successfully generated user occupation")
          self.assertEqual(result['data']['language_list'], [])

class TestJobSeekerLanguageUpdate(TestCase):
     def setUp(self):
          self.mock_user = MagicMock()
          self.mock_job_seeker = MagicMock()
          self.valid_language_data = {
               "language_list": [
                    {"language_id": 1, "proficiency": "intermediate"},
                    {"language_id": 2, "proficiency": "advanced"}
               ]
          }

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_perform_update_no_job_seeker_found(self, mock_get_job_seeker):
          mock_get_job_seeker.return_value = None
          
          with self.assertRaises(ValidationError):
               JobSeekerService.perform_job_seeker_languages_update(
                    self.mock_user,
                    self.valid_language_data
               )

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     def test_perform_update_empty_language_list(self, mock_get_job_seeker):
          mock_get_job_seeker.return_value = self.mock_job_seeker
          
          result = JobSeekerService.perform_job_seeker_languages_update(
               self.mock_user,
               {"language_list": []}
          )
          
          self.assertEqual(result['message'], "Failed to update language proficiency.")
          self.assertIsNone(result['data'])

     @patch('services.job_seeker.job_seeker_service.JobSeekerService.get_job_seeker_user')
     @patch('services.job_seeker.job_seeker_service.JobSeekerService._update_single_language')
     def test_perform_update_success(self, mock_update_single, mock_get_job_seeker):
          mock_get_job_seeker.return_value = self.mock_job_seeker
          mock_update_single.return_value = None
          
          result = JobSeekerService.perform_job_seeker_languages_update(
               self.mock_user,
               self.valid_language_data
          )
          
          self.assertEqual(result['message'], "Successfully updated job seeker language proficiency.")
          self.assertIsNone(result['data'])
          self.assertEqual(mock_update_single.call_count, 2)

     @patch('apps.job_seekers.models.JobSeekerLanguageProficiency.objects.get')
     @patch('apps.job_seekers.models.JobSeekerLanguageProficiency.objects.create')
     def test_update_single_language_existing(self, mock_create, mock_get):
          mock_proficiency = MagicMock()
          mock_proficiency.proficiency_level = "beginner"
          mock_get.return_value = mock_proficiency
          
          result = JobSeekerService._update_single_language(
               self.mock_job_seeker,
               language_id=1,
               proficiency_level="advanced"
          )
          
          mock_get.assert_called_once_with(user=self.mock_job_seeker, language_id=1)
          mock_proficiency.save.assert_called_once()
          mock_create.assert_not_called()
          self.assertIsNone(result)

     @patch('apps.job_seekers.models.JobSeekerLanguageProficiency.objects.get')
     @patch('apps.job_seekers.models.JobSeekerLanguageProficiency.objects.create')
     def test_update_single_language_new(self, mock_create, mock_get):
          mock_get.side_effect = JobSeekerLanguageProficiency.DoesNotExist
          mock_create.return_value = MagicMock()
          
          result = JobSeekerService._update_single_language(
               self.mock_job_seeker,
               language_id=2,
               proficiency_level="intermediate"
          )
          
          mock_get.assert_called_once_with(user=self.mock_job_seeker, language_id=2)
          mock_create.assert_called_once_with(
               user=self.mock_job_seeker,
               language_id=2,
               proficiency_level="intermediate"
          )
          self.assertIsNone(result)

     def test_update_single_language_invalid_id(self):
          result = JobSeekerService._update_single_language(
               self.mock_job_seeker,
               language_id=None,
               proficiency_level="advanced"
          )
          
          self.assertIsNone(result)