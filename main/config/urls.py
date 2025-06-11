from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls
from django.http import HttpResponse
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from fcm_django.api.rest_framework import FCMDeviceViewSet

def default_endpoint(request):
    return HttpResponse("Hello from \'/\'")

router = DefaultRouter()
router.register(r'devices', FCMDeviceViewSet)

urlpatterns = [
    path('', default_endpoint),
    # Spectacular - Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # FCM Device API
    path('api/v1/fcm/', include(router.urls)),
    
    # OAuth
    # path('api/v1/auth/accounts/', include('allauth.urls')),

    # Local API
    path('api/v1/', include('apps.authentication.urls')),
    path('api/v1/', include('apps.ni_super_admin.urls')),
    path('api/v1/', include('apps.companies.urls')),
    path('api/v1/', include('apps.job_seekers.urls')),
    path('api/v1/', include('apps.job_posting.urls')),
    path('api/v1/', include('apps.ws_channel.urls')),
    path('api/v1/', include('apps.audit_log.urls')),
    path('admin/', admin.site.urls),
] + debug_toolbar_urls()
