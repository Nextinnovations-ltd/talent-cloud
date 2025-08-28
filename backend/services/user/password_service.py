from django.conf import settings
from apps.users.models import PasswordReset
from utils.token.jwt import TokenUtil

class PasswordService:
     @staticmethod
     def create_password_reset(email):
          """ Generate Password Reset Code

          Args:
               email: string
          Returns:
               token
          """
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(settings.PASSWORD_RESET_REQUEST_EXPIRATION_TIME)
          
          # Add password request to database
          PasswordReset.objects.create(email=email, token=token, expired_at=expired_at)
          
          return token

     @staticmethod
     def regenerate_password_reset(email, reset_request):
          """ Regenerate Password Reset Code

          Args:
               email: string
               reset_request: object
          Returns:
               token
          """
          expired_at = TokenUtil.generate_expiration_time(settings.PASSWORD_RESET_REQUEST_EXPIRATION_TIME)
          
          # Update password request expiration time in database
          reset_request.expired_at = expired_at
          reset_request.save()
          
          return reset_request.token
