from rest_framework import serializers
from apps.job_seekers.models import JobSeekerProject
from django.utils import timezone

class JobSeekerProjectDisplaySerializer(serializers.ModelSerializer):
    """Serializer for displaying project details"""
    
    class Meta:
        model = JobSeekerProject
        fields = [
            'id', 'title', 'description', 'tags', 
            'project_url', 'project_image_url', 'start_date', 'end_date', 
            'is_ongoing', 'team_size', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobSeekerProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating projects"""
    
    class Meta:
        model = JobSeekerProject
        fields = [
            'id', 'title', 'description', 'tags', 
            'project_url', 'project_image_url', 'start_date', 'end_date', 
            'is_ongoing', 'team_size'
        ]
        read_only_fields = ['id']
    
    def validate_title(self, value):
        """Validate project title"""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Project title must be at least 3 characters long.")
        return value.strip()
    
    def validate_description(self, value):
        """Validate project description"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Project description must be at least 10 characters long.")
        return value.strip()
    
    def validate_tags(self, value):
        """Validate project tags"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list of strings.")
        
        if len(value) > 10:
            raise serializers.ValidationError("Maximum 10 tags allowed per project.")
        
        # Clean and validate each tag
        cleaned_tags = []
        for tag in value:
            if not isinstance(tag, str):
                raise serializers.ValidationError("Each tag must be a string.")
            
            cleaned_tag = tag.strip()
            if len(cleaned_tag) < 2:
                raise serializers.ValidationError("Each tag must be at least 2 characters long.")
            
            if len(cleaned_tag) > 30:
                raise serializers.ValidationError("Each tag must be less than 30 characters.")
            
            # Avoid duplicates
            if cleaned_tag.lower() not in [t.lower() for t in cleaned_tags]:
                cleaned_tags.append(cleaned_tag)
        
        return cleaned_tags
    
    def validate_project_url(self, value):
        """Validate project URL format"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Project URL must start with http:// or https://")
        return value
    
    def validate_project_image_url(self, value):
        """Validate project image URL format"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Project image URL must start with http:// or https://")
        
        # Optional: Check if URL points to an image
        if value:
            image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg')
            if not any(value.lower().endswith(ext) for ext in image_extensions):
                # Allow URLs without file extensions (for cloud storage services)
                pass
        
        return value
    
    def validate(self, attrs):
        """Validate the entire project data"""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        is_ongoing = attrs.get('is_ongoing', False)
        
        # If project is ongoing, end_date should be None
        if is_ongoing and end_date:
            raise serializers.ValidationError("Ongoing projects should not have an end date.")
        
        # If project is not ongoing, it should have an end date
        if not is_ongoing and not end_date and start_date:
            raise serializers.ValidationError("Completed projects must have an end date.")
        
        # Validate date logic
        if start_date and end_date:
            if start_date > end_date:
                raise serializers.ValidationError("Start date cannot be after end date.")
            
            # Check if dates are not in the future (unless ongoing)
            today = timezone.now().date()
            if end_date > today and not is_ongoing:
                raise serializers.ValidationError("End date cannot be in the future for completed projects.")
        
        return attrs
    
    def create(self, validated_data):
        """Create a new project"""
        user = self.context['request'].user.jobseeker
        project = JobSeekerProject.objects.create(
            user=user,
            **validated_data
        )
        return project
    
    def update(self, instance, validated_data):
        """Update an existing project"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Use display serializer for output"""
        return JobSeekerProjectDisplaySerializer(instance, context=self.context).data
