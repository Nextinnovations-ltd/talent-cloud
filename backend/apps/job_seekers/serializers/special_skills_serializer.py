from rest_framework import serializers
from apps.job_seekers.models import JobSeekerSpecialSkill, JobSeekerSkill
from rest_framework.exceptions import ValidationError

class JobSeekerSkillSerializer(serializers.ModelSerializer):
     """Serializer for JobSeekerSkill - used for nested display"""
     class Meta:
          model = JobSeekerSkill
          fields = ['id', 'title']

class JobSeekerSpecialSkillDisplaySerializer(serializers.ModelSerializer):
     """Serializer for displaying special skills with skill details"""
     skill = JobSeekerSkillSerializer(read_only=True)
     
     class Meta:
          model = JobSeekerSpecialSkill
          fields = ['id', 'skill', 'year_of_experience', 'created_at', 'updated_at']
          read_only_fields = ['id', 'created_at', 'updated_at']

class JobSeekerSpecialSkillCreateUpdateSerializer(serializers.ModelSerializer):
     """Serializer for creating and updating special skills"""
     skill_id = serializers.IntegerField(write_only=True)
     skill = JobSeekerSkillSerializer(read_only=True)
     
     class Meta:
          model = JobSeekerSpecialSkill
          fields = ['id', 'skill_id', 'skill', 'year_of_experience']
          read_only_fields = ['id', 'skill']
     
     def validate_skill_id(self, value):
          """Validate that the skill exists"""
          try:
               JobSeekerSkill.objects.get(id=value)
          except JobSeekerSkill.DoesNotExist:
               raise ValidationError("Invalid skill ID.")
          return value
     
     def validate_year_of_experience(self, value):
          """Validate years of experience"""
          if value is not None and value < 0:
               raise ValidationError("Years of experience cannot be negative.")
          if value is not None and value > 50:
               raise ValidationError("Years of experience cannot exceed 50 years.")
          return value
     
     def validate(self, attrs):
          """Validate the entire special skill data"""
          skill_id = attrs.get('skill_id')
          user = self.context['request'].user.jobseeker if hasattr(self.context['request'].user, 'jobseeker') else None
          
          if not user:
               raise ValidationError("Job seeker profile not found.")
          
          # Check for duplicate skills (only for create operations)
          if not self.instance:  # Creating new record
               if JobSeekerSpecialSkill.objects.filter(user=user, skill_id=skill_id).exists():
                    raise ValidationError("This skill is already added to your special skills.")
               
               # Check maximum skills limit
               existing_count = JobSeekerSpecialSkill.objects.filter(user=user).count()
               
               if existing_count >= 6:
                    raise ValidationError("You can add maximum 6 special skills.")
          
          return attrs
     
     def create(self, validated_data):
          """Create a new special skill"""
          skill_id = validated_data.pop('skill_id')
          user = self.context['request'].user.jobseeker
          
          special_skill = JobSeekerSpecialSkill.objects.create(
               user=user,
               skill_id=skill_id,
               **validated_data
          )
          
          return special_skill
     
     def update(self, instance, validated_data):
          """Update an existing special skill"""
          skill_id = validated_data.pop('skill_id', None)
          
          if skill_id:
               # Check if changing to a skill that already exists for this user
               if JobSeekerSpecialSkill.objects.filter(
                    user=instance.user, 
                    skill_id=skill_id
               ).exclude(id=instance.id).exists():
                    raise ValidationError("This skill is already in your special skills list.")
               
               instance.skill_id = skill_id
          
          instance.year_of_experience = validated_data.get('year_of_experience', instance.year_of_experience)
          instance.save()
          return instance
     
     def to_representation(self, instance):
          """Use display serializer for output"""
          return JobSeekerSpecialSkillDisplaySerializer(instance, context=self.context).data