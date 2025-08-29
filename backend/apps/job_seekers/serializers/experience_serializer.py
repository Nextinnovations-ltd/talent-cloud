from rest_framework import serializers
from apps.job_seekers.models import JobSeekerExperience
from services.job_seeker.shared_service import JobSeekerSharedService

class ExperienceSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerExperience
          fields = ('id', 'title', 'organization', 'job_type', 'work_type', 'start_date', 'end_date', 'description', 'is_present_work','user')
          read_only_fields = ('user',)
     
     def validate(self, attrs):
          """Validate the entire experience data"""
          start_date = attrs.get('start_date')
          end_date = attrs.get('end_date')
          is_ongoing = attrs.get('is_present_work', False)
          
          JobSeekerSharedService.validate_date_range(start_date, end_date, is_ongoing)
          
          return attrs