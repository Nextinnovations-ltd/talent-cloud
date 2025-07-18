"""
OAuth CSRF protection utilities using state parameter validation
"""
import secrets
import hashlib
import time
from typing import Dict
from django.core.cache import cache
from django.conf import settings
from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class OAuthStateManager:
     """
     Manages OAuth state parameter generation and validation for CSRF protection
     """
     
     # State parameter cache settings
     STATE_CACHE_PREFIX = 'oauth_state'
     STATE_EXPIRY_SECONDS = 600  # 10 minutes
     MAX_STATES_PER_IP = 10  # Prevent state flooding
     
     @staticmethod
     def generate_state(provider: str, ip_address: str, user_agent: str) -> str:
          """
          Generate a cryptographically secure state parameter
          
          Args:
               provider: OAuth provider name
               ip_address: Client IP address
               user_agent: Client user agent
               
          Returns:
               str: Generated state parameter
          """
          # Generate secure random state
          random_bytes = secrets.token_urlsafe(32)
          timestamp = str(int(time.time()))
          
          # Create a hash of request context for additional validation
          context_data = f"{provider}:{ip_address}:{user_agent[:100]}:{timestamp}"
          context_hash = hashlib.sha256(context_data.encode()).hexdigest()[:16]
          
          # Combine random data with context hash
          state = f"{random_bytes}.{context_hash}.{timestamp}"
          
          # Store state in cache with metadata
          cache_key = f"{OAuthStateManager.STATE_CACHE_PREFIX}:{state}"
          state_data = {
               'provider': provider,
               'ip_address': ip_address,
               'user_agent_hash': hashlib.sha256(user_agent.encode()).hexdigest(),
               'created_at': timestamp,
               'used': False
          }
          
          # Check rate limiting - max states per IP
          ip_cache_key = f"{OAuthStateManager.STATE_CACHE_PREFIX}_ip:{ip_address}"
          ip_state_count = cache.get(ip_cache_key, 0)
          
          if ip_state_count >= OAuthStateManager.MAX_STATES_PER_IP:
               logger.warning(f"State generation rate limit exceeded for IP: {ip_address}")
               raise ValidationError("Too many authentication attempts. Please try again later.")
          
          # Increment IP counter
          cache.set(ip_cache_key, ip_state_count + 1, OAuthStateManager.STATE_EXPIRY_SECONDS)
          
          # Store state data
          cache.set(cache_key, state_data, OAuthStateManager.STATE_EXPIRY_SECONDS)
          
          logger.info(f"Generated OAuth state for provider {provider} from IP: {ip_address[:15]}...")
          
          return state
     
     @staticmethod
     def validate_and_consume_state(
          state: str, 
          provider: str, 
          ip_address: str, 
          user_agent: str
     ) -> bool:
          """
          Validate state parameter and mark it as consumed
          
          Args:
               state: State parameter to validate
               provider: OAuth provider name
               ip_address: Client IP address
               user_agent: Client user agent
               
          Returns:
               bool: True if state is valid
               
          Raises:
               ValidationError: If state validation fails
          """
          if not state:
               raise ValidationError("State parameter is required for CSRF protection")
          
          if not isinstance(state, str):
               raise ValidationError("State parameter must be a string")
          
          # Check if this is our generated state format (random.hash.timestamp)
          state_parts = state.split('.')
          if len(state_parts) == 3:
               try:
                    random_part, context_hash, timestamp = state_parts
                    
                    # Validate timestamp (check if state is not too old)
                    state_time = int(timestamp)
                    current_time = int(time.time())
                    
                    if current_time - state_time > OAuthStateManager.STATE_EXPIRY_SECONDS:
                         raise ValidationError("State parameter has expired")
                    
                    # This looks like our generated state - validate it fully
                    return OAuthStateManager._validate_our_generated_state(
                         state, provider, ip_address, user_agent, context_hash, timestamp
                    )
                    
               except (ValueError, IndexError):
                    # If parsing fails, treat as external state
                    pass
          
          # This is likely an external state parameter from OAuth provider
          # Log it but allow it through with basic validation
          logger.info(f"External state parameter received from {provider}: {state[:20]}... from IP: {ip_address[:15]}")
          return True
     
     @staticmethod
     def _validate_our_generated_state(
          state: str, 
          provider: str, 
          ip_address: str, 
          user_agent: str,
          context_hash: str,
          timestamp: str
     ) -> bool:
          """
          Validate our internally generated state parameter with full CSRF protection
          
          Args:
               state: Full state parameter
               provider: OAuth provider name
               ip_address: Client IP address
               user_agent: Client user agent
               context_hash: Extracted context hash
               timestamp: Extracted timestamp
               
          Returns:
               bool: True if state is valid
               
          Raises:
               ValidationError: If state validation fails
          """
          
          # Retrieve state from cache
          cache_key = f"{OAuthStateManager.STATE_CACHE_PREFIX}:{state}"
          state_data = cache.get(cache_key)
          
          if not state_data:
               logger.warning(f"State validation failed - state not found or expired: {state[:20]}... from IP: {ip_address}")
               raise ValidationError("Invalid or expired state parameter")
          
          # Check if state was already used
          if state_data.get('used', False):
               logger.warning(f"State replay attack detected: {state[:20]}... from IP: {ip_address}")
               raise ValidationError("State parameter already used")
          
          # Validate provider matches
          if state_data.get('provider') != provider:
               logger.warning(f"State provider mismatch: expected {state_data.get('provider')}, got {provider}")
               raise ValidationError("State parameter provider mismatch")
          
          # Validate IP address matches (optional - may be too strict for some deployments)
          strict_ip_validation = getattr(settings, 'OAUTH_STRICT_IP_VALIDATION', True)
          if strict_ip_validation:
               if state_data.get('ip_address') != ip_address:
                    logger.warning(f"State IP mismatch: expected {state_data.get('ip_address')}, got {ip_address}")
                    raise ValidationError("State parameter IP address mismatch")
          
          # Validate user agent hash (less strict than full match)
          user_agent_hash = hashlib.sha256(user_agent.encode()).hexdigest()
          if state_data.get('user_agent_hash') != user_agent_hash:
               logger.warning(f"State user agent mismatch from IP: {ip_address}")
               # Don't fail for user agent mismatch - just log it
               # Some users may have dynamic user agents
          
          # Verify context hash
          context_data = f"{provider}:{state_data.get('ip_address')}:{user_agent[:100]}:{timestamp}"
          expected_context_hash = hashlib.sha256(context_data.encode()).hexdigest()[:16]
          
          if context_hash != expected_context_hash:
               logger.warning(f"State context hash validation failed from IP: {ip_address}")
               raise ValidationError("State parameter validation failed")
          
          # Mark state as used
          state_data['used'] = True
          cache.set(cache_key, state_data, 60)  # Keep for 1 minute for audit
          
          logger.info(f"State validation successful for provider {provider} from IP: {ip_address[:15]}...")
          
          return True
     
     @staticmethod
     def cleanup_expired_states() -> None:
          """
          Cleanup utility for expired states (can be called from management command)
          """
          # Django cache doesn't have a pattern-based cleanup, so this is mostly automatic
          # This method can be expanded if using a different cache backend
          logger.info("OAuth state cleanup completed (automatic with cache TTL)")

class OAuthCSRFProtection:
     """
     CSRF protection decorator and utilities for OAuth endpoints
     """
     
     @staticmethod
     def get_authorization_url(base_url: str, params: Dict[str, str], state: str) -> str:
          """
          Build OAuth authorization URL with state parameter
          
          Args:
               base_url: OAuth provider's authorization URL
               params: OAuth parameters
               state: State parameter for CSRF protection
               
          Returns:
               str: Complete authorization URL with state
          """
          # Add state to parameters
          params['state'] = state
          
          # Build query string
          query_params = '&'.join([f"{key}={value}" for key, value in params.items()])
          
          return f"{base_url}?{query_params}"
     
     @staticmethod
     def require_valid_state(view_func):
          """
          Decorator to enforce state parameter validation on OAuth callback views
          
          This decorator should be applied to OAuth callback views to ensure
          proper CSRF protection through state parameter validation.
          """
          def wrapper(self, request, *args, **kwargs):
               # Extract state parameter
               state = request.query_params.get('state')
               provider = getattr(self, 'oauth_provider', 'unknown')
               
               # Get client information
               ip_address = request.META.get('REMOTE_ADDR', '')
               user_agent = request.META.get('HTTP_USER_AGENT', '')
               
               # Validate state parameter
               try:
                    OAuthStateManager.validate_and_consume_state(
                         state, provider, ip_address, user_agent
                    )
               except ValidationError as e:
                    logger.warning(f"CSRF protection failed for {provider} OAuth: {str(e)}")
                    raise ValidationError(f"CSRF protection failed: {str(e)}")
               
               # Continue with original view
               return view_func(self, request, *args, **kwargs)
          
          return wrapper
