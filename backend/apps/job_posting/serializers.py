from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.job_posting.models import ApplicationStatus, BookmarkedJob, JobApplication, JobPost, JobPostMetric, JobPostView, SalaryModeType
from apps.companies.serializers import CompanyDetailSerializer
from utils.job_posting.job_posting_utils import format_salary

class JobPostSerializer(ModelSerializer):
     class Meta:
          model=JobPost
          fields= '__all__'
          read_only_fields = ['posted_by', 'view_count', 'applicant_count', 'bookmark_count']

     def update(self, instance, validated_data):
          salary_mode = validated_data.get("salary_mode", instance.salary_mode)

          if salary_mode == SalaryModeType.Fixed:
               validated_data["salary_min"] = None
               validated_data["salary_max"] = None
          elif salary_mode == SalaryModeType.Range:
               validated_data["salary_fixed"] = None

          return super().update(instance, validated_data)

class JobPostListSerializer(serializers.ModelSerializer):
     experience_level = serializers.StringRelatedField()
     skills = serializers.StringRelatedField(many=True)
     job_type = serializers.CharField(source='get_job_type_display')
     work_type = serializers.CharField(source='get_work_type_display')
     company_name = serializers.SerializerMethodField()
     company_image_url = serializers.SerializerMethodField()
     display_salary = serializers.SerializerMethodField()
     is_new = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id',
               'title',
               'description',
               'location',
               'experience_level',
               'experience_years',
               'skills',
               'job_type',
               'work_type',
               'company_name',
               'company_image_url',
               'display_salary',
               'created_at',
               'applicant_count',
               'is_new',
          ]

     def get_company_name(self, obj):
          # Handle company Null
          return getattr(getattr(obj.posted_by, 'company', None), 'name', None)
     
     def get_company_image_url(self, obj):
          # Handle company Null
          return getattr(getattr(obj.posted_by, 'company', None), 'image_url', None)
     
     def get_display_salary(self, obj):
          if obj.salary_fixed:
               fixed=format_salary(obj.salary_fixed)
               return f"{fixed} ({obj.get_salary_type_display()})"
          elif obj.salary_min and obj.salary_max:
               salary_min = format_salary(obj.salary_min)
               salary_max = format_salary(obj.salary_max)
               return f"{salary_min}-{salary_max}MMK/{obj.get_salary_type_display()}"
          
          return "Not specified"
     
     def get_is_new(self, obj):
          user = self.context['request'].user

          if not user.is_authenticated:
               return False
          try:
               job_seeker = user.jobseeker
          except:
               return False

          return not JobPostView.objects.filter(job_post=obj, job_seeker=job_seeker).exists()

class JobPostDetailSerializer(serializers.ModelSerializer):
     specialization = serializers.StringRelatedField()
     role = serializers.StringRelatedField()
     skills = serializers.StringRelatedField(many=True)
     experience_level = serializers.StringRelatedField()
     job_type = serializers.CharField(source='get_job_type_display')
     work_type = serializers.CharField(source='get_work_type_display')
     project_duration = serializers.CharField(source='get_project_duration_display', allow_null=True)
     salary_mode = serializers.CharField(source='get_salary_mode_display', allow_null=True)
     salary_type = serializers.CharField(source='get_salary_type_display', allow_null=True)
     
     company = serializers.SerializerMethodField()
     job_poster_name = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id', 'title', 'description', 'responsibilities', 'requirements', 'offered_benefits', 
               'location', 'specialization', 'role', 'skills', 'experience_level', 'experience_years', 
               'job_type', 'work_type', 'number_of_positions', 'salary_mode', 'salary_type',
               'salary_min', 'salary_max', 'salary_fixed', 'is_salary_negotiable',
               'project_duration', 'last_application_date', 'is_accepting_applications',
               'view_count', 'applicant_count', 'bookmark_count', 'company', 'job_poster_name'
          ]

     def get_company(self, obj):
          posted_by = getattr(obj, 'posted_by', None)
          
          if posted_by and hasattr(posted_by, 'company'):
               # Serialize the company object with CompanyDetailSerializer
               return CompanyDetailSerializer(posted_by.company).data
          return None

     def get_job_poster_name(self, obj):
          return getattr(obj.posted_by, 'name', None)


class JobApplicationSerializer(ModelSerializer):
     class Meta:
          model = JobApplication
          fields = ['id', 'job_post', 'job_seeker', 'status', 'cover_letter', 'application_resume_url', 'created_at']
          read_only_fields = ['id', 'job_post', 'job_seeker', 'status', 'created_at']

class JobApplicationCreateSerializer(ModelSerializer):
     class Meta:
          model = JobApplication
          fields = ['cover_letter', 'application_resume_url']

     def create(self, validated_data):
          return JobApplication.objects.create(**validated_data)

class JobApplicationStatusUpdateSerializer(ModelSerializer):
     class Meta:
          model = JobApplication
          fields = ['status']

     def validate_status(self, value):
          valid_statuses = [choice[0] for choice in ApplicationStatus.choices]
          
          if value not in valid_statuses:
               raise serializers.ValidationError("Invalid application status.")
          return value

# Bookmarked Job Serializers

class BookmarkedJobSerializer(ModelSerializer):
     class Meta:
          model = BookmarkedJob
          fields = ['id', 'job_post', 'created_at']
          read_only_fields = ['id', 'job_post', 'created_at']

# End Bookmarked Job Serializers

class JobPostMetricSerializer(ModelSerializer):
     class Meta:
          model=JobPostMetric
          fields=(
               'id', 'job_post', 'user', 'event_type', 'created_at', 'metadata'
          )
