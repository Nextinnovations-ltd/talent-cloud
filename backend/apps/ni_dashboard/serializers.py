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

# class JobSeekerOverviewSerializer(serializers.ModelSerializer):
#      recent_applied_jobs
#      recent_application
#      specialization_name
#      role_name
#      resume_url
#      cover_letter_url
#      address
#      phone_number
#      class Meta:
#           model=JobSeeker
#           fields=[
#                'name', 'email', 'bio', 'phone_number', 'address', 'role_name', 
#                'specialization_name', 'experience_level', 'experience_years',
#                'skills', 'social_links', 'resume_url', 'cover_letter_url',
#                'recent_applied_jobs', 'recent_application', 'is_open_to_work',
#                'expected_salary'
#           ]
     
     
     
#                # 'specialization': {
#                #      'id': occupation.specialization.id,
#                #      'name': occupation.specialization.name,
#                # } if occupation and occupation.specialization else None,
#                # 'role': {
#                #      'id': occupation.role.id,
#                #      'name': occupation.role.name,
#                # } if occupation and occupation.role else None,
#                # 'experience_level': {
#                #      'id': occupation.experience_level.id,
#                #      'level': occupation.experience_level.level,
#                # } if occupation and occupation.experience_level else None,
#                # 'experience_years': occupation.experience_years if occupation else None,
              
#                # # Social Links
#                # 'facebook_url': social_links.facebook_social_url if social_links else None,
#                # 'linkedin_url': social_links.linkedin_social_url if social_links else None,
#                # 'behance_url': social_links.behance_social_url if social_links else None,
#                # 'portfolio_url': social_links.portfolio_social_url if social_links else None,
#                # 'github_url': social_links.github_social_url if social_links else None,
