from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from main.config import health

def default_endpoint(request):
    return HttpResponse("Hello from \'/\'")

urlpatterns = [
    path('api/v1', default_endpoint),
    
    #Health
    path('api/v1/health/', health.health_check, name='health-check'),
    path('api/v1/health/liveness/', health.liveness_check, name='liveness-check'),
    
    # Spectacular - Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Local API
    path('api/v1/', include('apps.authentication.urls')),
    path('api/v1/', include('apps.ni_dashboard.urls')),
    path('api/v1/', include('apps.company_dashboard.urls')),
    path('api/v1/', include('apps.companies.urls')),
    path('api/v1/', include('apps.job_seekers.urls')),
    path('api/v1/', include('apps.job_posting.urls')),
    path('api/v1/', include('apps.ws_channel.urls')),
    path('api/v1/', include('apps.audit_log.urls')),
    path('api/v1/', include('apps.test_app.urls')),
    path('admin/', admin.site.urls),
]
