import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')

app = Celery('tc')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    # Test
    # 'add-every-30-seconds': {
    #     'task': 'sample_tasks.add',
    #     'schedule': 30.0,
    #     'args': (16, 16)
    # },
    'update-expired-jobs-daily': {
        'task': 'job_tasks.update_expired_jobs',
        'schedule': crontab(hour=0, minute=0),  # Daily at 12:00 AM
        'options': {
            'expires': 3600,
        }
    },
    # 'delete-expired-uploads': {
    #     'task': 'upload_tasks.delete_expired_uploads',
    #     'schedule': crontab(hour=12, minute=0),  # Daily at 12:00 PM
    #     'options': {
    #         'expires': 3600,
    #     }
    # },
}

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
