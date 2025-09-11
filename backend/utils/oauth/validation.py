"""
OAuth input validation utilities
"""
import re
from rest_framework.exceptions import ValidationError
from core.constants.constants import OAUTH_PROVIDERS

class OAuthValidator:
     """Validator class for OAuth parameters"""
     
     # Authorization code patterns for different providers
     AUTH_CODE_PATTERNS = {
          OAUTH_PROVIDERS.GITHUB: r'^[A-Za-z0-9._/-]+$', # Github auth codes
          OAUTH_PROVIDERS.GOOGLE: r'^[A-Za-z0-9._/-]+$',  # Google auth codes
          OAUTH_PROVIDERS.LINKEDIN: r'^[A-Za-z0-9._-]+$',  # LinkedIn auth codes
          OAUTH_PROVIDERS.FACEBOOK: r'^[A-Za-z0-9._#-]+$'  # Facebook auth codes
     }
     
     MAX_AUTH_CODE_LENGTH = 2048
     
     # State parameter pattern
     STATE_PATTERN = r'^[A-Za-z0-9._-]+$'
     MAX_STATE_LENGTH = 128
     
     @staticmethod
     def validate_auth_code(auth_code: str, provider: str) -> str:
          """
          Validate authorization code format and content
          
          Args:
               auth_code: The authorization code to validate
               provider: OAuth provider name ('google', 'linkedin', 'github', 'facebook')
               
          Returns:
               str: The validated authorization code
               
          Raises:
               ValidationError: If validation fails
          """
          if not auth_code:
               raise ValidationError("Authorization code is required")
          
          # Check if it's a string
          if not isinstance(auth_code, str):
               raise ValidationError("Authorization code must be a string")
          
          # Check length
          if len(auth_code) > OAuthValidator.MAX_AUTH_CODE_LENGTH:
               raise ValidationError(f"Authorization code too long (max {OAuthValidator.MAX_AUTH_CODE_LENGTH} characters)")
          
          # Check for null bytes or other dangerous characters
          if '\x00' in auth_code or '\n' in auth_code or '\r' in auth_code:
               raise ValidationError("Authorization code contains invalid characters")
          
          # Validate against provider-specific pattern
          pattern = OAuthValidator.AUTH_CODE_PATTERNS.get(provider.lower())
          
          if not pattern:
               raise ValidationError(f"Unsupported OAuth provider: {provider}")
          
          if not re.match(pattern, auth_code):
               raise ValidationError(f"Invalid authorization code format for {provider}")
          
          return auth_code.strip()
     
     @staticmethod
     def validate_state_parameter(state: str) -> str:
          """
          Validate state parameter format for CSRF protection
          
          Args:
               state: The state parameter to validate
               
          Returns:
               str: The validated state parameter
               
          Raises:
               ValidationError: If validation fails
          """
          if not state:
               raise ValidationError("State parameter is required for CSRF protection")
          
          if not isinstance(state, str):
               raise ValidationError("State parameter must be a string")
          
          max_length = 200
          if len(state) > max_length:
               raise ValidationError(f"State parameter too long (max {max_length} characters)")
          
          if '\x00' in state or '\n' in state or '\r' in state:
               raise ValidationError("State parameter contains invalid characters")
          
          # Check state pattern
          our_state_pattern = r'^[A-Za-z0-9_-]+\.[A-Za-z0-9a-f_-]+\.[0-9]+$'
          
          if re.match(our_state_pattern, state.strip()):
               return state.strip()

          general_state_pattern = r'^[A-Za-z0-9._=,\-:;]+$'
          
          if not re.match(general_state_pattern, state.strip()):
               raise ValidationError("State parameter contains invalid characters")
          
          return state.strip()
     
     @staticmethod
     def validate_provider_name(provider: str) -> str:
          """
          Validate OAuth provider name
          
          Args:
               provider: Provider name to validate
               
          Returns:
               str: The validated provider name
               
          Raises:
               ValidationError: If validation fails
          """
          if not provider:
               raise ValidationError("Provider name is required")
          
          if not isinstance(provider, str):
               raise ValidationError("Provider name must be a string")
          
          provider = provider.lower().strip()
          
          valid_providers = [OAUTH_PROVIDERS.GOOGLE, OAUTH_PROVIDERS.LINKEDIN, OAUTH_PROVIDERS.GITHUB, OAUTH_PROVIDERS.FACEBOOK]
          if provider not in valid_providers:
               raise ValidationError(f"Unsupported provider. Valid providers: {', '.join(valid_providers)}")
          
          return provider
     
     @staticmethod
     def sanitize_user_agent(user_agent: str) -> str:
          """
          Sanitize user agent string for logging
          
          Args:
               user_agent: Raw user agent string
               
          Returns:
               str: Sanitized user agent string
          """
          if not user_agent or not isinstance(user_agent, str):
               return "Unknown"
          
          # Limit length and remove potentially dangerous characters
          sanitized = re.sub(r'[^\w\s\-\.\(\);:/]', '', user_agent)
          return sanitized[:500]  # Limit to 500 characters
     
     @staticmethod
     def sanitize_ip_address(ip_address: str) -> str:
          """
          Sanitize IP address for logging
          
          Args:
               ip_address: Raw IP address
               
          Returns:
               str: Sanitized IP address
          """
          if not ip_address or not isinstance(ip_address, str):
               return "Unknown"
          
          # Basic IPv4/IPv6 validation pattern
          ipv4_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
          ipv6_pattern = r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
          
          if re.match(ipv4_pattern, ip_address) or re.match(ipv6_pattern, ip_address):
               return ip_address
          
          # If it doesn't match standard IP patterns, sanitize it
          sanitized = re.sub(r'[^\w\.\:]', '', ip_address)
          return sanitized[:45] if sanitized else "Unknown"  # Max IPv6 length is 45 chars
