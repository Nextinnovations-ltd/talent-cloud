from django.core.management.base import BaseCommand
from celery_app.celery import app

class Command(BaseCommand):
     help = 'Check Celery health status'
    
     def add_arguments(self, parser):
          parser.add_argument(
               '--verbose',
               action='store_true',
               help='Show detailed output',
          )
          parser.add_argument(
               '--workers-only',
               action='store_true',
               help='Check only worker status',
          )
    
     def handle(self, *args, **options):
          verbose = options.get('verbose', False)
          workers_only = options.get('workers_only', False)
          
          self.stdout.write(
               self.style.SUCCESS('\n=== Celery Health Check ===\n')
          )
        
          try:
               # Check if Celery is responsive
               inspect = app.control.inspect()
               
               # Check active workers
               active_workers = inspect.active()
               if active_workers:
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Celery workers active: {list(active_workers.keys())}')
                    )
                    
                    if verbose:
                         for worker, tasks in active_workers.items():
                              self.stdout.write(f'  Worker {worker}: {len(tasks)} active tasks')
               else:
                    self.stdout.write(
                         self.style.ERROR('✗ No active Celery workers found')
                    )
                    return
               
               if workers_only:
                    return
            
               # Check scheduled tasks
               scheduled = inspect.scheduled()
               if scheduled:
                    task_count = sum(len(tasks) for tasks in scheduled.values())
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Scheduled tasks: {task_count}')
                    )
                    
                    if verbose and task_count > 0:
                         for worker, tasks in scheduled.items():
                              self.stdout.write(f'  Worker {worker}: {len(tasks)} scheduled tasks')
               else:
                    self.stdout.write(
                         self.style.WARNING('⚠ No scheduled tasks found')
                    )
            
               # Check registered tasks
               registered = inspect.registered()
               if registered:
                    task_count = sum(len(tasks) for tasks in registered.values())
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Registered tasks: {task_count}')
                    )
                
                    if verbose:
                         all_tasks = set()
                         
                         for tasks in registered.values():
                              all_tasks.update(tasks)
                         self.stdout.write('  Available tasks:')
                         
                         for task in sorted(all_tasks):
                              if task.startswith('celery_app.tasks'):
                                   self.stdout.write(f'    - {task}')
            
               # Check beat scheduler
               try:
                    from django_celery_beat.models import PeriodicTask
                    periodic_tasks = PeriodicTask.objects.filter(enabled=True).count()
                    total_periodic_tasks = PeriodicTask.objects.count()
                    self.stdout.write(
                         self.style.SUCCESS(f'✓ Periodic tasks enabled: {periodic_tasks}/{total_periodic_tasks}')
                    )
                
                    if verbose and periodic_tasks > 0:
                         enabled_tasks = PeriodicTask.objects.filter(enabled=True)
                         self.stdout.write('  Enabled periodic tasks:')
                         
                         for task in enabled_tasks:
                              self.stdout.write(f'    - {task.name}: {task.crontab or task.interval}')
                        
               except Exception as e:
                    self.stdout.write(
                         self.style.WARNING(f'⚠ Could not check periodic tasks: {e}')
                    )
            
               # Check broker connection
               try:
                    stats = inspect.stats()
                    
                    if stats:
                         self.stdout.write(
                         self.style.SUCCESS('✓ Broker connection: OK')
                         )
                    
                         if verbose:
                              for worker, worker_stats in stats.items():
                                   self.stdout.write(f'  Worker {worker}:')
                                   self.stdout.write(f'    - Pool: {worker_stats.get("pool", {}).get("max-concurrency", "N/A")} max concurrency')
                                   self.stdout.write(f'    - Prefetch count: {worker_stats.get("prefetch_count", "N/A")}')
                    else:
                         self.stdout.write(
                         self.style.WARNING('⚠ Could not get broker stats')
                         )
               except Exception as e:
                    self.stdout.write(
                         self.style.ERROR(f'✗ Broker connection failed: {e}')
                    )
            
               self.stdout.write(
                    self.style.SUCCESS('\n=== Health Check Complete ===\n')
               )
                
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f'✗ Celery health check failed: {e}')
               )
               self.stdout.write(
                    self.style.ERROR('Make sure Celery workers are running and Redis is accessible.')
               )