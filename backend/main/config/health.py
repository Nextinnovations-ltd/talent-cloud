# main/config/health.py
import redis, os, boto3
from django.http import JsonResponse
from django.db import connection
from django.conf import settings
from django.core.mail import get_connection
from django.core.cache import cache
from datetime import datetime
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)

def health_check(request):
     """
     Comprehensive health check endpoint
     """
     checks = {}
     overall_healthy = True
     
     # 1. Database Health Check
     try:
          with connection.cursor() as cursor:
               cursor.execute("SELECT 1")
               cursor.fetchone()
          checks["database"] = "healthy"
     except Exception as e:
          checks["database"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # 2. Redis Health Check
     try:
          if hasattr(settings, 'REDIS_URL') or os.getenv('REDIS_URL'):
               redis_url = getattr(settings, 'REDIS_URL', os.getenv('REDIS_URL'))
               redis_client = redis.from_url(redis_url)
               redis_client.ping()
               checks["redis"] = "healthy"
          else:
               checks["redis"] = "not_configured"
     except Exception as e:
          checks["redis"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # 3. Email Health Check
     try:
          # Test email backend configuration
          email_backend = getattr(settings, 'EMAIL_BACKEND', '')
          
          if 'console' in email_backend.lower():
               checks["email"] = "console_backend"
          elif 'filebased' in email_backend.lower():
               checks["email"] = "file_backend"
          elif 'smtp' in email_backend.lower():
               # Test SMTP connection - Fix variable name conflict
               email_connection = get_connection()  # ✅ Renamed to avoid conflict
               email_connection.open()
               email_connection.close()
               checks["email"] = "healthy"
          else:
               checks["email"] = f"unknown_backend: {email_backend}"
               
     except Exception as e:
          checks["email"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # 4. Cache Health Check
     try:
          # Test Django cache
          test_key = 'health_check_test'
          test_value = 'working'
          cache.set(test_key, test_value, 10)
          cached_value = cache.get(test_key)
          
          if cached_value == test_value:
               checks["cache"] = "healthy"
          else:
               checks["cache"] = "unhealthy: cache read/write failed"
               overall_healthy = False
               
     except Exception as e:
          checks["cache"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # 5. AWS Services Health Check (S3)
     try:
          aws_access_key = getattr(settings, 'AWS_ACCESS_KEY', os.getenv('AWS_ACCESS_KEY'))
          aws_secret_key = getattr(settings, 'AWS_SECRET_KEY', os.getenv('AWS_SECRET_KEY'))
          aws_region = getattr(settings, 'AWS_S3_REGION_NAME', os.getenv('AWS_S3_REGION_NAME'))
          aws_bucket = getattr(settings, 'AWS_BUCKET_NAME', os.getenv('AWS_BUCKET_NAME'))
          
          if aws_access_key and aws_secret_key and aws_bucket:
               s3_client = boto3.client(
                    's3',
                    region_name=aws_region,
                    aws_access_key_id=aws_access_key,
                    aws_secret_access_key=aws_secret_key
               )
               # Test bucket access
               s3_client.head_bucket(Bucket=aws_bucket)
               checks["aws_s3"] = "healthy"
          else:
               checks["aws_s3"] = "not_configured"
               
     except ClientError as e:
          error_code = e.response['Error']['Code']
          checks["aws_s3"] = f"unhealthy: {error_code}"
          overall_healthy = False
     except Exception as e:
          checks["aws_s3"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # 6. Celery Health Check
     try:
          from celery import current_app
          
          # Check if Celery is configured
          broker_url = getattr(settings, 'CELERY_BROKER_URL', '')
          if broker_url:
               # Test broker connection
               with current_app.connection() as conn:
                    conn.ensure_connection(max_retries=1)
               checks["celery"] = "healthy"
          else:
               checks["celery"] = "not_configured"
               
     except Exception as e:
          checks["celery"] = f"unhealthy: {str(e)}"
          overall_healthy = False
     
     # ✅ Fixed Summary Calculation
     def categorize_status(status_value):
          """Categorize health check status"""
          status_lower = status_value.lower()
          if 'unhealthy' in status_lower or 'critical' in status_lower:
               return 'unhealthy'
          elif 'healthy' in status_lower or 'console_backend' in status_lower or 'file_backend' in status_lower or 'not_configured' in status_lower:
               return 'healthy'
          else:
               return 'unknown'
     
     # Count healthy and unhealthy checks
     healthy_count = 0
     unhealthy_count = 0
     unknown_count = 0
     
     for check_name, check_status in checks.items():
          category = categorize_status(check_status)
          if category == 'healthy':
               healthy_count += 1
          elif category == 'unhealthy':
               unhealthy_count += 1
          else:
               unknown_count += 1
     
     # Build health response
     health_data = {
          "status": "healthy" if overall_healthy else "unhealthy",
          "timestamp": datetime.now().isoformat(),
          "version": getattr(settings, 'APP_VERSION', '1.0.0'),
          "environment": os.getenv('ENV', 'development'),
          "checks": checks,
          "summary": {
               "total_checks": len(checks),
               "healthy_checks": healthy_count,
               "unhealthy_checks": unhealthy_count,
               "unknown_checks": unknown_count
          }
     }
     
     status_code = 200 if overall_healthy else 503
     return JsonResponse(health_data, status=status_code)

def liveness_check(request):
     """
     Simple liveness check - just returns OK
     """
     return JsonResponse({
          "alive": True,
          "timestamp": datetime.now().isoformat(),
          "pid": os.getpid()
     })

def readiness_check(request):
     """
     Readiness check - ensures app is ready to serve traffic
     """
     try:
          # Check essential services only
          essential_checks = {}
          ready = True
          
          # Database check
          with connection.cursor() as cursor:
               cursor.execute("SELECT COUNT(*) FROM django_migrations")
               migration_count = cursor.fetchone()[0]
               essential_checks["migrations"] = f"{migration_count} applied"
          
          # Cache check
          cache.set('readiness_test', 'ok', 5)
          if cache.get('readiness_test') == 'ok':
               essential_checks["cache"] = "ready"
          else:
               essential_checks["cache"] = "not_ready"
               ready = False
          
          response_data = {
               "ready": ready,
               "timestamp": datetime.now().isoformat(),
               "checks": essential_checks
          }
          
          return JsonResponse(response_data, status=200 if ready else 503)
          
     except Exception as e:
          return JsonResponse({
               "ready": False,
               "error": str(e),
               "timestamp": datetime.now().isoformat()
          }, status=503)