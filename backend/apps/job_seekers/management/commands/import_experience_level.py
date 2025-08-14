import csv
from django.core.management.base import BaseCommand
from ...models import JobSeekerExperienceLevel


class Command(BaseCommand):
     help = "Import JobSeeker Experience Levels from CSV file"

     def handle(self, *args, **options):
          self.import_experience_levels()
          self.stdout.write(self.style.SUCCESS("✅ Experience levels import complete"))

     def import_experience_levels(self):
          # Get total count first
          with open('data/job_seeker/experience_levels.csv', newline='', encoding='utf-8') as f:
               total_rows = sum(1 for line in f) - 1  # Subtract header row
          
          self.stdout.write(f"📈 Importing {total_rows} experience levels...")
          
          with open('data/job_seeker/experience_levels.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               created_count = 0
               updated_count = 0
               
               for i, row in enumerate(reader, 1):
                    obj, created = JobSeekerExperienceLevel.objects.update_or_create(
                         level=row['level'],
                         defaults={'level': row['level']}
                    )
                    
                    if created:
                         created_count += 1
                    else:
                         updated_count += 1
                    
                    # Progress indicator every 5 items or at the end
                    if i % 5 == 0 or i == total_rows:
                         self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
               
               self.stdout.write(f"📊 Created: {created_count}, Updated: {updated_count}")