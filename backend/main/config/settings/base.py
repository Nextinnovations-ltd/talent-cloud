from pathlib import Path
import os
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-%bg=deo4@dofjbmatk+31^=&wduyxj22qes%lijmu)3!+sqk8m'

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'daphne',
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    
    #External App
    'debug_toolbar',
    'corsheaders',
    'drf_spectacular',
    'django_celery_beat',
    'django_celery_results',
    'channels',
    
    #Local Apps
    'apps.ws_channel',
    'apps.authentication',
    'apps.companies',
    'apps.company_dashboard',
    'apps.users',
    'apps.ni_dashboard',
    'apps.job_seekers',
    'apps.job_posting',
    'apps.audit_log',
    'apps.test_app'
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware', # External middleware
    'whitenoise.middleware.WhiteNoiseMiddleware', # External middleware
    'corsheaders.middleware.CorsMiddleware', # External middleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'core.middleware.exception_handler.custom_exception_handler',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 15,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# region LOGGER CONFIGURATION

LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
        'celery': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'exception_file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOGS_DIR / 'exceptions.log'),
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOGS_DIR / 'errors.log'),
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'django_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOGS_DIR / 'django.log'),
            'maxBytes': 1024*1024*10,
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'celery_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOGS_DIR / 'celery.log'),
            'maxBytes': 1024*1024*10,
            'backupCount': 5,
            'formatter': 'simple',
        },
    },
    'loggers': {
        'exception_handler': {
            'handlers': ['console', 'exception_file', 'error_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'celery': {
            'handlers': ['console', 'celery_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

SEND_ERROR_NOTIFICATIONS = True
ADMINS = [
    ('Admin Name', 'admin@tc.io'),
]

# endregion LOGGER CONFIGURATION

# region SPECTACULAR CONFIGURATION

SPECTACULAR_SETTINGS = {
    'TITLE': 'Talent Cloud Backend API',
    'DESCRIPTION': 'A Job Seeking Platform for Technology Sector',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# endregion SPECTACULAR CONFIGURATION

ROOT_URLCONF = 'main.config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

ASGI_APPLICATION = 'main.config.asgi.application'
WSGI_APPLICATION = 'main.config.wsgi.application'

# region CACHE Configuration

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'oauth-rate-limiting',
        'OPTIONS': {
            'MAX_ENTRIES': 10000,
            'CULL_FREQUENCY': 3,
        }
    }
}

# endregion CACHE Configuration

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.TalentCloudUser'

# region OAuth Configuration

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend'
]

# OAuth Credentials - MUST be set via environment variables
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')

LINKEDIN_CLIENT_ID = config('LINKEDIN_CLIENT_ID', default='')
LINKEDIN_CLIENT_SECRET = config('LINKEDIN_CLIENT_SECRET', default='')

FACEBOOK_CLIENT_ID = config('FACEBOOK_CLIENT_ID', default='')
FACEBOOK_CLIENT_SECRET = config('FACEBOOK_CLIENT_SECRET', default='')

# OAUTH URLs
OAUTH_REDIRECT_URL = config('OAUTH_REDIRECT_URL', default="http://localhost:5173/oauth/callback")

# Provider-specific redirect URIs
GOOGLE_REDIRECT_URI = config('GOOGLE_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/google")
LINKEDIN_REDIRECT_URI = config('LINKEDIN_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/linkedin")
FACEBOOK_REDIRECT_URI = config('FACEBOOK_REDIRECT_URI', default="http://localhost:8000/api/v1/auth/accounts/facebook")

# Facebook API Version
FACEBOOK_API_VERSION = config('FACEBOOK_API_VERSION', default='v22.0')

# Validate that OAuth credentials are set in production
if config('DJANGO_ENV', default='development') == 'production':
    required_oauth_settings = [
        'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
        'LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 
        'FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET'
    ]
    
    missing_settings = [setting for setting in required_oauth_settings if not config(setting, default='')]
    if missing_settings:
        raise Exception(f"Missing required OAuth environment variables: {', '.join(missing_settings)}")

# endregion OAuth Configuration


# region Static Config

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# endregion Static Config


# region CORS Config

# CORs Allow Origin for Cross Site Request
# CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://127.0.0.1:8000').split(',')

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # React development server
    'http://127.0.0.1:5173', 
]

# endregion CORS Config


# region Celery Configuration

# Basic Celery Settings
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/1')

# Serialization & Timezone
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Task Discovery
CELERY_AUTODISCOVER_TASKS = True

CELERY_IMPORTS = (
    'celery_app.tasks.sample_tasks',
)

# Beat Scheduler
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Result Settings
CELERY_RESULT_EXPIRES = 60 * 60 * 24  # 24 hours
CELERY_TASK_TRACK_STARTED = True

# Task Execution
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutes
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60  # 25 minutes

# Worker Settings
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000

# Development Override
# if DEBUG:
CELERY_TASK_ALWAYS_EAGER = config('CELERY_TASK_ALWAYS_EAGER', default=False, cast=bool)

# endregion Celery Configuration