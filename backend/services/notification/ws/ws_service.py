from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from core.constants.constants import ROLES


class WsService:
     @staticmethod
     def notify_each_user(user_id, message, destination_url = None, title = None, notification_type = None):
          notification_data = {
               "message": message,
               "title": title or "Notification",
               "url": destination_url,
               "type": notification_type or "generic"
          }
          
          # Save in DB
          WsService.create_persisitent_notification(user_id, message)
          
          channel_layer = get_channel_layer()
          async_to_sync(channel_layer.group_send)(
               f"user_{user_id}",
               {
                    "type": "send_notification", #call the send_notification method from consumer
                    "notification": notification_data
               }
          )

     @staticmethod
     def notify_user_groups(message, role_list = [ROLES.USER], destination_url = None, title = None, notification_type = None):
          notification_data = {
               "message": message,
               "title": title or "Group Notification",
               "url": destination_url,
               "type": notification_type or "group_generic"
          }
          
          user_ids = TalentCloudUser.objects.filter(role__name__in=role_list).values_list("id", flat=True)
          
          # store notification for each user in DB
          for user_id in user_ids:
               WsService.create_persisitent_notification(user_id, message, title, destination_url, notification_type)
          
          channel_layer = get_channel_layer()
          
          for group in role_list:
               group_name = f"{group}s" # format the group name to align with created groups
               
               async_to_sync(channel_layer.group_send)(
                    group_name,
                    {
                         "type": "send_notification",
                         "notification": notification_data
                    }
               )
     
     @staticmethod
     def create_persisitent_notification(user_id, message, title = None, destination_url = None, notification_type = None):
          Notification.objects.create(user_id=user_id, message=message)