from rest_framework import serializers
from apps.job_seekers.models import Resume

class ResumeSerializer(serializers.ModelSerializer):
     original_file_name = serializers.SerializerMethodField()
     uploaded_at = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     
     class Meta:
          model = Resume
          fields = ['id', 'original_file_name', 'resume_url', 'is_default', 'uploaded_at']
     
     def get_uploaded_at(self, obj: Resume):
          if not obj.file_upload:
               return None
          
          return obj.file_upload.uploaded_at
     
     def get_resume_url(self, obj: Resume):
          return obj.resume_url
     
     def get_original_file_name(self, obj: Resume):
          return obj.file_name