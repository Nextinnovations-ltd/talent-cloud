import os
from celery import Celery
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')

app = Celery('tc')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'sample_tasks.add',
        'schedule': 30.0,
        'args': (16, 16)
    },
}

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
