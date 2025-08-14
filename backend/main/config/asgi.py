import os, django
from django.core.asgi import get_asgi_application

# Set Django settings FIRST, before any imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')

django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from apps.ws_channel.ws_middleware import JWTAuthMiddleware
from apps.ws_channel.ws_urls import websocket_urlpatterns

# Get the Django ASGI application
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
