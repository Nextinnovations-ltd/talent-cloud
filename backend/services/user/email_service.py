from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from apps.companies.models import VerifyRegisteredCompany
from apps.users.models import VerifyLoggedInUser, VerifyRegisteredUser
from apps.job_seekers.models import JobSeeker
from utils.token.jwt import TokenUtil

import logging

logger = logging.getLogger(__name__)

class AuthEmailService:
     @staticmethod
     def verify_user_registration(email):
          """ Generate User verification code and verification token to validate the correct user.
               Expired time limit can be set and default is 60 seconds.
          """
          verification_code = TokenUtil.generate_verification_code()
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(settings.VERIFICATION_EXPIRATION_TIME)
          
          VerifyRegisteredUser.objects.create(email=email, token=token, verification_code=verification_code, expired_at=expired_at)
          
          # Send Mail to user
          AuthEmailService.send_verify_registration_email_with_template(email, verification_code, token)
          
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
     def send_password_reset_email_with_template(user: JobSeeker, reset_token):
          """Send password reset email"""
          try:
               subject = f"Password Reset Request"
               
               context = {
                    'user_name': user.name or user.username,
                    'reset_link': f"{settings.FRONTEND_BASE_URL}/auth/reset-password?token={reset_token}"
               }
               
               # Render email templates
               html_message = render_to_string('emails/user/reset_password.html', context)
               # text_message = render_to_string('emails/invitation.txt', context)
               
               # Send email
               send_mail(
                    subject=subject,
                    message="",
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False
               )
               
               logger.info(f"Invitation email sent to {user.email}")
               
          except Exception as e:
               logger.error(f"Failed to send invitation email to {user.email}: {str(e)}")
               raise
          
     @staticmethod
     def send_verify_registration_email_with_template(email, verification_code, verification_token):
          """Send user verification email"""
          try:
               subject = f"Verify Registration"
               
               context = {
                    'verification_code': verification_code,
                    'verification_link': f"{settings.FRONTEND_BASE_URL}/auth/verifyemail?token={verification_token}"
               }
               
               # Render email templates
               html_message = render_to_string('emails/user/verify_registration.html', context)
               # text_message = render_to_string('emails/invitation.txt', context)
               
               # Send email
               send_mail(
                    subject=subject,
                    message="",
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False
               )
               
               logger.info(f"Invitation email sent to {email}")
               
          except Exception as e:
               logger.error(f"Failed to send invitation email to {email}: {str(e)}")
               raise

     @staticmethod
     def send_password_reset_success_email(email, user):
          try:
               subject = "Your Password Has Been Reset Successfully"
               
               context = {
                    'user_name': user.name or user.username
               }
               
               # Render email templates
               html_message = render_to_string('emails/user/password_reset_success.html', context)
               # text_message = render_to_string('emails/invitation.txt', context)
               
               # Send email
               send_mail(
                    subject=subject,
                    message="",
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False
               )
               
               logger.info(f"Password reset success email sent to {email}")
               
          except Exception as e:
               logger.error(f"Failed to send password reset succeess email to {email}: {str(e)}")
               raise
     
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