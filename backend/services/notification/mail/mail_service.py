from django.core.mail import send_mail as django_send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from core.middleware.exception_handler import CustomAPIException
import logging

logger = logging.getLogger(__name__)

class MailService:
     @staticmethod
     def _send_mail(subject, message, recipient_list, html_content=None):
          """ 
          Send email with optional HTML content using Django email backend.
          
          Args:
              subject: Email subject
              message: Plain text message
              recipient_list: List of recipient emails
              html_content: Optional HTML content for rich emails
          """
          try:
               if html_content:
                    # Send HTML email
                    email = EmailMultiAlternatives(
                         subject=subject,
                         body=message,
                         from_email=settings.EMAIL_FROM,
                         to=recipient_list
                    )
                    email.attach_alternative(html_content, "text/html")
                    email.send()
               else:
                    # Send plain text email
                    django_send_mail(
                         subject,
                         message,
                         from_email=settings.EMAIL_FROM,
                         recipient_list=recipient_list
                    )
                    
               logger.info(f"Email sent successfully to {len(recipient_list)} recipients")
               
          except Exception as e:
               logger.error(f"Error sending mail: {str(e)}")
               raise CustomAPIException(detail="Error Sending Email")
     
     @staticmethod
     def send_template_email(subject, template_name, context, recipient_list):
          """
          Send email using HTML template
          
          Args:
              subject: Email subject
              template_name: Template file name (e.g., 'emails/notification.html')
              context: Template context dictionary
              recipient_list: List of recipient emails
          """
          try:
               # Render HTML content
               html_content = render_to_string(template_name, context)
               
               # Create plain text fallback from HTML (basic version)
               plain_text = context.get('message', subject)
               
               MailService._send_mail(
                    subject=subject,
                    message=plain_text,
                    recipient_list=recipient_list,
                    html_content=html_content
               )
               
          except Exception as e:
               logger.error(f"Error sending template email: {str(e)}")
               raise CustomAPIException(detail="Error Sending Template Email")