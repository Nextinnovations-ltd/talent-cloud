from rest_framework import serializers
from .models import Company, Industry

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
          
class CompanyDetailSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company Detailmodel.
     """
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size',
               'founded_date', 'is_verified',
          ]
          read_only_fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size', 
               'founded_date', 'is_verified'
          ]
     
class CompanyApproveSerializer(serializers.ModelSerializer):
     class Meta:
          model=Company
          fields = ['id', 'is_verified']

class IndustrySerializer(serializers.ModelSerializer):
     class Meta:
          model=Industry
          fields = [
               'id', 'name'
          ]