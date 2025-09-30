from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.job_posting.models import ApplicationStatus, BookmarkedJob, JobApplication, JobPost, JobPostMetric, JobPostView, SalaryModeType, StatusChoices
from apps.companies.serializers import CompanyDetailSerializer
from utils.job_posting.job_posting_utils import format_salary

class JobPostDisplayMixin:
     def get_display_salary(self, obj):
          if obj.salary_fixed:
               fixed = format_salary(obj.salary_fixed)
               return f"{fixed}MMK/{obj.get_salary_type_display()}"
          elif obj.salary_min and obj.salary_max:
               salary_min = format_salary(obj.salary_min)
               salary_max = format_salary(obj.salary_max)
               return f"{salary_min}-{salary_max}MMK/{obj.get_salary_type_display()}"
          
          return "Not specified"

     def get_company_name(self, obj):
          return getattr(getattr(obj.posted_by, 'company', None), 'name', None)

     def get_company_image_url(self, obj):
          return getattr(getattr(obj.posted_by, 'company', None), 'image_url', None)

     def get_is_bookmarked(self, obj):
          user = self.context['request'].user
          
          if not user.is_authenticated:
               return False
          try:
               job_seeker = user.jobseeker
          except Exception:
               return False
          
          return BookmarkedJob.objects.filter(job_post=obj, job_seeker=job_seeker).exists()
     
     def get_is_applied(self, obj):
          user = self.context['request'].user
          
          if not user.is_authenticated:
               return False
          try:
               job_seeker = user.jobseeker
          except Exception:
               return False
          
          return JobApplication.objects.filter(job_post=obj, job_seeker=job_seeker).exists()

     def get_is_expired(self, obj):
          """
          Check if job is expired based on:
          1. Manual status (job_post_status = 'expired')
          2. Automatic expiration (last_application_date has passed)
          """
          from datetime import date
          
          # Check manual expiration status
          if obj.job_post_status == 'expired':
               return True
          
          # Check automatic expiration based on last application date
          if obj.last_application_date:
               today = date.today()
               
               if obj.last_application_date < today:
                    return True
          
          return False
     
     def get_effective_status(self, obj):
          """Get the effective status of the job post"""
          return obj.get_effective_status()
          
class JobPostSerializer(ModelSerializer):
     salary_min = serializers.DecimalField(
          max_digits=None,
          decimal_places=2,
          required=False,
          allow_null=True
     )
     salary_max = serializers.DecimalField(
          max_digits=None,
          decimal_places=2,
          required=False,
          allow_null=True
     )
     salary_fixed = serializers.DecimalField(
          max_digits=None,
          decimal_places=2,
          required=False,
          allow_null=True
     )

     class Meta:
          model=JobPost
          fields= '__all__'
          read_only_fields = ['posted_by', 'view_count', 'applicant_count', 'bookmark_count']
     
     def get_digit_count(self, amount):
          str_val = format(amount, 'f')
          int_part, _, decimal_part = str_val.partition(".")
          
          return len(int_part)
     
     def validate_decimal_format(self, value, field_name):
          """
          Custom validation for decimal format:
          - Maximum 10 digits before decimal point
          - Exactly 2 digits after decimal point
          """
          if value is None:
               return value
               
          # Convert to string
          str_value = str(value)
          
          # Handle negative values
          is_negative = str_value.startswith('-')
          
          if is_negative:
               raise serializers.ValidationError(f'{field_name.replace("_", " ").title()} cannot be negative.')
          
          if '.' in str_value:
               integer_part, decimal_part = str_value.split('.')
          else:
               integer_part = str_value
               decimal_part = '00'
          
          if len(integer_part) > 10:
               raise serializers.ValidationError(f'{field_name.replace("_", " ").title()} cannot have more than 10 digits before the decimal point.')
          
          if len(decimal_part) != 2:
               raise serializers.ValidationError(f'{field_name.replace("_", " ").title()} must have exactly 2 digits after the decimal point.')
          
          return value
     
     def validate_salary_min(self, value):
          """Validate minimum salary format and business rules"""
          if value is not None:
               salary_mode = self.initial_data.get('salary_mode')

               if salary_mode == SalaryModeType.Fixed:
                    return value
               
               if not salary_mode and self.instance:
                    salary_mode = self.instance.salary_mode
                    
                    if salary_mode == SalaryModeType.Fixed:
                         return value
               
               self.validate_decimal_format(value, 'salary_min')
               
               if value < 0:
                    raise serializers.ValidationError("Minimum salary cannot be negative.")
               
               if self.get_digit_count(value) < 3:
                    raise serializers.ValidationError("Minimum salary should have at least 3 digits.")
          
          return value

     def validate_salary_max(self, value):
          """Validate maximum salary format and business rules"""
          if value is not None:
               salary_mode = self.initial_data.get('salary_mode')
        
               if salary_mode == SalaryModeType.Fixed:
                    return value
                    
               if not salary_mode and self.instance:
                    salary_mode = self.instance.salary_mode
                    if salary_mode == SalaryModeType.Fixed:
                         return value
                    
               self.validate_decimal_format(value, 'salary_max')
               
               if value < 0:
                    raise serializers.ValidationError("Maximum salary cannot be negative.")
               
               if self.get_digit_count(value) < 3:
                    raise serializers.ValidationError("Maximum salary should have at least 3 digits.")
          
          return value

     def validate_salary_fixed(self, value):
          """Validate fixed salary format and business rules"""
          if value is not None:
               salary_mode = self.initial_data.get('salary_mode')
        
               if salary_mode == SalaryModeType.Range:
                    return value

               if not salary_mode and self.instance:
                    salary_mode = self.instance.salary_mode
                    if salary_mode == SalaryModeType.Range:
                         return value
               
               self.validate_decimal_format(value, 'salary_fixed')
               
               if value < 0:
                    raise serializers.ValidationError("Fixed salary cannot be negative.")
               
               if self.get_digit_count(value) < 3:
                    raise serializers.ValidationError("Fixed salary should have at least 3 digits.")
          
          return value
     
     def validate(self, attrs):
          salary_mode = attrs.get('salary_mode')
          salary_min = attrs.get('salary_min')
          salary_max = attrs.get('salary_max')
          salary_fixed = attrs.get('salary_fixed')
          last_application_date = attrs.get('last_application_date')
          
          # Job Post Update
          if self.instance:
               salary_mode = salary_mode or self.instance.salary_mode
               salary_min = salary_min if salary_min is not None else self.instance.salary_min
               salary_max = salary_max if salary_max is not None else self.instance.salary_max
               salary_fixed = salary_fixed if salary_fixed is not None else self.instance.salary_fixed
               last_application_date = last_application_date if last_application_date is not None else self.instance.last_application_date

          if last_application_date is not None:
               from datetime import date
               today_date = date.today()
               
               if last_application_date < today_date:
                    raise serializers.ValidationError({
                         'last_application_date': 'Application deadline cannot be in the past.'
                    })
               
               if self.instance.job_post_status == StatusChoices.EXPIRED:
                    attrs['job_post_status'] = StatusChoices.ACTIVE

          if salary_mode == SalaryModeType.Fixed:
               attrs['salary_max'] = None
               attrs['salary_min'] = None
               
               if not salary_fixed:
                    raise serializers.ValidationError({
                         'salary_fixed': 'Fixed salary is required when salary mode is Fixed.'
                    })
               
          elif salary_mode == SalaryModeType.Range:
               attrs['salary_fixed'] = None
               
               if not salary_min or not salary_max:
                    raise serializers.ValidationError({
                         'salary_mode': 'Both minimum and maximum salary are required for Range mode.'
                    })
                    
               if salary_min >= salary_max:
                    raise serializers.ValidationError({
                         'salary_max': 'Maximum salary must be greater than minimum salary.'
                    })

          return attrs
     
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
     is_bookmarked = serializers.SerializerMethodField()
     is_applied = serializers.SerializerMethodField()
     is_expired = serializers.SerializerMethodField()
     effective_status = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id',
               'title',
               'description',
               'location',
               'experience_level',
               'experience_years',
               'role',
               'specialization',
               'skills',
               'job_type',
               'work_type',
               'company_name',
               'company_image_url',
               'display_salary',
               'applicant_count',
               'is_new',
               'is_bookmarked',
               'is_applied',
               'is_expired',
               'effective_status',
               'created_at',
               'last_application_date',
          ]

     # Use JobPostDisplayMixin methods except get_is_new
     def get_company_name(self, obj):
          return JobPostDisplayMixin.get_company_name(self, obj)

     def get_company_image_url(self, obj):
          return JobPostDisplayMixin.get_company_image_url(self, obj)

     def get_display_salary(self, obj):
          return JobPostDisplayMixin.get_display_salary(self, obj)

     def get_is_bookmarked(self, obj):
          return JobPostDisplayMixin.get_is_bookmarked(self, obj)
     
     def get_is_new(self, obj):
          user = self.context['request'].user

          if not user.is_authenticated:
               return False
          try:
               job_seeker = user.jobseeker
          except:
               return False

          return not JobPostView.objects.filter(job_post=obj, job_seeker=job_seeker).exists()

     def get_is_applied(self,obj):
          return JobPostDisplayMixin.get_is_applied(self, obj)
     
     def get_is_expired(self, obj):
          return JobPostDisplayMixin.get_is_expired(self, obj)
     
     def get_effective_status(self, obj):
          return obj.get_effective_status()

class JobPostDetailSerializer(serializers.ModelSerializer):
     specialization = serializers.StringRelatedField()
     role = serializers.StringRelatedField()
     skills = serializers.StringRelatedField(many=True)
     experience_level = serializers.StringRelatedField()
     job_type = serializers.CharField(source='get_job_type_display')
     work_type = serializers.CharField(source='get_work_type_display')
     project_duration = serializers.CharField(source='get_project_duration_display', allow_null=True)
     display_salary = serializers.SerializerMethodField()
     company = serializers.SerializerMethodField()
     job_poster_name = serializers.SerializerMethodField()
     is_bookmarked = serializers.SerializerMethodField()
     is_applied = serializers.SerializerMethodField()
     is_expired = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id', 'title', 'description', 'responsibilities', 'requirements', 'offered_benefits', 
               'location', 'specialization', 'role', 'skills', 'experience_level', 'experience_years', 
               'job_type', 'work_type', 'number_of_positions', 'display_salary', 'is_salary_negotiable',
               'project_duration', 'last_application_date', 'is_accepting_applications',
               'view_count', 'applicant_count', 'bookmark_count', 'company', 'job_poster_name',
               'is_bookmarked', 'is_applied', 'is_expired', 'created_at'
          ]

     def get_company(self, obj):
          posted_by = getattr(obj, 'posted_by', None)
          
          if posted_by and hasattr(posted_by, 'company'):
               # Serialize the company object with CompanyDetailSerializer
               return CompanyDetailSerializer(posted_by.company).data
          return None

     def get_job_poster_name(self, obj):
          return getattr(obj.posted_by, 'name', None)

     def get_is_bookmarked(self, obj):
          return JobPostDisplayMixin.get_is_bookmarked(self, obj)
     
     def get_display_salary(self, obj):
          return JobPostDisplayMixin.get_display_salary(self, obj)

     def get_is_applied(self,obj):
          return JobPostDisplayMixin.get_is_applied(self, obj)
     
     def get_is_expired(self, obj):
          return JobPostDisplayMixin.get_is_expired(self, obj)

class JobApplicationSerializer(ModelSerializer):
     job_post = JobPostListSerializer()
     resume_url = serializers.SerializerMethodField()
     cover_letter_url = serializers.SerializerMethodField()
     
     class Meta:
          model = JobApplication
          fields = ['id', 'job_post', 'job_seeker', 'application_status', 'cover_letter_url', 'resume_url', 'created_at']
          read_only_fields = ['id', 'job_post', 'job_seeker', 'application_status', 'created_at']

     def get_resume_url(self, obj: JobApplication):
          """Generate public URL for resume using S3Service"""
          return obj.resume_url
    
     def get_cover_letter_url(self, obj: JobApplication):
          """Generate public URL for cover letter using S3Service"""
          return obj.cover_letter_url

class JobSeekerRecentApplicationSerializer(ModelSerializer):
     position = serializers.CharField(source='job_post.title')
     company = serializers.CharField(source='job_post.get_company_name')
     salary = serializers.CharField(source='job_post.get_salary')
     total_applicants = serializers.IntegerField(source='job_post.applicant_count')
     last_application_date = serializers.DateField(source='job_post.last_application_date')
     applied_date = serializers.DateTimeField(source='created_at')

     class Meta:
          model = JobApplication
          fields = ['position', 'company', 'salary', 'total_applicants', 'applied_date', 'last_application_date']
          
class JobApplicationCreateSerializer(ModelSerializer):
     class Meta:
          model = JobApplication
          fields = ['cover_letter_url', 'resume_url']

     def create(self, validated_data):
          return JobApplication.objects.create(**validated_data)

class JobApplicationStatusUpdateSerializer(ModelSerializer):
     class Meta:
          model = JobApplication
          fields = ['application_status']

     def validate_application_status(self, value):
          valid_statuses = [choice[0] for choice in ApplicationStatus.choices]
          
          if value not in valid_statuses:
               raise serializers.ValidationError("Invalid application status.")
          return value

# region Bookmarked Job Serializers

class BookmarkedJobSerializer(ModelSerializer):
     job_post = JobPostListSerializer()
     
     class Meta:
          model = BookmarkedJob
          fields = ['id', 'job_post', 'created_at']
          read_only_fields = ['id', 'job_post', 'created_at']

# endregion Bookmarked Job Serializers