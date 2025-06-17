from django.core.mail import send_mail as django_send_mail
from django.conf import settings
from core.middleware.exception_handler import CustomAPIException

class MailService:
     @staticmethod
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