from django.conf import settings
from apps.companies.models import VerifyRegisteredCompany
from apps.users.models import VerifyLoggedInUser, VerifyRegisteredUser
from utils.token.jwt import TokenUtil

class AuthEmailService:
     @staticmethod
     def verify_user_registration(email):
          """ Generate User verification code and verification token to validate the correct user.
               Expired time limit can be set and default is 60 seconds.
          """
          verification_code = TokenUtil.generate_verification_code()
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(60)
          
          VerifyRegisteredUser.objects.create(email=email, token=token, verification_code=verification_code, expired_at=expired_at)
          
          # Send Mail to user
          from utils.user.custom_mail_types import send_verification_email
          send_verification_email(email, token, verification_code)
          
          return token
     
     @staticmethod
     def verify_user_loggedin(email):
          """ Generate User verification code and verification token to validate the correct user.
               Expired time limit can be set and default is 300 seconds(5 minutes).
          """
          verification_code = TokenUtil.generate_verification_code()
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(300)
          
          VerifyLoggedInUser.objects.create(email=email, token=token, verification_code=verification_code, expired_at=expired_at)
          
          # Send Mail to user
          from utils.user.custom_mail_types import send_logged_in_verification_email
          send_logged_in_verification_email(email, token, verification_code)
          
          return token

     @staticmethod
     def send_password_reset_email(email, token):
          reset_url = f"{settings.FRONTEND_BASE_URL}/auth/reset-password?token={token}"

          from utils.user.custom_mail_types import send_password_reset_email
          send_password_reset_email(email, reset_url)

     @staticmethod
     def send_password_reset_success_email(email):
          from utils.user.custom_mail_types import send_password_reset_success_email
          send_password_reset_success_email(email)
     
     @staticmethod
     def verify_company_registration(email):
          """ Generate Company verification code and verification token to validate the correct company.
               Expired time limit can be set and default is 60 seconds.
          """
          verification_code = TokenUtil.generate_verification_code()
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(300)
          
          VerifyRegisteredCompany.objects.create(email=email, token=token, verification_code=verification_code, expired_at=expired_at)
          
          # Send Mail to company mail
          from utils.company.mail import send_company_verification_email
          send_company_verification_email(email, token, verification_code)
          
          return token