from django.test import TestCase
from unittest.mock import patch, MagicMock
from apps.users.models import TalentCloudUser
from services.auth.auth_service import AuthenticationService
from rest_framework.exceptions import ValidationError

class AuthenticationServiceTest(TestCase):
     def setUp(self):
          # Set up any mock data you need here.
          self.email = "testuser@example.com"
          self.password = "securepassword"
          self.role = "user"
          self.token = "sample_token"
          self.verification_code = "123456"
          
     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     @patch('services.user.email_service.AuthEmailService.verify_user_registration')
     def test_register_user_with_role_success(self, mock_verify_user_registration, mock_create_user_with_role):
          
          # Mock the user object
          mock_user = MagicMock(spec=TalentCloudUser)
          mock_user.email = self.email
          
          # Mock the return value for user creation and verified token generation methods
          mock_create_user_with_role.return_value = mock_user
          mock_verify_user_registration.return_value = 'verification_token'
          
          result = AuthenticationService.register_user_with_role(self.email, self.password, self.role)
          
          # Assert: Check if user creation was called with correct arguments
          mock_create_user_with_role.assert_called_once_with(email=self.email, password=self.password, role_name=self.role)
          
          # Assert: Check that the verification method was called
          mock_verify_user_registration.assert_called_once_with(self.email)
          
          # Assert: Check the returned verification token
          self.assertEqual(result, 'verification_token')
          
     def test_register_user_with_role_missing_email(self):
          # Test for missing email
          with self.assertRaises(ValueError):
               AuthenticationService.register_user_with_role(None, self.password, self.role)
          
     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     def test_register_user_with_role_fail(self, mock_create_user_with_role):
          # Arrange: Simulate user creation failure
          mock_create_user_with_role.side_effect = Exception("Exception occurred")
          
          # Assert Exception Check
          with self.assertRaises(Exception):
               AuthenticationService.register_user_with_role(self.email, self.password, self.role)
     
     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     @patch('services.user.email_service.AuthEmailService.verify_user_registration')
     def test_register_user_with_role_verification_fail(self, mock_verify_user_registration, mock_create_user_with_role):
          mock_user = MagicMock(spec=TalentCloudUser)
          mock_user.email = self.email
          
          mock_create_user_with_role.return_value = mock_user
          mock_verify_user_registration.side_effect = Exception("Email service failed")
          
          # Act and Assert
          with self.assertRaises(Exception):
               AuthenticationService.register_user_with_role(self.email, self.password, self.role)
     
     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     def test_register_user_with_role_user_exists(self, mock_create_user_with_role):
          # Arrange: Simulate user already exists scenario
          mock_create_user_with_role.side_effect = ValueError("User already exists with this email.")
          
          # Act and Assert
          with self.assertRaises(ValueError):
               AuthenticationService.register_user_with_role(self.email, self.password, self.role)
     
     @patch('apps.users.models.TalentCloudUser.objects.create_user_with_role')
     def test_register_user_with_role_invalid_email(self, mock_create_user_with_role):
          # Arrange: Simulate invalid email format or validation error
          mock_create_user_with_role.side_effect = ValueError("Invalid email")
          
          # Act and Assert
          with self.assertRaises(ValueError):
               AuthenticationService.register_user_with_role(self.email, self.password, self.role)
     
     @patch('apps.users.models.VerifyRegisteredUser.objects')
     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_verify_registered_user_success(self, mock_is_expired, mock_get_user, mock_verify_user_obj):
          mock_verify_request = MagicMock()
          mock_verify_request.verification_code = self.verification_code
          mock_verify_request.email = self.email
          mock_verify_request.expired_at = "future_time"

          mock_user = MagicMock()

          mock_verify_user_obj.active.return_value.filter.return_value.first.return_value = mock_verify_request
          mock_get_user.return_value = mock_user
          mock_is_expired.return_value = False

          user = AuthenticationService.verify_registered_user(self.token, self.verification_code)

          self.assertEqual(user, mock_user)
          self.assertTrue(mock_user.is_verified)
          mock_user.save.assert_called_once()
          self.assertFalse(mock_verify_request.status)
          mock_verify_request.save.assert_called_once()

     @patch('apps.users.models.VerifyRegisteredUser.objects')
     def test_verify_registered_user_invalid_token(self, mock_verify_user_obj):
          mock_verify_user_obj.active.return_value.filter.return_value.first.return_value = None

          with self.assertRaises(ValueError) as context:
               AuthenticationService.verify_registered_user(self.token, self.verification_code)

          self.assertEqual(str(context.exception), "Token is invalid.")

     @patch('apps.users.models.VerifyRegisteredUser.objects')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_verify_registered_user_expired_token(self, mock_is_expired, mock_verify_user_obj):
          mock_verify_request = MagicMock()
          mock_verify_request.expired_at = "past_time"

          mock_verify_user_obj.active.return_value.filter.return_value.first.return_value = mock_verify_request
          mock_is_expired.return_value = True

          with self.assertRaises(ValueError) as context:
               AuthenticationService.verify_registered_user(self.token, self.verification_code)

          self.assertEqual(str(context.exception), "Token is expired.")

     @patch('apps.users.models.VerifyRegisteredUser.objects')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_verify_registered_user_invalid_verification_code(self, mock_is_expired, mock_verify_user_obj):
          mock_verify_request = MagicMock()
          mock_verify_request.verification_code = "wrong_code"
          mock_verify_request.expired_at = "future_time"

          mock_verify_user_obj.active.return_value.filter.return_value.first.return_value = mock_verify_request
          mock_is_expired.return_value = False
          with self.assertRaises(ValueError) as context:
               AuthenticationService.verify_registered_user(self.token, self.verification_code)


          with self.assertRaises(ValueError) as context:
               AuthenticationService.verify_registered_user(self.token, self.verification_code)

          self.assertEqual(str(context.exception), "Verification code is invalid.")

     @patch('services.user.password_service.PasswordService.create_password_reset')
     @patch('services.user.email_service.AuthEmailService.send_password_reset_email')
     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     def test_create_password_reset_request_success(self, mock_user_filter, mock_password_reset_active, mock_send_email, mock_create_reset):
          mock_user_filter.return_value.exists.return_value = True
          mock_password_reset_active.return_value.filter.return_value.first.return_value = None
          mock_create_reset.return_value = 'new_reset_token'

          result = AuthenticationService.create_password_reset_request(self.email)

          mock_create_reset.assert_called_once_with(self.email)
          mock_send_email.assert_called_once_with(self.email, 'new_reset_token')
          self.assertEqual(result, 'new_reset_token')

     @patch('services.user.password_service.PasswordService.regenerate_password_reset')
     @patch('services.user.email_service.AuthEmailService.send_password_reset_email')
     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_create_password_reset_request_expired_request(self, mock_is_expired, mock_user_filter, mock_password_reset_active, mock_send_email, mock_regenerate_reset):
          mock_user_filter.return_value.exists.return_value = True
          mock_reset_request = MagicMock()
          mock_password_reset_active.return_value.filter.return_value.first.return_value = mock_reset_request
          mock_is_expired.return_value = True
          mock_regenerate_reset.return_value = 'regenerated_reset_token'

          result = AuthenticationService.create_password_reset_request(self.email)

          mock_regenerate_reset.assert_called_once_with(self.email, mock_reset_request)
          mock_send_email.assert_called_once_with(self.email, 'regenerated_reset_token')
          self.assertEqual(result, 'regenerated_reset_token')


     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('apps.users.models.TalentCloudUser.objects.filter')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_create_password_reset_request_already_requested(self, mock_is_expired, mock_user_filter, mock_password_reset_active):
          mock_user_filter.return_value.exists.return_value = True
          mock_reset_request = MagicMock()
          mock_password_reset_active.return_value.filter.return_value.first.return_value = mock_reset_request
          mock_is_expired.return_value = False

          with self.assertRaises(ValueError) as context:
               AuthenticationService.create_password_reset_request(self.email)

          self.assertEqual(str(context.exception), "Password reset request already sent.")

     @patch('apps.users.models.TalentCloudUser.objects.filter')
     def test_create_password_reset_request_user_not_found(self, mock_user_filter):
          mock_user_filter.return_value.exists.return_value = False

          with self.assertRaises(ValueError) as context:
               AuthenticationService.create_password_reset_request(self.email)

          self.assertEqual(str(context.exception), "Talent cloud user with this email does not exist.")

     @patch('services.user.email_service.AuthEmailService.send_password_reset_success_email')
     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('utils.token.jwt.TokenUtil.decode_user_token')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     def test_perform_reset_password_success(self, mock_is_expired, mock_decode_token, mock_get_user, mock_reset_active, mock_send_email):
          mock_decode_token.return_value = self.email
          mock_reset_request = MagicMock()
          mock_reset_active.return_value.filter.return_value.first.return_value = mock_reset_request
          mock_is_expired.return_value = False

          mock_user = MagicMock()
          mock_get_user.return_value = mock_user

          result = AuthenticationService.perform_reset_password(self.password, self.token)

          mock_user.set_password.assert_called_once_with(self.password)
          mock_send_email.assert_called_once_with(self.email)
          self.assertEqual(result, self.token)

     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('utils.token.jwt.TokenUtil.decode_user_token')
     def test_perform_reset_password_no_reset_request(self, mock_decode_token, mock_reset_active):
          mock_decode_token.return_value = self.email
          mock_reset_active.return_value.filter.return_value.first.return_value = None

          with self.assertRaises(ValueError) as context:
               AuthenticationService.perform_reset_password(self.password, self.token)

          self.assertIn("expired or invalid", str(context.exception))

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('utils.token.jwt.TokenUtil.decode_user_token')
     def test_perform_reset_password_expired_reset_request(self, mock_decode_token, mock_reset_active, mock_is_expired):
          mock_decode_token.return_value = self.email
          mock_reset_request = MagicMock()
          mock_reset_active.return_value.filter.return_value.first.return_value = mock_reset_request
          mock_is_expired.return_value = True

          with self.assertRaises(ValueError) as context:
               AuthenticationService.perform_reset_password(self.password, self.token)

          self.assertIn("expired or invalid", str(context.exception))

     @patch('apps.users.models.TalentCloudUser.objects.get')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.PasswordReset.objects.active')
     @patch('utils.token.jwt.TokenUtil.decode_user_token')
     def test_perform_reset_password_user_not_found(self, mock_decode_token, mock_reset_active, mock_is_expired, mock_get_user):
          mock_decode_token.return_value = self.email
          mock_reset_request = MagicMock()
          mock_reset_active.return_value.filter.return_value.first.return_value = mock_reset_request
          mock_is_expired.return_value = False
          mock_get_user.side_effect = TalentCloudUser.DoesNotExist()

          with self.assertRaises(ValueError) as context:
               AuthenticationService.perform_reset_password(self.password, self.token)

          self.assertIn("User with the provided email does not exist", str(context.exception))

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_check_token_validity_registration_success(self, mock_active, mock_is_expired):
          mock_record = MagicMock()
          mock_active.return_value.filter.return_value.first.return_value = mock_record
          mock_is_expired.return_value = False

          result = AuthenticationService.check_token_validity(self.token)
          self.assertTrue(result)

     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_check_token_validity_registration_invalid_token(self, mock_active):
          mock_active.return_value.filter.return_value.first.return_value = None

          with self.assertRaises(ValidationError) as context:
               AuthenticationService.check_token_validity(self.token)

          self.assertIn('Token is invalid.', str(context.exception))

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_check_token_validity_registration_expired_token(self, mock_active, mock_is_expired):
          mock_record = MagicMock()
          mock_active.return_value.filter.return_value.first.return_value = mock_record
          mock_is_expired.return_value = True

          with self.assertRaises(ValidationError) as context:
               AuthenticationService.check_token_validity(self.token)

          self.assertIn('Token is expired.', str(context.exception))

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.PasswordReset.objects.filter')
     def test_check_token_validity_password_reset_success(self, mock_filter, mock_is_expired):
          mock_record = MagicMock()
          mock_filter.return_value.first.return_value = mock_record
          mock_is_expired.return_value = False

          result = AuthenticationService.check_token_validity(self.token, action='reset')
          self.assertTrue(result)

     @patch('apps.users.models.PasswordReset.objects.filter')
     def test_check_token_validity_password_reset_invalid_token(self, mock_filter):
          mock_filter.return_value.first.return_value = None

          with self.assertRaises(ValidationError) as context:
               AuthenticationService.check_token_validity(self.token, action='reset')

          self.assertIn('Token is invalid.', str(context.exception))

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.PasswordReset.objects.filter')
     def test_check_token_validity_password_reset_expired_token(self, mock_filter, mock_is_expired):
          mock_record = MagicMock()
          mock_filter.return_value.first.return_value = mock_record
          mock_is_expired.return_value = True

          with self.assertRaises(ValidationError) as context:
               AuthenticationService.check_token_validity(self.token, action='reset')

          self.assertIn('Token is expired.', str(context.exception))

     @patch('utils.user.mail.send_verification_email')
     @patch('utils.token.jwt.TokenUtil.generate_verification_code')
     @patch('utils.token.jwt.TokenUtil.generate_expiration_time')
     @patch('utils.token.jwt.TokenUtil.decode_user_token')
     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_resend_activation_token_success_generate_new_code(
          self, mock_active, mock_is_expired, mock_decode_user_token, 
          mock_generate_expiration_time, mock_generate_verification_code, mock_send_verification_email):

          mock_request = MagicMock()
          mock_active.return_value.filter.return_value.first.return_value = mock_request
          mock_is_expired.return_value = True
          mock_decode_user_token.return_value = self.email
          mock_generate_expiration_time.return_value = 'new_expiration'
          mock_generate_verification_code.return_value = 'new_code'

          result = AuthenticationService.resend_activation_token(self.token)

          mock_send_verification_email.assert_called_once_with(self.email, self.token, 'new_code')
          self.assertEqual(result, 'Verification code is sent back to user.')

     @patch('utils.token.jwt.TokenUtil.is_expired')
     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_resend_activation_token_token_still_valid(self, mock_active, mock_is_expired):
          mock_request = MagicMock()
          mock_active.return_value.filter.return_value.first.return_value = mock_request
          mock_is_expired.return_value = False

          result = AuthenticationService.resend_activation_token(self.token)

          self.assertEqual(result, 'Token is still valid.')

     @patch('apps.users.models.VerifyRegisteredUser.objects.active')
     def test_resend_activation_token_invalid_token(self, mock_active):
          mock_active.return_value.filter.return_value.first.return_value = None

          with self.assertRaises(ValidationError) as context:
               AuthenticationService.resend_activation_token(self.token)

          self.assertIn('Token is invalid.', str(context.exception))
