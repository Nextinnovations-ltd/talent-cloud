from django.core.management.base import BaseCommand
from apps.job_posting.models import JobPost
from django.db import transaction

class Command(BaseCommand):
     """
     Management command to update JobPost work_type from 'work_from_home' to 'remote'.
     """

     def handle(self, *args, **options):
          with transaction.atomic():
               self.stdout.write("Starting update of JobPost work_type...")
               
               updated_count = JobPost.objects.filter(
                    work_type='work_from_home'
               ).update(
                    work_type='remote'
               )
               
               if updated_count > 0:
                    self.stdout.write(
                         self.style.SUCCESS(
                         f"Successfully updated {updated_count} JobPost records "
                         f"from 'work_from_home' to 'remote'."
                         )
                    )
               else:
                    self.stdout.write(
                         self.style.WARNING(
                         "No existing JobPost records found with work_type='work_from_home'. "
                         "Database is likely already updated."
                         )
                    )