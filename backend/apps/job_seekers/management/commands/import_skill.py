import csv
from django.core.management.base import BaseCommand
from ...models import JobSeekerSkill


class Command(BaseCommand):
     help = "Import JobSeeker Skills from CSV file"

     def handle(self, *args, **options):
          self.import_skills()
          self.stdout.write(self.style.SUCCESS("✅ Skills import complete"))

     def import_skills(self):
          # Get total count first
          with open('data/job_seeker/skills.csv', newline='', encoding='utf-8') as f:
               total_rows = sum(1 for line in f) - 1  # Subtract header row
          
          self.stdout.write(f"🛠️ Importing {total_rows} skills...")
          
          with open('data/job_seeker/skills.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               created_count = 0
               updated_count = 0
               
               for i, row in enumerate(reader, 1):
                    obj, created = JobSeekerSkill.objects.update_or_create(
                         title=row['title'],
                         defaults={'title': row['title']}
                    )
                    
                    if created:
                         created_count += 1
                    else:
                         updated_count += 1
                    
                    # Progress indicator every 25 items or at the end
                    if i % 25 == 0 or i == total_rows:
                         self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
               
               self.stdout.write(f"📊 Created: {created_count}, Updated: {updated_count}")