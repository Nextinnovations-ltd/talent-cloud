import string
import requests
from django.conf import settings
from rest_framework.response import Response
from apps.users.models import TalentCloudUser
from utils.token.jwt import TokenUtil

class OAuthService:
     def perform_oauth_process_and_generate_redirect_url(token_url, payload= None, headers = None, isPost = True):
          if isPost:
               if not headers:
                    token_response = requests.post(token_url, data=payload)
               else:
                    token_response = requests.post(token_url, data=payload, headers=headers)
          else:
               token_response = requests.get(token_url)
                    
          token_data = token_response.json()

          if "error" in token_data:
               return Response({"error": token_data["error"]}, status=400)

          token = token_data["id_token"] if isPost else token_data["access_token"]

          decoded_user_info = TokenUtil.decode_oauth_access_token(token)
          
          email = decoded_user_info.get("email")
          
          if not TalentCloudUser.objects.filter(email=email).exists():
               user = TalentCloudUser.objects.create_user_with_role(email=email, password=None, is_verified = True)
          else:
               user = TalentCloudUser.objects.get(email=email)
          
          access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 5)

          frontend_url = settings.OAUTH_REDIRECT_URL
          
          return f"{frontend_url}?token={access_token}"

class GoogleOAuthService:
     @staticmethod
     def process_google_oauth(auth_code) -> string:
          # Exchange auth code for access token and user info
          token_url = "https://oauth2.googleapis.com/token"
          
          payload = {
               "code": auth_code,
               "client_id": settings.GOOGLE_CLIENT_ID,
               "client_secret": settings.GOOGLE_CLIENT_SECRET,
               "redirect_uri": "http://localhost:8000/api/v1/auth/accounts/google",
               "grant_type": "authorization_code",
          }
          
          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload)
          
          return redirect_url
          
class LinkedinOAuthService:
     @staticmethod
     def process_linkedin_oauth(auth_code) -> string:
          # Exchange auth code for access token and user info
          token_url = "https://www.linkedin.com/oauth/v2/accessToken"
          
          payload = {
               "code": auth_code,
               "client_id": settings.LINKEDIN_CLIENT_ID,
               "client_secret": settings.LINKEDIN_CLIENT_SECRET,
               "redirect_uri": "http://localhost:8000/api/v1/auth/accounts/linkedin",
               "grant_type": "authorization_code",
          }
          
          headers = {'Content-Type': 'application/x-www-form-urlencoded'}

          # Exchange code with access token and decode the token for user information
          redirect_url = OAuthService.perform_oauth_process_and_generate_redirect_url(token_url, payload, headers)
          
          return redirect_url

class FacebookOAuthService:
     @staticmethod
     def process_facebook_oauth(auth_code) -> string:
          token_url = f"https://graph.facebook.com/v22.0/oauth/access_token?client_id={settings.FACEBOOK_CLIENT_ID}&redirect_uri=http://localhost:8000/api/v1/auth/accounts/facebook&client_secret={settings.FACEBOOK_CLIENT_SECRET}&code={auth_code}"
          
          # region Perform facebook authentication and get access token
          token_response = requests.get(token_url)
          token = token_response.json().get('access_token')
          # endregion Perform facebook authentication and get access token
          
          # region Get Authenticated user information
          user_info_url = 'https://graph.facebook.com/v22.0/me'
          
          params = {
               'fields': 'id,name,email',
               'access_token': token,
          }
          
          # Get authenticated user information
          response = requests.get(user_info_url, params=params)
          # endregion Get Authenticated user information

          email = response.json().get("email")

          if not TalentCloudUser.objects.filter(email=email).exists():
               user = TalentCloudUser.objects.create_user_with_role(email=email, password=None, is_verified = True)
          else:
               user = TalentCloudUser.objects.get(email=email)
          
          access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 5)

          frontend_url = settings.OAUTH_REDIRECT_URL
          
          return f"{frontend_url}?token={access_token}"
