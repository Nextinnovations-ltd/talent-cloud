from rest_framework.views import APIView
from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Chat
from rest_framework.response import Response
from apps.ws_channel.serializers import ChatListSerializer, ChatSerializer
from core.middleware.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from utils.response import CustomResponse
from django.db import transaction
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Chat"])
class UserChatListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     
     def get_talent_cloud_user(self):
          return self.request.user
     
     def get(self, request):
          chat_list = []
          user = self.get_talent_cloud_user()
          
          if user.chat_rooms.exists():
               chats = list(user.chat_rooms.all())
               chat_list = ChatListSerializer(chats, many=True)
               
          return Response(CustomResponse.success("Chat List information retrieved successfully", chat_list.data))

@extend_schema(tags=["Chat"])
class ChatRoomInfoAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     
     def get_talent_cloud_user(self):
          return self.request.user
     
     def get(self, request, receiver_id):
          sender = self.get_talent_cloud_user()
          receiver = TalentCloudUser.objects.get(id=receiver_id)
          
          if sender == receiver:
               raise ValidationError("User can't send message to itself.")
          
          chat_room = Chat.objects.filter(
               participants=sender
          ).filter(
               participants=receiver
          ).first()
          
          if not chat_room:
               with transaction.atomic():
                    chat_room = Chat.objects.create()
                    chat_room.participants.add(sender, receiver)
          
          chat_response = ChatSerializer(chat_room)
          
          return Response(CustomResponse.success("Chatroom information retrieved successfully", chat_response.data))
