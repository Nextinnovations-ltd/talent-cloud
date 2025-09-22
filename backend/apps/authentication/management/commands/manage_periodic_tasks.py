from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django_celery_beat.models import PeriodicTask
from celery_app.constants import CeleryUtils


class Command(BaseCommand):
     help = 'Manage periodic tasks'

     def add_arguments(self, parser):
          parser.add_argument('--disable', nargs='+', help='Disable tasks by name')
          parser.add_argument('--enable', nargs='+', help='Enable tasks by name')
          parser.add_argument('--delete', nargs='+', help='Delete tasks by name')
          parser.add_argument('--list', action='store_true', help='List all tasks')
          parser.add_argument(
               '--clean-unused',
               action='store_true',
               help='Remove tasks not in CeleryUtils.RUNNING_TASKS'
          )
          parser.add_argument(
               '--disable-unused',
               action='store_true',
               help='Disable tasks not in CeleryUtils.RUNNING_TASKS (without deleting)'
          )
          parser.add_argument(
               '--enable-running',
               action='store_true',
               help='Enable all tasks listed in CeleryUtils.RUNNING_TASKS'
          )
          parser.add_argument(
               '--sync',
               action='store_true',
               help='Full sync: disable unused and enable running tasks'
          )
          parser.add_argument(
               '--dry-run',
               action='store_true',
               help='Show what would be done without making changes'
          )
          parser.add_argument(
               '--force',
               action='store_true',
               help='Skip confirmation prompts'
          )

     def handle(self, *args, **options):
          if options['list']:
               self.list_tasks()
          
          if options['disable']:
               self.disable_tasks(options['disable'])
          
          if options['enable']:
               self.enable_tasks(options['enable'])
               
          if options['delete']:
               self.delete_tasks(options['delete'])
          
          if options['clean_unused']:
               self.clean_unused_tasks(options['dry_run'], options['force'])
          
          if options['disable_unused']:
               self.disable_unused_tasks(options['dry_run'], options['force'])
          
          if options['enable_running']:
               self.enable_running_tasks(options['dry_run'], options['force'])
          
          if options['sync']:
               self.sync_tasks(options['dry_run'], options['force'])

     def list_tasks(self):
          """Enhanced list with RUNNING_TASKS status"""
          tasks = PeriodicTask.objects.all().order_by('name')
          
          if not tasks.exists():
               self.stdout.write(self.style.WARNING('No periodic tasks found in database.'))
               return

          self.stdout.write(self.style.SUCCESS('\n=== Periodic Tasks Status ==='))
          self.stdout.write(f"{'Task Name':<40} {'Status':<10} {'In RUNNING_TASKS':<15} {'Task Path'}")
          self.stdout.write('-' * 100)

          for task in tasks:
               status = "✓ Enabled" if task.enabled else "✗ Disabled"
               in_running = "✓ Yes" if task.task in CeleryUtils.RUNNING_TASKS else "✗ No"
               
               # Color coding based on status
               if task.task in CeleryUtils.RUNNING_TASKS and task.enabled:
                    style = self.style.SUCCESS
               elif task.task not in CeleryUtils.RUNNING_TASKS:
                    style = self.style.WARNING
               else:
                    style = self.style.ERROR

               self.stdout.write(
                    style(f"{task.name:<40} {status:<10} {in_running:<15} {task.task}")
               )

          # Show RUNNING_TASKS that don't exist in DB
          db_tasks = set(tasks.values_list('task', flat=True))
          missing_tasks = set(CeleryUtils.RUNNING_TASKS.keys()) - db_tasks
          
          if missing_tasks:
               self.stdout.write(self.style.WARNING(f'\n=== Missing Tasks (in CeleryUtils.RUNNING_TASKS but not in DB) ==='))
               for task in missing_tasks:
                    self.stdout.write(f"  - {task}: {CeleryUtils.RUNNING_TASKS[task]}")

     def disable_tasks(self, task_names):
          for name in task_names:
               try:
                    task = PeriodicTask.objects.get(name=name)
                    task.enabled = False
                    task.save()
                    self.stdout.write(self.style.SUCCESS(f"✓ Disabled task: {name}"))
               except PeriodicTask.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"✗ Task not found: {name}"))

     def enable_tasks(self, task_names):
          for name in task_names:
               try:
                    task = PeriodicTask.objects.get(name=name)
                    task.enabled = True
                    task.save()
                    self.stdout.write(self.style.SUCCESS(f"✓ Enabled task: {name}"))
               except PeriodicTask.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"✗ Task not found: {name}"))

     def delete_tasks(self, task_names):
          for name in task_names:
               try:
                    task = PeriodicTask.objects.get(name=name)
                    task.delete()
                    self.stdout.write(self.style.SUCCESS(f"✓ Deleted task: {name}"))
               except PeriodicTask.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"✗ Task not found: {name}"))

     def clean_unused_tasks(self, dry_run=False, force=False):
          """Remove tasks that are not in CeleryUtils.RUNNING_TASKS"""
          unused_tasks = PeriodicTask.objects.exclude(task__in=CeleryUtils.RUNNING_TASKS.keys())
          
          if not unused_tasks.exists():
               self.stdout.write(self.style.SUCCESS('No unused tasks found.'))
               return

          self.stdout.write(self.style.WARNING(f'\nFound {unused_tasks.count()} unused tasks:'))
          for task in unused_tasks:
               self.stdout.write(f"  - {task.name} ({task.task})")

          if dry_run:
               self.stdout.write(self.style.WARNING('\n[DRY RUN] These tasks would be deleted.'))
               return

          if not force:
               confirm = input(f'\nAre you sure you want to DELETE these {unused_tasks.count()} tasks? (yes/no): ')
               if confirm.lower() != 'yes':
                    self.stdout.write('Operation cancelled.')
                    return

          try:
               with transaction.atomic():
                    deleted_count = unused_tasks.count()
                    unused_tasks.delete()
                    self.stdout.write(
                         self.style.SUCCESS(f'Successfully deleted {deleted_count} unused tasks.')
                    )
          except Exception as e:
               raise CommandError(f'Error deleting tasks: {e}')

     def disable_unused_tasks(self, dry_run=False, force=False):
          """Disable tasks that are not in CeleryUtils.RUNNING_TASKS"""
          unused_tasks = PeriodicTask.objects.filter(
               enabled=True
          ).exclude(task__in=CeleryUtils.RUNNING_TASKS.keys())
          
          if not unused_tasks.exists():
               self.stdout.write(self.style.SUCCESS('No enabled unused tasks found.'))
               return

          self.stdout.write(self.style.WARNING(f'\nFound {unused_tasks.count()} enabled unused tasks:'))
          for task in unused_tasks:
               self.stdout.write(f"  - {task.name} ({task.task})")

          if dry_run:
               self.stdout.write(self.style.WARNING('\n[DRY RUN] These tasks would be disabled.'))
               return

          if not force:
               confirm = input(f'\nDisable these {unused_tasks.count()} tasks? (yes/no): ')
               if confirm.lower() != 'yes':
                    self.stdout.write('Operation cancelled.')
                    return

          try:
               with transaction.atomic():
                    updated_count = unused_tasks.update(enabled=False)
                    self.stdout.write(
                         self.style.SUCCESS(f'Successfully disabled {updated_count} unused tasks.')
                    )
          except Exception as e:
               raise CommandError(f'Error disabling tasks: {e}')

     def enable_running_tasks(self, dry_run=False, force=False):
          """Enable all tasks listed in CeleryUtils.RUNNING_TASKS"""
          running_tasks = PeriodicTask.objects.filter(
               task__in=CeleryUtils.RUNNING_TASKS.keys(),
               enabled=False
          )
          
          if not running_tasks.exists():
               self.stdout.write(self.style.SUCCESS('All running tasks are already enabled.'))
               return

          self.stdout.write(self.style.WARNING(f'\nFound {running_tasks.count()} disabled running tasks:'))
          for task in CeleryUtils.running_tasks:
               self.stdout.write(f"  - {task.name} ({task.task})")

          if dry_run:
               self.stdout.write(self.style.WARNING('\n[DRY RUN] These tasks would be enabled.'))
               return

          if not force:
               confirm = input(f'\nEnable these {running_tasks.count()} tasks? (yes/no): ')
               if confirm.lower() != 'yes':
                    self.stdout.write('Operation cancelled.')
                    return

          try:
               with transaction.atomic():
                    updated_count = running_tasks.update(enabled=True)
                    self.stdout.write(
                         self.style.SUCCESS(f'Successfully enabled {updated_count} running tasks.')
                    )
          except Exception as e:
               raise CommandError(f'Error enabling tasks: {e}')

     def sync_tasks(self, dry_run=False, force=False):
          """Full sync: disable unused tasks and enable running tasks"""
          self.stdout.write(self.style.SUCCESS('=== Starting Full Task Sync ==='))
          
          # Show what will be done
          unused_tasks = PeriodicTask.objects.filter(enabled=True).exclude(task__in=CeleryUtils.RUNNING_TASKS.keys())
          disabled_running_tasks = PeriodicTask.objects.filter(
               task__in=CeleryUtils.RUNNING_TASKS.keys(),
               enabled=False
          )
          
          self.stdout.write(f'\nTasks to disable: {unused_tasks.count()}')
          self.stdout.write(f'Tasks to enable: {disabled_running_tasks.count()}')
          
          if dry_run:
               self.stdout.write(self.style.WARNING('\n[DRY RUN] No changes will be made.'))
               if unused_tasks.exists():
                    self.stdout.write('\nWould disable:')
                    for task in unused_tasks:
                         self.stdout.write(f"  - {task.name} ({task.task})")
               if disabled_running_tasks.exists():
                    self.stdout.write('\nWould enable:')
                    for task in disabled_running_tasks:
                         self.stdout.write(f"  - {task.name} ({task.task})")
               return

          if not force and (unused_tasks.exists() or disabled_running_tasks.exists()):
               confirm = input('\nProceed with sync? (yes/no): ')
               if confirm.lower() != 'yes':
                    self.stdout.write('Sync cancelled.')
                    return

          try:
               with transaction.atomic():
                    # Disable unused tasks
                    disabled_count = unused_tasks.update(enabled=False)
                    # Enable running tasks
                    enabled_count = disabled_running_tasks.update(enabled=True)
                    
                    self.stdout.write(
                         self.style.SUCCESS(
                         f'Sync completed: {disabled_count} tasks disabled, '
                         f'{enabled_count} tasks enabled.'
                         )
                    )
          except Exception as e:
               raise CommandError(f'Error during sync: {e}')