from rest_framework import serializers
from apps.job_posting.models import JobApplication, JobPost
from apps.job_seekers.models import JobSeeker

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
     job_post_id = serializers.IntegerField(source='job_post.id')
     name = serializers.CharField(source='job_seeker.name')
     phone_number = serializers.SerializerMethodField()
     email = serializers.CharField(source='job_seeker.email')
     role = serializers.SerializerMethodField()
     is_open_to_work = serializers.BooleanField(source='job_seeker.is_open_to_work')
     address = serializers.SerializerMethodField()
     profile_image_url = serializers.CharField(source='job_seeker.profile_image_url')
     applied_date = serializers.DateTimeField(source='created_at', read_only=True)
     
     def get_phone_number(self, obj: JobApplication):
          job_seeker: JobSeeker = obj.job_seeker.user
          
          if job_seeker.country_code and job_seeker.phone_number:
               return f"{job_seeker.country_code}{job_seeker.phone_number}"

          return None
     
     def get_role(self, obj: JobApplication):
          occupation = getattr(obj, 'occupation', None)
          return getattr(occupation.role, 'name', None) if occupation and occupation.role else None
          
     def get_address(self, obj: JobApplication):
          return obj.job_seeker.get_address