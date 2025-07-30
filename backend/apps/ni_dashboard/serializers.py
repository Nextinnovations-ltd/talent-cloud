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
     name = serializers.CharField(source='job_seeker.name')
     phone_number = serializers.SerializerMethodField()
     email = serializers.CharField(source='job_seeker.email')
     role = serializers.SerializerMethodField()
     is_open_to_work = serializers.BooleanField(source='job_seeker.is_open_to_work')
     address = serializers.SerializerMethodField()
     profile_image_url = serializers.CharField(source='job_seeker.profile_image_url')
     
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
          # job_seeker = application.job_seeker
          #      user = job_seeker.user
          #      role = getattr(getattr(job_seeker, 'occupation', None), 'role', None)
               
          #      result.append({
          #           'applicant_id': user.pk,
          #           'name': user.name,
          #           'phone_number': f"{user.country_code}{user.phone_number}" if user.country_code is not None and user.phone_number is not None else None,
          #           'email': user.email,
          #           'role': role.name,
          #           'is_opeo, 'occupan_to_work': job_seeker.is_open_to_work,
          #           'address': user.get_address,
          #           'profile_image_url': user.profile_image_url,
          #      })