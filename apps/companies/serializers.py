from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
     """
     Serializer for the Company model.
     Handles creation and partial updates.
     """
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'address', 'image_url', 'website',
               'description', 'industry', 'size', 'tagline', 'contact_email',
               'contact_phone', 'founded_date', 'is_verified',
               'created_at', 'updated_at'
          ]
          read_only_fields = ['id', 'slug', 'created_at', 'updated_at']