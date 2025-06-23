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
               'contact_phone', 'founded_date', 'is_verified', 'company_image_urls',
               'created_at', 'updated_at'
          ]
          read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
     
     def create(self, validated_data):
          image_urls = validated_data.pop('company_image_urls', [])
          
          company = Company.objects.create(**validated_data)
          company.company_image_urls = image_urls
          
          company.save()
          
          return company

     def update(self, instance, validated_data):
          image_urls = validated_data.pop('company_image_urls', None)
          
          for attr, value in validated_data.items():
               setattr(instance, attr, value)
          
          if image_urls is not None:
               instance.company_image_urls = image_urls
          
          instance.save()
          
          return instance
          
class CompanyDetailSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company Detailmodel.
     """
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size',
               'founded_date', 'is_verified', 'company_image_urls'
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