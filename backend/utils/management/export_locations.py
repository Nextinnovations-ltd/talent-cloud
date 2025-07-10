import csv
from django.apps import apps

def export_countries_csv(file_path='countries.csv'):
     fields = ['id', 'name', 'code2', 'code3', 'continent']
     
     Country = apps.get_model('cities_light', 'Country')
     
     with open(file_path, 'w', newline='', encoding='utf-8') as f:
          writer = csv.DictWriter(f, fieldnames=fields)
          writer.writeheader()
          for country in Country.objects.all().values(*fields):
               writer.writerow(country)

def export_cities_csv(file_path='cities.csv'):
     fields = ['id', 'name', 'country_id', 'latitude', 'longitude', 'population']
     
     City = apps.get_model('cities_light', 'City')
     
     with open(file_path, 'w', newline='', encoding='utf-8') as f:
          writer = csv.DictWriter(f, fieldnames=fields)
          writer.writeheader()
          for city in City.objects.all().values(*fields):
               writer.writerow(city)