from .base import *
from decouple import config as decouple_config, Config, RepositoryEnv
import os

# Load only development-specific environment file
dev_env = os.path.join(BASE_DIR, '.env.staging')

_LOADED_FLAG = f"_DEV_ENV_LOADED_{id(dev_env)}"

try:
     if os.path.exists(dev_env):
          config = Config(RepositoryEnv(dev_env))
          if _LOADED_FLAG not in os.environ:
               print(f"🔧 Staging: Loaded .env.staging")
               os.environ[_LOADED_FLAG] = "true"
     else:
          # Use the default decouple config function
          config = decouple_config
          if _LOADED_FLAG not in os.environ:
               print(f"⚠️ Staging: .env.staging not found, using system environment")
               os.environ[_LOADED_FLAG] = "true"
except Exception as e:
     print(f"❌ Error loading environment configuration: {e}")
     # Fallback to system environment
     config = decouple_config

DEBUG = config('DEBUG', default=False, cast=bool)
ENVIRONMENT = 'staging'

STAGING_SERVER_IP = config('STAGING_SERVER_IP', default='STAGING_SERVER_IP')

ALLOWED_HOSTS = [
     STAGING_SERVER_IP,
     'staging.talent-cloud.asia',
     'localhost',
     '127.0.0.1',
]

CORS_ALLOW_CREDENTIALS = True

# CORS Settings for staging
CORS_ALLOWED_ORIGINS = [
     "http://staging.talent-cloud.asia",
     "https://staging.talent-cloud.asia",
     
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
     "https://staging.talent-cloud.asia",
     "http://staging.talent-cloud.asia",
     
     f"https://{STAGING_SERVER_IP}",
     f"http://{STAGING_SERVER_IP}",
    
     "http://localhost:5173",
     "http://localhost:8000",
]

FRONTEND_BASE_URL = config('FRONTEND_BASE_URL', default=f'https://staging.talent-cloud.asia')

DATABASES = {
     'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': config('DB_NAME', default='talentcloud'),
          'USER': config('DB_USER', default='talentclouduser'),
          'PASSWORD': config('DB_PASSWORD', default='default'),
          'HOST': config('DB_HOST', default='postgres'),
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

DEFAULT_FROM_EMAIL = EMAIL_FROM
SERVER_EMAIL = EMAIL_FROM        # Prevents webmaster@localhost
ADMINS = [('Admin', EMAIL_FROM)]
MANAGERS = ADMINS

# Celery Configuration
REDIS_URL=config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')


# S3 Configuration
AWS_ACCESS_KEY = config('AWS_ACCESS_KEY')
AWS_SECRET_KEY = config('AWS_SECRET_KEY')
AWS_BUCKET_NAME = config('AWS_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='ap-northeast-1')
AWS_S3_FILE_OVERWRITE = False

# OAuth Configuration
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')
LINKEDIN_CLIENT_ID = config('LINKEDIN_CLIENT_ID', default='')
LINKEDIN_CLIENT_SECRET = config('LINKEDIN_CLIENT_SECRET', default='')
FACEBOOK_CLIENT_ID = config('FACEBOOK_CLIENT_ID', default='')
FACEBOOK_CLIENT_SECRET = config('FACEBOOK_CLIENT_SECRET', default='')

OAUTH_REDIRECT_URL = config('OAUTH_REDIRECT_URL', default="http://localhost:5173/oauth/callback")
GOOGLE_REDIRECT_URI = config('GOOGLE_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/google")
LINKEDIN_REDIRECT_URI = config('LINKEDIN_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/linkedin")
FACEBOOK_REDIRECT_URI = config('FACEBOOK_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/facebook")
FACEBOOK_API_VERSION = config('FACEBOOK_API_VERSION', default='v22.0')