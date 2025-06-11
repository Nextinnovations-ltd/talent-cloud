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