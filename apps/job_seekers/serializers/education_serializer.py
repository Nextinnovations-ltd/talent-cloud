from rest_framework import serializers
from apps.job_seekers.models import JobSeekerEducation

class EducationSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerEducation
          fields = ('id', 'degree', 'institution', 'start_date', 'end_date', 'description', 'is_currently_attending', 'user')
          read_only_fields = ('user',)