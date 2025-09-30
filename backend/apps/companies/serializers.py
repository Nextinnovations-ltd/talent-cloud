from rest_framework import serializers
from services.storage.s3_service import S3Service
from .models import Company, Industry

class CompanySerializer(serializers.ModelSerializer):
     """
     Serializer for the Company model.
     Handles creation and partial updates.
     """
     industry_name = serializers.SerializerMethodField()
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'address', 'image_url', 'website', 'why_join_us',
               'description', 'industry', 'industry_name', 'size', 'tagline', 'contact_email',
               'contact_phone', 'founded_date', 'is_verified', 'company_image_urls', 
               'cover_image_url', 'facebook_url', 'linkedin_url', 
               'instagram_url', 'created_at', 'updated_at'
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
     
     
     def get_industry_name(self, obj: Company):
          """Retrieves Industry Name"""
          return obj.industry.name if hasattr(obj, 'industry') else None

class CompanyListSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company list.
     """
     opening_jobs = serializers.SerializerMethodField()
     image_url = serializers.SerializerMethodField()
     
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'image_url', 'description', 
               'industry', 'tagline', 'is_verified', 'size', 'opening_jobs'
          ]
          read_only_fields = ['id', 'slug']
     
     def get_opening_jobs(self, obj: Company):
          return obj.get_opening_jobs.count()
     
     def get_image_url(self, obj: Company):
          return S3Service.get_public_url(obj.image_url) if obj.image_url else None
          
class CompanyDetailSerializer(serializers.ModelSerializer):
     """
     Serializer for the Company Detailmodel.
     """
     industry = serializers.SerializerMethodField()
     company_image_urls = serializers.SerializerMethodField()
     
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size',
               'founded_date', 'is_verified', 'company_image_urls', 'why_join_us',
               'cover_image_url', 'facebook_url', 'linkedin_url', 'instagram_url',
          ]
          read_only_fields = [
               'id', 'name', 'description', 'image_url', 'industry', 'size', 
               'founded_date', 'is_verified', 'company_image_urls', 'why_join_us',
               'cover_image_url', 'facebook_url', 'linkedin_url', 'instagram_url',
          ]
     
     def get_company_image_urls(self, obj: Company):
          """Retrieves Company Image URLS"""
          return obj.company_image_urls_list
     
     def get_industry(self, obj: Company):
          """Retrieves Industry Name"""
          return obj.industry.name if hasattr(obj, 'industry') else None
     
class CompanyApproveSerializer(serializers.ModelSerializer):
     class Meta:
          model=Company
          fields = ['id', 'is_verified']

class CompanyWithJobsSerializer(serializers.ModelSerializer):
     """
     Serializer for Company details, including related job posts.
     """
     job_posts = serializers.SerializerMethodField()
     industry = serializers.SerializerMethodField()
     address = serializers.SerializerMethodField()
     company_image_urls = serializers.SerializerMethodField()
     
     class Meta:
          model = Company
          fields = [
               'id', 'name', 'slug', 'address', 'image_url', 'website', 'why_join_us',
               'description', 'industry', 'size', 'tagline', 'contact_email',
               'contact_phone', 'founded_date', 'is_verified', 'company_image_urls',
               'cover_image_url', 'facebook_url', 'linkedin_url', 'instagram_url',
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
     
     def get_industry(self, obj: Company):
          """Retrieves Industry Name"""
          return obj.industry.name if hasattr(obj, 'industry') else None

     def get_company_image_urls(self, obj: Company):
          """Retrieves Company Image URLS"""
          return obj.company_image_urls_list
     
     def get_address(self, obj:Company):          
          if not hasattr(obj, 'address') or not obj.address:
               return None
          
          address = obj.address
          
          
          formatted_address = []
          
          if hasattr(address, 'address') and address.address:
               formatted_address.append(address.address.strip())
          
          if hasattr(address, 'city') and address.city and hasattr(address.city, 'name'):
               formatted_address.append(address.city.name.strip())
          
          if hasattr(address, 'country') and address.country and hasattr(address.country, 'name'):
               formatted_address.append(address.country.name.strip())
          
          formatted_address = ', '.join(formatted_address) if formatted_address else ''
                    
          return formatted_address
          
class IndustrySerializer(serializers.ModelSerializer):
     class Meta:
          model=Industry
          fields = [
               'id', 'name'
          ]