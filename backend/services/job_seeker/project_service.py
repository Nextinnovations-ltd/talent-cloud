from apps.job_seekers.models import JobSeekerProject
from apps.job_seekers.serializers.project_serializer import JobSeekerProjectCreateUpdateSerializer
from services.job_seeker.file_upload_service import FileUploadService
from services.storage.s3_service import S3Service
from rest_framework.exceptions import ValidationError
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class ProjectService:
     @staticmethod
     def performed_project_creation(user, validated_data, upload_id=None):
          try:
               with transaction.atomic():
                    file_upload_path = None
                    
                    if upload_id:
                         file_upload = S3Service.update_upload_status(user, upload_id)
                         file_upload_path = file_upload.file_path

                    return ProjectService.create_project(user.jobseeker, validated_data, file_upload_path)
          except Exception as e:
               logger.error(f"Failed to create project: {str(e)}")
               raise ValidationError(f"Failed to create project: {str(e)}")
     
     @staticmethod
     def performed_project_update(user, project: JobSeekerProject, validated_data, upload_id=None):
          """
          Update a project with optional image update
          
          Args:
               project: JobSeekerProject instance to update
               validated_data: Validated data from serializer
               upload_id: Optional upload ID for new image
               
          Returns:
               Updated project data
          """
          try:
               old_image_path = project.project_image_url
               
               # If upload_id is provided, handle image update
               if upload_id:
                    # Update upload status and get file info
                    file_upload = S3Service.update_upload_status(user, upload_id)
                    
                    # Update the image URL
                    validated_data['project_image_url'] = file_upload.file_path
                    
                    logger.info(f"Updated project image for project {project.id}")
               
               # Update project fields
               for field, value in validated_data.items():
                    setattr(project, field, value)
               
               project.save()
               
               # Clean up old image if a new one was uploaded
               if upload_id and old_image_path and old_image_path != validated_data.get('project_image_url'):
                    try:
                         S3Service.delete_file(old_image_path)
                         logger.info(f"Deleted old project image: {old_image_path}")
                    except Exception as e:
                         logger.warning(f"Failed to delete old project image {old_image_path}: {str(e)}")
               
               # Return serialized data
               serializer = JobSeekerProjectCreateUpdateSerializer(project)
               
               logger.info(f"Successfully updated project {project.id}")
               
               return serializer.data
          except Exception as e:
               logger.error(f"Error updating project {project.id}: {str(e)}")
               raise ValidationError(f"Failed to update project: {str(e)}")
     
     @staticmethod
     def performed_project_image_deletion(user, project: JobSeekerProject):
          """
          Delete a project image 
          
          Args:
               project: JobSeekerProject instance to delete
          """
          try:
               image_path = project.project_image_url
               
               # Clean up image file if it exists
               if image_path:
                    try:
                         is_deleted = S3Service.delete_file(image_path)
                         
                         if is_deleted:
                              FileUploadService.soft_delete_upload_file(user, image_path)
                              
                              project.project_image_url=None
                              project.save()
                              
                              logger.info(f"Deleted project image: {image_path}")
                         else:
                              logger.warning(f"Failed to delete project image.")
                              raise ValidationError("Error deleting project image.")
                    except Exception as e:
                         logger.warning(f"Failed to delete project image {image_path}: {str(e)}")
               
               logger.info(f"Successfully deleted project image.")
               
          except Exception as e:
               logger.error(f"Error deleting project image: {str(e)}")
               raise ValidationError(f"Failed to delete project image: {str(e)}")
               
     @staticmethod
     def create_project(user, validated_data, file_path):
          project = JobSeekerProject.objects.create(
               user=user,
               project_image_url = file_path,
               **validated_data
          )

          return JobSeekerProjectCreateUpdateSerializer(project).data
     
     @staticmethod
     def get_projects(user_id):
          return JobSeekerProject.objects.filter(user__id=user_id).order_by('-created_at')