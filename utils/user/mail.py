from django.conf import settings
from django.core.mail import send_mail as django_send_mail

from core.middleware.exception_handler import CustomAPIException

def send_verification_email(email, token, verification_code):
     verification_url = f"{settings.FRONTEND_BASE_URL}/auth/verifyemail?token={token}"

     subject = "Please verify your email address"
     message = f"""
     Thank you for registering with us. Please click the link below to verify your email address:

     {verification_url}
     
     Here is 6 digit code to verify your registration and complete your registration:
     
     {verification_code}


     If you did not register for an account, please ignore this email.

     Best regards,
     Talent Cloud Team
     """
     _send_mail(
          subject,
          message,
          [email]
     )

def send_logged_in_verification_email(email, token, verification_code):
     """
     Sends a verification email to a logged-in user's email address
     with a verification link and code for email address verification.

     Args:
          email (str): The email address of the user to verify.
          token (str): The unique token for verification.
          verification_code (str): The 6-digit verification code.
     """
     verification_url = f"{settings.FRONTEND_BASE_URL}/verify-email?token={token}&code={verification_code}"

     subject = "Verify Your Email Address"

     message = f"""
     Dear User,

     Thank you for using Talent Cloud. To verify your email address, please follow these steps:

     1. Click on the link below to start the verification process:
          {verification_url}

     2. You will be prompted to enter the following 6-digit verification code to confirm your email:

          Verification Code: {verification_code}

     Please note that this verification link and code will expire in 5 minutes.

     If you did not request this email, please disregard it.

     Best regards,
     The Talent Cloud Team
     """

     # Send the email using your helper function or Django's send_mail
     _send_mail(
          subject,
          message,
          [email]
     )

def send_password_reset_email(email, reset_url):
     subject = "Password Reset Request"
     message = f"""
     We received a request to reset your password. Please click the link below to reset your password:

     {reset_url}

     If you did not request a password reset, please ignore this email.

     Best regards,
     Talent Cloud Team
     """
     
     _send_mail(
          subject,
          message,
          [email]
     )

def send_password_reset_success_email(email):
     subject = "Your Password Has Been Reset Successfully"
     message = f"""
     Hello,

     This is a confirmation that your password has been successfully reset.

     If you did not perform this action, please contact our support team immediately.

     Best regards,  
     Talent Cloud Team
     """
     
     _send_mail(
          subject,
          message,
          [email],
     )

def _send_mail(subject, message, recipient_list):
     """ Sending email with no template design using django 
     email backend.
     Args:
     subject 
     message
     recipient_list
     """
     try:
          django_send_mail(
               subject,
               message,
               from_email=settings.EMAIL_FROM,
               recipient_list=recipient_list
          )
     except Exception as e:
          print(f"Error sending mail {str(e)}")
          raise CustomAPIException(detail="Error Sending Email")