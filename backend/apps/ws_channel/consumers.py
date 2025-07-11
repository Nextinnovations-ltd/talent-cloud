import json
from channels.generic.websocket import AsyncWebsocketConsumer
from core.constants.constants import ROLES
from asgiref.sync import sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):
     async def connect(self):
          user = self.scope["user"]
          
          if user.is_authenticated:
               # Added to individual user
               self.user_group = f"user_{user.id}_notifications"
               await self.channel_layer.group_add(self.user_group, self.channel_name)

               role_name = None
               if user.role_id:  # check if user has a role
                    role_obj = await sync_to_async(lambda: user.role)()
                    role_name = role_obj.name if role_obj else None
               
               # Connect to appropriate definied group based on roles
               if role_name == ROLES.ADMIN:
                    self.role_group = f"admins"
                    # print("Group", self.role_group)
               elif role_name == ROLES.SUPERADMIN:
                    self.role_group = f"superadmins"
                    # print("Group", self.role_group)
               else:
                    self.role_group = f"users"
                    # print("Group", self.role_group)
               
               self.group_list = [self.user_group, self.role_group]
               
               # Added to related group
               await self.channel_layer.group_add(self.role_group, self.channel_name)
               await self.accept()
          else:
               await self.close()

     async def disconnect(self, close_code):
          user = self.scope["user"]
          # print("disconnect")
          if user.is_authenticated:
               # disconnect from all joined groups 
               for group in self.group_list:
                    await self.channel_layer.group_discard(group, self.channel_name)

     async def receive(self, text_data):
          data = json.loads(text_data)
          event_type = data.get("type")

          if event_type == "ping":
               await self.send(text_data=json.dumps({"type": "pong"}))

     async def send_notification(self, event):
          payload = event.get("notification", { "message": event.get("message") })
          
          await self.send(text_data=json.dumps({
               "type": "notification",
               **payload
          }))