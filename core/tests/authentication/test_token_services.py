from unittest import TestCase
from unittest.mock import patch, MagicMock
from rest_framework.exceptions import ValidationError
from apps.users.models import TalentCloudUser
from apps.job_seekers.models import JobSeeker
from services.auth.token_service import TokenService


class TestTokenService(TestCase):
     def setUp(self):
          self.user_id = 1
          self.role = 'USER'
          self.refresh_token = 'mock_refresh_token'
          self.access_token = 'mock_access_token'
          self.payload = {'user_id': self.user_id, 'role': self.role}
          
          self.user = MagicMock(spec=TalentCloudUser)
          self.user.pk = self.user_id
          self.user.role.name = self.role
          
          self.job_seeker = MagicMock(spec=JobSeeker)
          self.job_seeker.pk = self.user_id
          self.job_seeker.role.name = self.role
          self.job_seeker.onboarding_step = 1
          self.job_seeker.username = 'auto_generated_123'


     @patch('utils.token.jwt.TokenUtil.generate_access_token')
     @patch('utils.token.jwt.TokenUtil.decode_refresh_token')
     def test_refresh_access_token_success(self, mock_decode_refresh_token, mock_generate_access_token):
          mock_decode_refresh_token.return_value = self.payload
          mock_generate_access_token.return_value = self.access_token

          result = TokenService.refresh_access_token(self.refresh_token)

          self.assertEqual(result, self.access_token)
          mock_decode_refresh_token.assert_called_once_with(self.refresh_token)
          mock_generate_access_token.assert_called_once()


     @patch('utils.token.jwt.TokenUtil.decode_refresh_token', side_effect=Exception('Invalid Token'))
     def test_refresh_access_token_invalid_token(self, mock_decode_refresh_token):
          with self.assertRaises(ValidationError):
               TokenService.refresh_access_token(self.refresh_token)


     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('utils.token.jwt.TokenUtil.decode_access_token')
     def test_authenticate_token_success(self, mock_decode_access_token, mock_get):
          mock_decode_access_token.return_value = {'user_id': self.user_id}
          mock_get.return_value = self.user

          result = TokenService.authenticate_token(self.access_token)

          self.assertEqual(result, self.user)
          mock_decode_access_token.assert_called_once()
          mock_get.assert_called_once()


     @patch('apps.users.models.TalentCloudUser.objects.get', side_effect=TalentCloudUser.DoesNotExist)
     @patch('utils.token.jwt.TokenUtil.decode_access_token')
     def test_authenticate_token_invalid_user(self, mock_decode_access_token, mock_get):
          mock_decode_access_token.return_value = {'user_id': self.user_id}

          with self.assertRaises(ValidationError):
               TokenService.authenticate_token(self.access_token)


     @patch('apps.job_seekers.models.JobSeeker.objects.get')
     @patch('services.auth.token_service.check_auto_generated_username')
     @patch('utils.token.jwt.TokenUtil.generate_refresh_token')
     @patch('utils.token.jwt.TokenUtil.decode_access_token')
     def test_verify_token_and_generate_refresh_token_success(
          self, mock_decode_access_token, mock_generate_refresh_token, 
          mock_check_auto_generated_username, mock_get):

          mock_decode_access_token.return_value = {'user_id': self.user_id}
          mock_get.return_value = self.job_seeker
          mock_check_auto_generated_username.return_value = True
          mock_generate_refresh_token.return_value = 'mock_refresh_token'

          result = TokenService.verify_token_and_generate_refresh_token(self.access_token)

          expected_result = (
               self.role,
               self.job_seeker.onboarding_step,
               True,
               'mock_refresh_token'
          )

          self.assertEqual(result, expected_result)
          mock_decode_access_token.assert_called_once()
          mock_get.assert_called_once()
          mock_check_auto_generated_username.assert_called_once()
          mock_generate_refresh_token.assert_called_once()


     @patch('apps.job_seekers.models.JobSeeker.objects.get', side_effect=JobSeeker.DoesNotExist)
     @patch('utils.token.jwt.TokenUtil.decode_access_token')
     def test_verify_token_and_generate_refresh_token_invalid_user(
          self, mock_decode_access_token, mock_get):

          mock_decode_access_token.return_value = {'user_id': self.user_id}

          with self.assertRaises(Exception):
               TokenService.verify_token_and_generate_refresh_token(self.access_token)

