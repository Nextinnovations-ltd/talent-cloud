from rest_framework import serializers
from apps.job_posting.models import JobPost
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

# class ApplicantDashboardSerializer(serializers.ModelSerializer):
#      applicant_id
     
#      class Meta:
#           model=JobSeeker
#           fields = [
#                'applicant_id', 'name', 'phone_number', 'email', 'role', 'is_open_to_work',
#                'address', 'profile_image_url'
#           ]
          
          
          
#           # 'applicant_id': user.pk,
#           #           'name': user.name,
#           #           'phone_number': f"{user.country_code}{user.phone_number}" if user.country_code is not None and user.phone_number is not None else None,
#           #           'email': user.email,
#           #           'role': role.name,
#           #           'is_open_to_work': job_seeker.is_open_to_work,
#           #           'address': user.get_address,
#           #           'profile_image_url': user.profile_image_url,