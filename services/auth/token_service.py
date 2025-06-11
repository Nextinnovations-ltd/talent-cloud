from rest_framework.exceptions import ValidationError
from apps.job_seekers.models import JobSeeker
from apps.users.models import TalentCloudUser
from utils.token.jwt import TokenUtil
from utils.user.user import check_auto_generated_username

class TokenService:
     
     @staticmethod
     def refresh_access_token(refresh_token):
          try:
               payload = TokenUtil.decode_refresh_token(refresh_token)
               token = TokenUtil.generate_access_token(payload['user_id'], payload['role'], 5)
               
               return token
          except Exception as e:
               raise ValidationError(f"Error generating token: {str(e)}")

     @staticmethod
     def authenticate_token(token):
          """
          Decodes the access token and fetches the user. 
          Returns the user object if the token is valid.
          """
          try:
               decoded_token = TokenUtil.decode_access_token(token)
               user = TalentCloudUser.objects.get(pk=decoded_token['user_id'])
               
               return user
          except TalentCloudUser.DoesNotExist:
               raise ValidationError("Access token is invalid.")
          except Exception as e:
               raise Exception(f"An error occurred while authenticating token: {str(e)}")
     
     @staticmethod
     def verify_token_and_generate_refresh_token(token):
          """
          Verifies the token, retrieves the user, and generates a refresh token.
          Returns a tuple (user_role, onboarding_step, is_generated_username, refresh_token).
          """
          try:
               # Decode the token
               decoded_token = TokenUtil.decode_access_token(token)
               
               # Retrieve the user
               user = JobSeeker.objects.get(pk=decoded_token['user_id'])
               
               # Get the user's role and additional info
               user_role = user.role.name
               onboarding_step = user.onboarding_step if user_role == "USER" else None
               is_generated_username = check_auto_generated_username(user.username)
               
               # Generate refresh token
               refresh_token = TokenUtil.generate_refresh_token(user.pk, user.role.name)
               
               return user_role, onboarding_step, is_generated_username, refresh_token
          except JobSeeker.DoesNotExist:
               raise ValidationError("Access token is invalid.")
          except Exception as e:
               raise Exception(f"An error occurred while processing the token: {str(e)}")
          