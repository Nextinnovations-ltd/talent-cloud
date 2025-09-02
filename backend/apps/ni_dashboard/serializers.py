from rest_framework import serializers
from apps.job_posting.models import JobApplication, JobPost
from apps.job_seekers.models import JobSeeker
from services.storage.s3_service import S3Service

class JobPostDashboardSerializer(serializers.ModelSerializer):
     company = serializers.SerializerMethodField()
     specialization_name = serializers.CharField(source='specialization.name', read_only=True)
     posted_date = serializers.DateTimeField(source='created_at', read_only=True)
     deadline_date = serializers.DateField(source='last_application_date', read_only=True)

     class Meta:
          model = JobPost
          fields = [
               'id',
               'title',
               'company',
               'specialization_name',
               'job_post_status',
               'applicant_count',
               'view_count',
               'posted_date',
               'deadline_date',
          ]

     def get_company(self, obj: JobPost):
          return obj.get_company_name

class ApplicantDashboardSerializer(serializers.Serializer):
     applicant_id = serializers.IntegerField(source='job_seeker.user.id')
     application_status = serializers.CharField()
     job_post_id = serializers.IntegerField(source='job_post.id')
     name = serializers.CharField(source='job_seeker.name')
     phone_number = serializers.SerializerMethodField()
     email = serializers.CharField(source='job_seeker.email')
     role = serializers.SerializerMethodField()
     is_open_to_work = serializers.BooleanField(source='job_seeker.is_open_to_work')
     address = serializers.SerializerMethodField()
     applied_date = serializers.DateTimeField(source='created_at', read_only=True)
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     
     class Meta:
          model = JobApplication
          fields = [
               'applicant_id',
               'application_status',
               'job_post_id',
               'name',
               'phone_number',
               'email',
               'role',
               'is_open_to_work',
               'address',
               'applied_date',
               'profile_image_url',
               'resume_url'
          ]
     
     def get_phone_number(self, obj: JobApplication):
          user = obj.job_seeker.user
          
          if user.country_code and user.phone_number:
               return f"{user.country_code}{user.phone_number}"

          return None
     
     def get_role(self, obj: JobApplication):
          job_seeker: JobSeeker = obj.job_seeker
          occupation = getattr(job_seeker, 'occupation', None)
          return getattr(occupation.role, 'name', None) if occupation and occupation.role else None
          
     def get_address(self, obj: JobApplication):
          return obj.job_seeker.get_address
     
     def get_profile_image_url(self, obj: JobApplication):
          if obj.job_seeker.profile_image_url:
               return S3Service.get_public_url(obj.job_seeker.profile_image_url)
          return None
     
     def get_resume_url(self, obj: JobApplication):
          return obj.job_seeker.resume_url_link