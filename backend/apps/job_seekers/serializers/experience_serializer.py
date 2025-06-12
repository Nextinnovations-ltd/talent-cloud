from rest_framework import serializers
from apps.job_seekers.models import JobSeekerExperience

class ExperienceSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerExperience
          fields = ('id', 'title', 'organization', 'job_type', 'work_type', 'start_date', 'end_date', 'description', 'is_present_work','user')
          read_only_fields = ('user',)