from rest_framework import serializers
from apps.job_seekers.models import Resume

class ResumeSerializer(serializers.ModelSerializer):
     uploaded_at = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     
     class Meta:
          model = Resume
          fields = ['id', 'resume_url', 'is_default', 'uploaded_at']
     
     def get_uploaded_at(self, obj: Resume):
          if not obj.file_upload:
               return None
          
          return obj.file_upload.uploaded_at
     
     def get_resume_url(self, obj: Resume):
          return obj.resume_url