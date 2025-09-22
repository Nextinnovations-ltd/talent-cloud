class CeleryUtils:
     # Registered Scheduled Tasks here for syncing on deployment and modifying database.
     RUNNING_TASKS = {
          'sample_tasks.add': 'Sample addition task for testing',
          'job_tasks.update_expired_jobs': 'Daily job expiration update task',
          'celery.backend_cleanup': 'Built in tasks for cleaning finished tasks'
     }