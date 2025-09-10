from django.core.management.base import BaseCommand
from apps.job_seekers.models import University
import csv


class Command(BaseCommand):
     help = "Import Universities data from Csv file"
     
     def handle(self, *args, **options):
          self.import_universities()
          self.stdout.write(self.style.SUCCESS("✅ Import complete"))
     
     def import_universities(self):
          with open('data/job_seeker/universities.csv', newline='', encoding='utf-8') as f:
               total_rows = sum(1 for line in f) - 1
               
          self.stdout.write(f"Importing {total_rows} universities...")  
          
          with open('data/job_seeker/universities.csv', newline='', encoding='utf-8') as f:
               reader = csv.DictReader(f)
               created_count = 0
               updated_count = 0
               
               for i, row in enumerate(reader, 1):
                    obj, created = University.objects.update_or_create(
                         id=row['id'],
                         defaults={
                              'name': row['name'],
                              'state': row['state'],
                              'country': row['country']
                         }
                    )
                    
                    if created:
                         created_count += 1
                    else:
                         updated_count += 1
                    
                    if i % 10 == 0 or i == total_rows:
                         self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
               
               self.stdout.write(f"📊 Created: {created_count}, Updated: {updated_count}")