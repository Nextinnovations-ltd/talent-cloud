from rest_framework import serializers
from apps.job_seekers.models import JobSeekerEducation, University
from services.job_seeker.shared_service import JobSeekerSharedService

class UniversitySerializer(serializers.ModelSerializer):
     class Meta:
          model = University
          fields = ['id', 'name', 'country', 'state']

class EducationSerializer(serializers.ModelSerializer):
     institution = serializers.CharField(write_only=False)
     
     class Meta:
          model = JobSeekerEducation
          fields = ('id', 'degree', 'institution', 'start_date', 'end_date', 'description', 'is_currently_attending', 'user')
          read_only_fields = ('user',)
     
     def validate_institution(self, value):
          """
          Validate institution field - can be University ID or custom text
          """
          if not value:
               raise serializers.ValidationError("Institution is required.")
          
          try:
               university_id = value
               
               university = University.objects.get(id=university_id, status=True)
               
               return { 'institution': university, 'custom_institution': None }
          except University.DoesNotExist:
               # raise serializers.ValidationError("Selected university does not exist or is not active.")
               custom_name = str(value).strip()
               
               if not custom_name:
                    raise serializers.ValidationError("Institution name cannot be empty.")
               
               # Check if custom name matches an existing university
               existing_university = University.objects.filter(
                    name__iexact=custom_name,
                    status=True
               ).first()
               
               if existing_university:
                    # Use the existing university
                    return { 'institution': existing_university, 'custom_institution': None}
               else:
                    # Use as custom institution
                    return { 'institution': None, 'custom_institution': custom_name}
     
     
     def validate(self, attrs):
        """Validate the entire education data"""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        is_ongoing = attrs.get('is_currently_attending', False)
        
        JobSeekerSharedService.validate_date_range(start_date, end_date, is_ongoing)
        
        return attrs
    
     def create(self, validated_data):
          """Custom create method to handle institution logic"""
          institution_data = validated_data.pop('institution')
          
          # Set data for institution field
          validated_data['institution'] = institution_data['institution']
          validated_data['custom_institution'] = institution_data['custom_institution']
          
          return super().create(validated_data)
     
     def update(self, instance, validated_data):
          """Custom update method to handle institution logic"""
          if 'institution' in validated_data:
               institution_data = validated_data.pop('institution')
               
               # Set data for institution field
               validated_data['institution'] = institution_data['institution']
               validated_data['custom_institution'] = institution_data['custom_institution']
          
          return super().update(instance, validated_data)
     
     def to_representation(self, instance):
          """Custom output representation - return only institution name"""
          data = super().to_representation(instance)
          
          # Return institution name
          if instance.institution:
               data['institution'] = instance.institution.name
          else:
               data['institution'] = instance.custom_institution
          
          return data