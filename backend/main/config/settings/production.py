from .base import *
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = [host.strip() for host in config('ALLOWED_HOSTS', default='*').split(',')]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Whitenoise Compressed Storage
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

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