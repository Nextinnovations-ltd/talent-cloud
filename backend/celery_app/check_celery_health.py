from django.core.management.base import BaseCommand
from celery_app.celery import app

class Command(BaseCommand):
    help = 'Check Celery health status'
    
    def handle(self, *args, **options):
          try:
               # Check if Celery is responsive
               inspect = app.control.inspect()
               
               # Check active workers
               active_workers = inspect.active()
               if active_workers:
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Celery workers active: {list(active_workers.keys())}')
                    )
               else:
                    self.stdout.write(
                         self.style.ERROR('✗ No active Celery workers found')
                    )
               
               # Check scheduled tasks
               scheduled = inspect.scheduled()
               if scheduled:
                    task_count = sum(len(tasks) for tasks in scheduled.values())
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Scheduled tasks: {task_count}')
                    )
               
               # Check beat scheduler
               try:
                    from django_celery_beat.models import PeriodicTask
                    periodic_tasks = PeriodicTask.objects.filter(enabled=True).count()
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Periodic tasks enabled: {periodic_tasks}')
                    )
               except Exception as e:
                    self.stdout.write(
                         self.style.WARNING(f'⚠ Could not check periodic tasks: {e}')
                    )
                    
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f'✗ Celery health check failed: {e}')
               )