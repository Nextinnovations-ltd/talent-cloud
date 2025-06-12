from rest_framework import serializers
from apps.job_seekers.models import JobSeekerCertification

class CertificationSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerCertification
          fields = ('id', 'title', 'organization', 'issued_date', 'expiration_date', 'has_expiration_date', 'url', 'user')
          read_only_fields = ('user',)