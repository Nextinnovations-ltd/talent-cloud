import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')

app = Celery('tc')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.timezone = "Asia/Yangon"
app.conf.enable_utc = False

app.conf.beat_schedule = {
    # Test
    'add-every-30-seconds': {
        'task': 'sample_tasks.add',
        'schedule': crontab(hour=16, minute=30),
        'args': (16, 16)
    },
    'update-expired-jobs-daily': {
        'task': 'job_tasks.update_expired_jobs',
        'schedule': crontab(hour=0, minute=0),  # Daily at 12:00 AM
        'options': {
            'expires': 3600,
        }
    },
    'weekly-resumes-cleanup': {
        'task': 'upload_tasks.weekly_resumes_cleanup',
        'schedule': crontab(hour=0, minute=0, day_of_week=0),  # Sunday 12:00 AM
    },
    'calculate-trending-scores-daily': {
        'task': 'nlp_tasks.calculate_trending_scores_task',
        'schedule': crontab(hour=0, minute=0), # Daily 12:00 AM
        'args': (),
    },
}

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
