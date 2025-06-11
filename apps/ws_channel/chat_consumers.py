import json
from apps.ws_channel.redis.redis_constants import REDIS_CONSTS
from .redis.redis_client import redis_client
from django.db import transaction
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
     async def connect(self):
          user = self.scope['user']
          
          if not user.is_authenticated:
               await self.close()
               return
          
          self.user_id = str(user.id)
          self.user_chat_rooms = await self.get_user_chat_rooms(user)
          
          print(f"{ user.email } conntected_rooms", self.user_chat_rooms)
          
          if not self.user_chat_rooms:
               print(f"Not room existed for {user.email}")
               await self.close()
               return
          
          redis_client.sadd(REDIS_CONSTS.ONLINE_USERS, self.user_id)
          
          for room in self.user_chat_rooms:
               await self.channel_layer.group_add(room, self.channel_name)
          
          await self.accept()
          
          # Deliver unsend message if any exists
          buffer_key = f"{REDIS_CONSTS.UNDELIVERED_MESSAGES}:{self.user_id}"
          
          MAX_RETRIES = 3
          
          while redis_client.llen(buffer_key) > 0:
               raw_msg = redis_client.lpop(buffer_key)

               if raw_msg:
                    msg_obj = json.loads(raw_msg)
                    retry_count = msg_obj.get("retry_count", 0)
                    
                    count = count+1
                    
                    try:
                         await self.send(text_data=json.dumps(msg_obj))
                    except Exception as e:
                         if retry_count < MAX_RETRIES:
                              msg_obj["retry_count"] = retry_count + 1
                              redis_client.rpush(buffer_key, json.dumps(msg_obj))
                              print(f"Retry {retry_count+1}/{MAX_RETRIES} for message to {self.user_id}")
                         else:
                              print(f"Message dropped after {MAX_RETRIES} retries for user {self.user_id}")

     async def disconnect(self, close_code):
          print(f"User:{self.user_id} disconnected.")
          for room in self.user_chat_rooms:
               
               print(f"Disconnected from {room}")
               
               await self.channel_layer.group_discard(f"{room}", self.channel_name)
          
          redis_client.srem(REDIS_CONSTS.ONLINE_USERS, str(self.user_id))

     async def receive(self, text_data):
          user = self.scope['user']
          
          data = json.loads(text_data)
          
          message = data['message']
          sender_id = user.id
          chat_id = data['chat_id']

          # left validation for user sending to their related chat room.
          if chat_id not in self.user_chat_rooms:
               print("No matched room")
               return

          await self.save_message(chat_id, sender_id, message)
          
          message_event = {
               'type': 'send_message',
               'message': message,
               'sender_id': sender_id,
               'chat_id': chat_id,
          }

          await self.channel_layer.group_send(chat_id, message_event)
          
          recipient_ids = await self.get_recipient_ids(chat_id, sender_id)
          
          for rid in recipient_ids:
               # check user is offline or not
               if not redis_client.sismember(REDIS_CONSTS.ONLINE_USERS, str(rid)):
                    retry_message_event = {
                         **message_event,
                         "retry_count": 0,
                    }
                                        
                    redis_client.rpush(f"{REDIS_CONSTS.UNDELIVERED_MESSAGES}:{rid}", json.dumps(retry_message_event))

     async def send_message(self, event):
          await self.send(text_data=json.dumps({
               'message': event['message'],
               'sender_id': event['sender_id'],
               'chat_id': event['chat_id'],
          }))
     
     @database_sync_to_async     
     def get_recipient_ids(self, chat_id, sender_id):
          from apps.ws_channel.models import Chat
          chat =  Chat.objects.get(uuid=chat_id)
          recipients = [str(user.id) for user in chat.participants.exclude(id=sender_id)]
          
          return recipients

     @database_sync_to_async
     def save_message(self, chat_id, sender_id, message):
          from apps.ws_channel.models import Chat, Message
          with transaction.atomic():
               chat = Chat.objects.get(uuid=chat_id)
               return Message.objects.create(chat=chat, sender_id=sender_id, message=message)

     @database_sync_to_async
     def get_user_chat_rooms(self, user):
          # Customize based on your model logic
          return [str(uuid) for uuid in user.chat_rooms.values_list("uuid", flat=True)]