"""
OAuth Rate Limiting Configuration and Utilities
"""
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from core.constants.constants import OAUTH_PROVIDERS
from utils.response import CustomResponse
from django.http import JsonResponse
from rest_framework import status
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class OAuthRateLimitConfig:
     """Configuration for OAuth rate limiting"""
     
     # Rate limits for different scenarios
     LIMITS = {
          # Per IP address limits
          'oauth_per_ip': '10/5m',        # 10 attempts per 5 minutes per IP
          'oauth_per_ip_hourly': '50/1h', # 50 attempts per hour per IP
          'oauth_per_ip_daily': '200/1d', # 200 attempts per day per IP
          
          # Global limits (to prevent distributed attacks)
          'oauth_global': '1000/1h',      # 1000 total OAuth attempts per hour
          
          # Provider-specific limits (in case one provider is being targeted)
          'oauth_provider': '100/5m',     # 100 attempts per provider per 5 minutes
     }
     
     # Rate limit key functions
     @staticmethod
     def get_ip_key(group, request):
          """Get rate limit key based on IP address"""
          return request.META.get('REMOTE_ADDR', 'unknown')
     
     @staticmethod
     def get_provider_key(group, request):
          """Get rate limit key based on OAuth provider"""
          # Extract provider from URL path
          path = request.path
          if OAUTH_PROVIDERS.GOOGLE in path:
               provider = OAUTH_PROVIDERS.GOOGLE
          elif OAUTH_PROVIDERS.LINKEDIN in path:
               provider = OAUTH_PROVIDERS.LINKEDIN
          elif OAUTH_PROVIDERS.GITHUB in path:
               provider = OAUTH_PROVIDERS.GITHUB
          elif OAUTH_PROVIDERS.FACEBOOK in path:
               provider = OAUTH_PROVIDERS.FACEBOOK
          else:
               provider = 'unknown'
          
          return f"{provider}:{request.META.get('REMOTE_ADDR', 'unknown')}"
     
     @staticmethod
     def get_global_key(group, request):
          """Get rate limit key for global limits"""
          return 'oauth_global'

def oauth_rate_limit_handler(request, exception):
     """
     Custom handler for rate limit exceeded
     
     Args:
          request: Django request object
          exception: Rate limit exception
          
     Returns:
          JsonResponse with rate limit error
     """
     ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
     user_agent = request.META.get('HTTP_USER_AGENT', 'Unknown')[:100]
     
     # Log rate limit violation
     logger.warning(
          f"OAuth rate limit exceeded from IP: {ip_address}",
          extra={
               'ip': ip_address,
               'user_agent': user_agent,
               'path': request.path,
               'method': request.method,
               'rate_limit_type': 'oauth_security'
          }
     )
     
     return JsonResponse(
          CustomResponse.error(
               "Too many authentication attempts. Please try again later.",
               error_code="RATE_LIMIT_EXCEEDED"
          ),
          status=status.HTTP_429_TOO_MANY_REQUESTS
     )

def oauth_rate_limited(view_func):
     """
     Decorator to apply comprehensive rate limiting to OAuth views
     
     This applies multiple rate limits:
     1. Per IP address (prevents single-source attacks)
     2. Per provider (prevents provider-specific attacks)
     3. Global (prevents distributed attacks)
     """
     @method_decorator([
          # Primary rate limit: 10 attempts per 5 minutes per IP
          ratelimit(
               key=OAuthRateLimitConfig.get_ip_key,
               rate=OAuthRateLimitConfig.LIMITS['oauth_per_ip'],
               method='GET',
               block=True
          ),
          # Hourly rate limit: 50 attempts per hour per IP
          ratelimit(
               key=OAuthRateLimitConfig.get_ip_key,
               rate=OAuthRateLimitConfig.LIMITS['oauth_per_ip_hourly'],
               method='GET',
               block=True
          ),
          # Daily rate limit: 200 attempts per day per IP
          ratelimit(
               key=OAuthRateLimitConfig.get_ip_key,
               rate=OAuthRateLimitConfig.LIMITS['oauth_per_ip_daily'],
               method='GET',
               block=True
          ),
          # Provider-specific rate limit
          ratelimit(
               key=OAuthRateLimitConfig.get_provider_key,
               rate=OAuthRateLimitConfig.LIMITS['oauth_provider'],
               method='GET',
               block=True
          ),
          # Global rate limit (prevents distributed attacks)
          ratelimit(
               key=OAuthRateLimitConfig.get_global_key,
               rate=OAuthRateLimitConfig.LIMITS['oauth_global'],
               method='GET',
               block=True
          ),
     ], name='get')
     @wraps(view_func)
     def wrapped_view(*args, **kwargs):
          return view_func(*args, **kwargs)
     
     return wrapped_view

def check_rate_limit_status(request, provider):
     """
     Check current rate limit status without incrementing counters
     
     Args:
          request: Django request object
          provider: OAuth provider name
          
     Returns:
          dict: Rate limit status information
     """
     from django_ratelimit.core import is_ratelimited
     
     ip_address = OAuthRateLimitConfig.get_ip_key('oauth', request)
     provider_key = OAuthRateLimitConfig.get_provider_key('oauth', request)
     
     # Check each rate limit without incrementing
     limits_status = {
          'ip_5min': not is_ratelimited(
               request, group='oauth', fn=lambda r: ip_address, 
               key=lambda r: ip_address, rate='10/5m', increment=False
          ),
          'ip_hourly': not is_ratelimited(
               request, group='oauth', fn=lambda r: ip_address,
               key=lambda r: ip_address, rate='50/1h', increment=False
          ),
          'provider': not is_ratelimited(
               request, group='oauth', fn=lambda r: provider_key,
               key=lambda r: provider_key, rate='100/5m', increment=False
          ),
          'global': not is_ratelimited(
               request, group='oauth', fn=lambda r: 'global',
               key=lambda r: 'global', rate='1000/1h', increment=False
          )
     }
     
     return {
          'allowed': all(limits_status.values()),
          'limits': limits_status,
          'ip': ip_address,
          'provider': provider
     }

class RateLimitMetrics:
     """Utility class for rate limit monitoring and metrics"""
     
     @staticmethod
     def log_rate_limit_metrics(request, provider, success=True):
          """
          Log rate limit metrics for monitoring
          
          Args:
               request: Django request object
               provider: OAuth provider name
               success: Whether the OAuth attempt was successful
          """
          ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
          
          logger.info(
               f"OAuth rate limit metrics",
               extra={
                    'event_type': 'oauth_rate_limit_metrics',
                    'provider': provider,
                    'ip': ip_address,
                    'success': success,
                    'user_agent': request.META.get('HTTP_USER_AGENT', 'Unknown')[:100],
                    'timestamp': request.META.get('HTTP_DATE', ''),
                    'path': request.path
               }
          )
     
     @staticmethod
     def get_rate_limit_headers(request):
          """
          Generate rate limit headers for response
          
          Args:
               request: Django request object
               
          Returns:
               dict: Headers to add to response
          """
          # This would typically integrate with your rate limiting backend
          # to provide remaining attempts, reset time, etc.
          return {
               'X-RateLimit-Limit': '10',
               'X-RateLimit-Remaining': '9',  # Would be calculated dynamically
               'X-RateLimit-Reset': '300',    # Would be calculated dynamically
          }
