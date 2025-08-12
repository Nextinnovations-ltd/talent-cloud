from .base import *
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
ENVIRONMENT = 'staging'

STAGING_SERVER_IP = config('STAGING_SERVER_IP', default='STAGING_SERVER_IP')

ALLOWED_HOSTS = [
     'staging.talentcloud.asia',
     'staging-api.talentcloud.asia',
     STAGING_SERVER_IP,
     'localhost',
     '127.0.0.1',
]

CORS_ALLOW_CREDENTIALS = True

# CORS Settings for staging
CORS_ALLOWED_ORIGINS = [
     "https://staging.talentcloud.asia",
     "https://staging-app.talentcloud.asia", 
     
     # IP-based origins for staging server
     f"https://{STAGING_SERVER_IP}",
     f"http://{STAGING_SERVER_IP}",
     f"https://{STAGING_SERVER_IP}:8000",
     f"http://{STAGING_SERVER_IP}:8000",
     f"https://{STAGING_SERVER_IP}:5173",
     f"http://{STAGING_SERVER_IP}:5173",
    
     "http://localhost:5173",
     "http://localhost:8000",
]

# CSRF settings for IP access
CSRF_TRUSTED_ORIGINS = [
     "https://staging.talentcloud.asia",
     "http://staging.talentcloud.asia",
     f"https://{STAGING_SERVER_IP}",
     f"http://{STAGING_SERVER_IP}",
    
     "http://localhost:5173",
     "http://localhost:8000",
]

# Internal IP for Django Debug Toolbar
INTERNAL_IPS = [
     "127.0.0.1",
     "localhost"
]

DATABASES = {
     'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': config('DB_NAME', default='talentcloud'),
          'USER': config('DB_USER', default='talentclouduser'),
          'PASSWORD': config('DB_PASSWORD', default='default'),
          'HOST': config('DB_HOST', default='localhost'),
          'PORT': config('DB_PORT', default='5432'),
     }
}

# Staging Email Setting
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default="localhost")
EMAIL_PORT = config('EMAIL_PORT', default=1025, cast=int)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default="")
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default="")
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=False, cast=bool)
EMAIL_FROM = config('EMAIL_FROM', default="master@tc.io")

# Celery Configuration
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')

FRONTEND_BASE_URL = config('FRONTEND_BASE_URL', default=f'http://localhost:5173')


#region S3 Credentials

AWS_ACCESS_KEY = config('AWS_ACCESS_KEY')
AWS_SECRET_KEY = config('AWS_SECRET_KEY')
AWS_BUCKET_NAME = config('AWS_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='ap-northeast-1')
AWS_S3_FILE_OVERWRITE = False

#endregion S3 Credentials