import string
import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.users.models import TalentCloudUser
from utils.token.jwt import TokenUtil
from utils.oauth.validation import OAuthValidator
import logging

logger = logging.getLogger(__name__)

class OAuthService:
     @staticmethod
     def perform_oauth_process_and_generate_redirect_url(token_url, payload=None, headers=None, isPost=True, provider=None):
          """
          Common OAuth processing logic
          
          Args:
               token_url: The OAuth provider's token endpoint
               payload: Request payload
               headers: Request headers
               isPost: Whether to use POST or GET request
               provider: OAuth provider name ('facebook', 'google', 'linkedin')
               
          Returns:
               str: Redirect URL with access token
               
          Raises:
               ValidationError: If OAuth process fails
          """
          try:
               if isPost:
                    if not headers:
                         token_response = requests.post(token_url, data=payload, timeout=30)
                    else:
                         token_response = requests.post(token_url, data=payload, headers=headers, timeout=30)
               else:
                    token_response = requests.get(token_url, timeout=30)
               
               token_response.raise_for_status()  # Raise exception for HTTP errors
               token_data = token_response.json()

               if "error" in token_data:
                    logger.error(f"OAuth error: {token_data.get('error_description', token_data['error'])}")
                    raise ValidationError(f"OAuth authentication failed: {token_data.get('error_description', 'Unknown error')}")

               # Additional handler for facebook
               if provider == 'facebook':
                    access_token = token_data.get("access_token")
                    
                    if not access_token:
                         raise ValidationError("No access token received from Facebook")
                    
                    # Fetch user info from Facebook Graph API
                    user_info_url = f'https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/me'
                    
                    params = {
                         'fields': 'id,name,email',
                         'access_token': access_token,
                    }
                    
                    user_response = requests.get(user_info_url, params=params, timeout=30)
                    user_response.raise_for_status()
                    user_info = user_response.json()
                    
                    email = user_info.get("email")
               else:
                    # Google and LinkedIn provide id_token with user info
                    token = token_data["id_token"] if isPost else token_data["access_token"]
                    decoded_user_info = TokenUtil.decode_oauth_access_token(token)
                    email = decoded_user_info.get("email")
               
               if not email:
                    raise ValidationError("Email not provided by OAuth provider")
               
               if not TalentCloudUser.objects.filter(email=email).exists():
                    user = TalentCloudUser.objects.create_user_with_role(email=email, password=None, is_verified=True)
                    logger.info(f"Created new user via {provider} OAuth: {email}")
               else:
                    user = TalentCloudUser.objects.get(email=email)
                    logger.info(f"Existing user logged in via {provider} OAuth: {email}")
               
               access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 5)
               frontend_url = settings.OAUTH_REDIRECT_URL
               
               return f"{frontend_url}?token={access_token}"
               
          except requests.RequestException as e:
               logger.error(f"OAuth request failed: {str(e)}")
               raise ValidationError("OAuth service temporarily unavailable")
          except Exception as e:
               logger.error(f"OAuth process failed: {str(e)}")
               raise ValidationError("Authentication failed")

class GoogleOAuthService:
     @staticmethod
     def process_google_oauth(auth_code) -> str:
          """
          Process Google OAuth authentication
          
          Args:
               auth_code: Authorization code from Google
               
          Returns:
               str: Redirect URL with access token
          """
          # Validate authorization code (additional validation in service layer)
          validated_auth_code = OAuthValidator.validate_auth_code(auth_code, 'google')
               
          # Exchange auth code for access token and user info
          token_url = "https://oauth2.googleapis.com/token"
          
          payload = {
               "code": validated_auth_code,
               "client_id": settings.GOOGLE_CLIENT_ID,
               "client_secret": settings.GOOGLE_CLIENT_SECRET,
               "redirect_uri": settings.GOOGLE_REDIRECT_URI,
               "grant_type": "authorization_code",
          }
          
          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload, provider='google')
          
          return redirect_url
          
class LinkedinOAuthService:
     @staticmethod
     def process_linkedin_oauth(auth_code) -> str:
          """
          Process LinkedIn OAuth authentication
          
          Args:
               auth_code: Authorization code from LinkedIn
               
          Returns:
               str: Redirect URL with access token
          """
          # Validate authorization code (additional validation in service layer)
          validated_auth_code = OAuthValidator.validate_auth_code(auth_code, 'linkedin')
               
          # Exchange auth code for access token and user info
          token_url = "https://www.linkedin.com/oauth/v2/accessToken"
          
          payload = {
               "code": validated_auth_code,
               "client_id": settings.LINKEDIN_CLIENT_ID,
               "client_secret": settings.LINKEDIN_CLIENT_SECRET,
               "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
               "grant_type": "authorization_code",
          }
          
          headers = {'Content-Type': 'application/x-www-form-urlencoded'}

          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload, headers, provider='linkedin')
          
          return redirect_url

class FacebookOAuthService:
     @staticmethod
     def process_facebook_oauth(auth_code) -> str:
          """
          Process Facebook OAuth authentication
          
          Args:
               auth_code: Authorization code from Facebook
               
          Returns:
               str: Redirect URL with access token
          """
          # Validate authorization code (additional validation in service layer)
          validated_auth_code = OAuthValidator.validate_auth_code(auth_code, 'facebook')
               
          # Facebook uses a different approach - we get access_token directly, not id_token
          token_url = f"https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/oauth/access_token?client_id={settings.FACEBOOK_CLIENT_ID}&redirect_uri={settings.FACEBOOK_REDIRECT_URI}&client_secret={settings.FACEBOOK_CLIENT_SECRET}&code={validated_auth_code}"
          
          # Use the common OAuth service method with isPost=False to get access_token
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload=None, headers=None, isPost=False, provider='facebook')
          
          return redirect_url
