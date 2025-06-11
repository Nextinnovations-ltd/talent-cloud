import os
from decouple import config
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from apps.ws_channel.ws_urls import websocket_urlpatterns
from apps.ws_channel.ws_middleware import JWTAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', config('DJANGO_SETTINGS_MODULE', default='main.config.settings.development'))

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})

# application = get_asgi_application()
