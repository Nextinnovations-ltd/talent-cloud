"""
Tests for OAuth CSRF protection using state parameter validation
"""
import time
from unittest.mock import patch
from django.test import TestCase, RequestFactory
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from utils.oauth.csrf_protection import OAuthStateManager, OAuthCSRFProtection
from utils.oauth.validation import OAuthValidator


class OAuthStateManagerTestCase(TestCase):
     """Test cases for OAuth state parameter management"""
     
     def setUp(self):
          """Set up test environment"""
          self.factory = RequestFactory()
          # Clear cache before each test
          cache.clear()
          
          # Test data
          self.test_provider = 'google'
          self.test_ip = '192.168.1.100'
          self.test_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
     
     def tearDown(self):
          """Clean up after each test"""
          cache.clear()
     
     def test_generate_state_success(self):
          """Test successful state parameter generation"""
          state = OAuthStateManager.generate_state(
               self.test_provider, 
               self.test_ip, 
               self.test_user_agent
          )
          
          # Verify state format (should have 3 parts separated by dots)
          self.assertIsInstance(state, str)
          parts = state.split('.')
          self.assertEqual(len(parts), 3)
          
          # Verify each part is not empty
          for part in parts:
               self.assertGreater(len(part), 0)
          
          # Verify state is stored in cache
          cache_key = f"{OAuthStateManager.STATE_CACHE_PREFIX}:{state}"
          state_data = cache.get(cache_key)
          self.assertIsNotNone(state_data)
          self.assertEqual(state_data['provider'], self.test_provider)
          self.assertEqual(state_data['ip_address'], self.test_ip)
          self.assertFalse(state_data['used'])
     
     def test_generate_state_rate_limiting(self):
          """Test state generation rate limiting per IP"""
          # Generate maximum allowed states
          for i in range(OAuthStateManager.MAX_STATES_PER_IP):
               state = OAuthStateManager.generate_state(
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
               self.assertIsInstance(state, str)
          
          # Next attempt should fail due to rate limiting
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.generate_state(
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("Too many authentication attempts", str(cm.exception))
     
     def test_validate_and_consume_state_success(self):
          """Test successful state validation and consumption"""
          # Generate state
          state = OAuthStateManager.generate_state(
               self.test_provider, 
               self.test_ip, 
               self.test_user_agent
          )
          
          # Validate and consume state
          result = OAuthStateManager.validate_and_consume_state(
               state, 
               self.test_provider, 
               self.test_ip, 
               self.test_user_agent
          )
          
          self.assertTrue(result)
          
          # Verify state is marked as used
          cache_key = f"{OAuthStateManager.STATE_CACHE_PREFIX}:{state}"
          state_data = cache.get(cache_key)
          self.assertIsNotNone(state_data)
          self.assertTrue(state_data['used'])
     
     def test_validate_state_missing_parameter(self):
          """Test validation fails when state parameter is missing"""
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    None, 
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("State parameter is required", str(cm.exception))
     
     def test_validate_state_expired(self):
          """Test validation fails for expired state"""
          # Create an expired state manually
          expired_timestamp = str(int(time.time()) - OAuthStateManager.STATE_EXPIRY_SECONDS - 100)
          expired_state = f"random_data.context_hash.{expired_timestamp}"
          
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    expired_state, 
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("State parameter has expired", str(cm.exception))
     
     def test_validate_state_not_found(self):
          """Test validation fails when state is not found in cache"""
          # Generate a valid-looking state that wasn't generated by the system
          fake_state = "fake_random_data.fake_context_hash." + str(int(time.time()))
          
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    fake_state, 
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("Invalid or expired state parameter", str(cm.exception))
     
     def test_validate_state_replay_attack(self):
          """Test validation prevents state replay attacks"""
          # Generate and consume state once
          state = OAuthStateManager.generate_state(
               self.test_provider, 
               self.test_ip, 
               self.test_user_agent
          )
          
          # First consumption should succeed
          result = OAuthStateManager.validate_and_consume_state(
               state, 
               self.test_provider, 
               self.test_ip, 
               self.test_user_agent
          )
          self.assertTrue(result)
          
          # Second attempt should fail (replay attack)
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    state, 
                    self.test_provider, 
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("State parameter already used", str(cm.exception))
     
     def test_validate_state_provider_mismatch(self):
          """Test validation fails when provider doesn't match"""
          # Generate state for one provider
          state = OAuthStateManager.generate_state(
               'google', 
               self.test_ip, 
               self.test_user_agent
          )
          
          # Try to validate with different provider
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    state, 
                    'facebook',  # Different provider
                    self.test_ip, 
                    self.test_user_agent
               )
          
          self.assertIn("State parameter provider mismatch", str(cm.exception))
     
     @patch('utils.oauth.csrf_protection.settings')
     def test_validate_state_ip_mismatch_strict(self, mock_settings):
          """Test validation fails when IP doesn't match in strict mode"""
          # Mock settings
          mock_settings.OAUTH_STRICT_IP_VALIDATION = True
          
          # Generate state for one IP
          state = OAuthStateManager.generate_state(
               self.test_provider, 
               '192.168.1.100', 
               self.test_user_agent
          )
          
          # Try to validate with different IP
          with self.assertRaises(ValidationError) as cm:
               OAuthStateManager.validate_and_consume_state(
                    state, 
                    self.test_provider, 
                    '192.168.1.200',  # Different IP
                    self.test_user_agent
               )
          
          self.assertIn("State parameter IP address mismatch", str(cm.exception))
     
     @patch('utils.oauth.csrf_protection.settings')
     def test_validate_state_ip_mismatch_lenient(self, mock_settings):
          """Test validation succeeds when IP doesn't match in lenient mode"""
          # Mock settings
          mock_settings.OAUTH_STRICT_IP_VALIDATION = False
          
          # Generate state for one IP
          state = OAuthStateManager.generate_state(
               self.test_provider, 
               '192.168.1.100', 
               self.test_user_agent
          )
          
          # Try to validate with different IP (should succeed in lenient mode)
          result = OAuthStateManager.validate_and_consume_state(
               state, 
               self.test_provider, 
               '192.168.1.200',  # Different IP
               self.test_user_agent
          )
          
          self.assertTrue(result)


class OAuthCSRFProtectionTestCase(TestCase):
     """Test cases for OAuth CSRF protection utilities"""
     
     def test_get_authorization_url(self):
          """Test building authorization URL with state parameter"""
          base_url = "https://accounts.google.com/oauth/authorize"
          params = {
               'client_id': 'test_client_id',
               'redirect_uri': 'https://example.com/callback',
               'scope': 'email profile'
          }
          state = "test_state_parameter"
          
          result_url = OAuthCSRFProtection.get_authorization_url(base_url, params, state)
          
          # Verify URL contains all parameters including state
          self.assertIn(base_url, result_url)
          self.assertIn('client_id=test_client_id', result_url)
          self.assertIn('redirect_uri=https://example.com/callback', result_url)
          self.assertIn('scope=email profile', result_url)
          self.assertIn('state=test_state_parameter', result_url)


class OAuthValidatorCSRFTestCase(TestCase):
     """Test cases for OAuth validator CSRF-related functionality"""
     
     def test_validate_state_parameter_format(self):
          """Test state parameter format validation"""
          # Valid state parameters - using realistic format like what's actually generated
          valid_states = [
               "random_data_123.abc123def456.1234567890",
               "abc123_xyz-def.def456abc123.1640995200", 
               "long-random_string.abcdef123456.1234567890"
          ]
          
          for valid_state in valid_states:
               result = OAuthValidator.validate_state_parameter(valid_state)
               self.assertEqual(result, valid_state.strip())
     
     def test_validate_state_parameter_edge_cases(self):
          """Test state parameter validation edge cases"""
          # Test with whitespace - fix the format to match our pattern
          state_with_whitespace = "  valid123.format456.1234567890  "
          result = OAuthValidator.validate_state_parameter(state_with_whitespace)
          self.assertEqual(result, "valid123.format456.1234567890")
          
          # Test non-string input
          with self.assertRaises(ValidationError) as cm:
               OAuthValidator.validate_state_parameter(123)
          
          self.assertIn("State parameter must be a string", str(cm.exception))
