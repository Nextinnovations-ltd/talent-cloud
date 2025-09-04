from rest_framework import serializers
from apps.job_posting.models import JobSeeker, JobApplication, JobPost
from services.job_seeker.job_seeker_service import JobSeekerService
from services.storage.s3_service import S3Service

class JobPostDashboardSerializer(serializers.ModelSerializer):
     company = serializers.SerializerMethodField()
     specialization_name = serializers.CharField(source='specialization.name', read_only=True)
     posted_date = serializers.DateTimeField(source='created_at', read_only=True)
     deadline_date = serializers.DateField(source='last_application_date', read_only=True)
     skills = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id',
               'title',
               'company',
               'specialization_name',
               'skills',
               'job_post_status',
               'applicant_count',
               'view_count',
               'posted_date',
               'deadline_date',
          ]

     def get_company(self, obj: JobPost):
          return obj.get_company_name
     
     def get_skills(self, obj: JobPost):
          return obj.get_skill_list

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
     cover_letter_url = serializers.SerializerMethodField()
     
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
               'cover_letter_url'
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
     
     def get_cover_letter_url(self, obj: JobApplication):
          if obj.cover_letter_url:
               return S3Service.get_public_url(obj.cover_letter_url)
          return None

class JobSeekerOverviewSerializer(serializers.ModelSerializer):
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     cover_letter_url = serializers.SerializerMethodField()
     phone_number = serializers.SerializerMethodField()
     address = serializers.SerializerMethodField()
     social_links = serializers.SerializerMethodField()
     occupation = serializers.SerializerMethodField()
     recent_application = serializers.SerializerMethodField()
     recent_applied_jobs = serializers.SerializerMethodField()
     
     class Meta:
          model=JobSeeker
          fields=[
               'name', 'email', 'bio', 'phone_number', 'address', 'is_open_to_work',
               'expected_salary', 'profile_image_url', 'resume_url', 'cover_letter_url', 
               'occupation', 'social_links', 'recent_application', 'recent_applied_jobs'
          ]
     
     def get_profile_image_url(self, obj:JobSeeker):
          return obj.profile_image_url_link

     def get_resume_url(self, obj:JobSeeker):
          return obj.resume_url_link

     def get_cover_letter_url(self, obj:JobSeeker):
          return None

     def get_phone_number(self, obj:JobSeeker):
          return obj.get_phone_number

     def get_address(self, obj:JobSeeker):
          return obj.get_address

     def get_social_links(self, obj:JobSeeker):
          return JobSeekerService.get_job_seeker_social_links(obj)
     
     def get_occupation(self, obj):
          return JobSeekerService.get_occupation_info(obj)
     
     def get_recent_application(self, obj: JobSeeker):
          return obj.recent_application
     
     def get_recent_applied_jobs(self, obj: JobSeeker):
          latest_job_applications = obj.latest_job_applications
          
          return JobSeekerRecentAppliedJobSerializer(latest_job_applications, many=True).data

class JobSeekerRecentAppliedJobSerializer(serializers.ModelSerializer):
     job_id = serializers.IntegerField(source='job_post.id')
     position = serializers.CharField(source='job_post.title')
     applicant_count = serializers.IntegerField(source='job_post.applicant_count')
     applied_date = serializers.DateTimeField(source='job_post.created_at')
     company = serializers.SerializerMethodField()
     skills = serializers.SerializerMethodField()
     salary = serializers.SerializerMethodField()

     class Meta:
          model = JobApplication
          fields = [
               'job_id',
               'position',
               'applicant_count',
               'applied_date',
               'company',
               'skills',
               'salary'
          ]

     def get_company(self, obj: JobApplication):
          return obj.job_post.get_company_name
     
     def get_skills(self, obj: JobApplication):
          return obj.job_post.get_skill_list
     
     def get_salary(self, obj: JobApplication):
          return obj.job_post.get_salary