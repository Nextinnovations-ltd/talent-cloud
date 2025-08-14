import csv
from django.core.management.base import BaseCommand
from ...models import JobSeekerSpecialization


class Command(BaseCommand):
    help = "Import JobSeeker Specializations from CSV file"

    def handle(self, *args, **options):
        self.import_specializations()
        self.stdout.write(self.style.SUCCESS("✅ Specializations import complete"))

    def import_specializations(self):
        # Get total count first
        with open('data/job_seeker/specializations.csv', newline='', encoding='utf-8') as f:
            total_rows = sum(1 for line in f) - 1  # Subtract header row
        
        self.stdout.write(f"📋 Importing {total_rows} specializations...")
        
        with open('data/job_seeker/specializations.csv', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            created_count = 0
            updated_count = 0
            
            for i, row in enumerate(reader, 1):
                obj, created = JobSeekerSpecialization.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'description': row.get('description', ''),
                        'status': row.get('status', True)
                    }
                )
                
                if created:
                    created_count += 1
                else:
                    updated_count += 1
                
                # Progress indicator every 10 items or at the end
                if i % 10 == 0 or i == total_rows:
                    self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
            
            self.stdout.write(f"📊 Created: {created_count}, Updated: {updated_count}")