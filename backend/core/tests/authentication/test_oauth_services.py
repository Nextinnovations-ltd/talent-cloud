from unittest import TestCase
from unittest.mock import patch, MagicMock
from apps.users.models import TalentCloudUser
from services.auth.oauth_service import OAuthService

class TestOAuthService(TestCase):
     def setUp(self):
          self.email = 'testuser@tc.io'
          self.token_url = 'https://oauth2.provider/token'
          self.payload = {'code': 'abc123'}
          self.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
          self.user = MagicMock(spec=TalentCloudUser)
          self.user.pk = 1
          self.user.role.name = 'user'

     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('utils.token.jwt.TokenUtil.decode_oauth_access_token')
     @patch('utils.token.jwt.TokenUtil.generate_access_token')
     @patch('requests.post')
     @patch('django.conf.settings.OAUTH_REDIRECT_URL', 'https://frontend.com/redirect')
     def test_perform_oauth_success_post_with_headers(
          self, mock_post, mock_generate_access_token, 
          mock_decode_oauth_access_token, mock_filter, mock_get):

          mock_post.return_value.json.return_value = {'id_token': 'mock_token'}
          mock_decode_oauth_access_token.return_value = {'email': self.email}
          mock_filter.return_value.exists.return_value = True
          mock_get.return_value = self.user
          mock_generate_access_token.return_value = 'mock_access_token'

          response = OAuthService.perform_oauth_process_and_generate_redirect_url(
               self.token_url, self.payload, self.headers, isPost=True)

          expected_url = 'https://frontend.com/redirect?token=mock_access_token'
          self.assertEqual(response, expected_url)
     
     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('utils.token.jwt.TokenUtil.decode_oauth_access_token')
     @patch('utils.token.jwt.TokenUtil.generate_access_token')
     @patch('requests.post')
     @patch('django.conf.settings.OAUTH_REDIRECT_URL', 'https://frontend.com/redirect')
     def test_perform_oauth_success_post_without_headers(
          self, mock_post, mock_generate_access_token, 
          mock_decode_oauth_access_token, mock_filter, mock_get):

          mock_post.return_value.json.return_value = {'id_token': 'mock_token'}
          mock_decode_oauth_access_token.return_value = {'email': self.email}
          mock_filter.return_value.exists.return_value = True
          mock_get.return_value = self.user
          mock_generate_access_token.return_value = 'mock_access_token'

          response = OAuthService.perform_oauth_process_and_generate_redirect_url(
               self.token_url, self.payload, None, isPost=True)

          expected_url = 'https://frontend.com/redirect?token=mock_access_token'
          self.assertEqual(response, expected_url)
     
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('utils.token.jwt.TokenUtil.decode_oauth_access_token')
     @patch('utils.token.jwt.TokenUtil.generate_access_token')
     @patch('requests.get')
     @patch('django.conf.settings.OAUTH_REDIRECT_URL', 'https://frontend.com/redirect')
     def test_perform_oauth_success_get(
          self, mock_get, mock_generate_access_token, 
          mock_decode_oauth_access_token, mock_get_db, 
          mock_filter_db):
          mock_get.return_value.json.return_value = { "access_token": "mock_token" }
          mock_decode_oauth_access_token.return_value = { "email": self.email}
          mock_filter_db.return_value.exists.return_value = True
          mock_get_db.return_value = self.user
          mock_generate_access_token.return_value = "mock_access_token"
          
          result = OAuthService.perform_oauth_process_and_generate_redirect_url(self.token_url, self.payload, None, False)
          
          expected_url = 'https://frontend.com/redirect?token=mock_access_token'
          
          self.assertEqual(result, expected_url)
     
     @patch('requests.post')
     def test_perform_oauth_process_with_error_response(self, mock_post):
          mock_response = MagicMock()
          mock_response.json.return_value = {
               "error": "invalid_grant"
          }
          
          mock_post.return_value = mock_response

          result = OAuthService.perform_oauth_process_and_generate_redirect_url("dummy_url", payload={}, isPost=True)
          
          self.assertEqual(result.status_code, 400)
          self.assertEqual(result.data, {"error": "invalid_grant"})

     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('utils.token.jwt.TokenUtil.decode_oauth_access_token')
     @patch('utils.token.jwt.TokenUtil.generate_access_token')
     @patch('requests.post')
     @patch('django.conf.settings.OAUTH_REDIRECT_URL', 'https://frontend.com/redirect')
     def test_perform_oauth_create_user_when_not_exist(self, mock_post, mock_generate_access_token, 
     mock_decode_oauth_access_token, mock_filter, mock_create_user_with_role):
          mock_response = MagicMock()
          mock_response.json.return_value = {
               "id_token": "dummy_token"
          }
          mock_post.return_value = mock_response
          mock_decode_oauth_access_token.return_value = {
               "email": self.email
          }
          mock_filter.return_value.exists.return_value = False
          mock_create_user_with_role.return_value = self.user
          mock_generate_access_token.return_value = "mock_access_token"

          result = OAuthService.perform_oauth_process_and_generate_redirect_url("dummy_url", payload={}, isPost=True)
          
          mock_create_user_with_role.assert_called_once()
          self.assertEqual(result, 'https://frontend.com/redirect?token=mock_access_token')
