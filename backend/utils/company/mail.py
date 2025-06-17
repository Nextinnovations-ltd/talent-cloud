from django.conf import settings
from services.notification.mail.mail_service import MailService

def send_company_verification_email(company_email, token, verification_code):
     """
     Sends a verification email to a company email address
     with a verification link and code.

     Args:
          company_email (str): The email address of the company to verify.
          token (str): The unique token for verification.
          verification_code (str): The 6-digit verification code.
     """
     # Construct the verification URL
     verification_url = f"{settings.FRONTEND_BASE_URL}/verify-company?token={token}&code={verification_code}"

     subject = "Verify Your Company Registration"

     message = f"""
     Dear Company Representative,

     Thank you for registering your company with Talent Cloud.

     To complete your registration and verify your company profile, please click on the link below:

     {verification_url}

     Alternatively, you can use the following 6-digit verification code directly on our platform:

     Verification Code: {verification_code}

     Please note that this verification link and code will expire soon.

     If you did not register your company with Talent Cloud, please disregard this email.

     Best regards,
     The Talent Cloud Team
     """

     # Send the email using your helper function or Django's send_mail
     MailService._send_mail(
          subject,
          message,
          [company_email]
     )