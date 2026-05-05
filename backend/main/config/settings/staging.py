import os

from .base import *  # noqa: F401, F403

DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1")

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL")

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False").lower() in (
    "true",
    "1",
)
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "True").lower() in (
    "true",
    "1",
)

# CSRF settings
CSRF_TRUSTED_ORIGINS = (
    os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if os.getenv("CSRF_TRUSTED_ORIGINS")
    else []
)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}

# Email settings
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_FROM = os.getenv("EMAIL_FROM", "")
DEFAULT_FROM_EMAIL = EMAIL_FROM
SERVER_EMAIL = EMAIL_FROM  # Prevents webmaster@localhost
ADMINS = [("Admin", EMAIL_FROM)]
MANAGERS = ADMINS

# Celery settings
REDIS_URL = os.getenv("REDIS_URL")
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", REDIS_URL)
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", REDIS_URL)

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL],
        },
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}


# S3 settings
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")
AWS_S3_FILE_OVERWRITE = False


# OAuth settings #
OAUTH_REDIRECT_URL = os.getenv("OAUTH_REDIRECT_URL")

# Google
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# GitHub
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")

# LinkedIn
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")
