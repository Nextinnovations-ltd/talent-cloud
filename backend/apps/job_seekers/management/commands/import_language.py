import csv
from django.core.management.base import BaseCommand
from ...models import SpokenLanguage


class Command(BaseCommand):
     help = "Import Spoken Languages from CSV file"

     def handle(self, *args, **options):
          self.import_spoken_languages()
          self.stdout.write(self.style.SUCCESS("✅ Spoken languages import complete"))

     def import_spoken_languages(self):
          # Get total count first
          with open('data/job_seeker/languages.csv', newline='', encoding='utf-8') as f:
               total_rows = sum(1 for line in f) - 1  # Subtract header row
          
          self.stdout.write(f"🗣️ Importing {total_rows} spoken languages...")
          
          with open('data/job_seeker/languages.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               created_count = 0
               updated_count = 0
               
               for i, row in enumerate(reader, 1):
                    obj, created = SpokenLanguage.objects.update_or_create(
                         name=row['name'],
                         defaults={'name': row['name']}
                    )
                    
                    if created:
                         created_count += 1
                    else:
                         updated_count += 1
                    
                    # Progress indicator every 10 items or at the end
                    if i % 10 == 0 or i == total_rows:
                         self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
               
               self.stdout.write(f"📊 Created: {created_count}, Updated: {updated_count}")