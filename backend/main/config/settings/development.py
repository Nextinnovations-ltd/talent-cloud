from .base import *
from decouple import config as decouple_config, Config, RepositoryEnv
import os

# Load only development-specific environment file
dev_env = os.path.join(BASE_DIR, '.env.development')

_LOADED_FLAG = f"_DEV_ENV_LOADED_{id(dev_env)}"

try:
    if os.path.exists(dev_env):
        config = Config(RepositoryEnv(dev_env))
        if _LOADED_FLAG not in os.environ:
            print(f"🔧 Development: Loaded .env.development")
            os.environ[_LOADED_FLAG] = "true"
    else:
        # Use the default decouple config
        config = decouple_config
        if _LOADED_FLAG not in os.environ:
            print(f"⚠️ Development: .env.development not found, using system environment")
            os.environ[_LOADED_FLAG] = "true"
except Exception as e:
    print(f"❌ Error loading environment configuration: {e}")
    # Fallback to system environment
    config = decouple_config

DEBUG = config('DEBUG', default=True, cast=bool)
ENVIRONMENT='development'

ALLOWED_HOSTS = ['*']

BACKEND_BASE_URL = config('BACKEND_BASE_URL', default=f'http://localhost:8000')
FRONTEND_BASE_URL = config('FRONTEND_BASE_URL', default=f'http://localhost:5173')

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

# Development Email Setting
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

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

CORS_ALLOWED_ORIGINS = [
     "http://localhost:5173",
     "http://localhost:8000",
]

# Celery Configuration
REDIS_URL=config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [REDIS_URL],
        },
    },
}

# S3 Configuration
AWS_ACCESS_KEY = config('AWS_ACCESS_KEY')
AWS_SECRET_KEY = config('AWS_SECRET_KEY')
AWS_BUCKET_NAME = config('AWS_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='ap-northeast-1')
AWS_S3_FILE_OVERWRITE = False


# OAuth Configuration
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')
GITHUB_CLIENT_ID = config('GITHUB_CLIENT_ID', default='')
GITHUB_CLIENT_SECRET = config('GITHUB_CLIENT_SECRET', default='')
LINKEDIN_CLIENT_ID = config('LINKEDIN_CLIENT_ID', default='')
LINKEDIN_CLIENT_SECRET = config('LINKEDIN_CLIENT_SECRET', default='')
FACEBOOK_CLIENT_ID = config('FACEBOOK_CLIENT_ID', default='')
FACEBOOK_CLIENT_SECRET = config('FACEBOOK_CLIENT_SECRET', default='')

OAUTH_REDIRECT_URL = config('OAUTH_REDIRECT_URL', default="http://localhost:5173/oauth/callback")
GOOGLE_REDIRECT_URI = config('GOOGLE_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/google")
GITHUB_REDIRECT_URI = config('GITHUB_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/github")
LINKEDIN_REDIRECT_URI = config('LINKEDIN_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/linkedin")
FACEBOOK_REDIRECT_URI = config('FACEBOOK_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/facebook")
FACEBOOK_API_VERSION = config('FACEBOOK_API_VERSION', default='v22.0')

DIFY_API_URL= config('DIFY_API_URL', default='https://api.dify.ai/v1/workflows/run')
DIFY_API_KEY= config('DIFY_API_KEY', default='app-cgtngfiCzymjd46gM1oValin')