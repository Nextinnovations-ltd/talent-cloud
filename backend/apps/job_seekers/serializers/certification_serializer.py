from rest_framework import serializers
from apps.job_seekers.models import JobSeekerCertification
from django.utils import timezone

class CertificationDisplaySerializer(serializers.ModelSerializer):
     certification_image_url = serializers.SerializerMethodField()

     class Meta:
          model = JobSeekerCertification
          fields = [ 'id', 'title', 'organization', 'issued_date', 'expiration_date', 'has_expiration_date', 'url', 'credential_id', 'certification_image_url' ]
          read_only_fields = ['id', 'issued_date', 'expiration_date']
     
     def get_certification_image_url(self, obj: JobSeekerCertification):
          return obj.certification_image_url


class CertificationCreateUpdateSerializer(serializers.ModelSerializer):
     certification_image_url = serializers.SerializerMethodField()
     expiration_date = serializers.DateField(required=False, allow_null=True)
     
     class Meta:
          model = JobSeekerCertification
          fields = ('id', 'title', 'organization', 'issued_date', 'expiration_date', 'has_expiration_date', 'url', 'certification_image_url')
          read_only_fields = ['id']
     
     def to_internal_value(self, data):
          if not data.get('has_expiration_date', True):
               data_copy = data.copy()
               data_copy.pop('expiration_date', None)
               
               validated_data = super().to_internal_value(data_copy)
               
               validated_data['expiration_date'] = None
               
               return validated_data
          
          return super().to_internal_value(data)
     
     def validate_title(self, value):
          """Validate certification title"""
          if not value or len(value.strip()) < 3:
               raise serializers.ValidationError("Certification title must be at least 3 characters long.")
          return value.strip()
     
     def validate_url(self, value):
        """Validate certification URL format"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Certification URL must start with http:// or https://")
        return value
    
     def validate(self, attrs):
          has_expiration = attrs.get('has_expiration_date', False)
          issued_date = attrs.get('issued_date')
          expiration_date = attrs.get('expiration_date')
          today = timezone.now().date()
     
          if not has_expiration and expiration_date:
               raise serializers.ValidationError("If 'Does Not Expire' is checked, an expiration date cannot be provided.")
          
          if has_expiration and not expiration_date:
               raise serializers.ValidationError("An expiration date is required.")

          if issued_date and expiration_date:
               if issued_date > expiration_date:
                    raise serializers.ValidationError("Issued date cannot be after the expiration date.")
                    
               if expiration_date > today:
                    pass

          if issued_date and issued_date > today:
               raise serializers.ValidationError("Issued date cannot be in the future.")
          
          return attrs
          
     def get_certification_image_url(self, obj: JobSeekerCertification):
          return obj.certification_image_url
     
     def create(self, validated_data):
          """Create a new certification"""
          user = self.context['request'].user.jobseeker
          certification = JobSeekerCertification.objects.create(
               user=user,
               **validated_data
          )
          
          return certification
     
     def update(self, instance, validated_data):
          """Update an existing certification"""
          for attr, value in validated_data.items():
               setattr(instance, attr, value)
          
          instance.save()
          
          return instance
     
     def to_representation(self, instance):
        """Use display serializer for output"""
        return CertificationDisplaySerializer(instance, context=self.context).data