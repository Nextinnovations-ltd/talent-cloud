from unittest import TestCase
from unittest.mock import patch, MagicMock
from rest_framework.exceptions import ValidationError
from apps.users.models import TalentCloudUser
from services.auth.user_info_service import UserInfoService

class TestUserInfoService(TestCase):
     def setUp(self):
          self.user = MagicMock(spec=TalentCloudUser)
          self.user.username = 'testuser'
          self.user.profile_image_url = 'https://image.url/profile.jpg'
          self.user.role.name = 'USER'
          self.user.onboarding_step = 1

     @patch('utils.user.user.check_auto_generated_username')
     @patch('services.auth.user_info_service.UserInfoService.get_user_obj')
     def test_get_user_profile_info_success(self, mock_get_user_obj, mock_check_auto_generated_username):
          mock_get_user_obj.return_value = self.user
          mock_check_auto_generated_username.return_value = False

          expected_result = {
               'profile_image_url': self.user.profile_image_url,
               'role': self.user.role.name,
               'onboarding_step': self.user.onboarding_step,
               'is_generated_username': False
          }

          result = UserInfoService.get_user_profile_info(self.user)
          self.assertEqual(result, expected_result)

     @patch('services.auth.user_info_service.UserInfoService.get_user_obj')
     def test_get_user_profile_info_failure(self, mock_get_user_obj):
          mock_get_user_obj.side_effect = Exception('DB error')

          with self.assertRaises(ValidationError) as context:
               UserInfoService.get_user_profile_info(self.user)

          self.assertIn('Error retrieving user info', str(context.exception))
