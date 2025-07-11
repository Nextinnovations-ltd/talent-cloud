import csv
from django.core.management.base import BaseCommand
from ...models import Country, City

class Command(BaseCommand):
    help = "Import countries and cities from CSV files"

    def handle(self, *args, **options):
        self.import_countries()
        self.import_cities()
        self.stdout.write(self.style.SUCCESS("✅ Import complete"))

    def import_countries(self):
        with open('data/location/countries.csv', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                Country.objects.update_or_create(
                    id=row['id'],
                    defaults={
                        'code2': row['code2'],
                        'name': row['name'],
                        'code3': row.get('code3', ''),
                        'continent': row.get('continent', ''),
                    }
                )

    def import_cities(self):
        with open('data/location/cities.csv', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    country = Country.objects.get(id=row['country_id'])
                except Country.DoesNotExist:
                    self.stderr.write(f"❌ Country ID {row['country_id']} not found for city {row['name']}")
                    continue

                City.objects.update_or_create(
                    name=row['name'],
                    country=country
                )
