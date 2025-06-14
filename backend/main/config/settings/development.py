from .base import *
from decouple import config

DEBUG = True

ALLOWED_HOSTS = [host.strip() for host in config('ALLOWED_HOSTS', default='*').split(',')]

# Internal IP for Django Debug Toolbar
INTERNAL_IPS = [
    "127.0.0.1",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'talentcloud',
        'USER': 'talentclouduser',
        'PASSWORD': 'default',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}

# Development Email Setting
EMAIL_HOST = "0.0.0.0"
EMAIL_PORT = "1025"
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_USE_TLS = False
EMAIL_FROM = "master@tc.io"


CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

FRONTEND_BASE_URL = 'http://localhost:5173'

#region S3 Credentials
AWS_ACCESS_KEY = "YOUR_KEY"
AWS_SECRET_KEY = "YOUR_SECRET"
S3_ASSETS_BUCKET_NAME = "talent_cloud"
#endregion S3 Credentials