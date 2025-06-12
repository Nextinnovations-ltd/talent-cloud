from rest_framework import serializers
from services.job_seeker.occupation_service import JobSeekerRoleService
from ..models import JobSeekerOccupation, JobSeekerSpecialization, JobSeekerSkill, JobSeekerRole, JobSeekerExperienceLevel, SpokenLanguage

class JobSeekerOccupationSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerOccupation
          fields = ('id', 'role', 'specialization', 'skills', 'experience_level', 'experience_years')

class JobSeekerSpecializationSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerSpecialization
          fields = ['id', 'name', 'description']

class JobSeekerRoleSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerRole
          fields = ['id', 'name', 'specialization']
          
     def update(self, instance, validated_data):
          try:
               instance = JobSeekerRoleService.update_job_seeker_role(instance, validated_data)
               
               return instance
          except ValueError as e:
               raise serializers.ValidationError(e)
     
class JobSeekerSkillSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerSkill
          fields = ['id', 'title']
          
class JobSeekerExperienceLevelSerializer(serializers.ModelSerializer):
     class Meta:
          model = JobSeekerExperienceLevel
          fields = ['id', 'level']

class JobSeekerSpokenLanguageSerializer(serializers.ModelSerializer):
     class Meta:
          model = SpokenLanguage
          fields = ['id', 'name']
          
class SpokenLanguageSerializer(serializers.ModelSerializer):
     class Meta:
          model = SpokenLanguage
          fields = ['id', 'name']