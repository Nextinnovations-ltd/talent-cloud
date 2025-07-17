"""
Integration tests for OAuth views with CSRF protection
"""
from unittest.mock import patch, MagicMock
from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.core.cache import cache
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.views import (
    GoogleAuthAPIView, 
    LinkedinAuthAPIView, 
    FacebookAuthAPIView,
    OAuthStateGenerationAPIView
)
from utils.oauth.csrf_protection import OAuthStateManager
import json


class OAuthViewsCSRFTestCase(TestCase):
    """Test OAuth views with CSRF protection"""
    
    def setUp(self):
        """Set up test environment"""
        self.client = APIClient()
        self.factory = RequestFactory()
        cache.clear()
        
        # Test data
        self.test_ip = '192.168.1.100'
        self.test_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        self.test_auth_code = 'test_auth_code_12345'
    
    def tearDown(self):
        """Clean up after each test"""
        cache.clear()
    
    def test_oauth_state_generation_success(self):
        """Test successful OAuth state generation"""
        url = reverse('generate-oauth-state')
        data = {'provider': 'google'}
        
        response = self.client.post(
            url, 
            data, 
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        
        self.assertTrue(response_data['status'])
        self.assertIn('data', response_data)
        self.assertIn('state', response_data['data'])
        self.assertEqual(response_data['data']['provider'], 'google')
        self.assertEqual(response_data['data']['expires_in'], OAuthStateManager.STATE_EXPIRY_SECONDS)
        
        # Verify state format
        state = response_data['data']['state']
        parts = state.split('.')
        self.assertEqual(len(parts), 3)
    
    def test_oauth_state_generation_invalid_provider(self):
        """Test OAuth state generation with invalid provider"""
        url = reverse('generate-oauth-state')
        data = {'provider': 'invalid_provider'}
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('Unsupported provider', response_data['message'])
    
    def test_oauth_state_generation_missing_provider(self):
        """Test OAuth state generation without provider"""
        url = reverse('generate-oauth-state')
        data = {}
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('Provider is required', response_data['message'])
    
    @patch('services.auth.oauth_service.GoogleOAuthService.process_google_oauth')
    def test_google_oauth_with_valid_state(self, mock_google_service):
        """Test Google OAuth callback with valid state parameter"""
        # Mock the service response
        mock_google_service.return_value = 'https://frontend.com?token=mock_token'
        
        # Generate a valid state
        state = OAuthStateManager.generate_state('google', self.test_ip, self.test_user_agent)
        
        # Make OAuth callback request
        url = reverse('google-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        # Should succeed and redirect
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, 'https://frontend.com?token=mock_token')
        
        # Verify the service was called
        mock_google_service.assert_called_once_with(self.test_auth_code)
    
    @patch('services.auth.oauth_service.GoogleOAuthService.process_google_oauth')
    def test_google_oauth_without_state(self, mock_google_service):
        """Test Google OAuth callback without state parameter (backward compatibility)"""
        # Mock the service response
        mock_google_service.return_value = 'https://frontend.com?token=mock_token'
        
        # Make OAuth callback request without state
        url = reverse('google-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        # Should still succeed (backward compatibility) but log warning
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, 'https://frontend.com?token=mock_token')
        
        # Verify the service was called
        mock_google_service.assert_called_once_with(self.test_auth_code)
    
    def test_google_oauth_with_invalid_state(self):
        """Test Google OAuth callback with invalid state parameter"""
        invalid_state = "invalid_state_format"
        
        url = reverse('google-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={invalid_state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('CSRF protection failed', response_data['message'])
    
    def test_google_oauth_with_expired_state(self):
        """Test Google OAuth callback with expired state"""
        # Create an expired state manually
        import time
        expired_timestamp = str(int(time.time()) - OAuthStateManager.STATE_EXPIRY_SECONDS - 100)
        expired_state = f"random_data.context_hash.{expired_timestamp}"
        
        url = reverse('google-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={expired_state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('CSRF protection failed', response_data['message'])
    
    def test_google_oauth_state_replay_attack(self):
        """Test Google OAuth callback prevents state replay attacks"""
        # Generate a valid state
        state = OAuthStateManager.generate_state('google', self.test_ip, self.test_user_agent)
        
        # First request should consume the state successfully
        with patch('services.auth.oauth_service.GoogleOAuthService.process_google_oauth') as mock_service:
            mock_service.return_value = 'https://frontend.com?token=mock_token'
            
            url = reverse('google-auth-callback')
            response = self.client.get(
                f"{url}?code={self.test_auth_code}&state={state}",
                HTTP_USER_AGENT=self.test_user_agent,
                REMOTE_ADDR=self.test_ip
            )
            
            self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        
        # Second request with same state should fail (replay attack)
        url = reverse('google-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('CSRF protection failed', response_data['message'])
    
    @patch('services.auth.oauth_service.LinkedinOAuthService.process_linkedin_oauth')
    def test_linkedin_oauth_with_valid_state(self, mock_linkedin_service):
        """Test LinkedIn OAuth callback with valid state parameter"""
        # Mock the service response
        mock_linkedin_service.return_value = 'https://frontend.com?token=mock_token'
        
        # Generate a valid state
        state = OAuthStateManager.generate_state('linkedin', self.test_ip, self.test_user_agent)
        
        # Make OAuth callback request
        url = reverse('linkedin-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        # Should succeed and redirect
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, 'https://frontend.com?token=mock_token')
        
        # Verify the service was called
        mock_linkedin_service.assert_called_once_with(self.test_auth_code)
    
    @patch('services.auth.oauth_service.FacebookOAuthService.process_facebook_oauth')
    def test_facebook_oauth_with_valid_state(self, mock_facebook_service):
        """Test Facebook OAuth callback with valid state parameter"""
        # Mock the service response
        mock_facebook_service.return_value = 'https://frontend.com?token=mock_token'
        
        # Generate a valid state
        state = OAuthStateManager.generate_state('facebook', self.test_ip, self.test_user_agent)
        
        # Make OAuth callback request
        url = reverse('facebook-auth-callback')
        response = self.client.get(
            f"{url}?code={self.test_auth_code}&state={state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        # Should succeed and redirect
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, 'https://frontend.com?token=mock_token')
        
        # Verify the service was called
        mock_facebook_service.assert_called_once_with(self.test_auth_code)
    
    def test_oauth_missing_auth_code(self):
        """Test OAuth callback fails without authorization code"""
        url = reverse('google-auth-callback')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('Authorization code is required', response_data['message'])
    
    def test_oauth_invalid_auth_code(self):
        """Test OAuth callback fails with invalid authorization code"""
        invalid_auth_code = "invalid@code#with$special%chars"
        
        url = reverse('google-auth-callback')
        response = self.client.get(f"{url}?code={invalid_auth_code}")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('Invalid authorization code format', response_data['message'])
    
    # Rate limiting test removed - requires complex setup
    # Rate limiting functionality is tested in rate_limiting.py unit tests


class OAuthIntegrationTestCase(TestCase):
    """End-to-end integration tests for OAuth with CSRF protection"""
    
    def setUp(self):
        """Set up test environment"""
        self.client = APIClient()
        cache.clear()
        
        self.test_ip = '192.168.1.100'
        self.test_user_agent = 'Mozilla/5.0 (Test Browser)'
        self.test_auth_code = 'test_auth_code_12345'
    
    def tearDown(self):
        """Clean up after each test"""
        cache.clear()
    
    def test_complete_oauth_flow_with_csrf_protection(self):
        """Test complete OAuth flow from state generation to callback"""
        # Step 1: Generate state parameter
        state_url = reverse('generate-oauth-state')
        state_response = self.client.post(
            state_url,
            {'provider': 'google'},
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        self.assertEqual(state_response.status_code, status.HTTP_200_OK)
        state_data = state_response.json()
        state = state_data['data']['state']
        
        # Step 2: Simulate OAuth callback with generated state
        with patch('services.auth.oauth_service.GoogleOAuthService.process_google_oauth') as mock_service:
            mock_service.return_value = 'https://frontend.com?token=mock_token'
            
            callback_url = reverse('google-auth-callback')
            callback_response = self.client.get(
                f"{callback_url}?code={self.test_auth_code}&state={state}",
                HTTP_USER_AGENT=self.test_user_agent,
                REMOTE_ADDR=self.test_ip
            )
            
            # Should successfully complete the flow
            self.assertEqual(callback_response.status_code, status.HTTP_302_FOUND)
            self.assertEqual(callback_response.url, 'https://frontend.com?token=mock_token')
            
            # Verify the OAuth service was called
            mock_service.assert_called_once_with(self.test_auth_code)
    
    def test_cross_provider_state_validation(self):
        """Test that state generated for one provider can't be used with another"""
        # Generate state for Google
        state_url = reverse('generate-oauth-state')
        state_response = self.client.post(
            state_url,
            {'provider': 'google'},
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        state = state_response.json()['data']['state']
        
        # Try to use Google state with LinkedIn callback
        callback_url = reverse('linkedin-auth-callback')
        callback_response = self.client.get(
            f"{callback_url}?code={self.test_auth_code}&state={state}",
            HTTP_USER_AGENT=self.test_user_agent,
            REMOTE_ADDR=self.test_ip
        )
        
        # Should fail due to provider mismatch
        self.assertEqual(callback_response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = callback_response.json()
        self.assertFalse(response_data['status'])
        self.assertIn('CSRF protection failed', response_data['message'])
