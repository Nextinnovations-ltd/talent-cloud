from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from core.constants.constants import ROLES

def create_persisitent_notification(user_id, message):
     Notification.objects.create(user_id=user_id, message=message)

def notify_each_user(user_id, message, destination_url = None):
     # Save in DB
     create_persisitent_notification(user_id, message)
     
     channel_layer = get_channel_layer()
     async_to_sync(channel_layer.group_send)(
          f"user_{user_id}",
          {
               "type": "send_notification", #call the send_notification method from consumer
               "message": message
          }
     )

def notify_user_groups(message, role_list = [ROLES.USER]):
     user_ids = TalentCloudUser.objects.filter(role__name__in=role_list).values_list("id", flat=True)
     
     # store notification for each user in DB
     for user_id in user_ids:
          create_persisitent_notification(user_id, message)
     
     channel_layer = get_channel_layer()
     
     for group in role_list:
          group_name = f"{group}s" # format the group name to align with created groups
          
          async_to_sync(channel_layer.group_send)(
               group_name,
               {
                    "type": "send_notification",
                    "message": message
               }
          )

def send_message_to_chat(chat_id, sender_id, message):
     # Save in DB
     # pass
     
     channel_layer = get_channel_layer()
     
     async_to_sync(channel_layer.group_send)(
          chat_id,
          {
               "type": "send_message",
               "message": message,
               "chat_id": chat_id,
               "sender_id": sender_id,
          }
     )