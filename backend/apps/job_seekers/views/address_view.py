from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.job_seekers.serializers.address_serializer import CitySerializer, CountrySerializer
from apps.users.models import City, Country
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Location Data"])
class CountryAPIView(APIView):
     # ✅ PUBLIC: No authentication required (location data is public)
     authentication_classes = []
     permission_classes = []
     
     def get(self, request):
          countries = Country.objects.all()
          serializer = CountrySerializer(countries, many=True)

          return Response(CustomResponse.success("Successfully fetched country list.", serializer.data), status=status.HTTP_200_OK)

@extend_schema(tags=["Location Data"])
class CityAPIView(APIView):
     # ✅ PUBLIC: No authentication required (location data is public)
     authentication_classes = []
     permission_classes = []
     
     def get(self, request, country_id):
          cities = City.objects.filter(country_id=country_id)
          serializer = CitySerializer(cities, many=True)

          return Response(CustomResponse.success("Successfully fetched city list.", serializer.data), status=status.HTTP_200_OK)