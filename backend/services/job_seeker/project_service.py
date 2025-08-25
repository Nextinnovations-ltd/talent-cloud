from apps.job_seekers.models import JobSeekerProject
from apps.job_seekers.serializers.project_serializer import JobSeekerProjectCreateUpdateSerializer
from services.storage.s3_service import S3Service
from rest_framework.exceptions import ValidationError
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class ProjectService:
     @staticmethod
     def performed_project_creation(user, validated_data, upload_id):
          try:
               with transaction.atomic():
                    file_upload = S3Service.update_upload_status(user, upload_id)

                    return ProjectService.create_project(user, validated_data, file_upload.file_path)
          except Exception as e:
               logger.error(f"Failed to create project: {str(e)}")
               raise ValidationError(f"Failed to create project: {str(e)}")
     
     @staticmethod
     def create_project(user, validated_data, file_path):
          project = JobSeekerProject.objects.create(
               user=user,
               project_image_url = file_path,
               **validated_data
          )

          return JobSeekerProjectCreateUpdateSerializer(project).data