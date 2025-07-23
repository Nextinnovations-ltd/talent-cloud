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
               'id', 'name', 'slug', 'address', 'image_url', 'website', 'why_join_us',
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

class CompanyListSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company list.
     """
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'image_url', 'description', 
               'industry', 'tagline', 'is_verified', 'size'
          ]
          read_only_fields = ['id', 'slug']
          
class CompanyDetailSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company Detailmodel.
     """
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size',
               'founded_date', 'is_verified', 'company_image_urls', 'why_join_us'
          ]
          read_only_fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size', 
               'founded_date', 'is_verified', 'company_image_urls', 'why_join_us'
          ]
     
class CompanyApproveSerializer(serializers.ModelSerializer):
     class Meta:
          model=Company
          fields = ['id', 'is_verified']

class CompanyWithJobsSerializer(serializers.ModelSerializer):
     """
     Serializer for Company details, including related job posts.
     """
     job_posts = serializers.SerializerMethodField()
     industry = serializers.StringRelatedField()

     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'address', 'image_url', 'website', 'why_join_us',
               'description', 'industry', 'size', 'tagline', 'contact_email',
               'contact_phone', 'founded_date', 'is_verified', 'company_image_urls',
               'job_posts', 'created_at', 'updated_at'
          ]
          read_only_fields = fields

     def get_job_posts(self, obj):
          """
          Retrieves active job posts for the company.
          """
          # Import locally to avoid circular dependency
          from apps.job_posting.models import JobPost
          from apps.job_posting.serializers import JobPostListSerializer

          request = self.context.get('request')
          if not request:
               return []

          job_posts = JobPost.objects.active().filter(posted_by__company=obj).select_related(
               'role', 'experience_level', 'posted_by').prefetch_related('skills')
          serializer = JobPostListSerializer(job_posts, many=True, context={'request': request})
          return serializer.data

class IndustrySerializer(serializers.ModelSerializer):
     class Meta:
          model=Industry
          fields = [
               'id', 'name'
          ]