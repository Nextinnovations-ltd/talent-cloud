from utils.notification.types import NotificationType
from services.notification.mail.mail_service import MailService
from services.notification.ws.ws_service import WsService

class NotificationDispatcher:
     def __init__(self, *, email=True, websocket=True):
          self.email = email
          self.websocket = websocket

     def send(self, user, notification_type: NotificationType, context: dict):
          """
          user: User model instance to receive the notification
          notification_type: Enum value of NotificationType
          context: Dictionary of dynamic content (title, message, etc.)
          """
          if self.email:
               MailService._send_mail(user, notification_type, context)

          if self.websocket:
               WsService.notify_each_user(user, notification_type, context)
