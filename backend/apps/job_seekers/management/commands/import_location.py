import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import Country, City

class Command(BaseCommand):
    help = "Import countries and cities from CSV files"

    def handle(self, *args, **options):
        self.import_countries()
        self.import_cities()
        self.stdout.write(self.style.SUCCESS("✅ Import complete"))

    def import_countries(self):
        # Get total count first
        with open('data/location/countries.csv', newline='', encoding='utf-8') as f:
            total_rows = sum(1 for line in f) - 1

        self.stdout.write(f"🌍 Importing {total_rows} countries...")

        with open('data/location/countries.csv', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            countries_to_create = []
            countries_to_update = []
            
            # Pre-fetch existing countries
            existing_countries = {str(c.id): c for c in Country.objects.all()}
            
            for i, row in enumerate(reader, 1):
                country_data = {
                    'id': row['id'],
                    'code2': row['code2'],
                    'name': row['name'],
                    'code3': row.get('code3', ''),
                    'continent': row.get('continent', ''),
                }
                
                if row['id'] in existing_countries:
                    # Update existing
                    country = existing_countries[row['id']]
                    for field, value in country_data.items():
                        if field != 'id':
                            setattr(country, field, value)
                    countries_to_update.append(country)
                else:
                    # Create new
                    countries_to_create.append(Country(**country_data))
                
                if i % 25 == 0 or i == total_rows:
                    self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
            
            # Bulk operations
            with transaction.atomic():
                if countries_to_create:
                    Country.objects.bulk_create(countries_to_create, ignore_conflicts=True)
                if countries_to_update:
                    Country.objects.bulk_update(
                        countries_to_update, 
                        ['code2', 'name', 'code3', 'continent'],
                        batch_size=1000
                    )
            
            self.stdout.write(f"📊 Created: {len(countries_to_create)}, Updated: {len(countries_to_update)}")
            self.stdout.write("")
            
    def import_cities(self):
        # Get total count first
        with open('data/location/cities.csv', newline='', encoding='utf-8') as f:
            total_rows = sum(1 for line in f) - 1

        self.stdout.write(f"🏙️ Importing {total_rows} cities...")

        # Pre-fetch all countries for better performance
        countries_map = {str(c.id): c for c in Country.objects.all()}
        
        # Pre-fetch existing cities
        existing_cities = {}
        for city in City.objects.select_related('country').all():
            key = f"{city.name}_{city.country.id}"
            existing_cities[key] = city

        cities_to_create = []
        cities_to_update = []
        error_count = 0
        batch_size = 1000

        with open('data/location/cities.csv', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for i, row in enumerate(reader, 1):
                country_id = row['country_id']
                
                if country_id not in countries_map:
                    if error_count < 10:  # Limit error messages
                        self.stderr.write(f"❌ Country ID {country_id} not found for city {row['name']}")
                    error_count += 1
                    continue

                country = countries_map[country_id]
                city_key = f"{row['name']}_{country_id}"
                
                if city_key in existing_cities:
                    # City exists, could update if needed
                    pass
                else:
                    # Create new city
                    cities_to_create.append(City(
                        name=row['name'],
                        country=country
                    ))
                
                # Bulk insert every batch_size records
                if len(cities_to_create) >= batch_size:
                    with transaction.atomic():
                        City.objects.bulk_create(cities_to_create, ignore_conflicts=True)
                    cities_to_create = []
                
                # Progress indicator
                if i % 500 == 0 or i == total_rows:
                    self.stdout.write(f"Progress: {i}/{total_rows} ({(i/total_rows)*100:.1f}%)")
            
            # Insert remaining cities
            if cities_to_create:
                with transaction.atomic():
                    City.objects.bulk_create(cities_to_create, ignore_conflicts=True)
            
            total_created = i - error_count - len(existing_cities)
            self.stdout.write(f"📊 Created: {total_created}, Errors: {error_count}")
            if error_count > 10:
                self.stdout.write(f"⚠️ Showing first 10 errors only. Total errors: {error_count}")