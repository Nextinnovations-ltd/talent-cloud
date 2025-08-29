from rest_framework import serializers
from apps.job_seekers.models import JobSeekerEducation
from services.job_seeker.shared_service import JobSeekerSharedService

class EducationSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerEducation
          fields = ('id', 'degree', 'institution', 'start_date', 'end_date', 'description', 'is_currently_attending', 'user')
          read_only_fields = ('user',)
     
     def validate(self, attrs):
          """Validate the entire education data"""
          start_date = attrs.get('start_date')
          end_date = attrs.get('end_date')
          is_ongoing = attrs.get('is_currently_attending', False)
          
          JobSeekerSharedService.validate_date_range(start_date, end_date, is_ongoing)
          
          return attrs