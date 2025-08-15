import redis, os
from django.http import JsonResponse
from django.db import connection
from django.conf import settings
from datetime import datetime

def health_check(request):
     """
     Simple health check endpoint
     """
     try:
          # Check database connection
          with connection.cursor() as cursor:
               cursor.execute("SELECT 1")
          
          db_status = "healthy"
     except Exception as e:
          db_status = f"unhealthy: {str(e)}"
     
     # Check Redis connection (if configured)
     redis_status = "not_configured"
     
     try:
          if hasattr(settings, 'REDIS_URL') or os.getenv('REDIS_URL'):
               redis_client = redis.from_url(settings.REDIS_URL if hasattr(settings, 'REDIS_URL') else os.getenv('REDIS_URL'))
               redis_client.ping()
               redis_status = "healthy"
     except Exception as e:
          redis_status = f"unhealthy: {str(e)}"
     
     health_data = {
          "status": "healthy" if db_status == "healthy" else "unhealthy",
          "timestamp": datetime.now().isoformat(),
          "version": getattr(settings, 'APP_VERSION', '1.0.0'),
          "environment": os.getenv('ENV', 'development'),
          "checks": {
               "database": db_status,
               "redis": redis_status,
          }
     }
     
     status_code = 200 if health_data["status"] == "healthy" else 503
     return JsonResponse(health_data, status=status_code)

def liveness_check(request):
     """
     Simple liveness check - just returns OK
     """
     return JsonResponse({
          "alive": True,
          "timestamp": datetime.now().isoformat()
     })