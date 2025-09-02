import csv
from django.core.management.base import BaseCommand
from ...models import JobSeekerRole, JobSeekerSpecialization


class Command(BaseCommand):
     help = "Import JobSeeker Roles from CSV file"

     def handle(self, *args, **options):
          self.cleanup_roles()
          self.cleanup_specializations()
          self.stdout.write(self.style.SUCCESS("✅ Role and Specialization cleanup complete"))

     def cleanup_roles(self):
          """Remove roles that are not in the CSV anymore"""
          with open('data/job_seeker/roles.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               role_ids_in_file = {row['id'] for row in reader}

          # Find roles in DB that are NOT in CSV
          roles_to_delete = JobSeekerRole.objects.exclude(id__in=role_ids_in_file)

          count = roles_to_delete.count()
          if count > 0:
               self.stdout.write(f"🧹 Cleaning up {count} old roles...")
               roles_to_delete.delete()
          else:
               self.stdout.write("🧹 No old roles to clean up.")
     
     def cleanup_specializations(self):
          """Remove specializations that are not in the CSV anymore"""
          with open('data/job_seeker/specializations.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               specialization_ids_in_file = {row['id'] for row in reader}

          # Find specializations in DB that are NOT in CSV
          specs_to_delete = JobSeekerSpecialization.objects.exclude(id__in=specialization_ids_in_file)

          count = specs_to_delete.count()
          if count > 0:
               self.stdout.write(f"🧹 Cleaning up {count} old specializations...")
               specs_to_delete.delete()
          else:
               self.stdout.write("🧹 No old specializations to clean up.")