from pathlib import Path
import os

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
    'channels',
    
    #Local Apps
    'apps.ws_channel',
    'apps.authentication',
    'apps.companies',
    'apps.users',
    'apps.ni_super_admin',
    'apps.job_seekers',
    'apps.job_posting',
    'apps.audit_log',
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
    'PAGE_SIZE': 4,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Talent Cloud Backend API',
    'DESCRIPTION': 'A Job Seeking Platform for Technology Sector',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

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

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Password validation
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

GOOGLE_CLIENT_ID = '394068996425-9uu48cj29id232k3di793gvdbb4a50fa.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = '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'

LINKEDIN_CLIENT_ID = '866khyw28sevz8'
LINKEDIN_CLIENT_SECRET = 'WPL_AP1.m68SvuuDfa1LXupr.+YHjyg=='

FACEBOOK_CLIENT_ID = '1999611343882551'
FACEBOOK_CLIENT_SECRET = '495a6ed1c1986293eb357350b2ea4f02'

OAUTH_REDIRECT_URL = "http://localhost:5173/oauth/callback"

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


# region Celery Config

CELERY_TIMEZONE = 'UTC'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_IMPORTS = ('main.celery.tasks',)
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# endregion Celery Config