import django
django.setup()

from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from utils.token.jwt import TokenUtil
from apps.users.models import TalentCloudUser

@database_sync_to_async
def get_user_from_token(token):
     try:
          payload = TokenUtil.decode_access_token(token)
          
          return TalentCloudUser.objects.get(id=payload['user_id'])
     except TalentCloudUser.DoesNotExist:
          return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
     # intercept websocket connection and authenticated and authorized the user
     async def __call__(self, scope, receive, send):
          query_string = scope["query_string"].decode()
          token = parse_qs(query_string).get("token", [None])[0]

          scope["user"] = await get_user_from_token(token)
          
          print("user", f"{scope["user"]} - Id: {scope["user"].id}")
          
          return await super().__call__(scope, receive, send)
