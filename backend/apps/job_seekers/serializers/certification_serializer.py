from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.job_seekers.models import JobSeekerCertification

class CertificationSerializer(serializers.ModelSerializer):
     expiration_date = serializers.DateField(required=False, allow_null=True)
     
     class Meta:
          model = JobSeekerCertification
          fields = ('id', 'title', 'organization', 'issued_date', 'expiration_date', 'has_expiration_date', 'url', 'user')
          read_only_fields = ('user',)
     
     def to_internal_value(self, data):
          # Check if has_expiration_date is False and remove expiration_date from validation
          if not data.get('has_expiration_date', True):
               data_copy = data.copy()
               data_copy.pop('expiration_date', None)
               
               validated_data = super().to_internal_value(data_copy)
               
               validated_data['expiration_date'] = None
               
               return validated_data
          
          return super().to_internal_value(data)
     
     def validate(self, attrs):
          has_expiration = attrs.get('has_expiration_date', False)
          expiration_date = attrs.get('expiration_date')
          
          if has_expiration and not expiration_date:
               raise ValidationError('Expiration date is required.')
          
          return attrs