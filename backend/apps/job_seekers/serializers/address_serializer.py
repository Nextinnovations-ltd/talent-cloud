from rest_framework.serializers import ModelSerializer
from apps.users.models import Address, City, Country

class CitySerializer(ModelSerializer):
     class Meta:
          model = City
          fields = ['id', 'name']

class CountrySerializer(ModelSerializer):
     class Meta:
          model = Country
          fields = ['id', 'name']