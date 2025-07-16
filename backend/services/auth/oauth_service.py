import string
import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.users.models import TalentCloudUser
from utils.token.jwt import TokenUtil
import logging

logger = logging.getLogger(__name__)

class OAuthService:
     @staticmethod
     def perform_oauth_process_and_generate_redirect_url(token_url, payload=None, headers=None, isPost=True):
          """
          Common OAuth processing logic
          
          Args:
               token_url: The OAuth provider's token endpoint
               payload: Request payload
               headers: Request headers
               isPost: Whether to use POST or GET request
               
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

               token = token_data["id_token"] if isPost else token_data["access_token"]

               decoded_user_info = TokenUtil.decode_oauth_access_token(token)
               
               email = decoded_user_info.get("email")
               
               if not email:
                    raise ValidationError("Email not provided by OAuth provider")
               
               if not TalentCloudUser.objects.filter(email=email).exists():
                    user = TalentCloudUser.objects.create_user_with_role(email=email, password=None, is_verified=True)
                    logger.info(f"Created new user via OAuth: {email}")
               else:
                    user = TalentCloudUser.objects.get(email=email)
                    logger.info(f"Existing user logged in via OAuth: {email}")
               
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
          if not auth_code:
               raise ValidationError("Authorization code is required")
               
          # Exchange auth code for access token and user info
          token_url = "https://oauth2.googleapis.com/token"
          
          payload = {
               "code": auth_code,
               "client_id": settings.GOOGLE_CLIENT_ID,
               "client_secret": settings.GOOGLE_CLIENT_SECRET,
               "redirect_uri": settings.GOOGLE_REDIRECT_URI,
               "grant_type": "authorization_code",
          }
          
          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload)
          
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
          if not auth_code:
               raise ValidationError("Authorization code is required")
               
          # Exchange auth code for access token and user info
          token_url = "https://www.linkedin.com/oauth/v2/accessToken"
          
          payload = {
               "code": auth_code,
               "client_id": settings.LINKEDIN_CLIENT_ID,
               "client_secret": settings.LINKEDIN_CLIENT_SECRET,
               "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
               "grant_type": "authorization_code",
          }
          
          headers = {'Content-Type': 'application/x-www-form-urlencoded'}

          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload, headers)
          
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
          if not auth_code:
               raise ValidationError("Authorization code is required")
               
          token_url = f"https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/oauth/access_token?client_id={settings.FACEBOOK_CLIENT_ID}&redirect_uri={settings.FACEBOOK_REDIRECT_URI}&client_secret={settings.FACEBOOK_CLIENT_SECRET}&code={auth_code}"
          
          try:
               # region Perform facebook authentication and get access token
               token_response = requests.get(token_url, timeout=30)
               token_response.raise_for_status()
               
               token_data = token_response.json()
               if "error" in token_data:
                    logger.error(f"Facebook OAuth error: {token_data.get('error_description', token_data['error'])}")
                    raise ValidationError(f"Facebook authentication failed: {token_data.get('error_description', 'Unknown error')}")
                    
               token = token_data.get('access_token')
               if not token:
                    raise ValidationError("No access token received from Facebook")
               # endregion Perform facebook authentication and get access token
               
               # region Get Authenticated user information
               user_info_url = f'https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/me'
               
               params = {
                    'fields': 'id,name,email',
                    'access_token': token,
               }
               
               # Get authenticated user information
               response = requests.get(user_info_url, params=params, timeout=30)
               response.raise_for_status()
               user_info = response.json()
               # endregion Get Authenticated user information

               email = user_info.get("email")
               if not email:
                    raise ValidationError("Email not provided by Facebook")

               if not TalentCloudUser.objects.filter(email=email).exists():
                    user = TalentCloudUser.objects.create_user_with_role(email=email, password=None, is_verified=True)
                    logger.info(f"Created new user via Facebook OAuth: {email}")
               else:
                    user = TalentCloudUser.objects.get(email=email)
                    logger.info(f"Existing user logged in via Facebook OAuth: {email}")
               
               access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 5)

               frontend_url = settings.OAUTH_REDIRECT_URL
               
               return f"{frontend_url}?token={access_token}"
               
          except requests.RequestException as e:
               logger.error(f"Facebook OAuth request failed: {str(e)}")
               raise ValidationError("Facebook service temporarily unavailable")
          except Exception as e:
               logger.error(f"Facebook OAuth process failed: {str(e)}")
               raise ValidationError("Facebook authentication failed")
