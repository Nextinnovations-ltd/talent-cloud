from rest_framework import serializers
from services.storage.s3_service import S3Service

class FileUploadSerializer(serializers.ModelSerializer):
    public_url = serializers.SerializerMethodField()
    
    class Meta:
        from apps.authentication.models import FileUpload
        
        model=FileUpload
        fields=['id','original_filename','file_path','file_type','file_size','public_url','upload_status']
        
    def get_public_url(self, obj):
        return S3Service.get_public_url(obj.file_path)
