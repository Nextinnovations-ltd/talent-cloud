import mimetypes, boto3, uuid
from typing import List, Dict, Any
from datetime import datetime, timedelta
from django.conf import settings
from botocore.exceptions import ClientError
from rest_framework.exceptions import ValidationError
from core.constants.s3.constants import FILE_TYPES, UPLOAD_MAPPER
import logging

logger = logging.getLogger(__name__)

class S3Service:
     def __init__(self):
          self.s3_client = boto3.client(
               "s3", 
               aws_access_key_id=settings.AWS_ACCESS_KEY, 
               aws_secret_access_key=settings.AWS_SECRET_KEY,
               region_name=getattr(settings, 'AWS_REGION', 'us-east-1')
          )
          self.bucket_name = settings.AWS_BUCKET_NAME

     @staticmethod
     def get_public_url(file_path):
          """
          Get public URL for S3 file (if bucket allows public access)
          """
          if not file_path:
               return None
               
          bucket_name = settings.AWS_BUCKET_NAME
          region = settings.AWS_S3_REGION_NAME
          
          return f"https://{bucket_name}.s3.{region}.amazonaws.com/{file_path}"

     @classmethod
     def get_content_type_from_filename(cls, filename):
          """Get proper content type from filename"""
          content_type, _ = mimetypes.guess_type(filename)
          if not content_type:
               extension = filename.split('.')[-1].lower()
               content_type_map = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg', 
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'pdf': 'application/pdf',
                    'doc': 'application/msword',
                    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'txt': 'text/plain',
                    'svg': 'image/svg+xml'
               }
               content_type = content_type_map.get(extension, 'application/octet-stream')
          return content_type

     @classmethod
     def get_allowed_content_types(cls, file_type=FILE_TYPES.PROFILE_IMAGE):
          return UPLOAD_MAPPER.TYPE_MAP.get(file_type, {}).get("content_types", [])

     @classmethod
     def get_max_size(cls, file_type=FILE_TYPES.PROFILE_IMAGE):
          return UPLOAD_MAPPER.TYPE_MAP.get(file_type, {}).get("max_size", 0)

     @classmethod
     def validate_file_upload(cls, content_type, file_size, file_type):
          allowed_types = cls.get_allowed_content_types(file_type)
          
          # check allowed content_types
          if content_type not in allowed_types:
               raise ValidationError(
                    f"Invalid file type. Allowed: {', '.join(allowed_types)}"
               )

          # check size limit
          max_size = cls.get_max_size(file_type)
          
          if file_size > max_size:
               raise ValidationError(
                    f"File too large. Max allowed size: {max_size // (1024 * 1024)} MB"
               )
          
          return allowed_types, max_size

     @classmethod
     def generate_presigned_upload_url(cls, file_path, file_type=None, file_size=None, expiration=3600):
          try:
               s3_service = cls()

               # Auto-detect content type if not provided
               if not file_type:
                    file_type = cls.get_content_type_from_filename(file_path)
               
               # Ensure content type is clean and consistent
               file_type = file_type.lower().strip() if file_type else 'application/octet-stream'

               # File size limit (default 10MB)
               max_size = file_size or 10 * 1024 * 1024  # 10MB

               # Prepare fields - this is crucial for the policy to work correctly
               fields = {
                    'Content-Type': file_type
               }

               # Prepare conditions for presigned post
               conditions = [
                    {"Content-Type": file_type},  # Exact match condition
                    ["content-length-range", 1, max_size]
               ]

               logger.info(f"Generating presigned URL:")
               logger.info(f"  Bucket: {s3_service.bucket_name}")
               logger.info(f"  File path: {file_path}")
               logger.info(f"  Content-Type: {file_type}")
               logger.info(f"  Max size: {max_size}")
               
               # Generate presigned POST URL with both Fields and Conditions
               response = s3_service.s3_client.generate_presigned_post(
                    Bucket=s3_service.bucket_name,
                    Key=file_path,
                    Fields=fields,
                    Conditions=conditions,
                    ExpiresIn=expiration
               )
               
               logger.info(f"Generated presigned URL successfully")
               logger.info(f"Fields in response: {response.get('fields', {})}")
               
               return {
                    'upload_url': response['url'],
                    'fields': response['fields'],
                    'file_path': file_path,
                    'expires_in': expiration,
                    'content_type': file_type
               }
               
          except ClientError as e:
               logger.error(f"Error generating presigned URL: {str(e)}")
               raise Exception(f"Failed to generate upload URL: {str(e)}")

     @classmethod
     def generate_presigned_download_url(cls, file_path, expiration=3600):
          """Generate presigned URL for downloading files from S3"""
          try:
               service = cls()
               url = service.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': service.bucket_name, 'Key': file_path},
                    ExpiresIn=expiration
               )
               return url
          except ClientError as e:
               logger.error(f"Error generating download URL: {str(e)}")
               raise Exception("Failed to generate download URL")
     
     @classmethod
     def check_file_exists(cls, file_path):
          """Check if file exists in S3"""
          try:
               service = cls()
               service.s3_client.head_object(Bucket=service.bucket_name, Key=file_path)
               return True
          except ClientError:
               return False

     @classmethod
     def delete_file(cls, file_path):
          """Delete file from S3"""
          try:
               service = cls()
               service.s3_client.delete_object(Bucket=service.bucket_name, Key=file_path)
               return True
          except ClientError as e:
               logger.error(f"Error deleting file: {str(e)}")
               return False
     
     @classmethod
     def generate_unique_file_path(cls, file_type, original_filename=None):
          """Generate organized file path structure"""
          timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
          unique_id = str(uuid.uuid4())[:8]
          
          # Extract file extension
          if original_filename:
               extension = original_filename.split('.')[-1].lower()
               base_name = original_filename.split('.')[0].lower()
               base_name = ''.join(c for c in base_name if c.isalnum() or c in '_-') # Clean the base name for filename safety
          else:
               extension = 'unknown'
               base_name = 'file'
          
          print(f"Generated timestamp: {timestamp}")
          
          # Filename with timestamp
          file_name = f'{base_name}_{timestamp}_{unique_id}'
          
          # Organize by file type and user
          path_mapping = {
               'resume': f'{settings.ENVIRONMENT}/resumes/{file_name}.{extension}',
               'application_resume': f'{settings.ENVIRONMENT}/application-resumes/{file_name}.{extension}',
               'profile_image': f'{settings.ENVIRONMENT}/profiles/{file_name}.{extension}',
               'cover_letter': f'{settings.ENVIRONMENT}/cover-letters/{file_name}.{extension}',
               'project_image': f'{settings.ENVIRONMENT}/projects/{file_name}.{extension}',
               'company_logo': f'{settings.ENVIRONMENT}/companies/logos/{file_name}.{extension}',
               'job_attachment': f'{settings.ENVIRONMENT}/jobs/attachments/{file_name}.{extension}',
               'document': f'{settings.ENVIRONMENT}/documents/{file_name}.{extension}'
          }
          
          return path_mapping.get(file_type, f'misc/{file_name}.{extension}')

     @staticmethod
     def update_upload_status(user, upload_id):
          """
          General method for all types of file upload for changing the upload 
          status after success
          """
          from apps.authentication.models import FileUpload
          try:
               file_upload = FileUpload.objects.get(
                    id=upload_id,
                    user=user,
                    upload_status='pending'
               )
          except FileUpload.DoesNotExist:
               raise ValidationError("Invalid upload_id or upload already processed")

          # Update upload record
          file_upload.upload_status = 'uploaded'
          file_upload.uploaded_at = datetime.now()
          file_upload.save()
          
          return file_upload


     # Bulk File Operations
     
     @classmethod
     def generate_bulk_presigned_upload_urls(cls, files_data: List[Dict], user, expiration=3600) -> Dict[str, Any]:
          """
          Generate presigned URLs for multiple files
          
          Args:
               files_data: List of dicts with keys: 'filename', 'file_size', 'content_type', 'file_type'
               user_id: User ID for file path generation
               expiration: URL expiration time in seconds
               
          Returns:
               Dict with success/failed uploads and their respective data
          """
          results = {
               'successful_uploads': [],
               'failed_uploads': [],
               'total_files': len(files_data),
               'success_count': 0,
               'error_count': 0,
               'upload_records': []
          }
          
          for file_data in files_data:
               try:
                    # Validate required fields
                    required_fields = ['filename', 'file_size', 'file_type']
                    for field in required_fields:
                         if field not in file_data:
                              raise ValidationError(f"Missing required field: {field}")
                    
                    filename = file_data['filename']
                    file_size = file_data['file_size']
                    file_type = file_data['file_type']
                    content_type = file_data.get('content_type') or cls.get_content_type_from_filename(filename)
                    
                    # Validate file upload
                    cls.validate_file_upload(content_type, file_size, file_type)
                    
                    # Generate unique file path
                    file_path = cls.generate_unique_file_path(file_type, filename)
                    
                    # Generate presigned URL
                    presigned_data = cls.generate_presigned_upload_url(
                         file_path=file_path,
                         file_type=content_type,
                         file_size=file_size,
                         expiration=expiration
                    )
                    
                    data = {
                         'filename': filename,
                         'file_type': file_type,
                         'file_size': file_size,
                         'file_path': file_path,
                         'upload_url': presigned_data['upload_url'],
                         'expires_in': expiration
                    }
                    
                    results['successful_uploads'].append(data)
                    results['success_count'] += 1
                    
                    logger.info(f"Generated presigned URL for bulk upload: {filename}")
               except Exception as e:
                    error_data = {
                         'filename': file_data.get('filename', 'unknown'),
                         'error': str(e),
                         'file_data': file_data
                    }
                    results['failed_uploads'].append(error_data)
                    results['error_count'] += 1
                    
                    logger.error(f"Failed to generate presigned URL for {file_data.get('filename', 'unknown')}: {str(e)}")
          
          # Create upload records for successful uploads only
          if results['successful_uploads']:
               try:
                    upload_records = cls._create_bulk_upload_record(
                         user,
                         uploads=results['successful_uploads']
                    )
                    
                    # Add upload_ids to the success data
                    for i, upload_record in enumerate(upload_records):
                         if i < len(results['successful_uploads']):
                              results['successful_uploads'][i]['upload_id'] = upload_record.id
                    
                    results['upload_records'] = [
                         {
                              'id': record.id,
                              'filename': record.original_filename,
                              'file_path': record.file_path,
                              'upload_status': record.upload_status
                         }
                         for record in upload_records
                    ]
                    
                    logger.info(f"Created {len(upload_records)} upload records for bulk upload")
                    
               except Exception as e:
                    logger.error(f"Failed to create upload records: {str(e)}")
                    # If database creation fails, mark all as failed
                    for success_data in results['successful_uploads']:
                         error_data = {
                              'filename': success_data['filename'],
                              'error': f"Database record creation failed: {str(e)}",
                              'file_data': success_data
                         }
                         results['failed_uploads'].append(error_data)
                    
                    # Clear successful uploads since database creation failed
                    results['error_count'] += results['success_count']
                    results['success_count'] = 0
                    results['successful_uploads'] = []
          
          
          return results

     @classmethod
     def validate_bulk_upload_completion(cls, user, upload_ids: List[int]) -> Dict[str, Any]:
          """
          Validate and update status for multiple completed uploads
          
          Args:
               upload_ids: List of upload IDs to validate
               user_id: User ID for security validation
               
          Returns:
               Dict with validation results
          """
          total_record_count = len(upload_ids)
          
          results = {
               'success_records': [],
               'total_uploads': total_record_count,
               'success_count': 0,
               'error_count': 0
          }
          
          updated_record_count = 0
          
          try:
               # Update upload status in bulk
               updated_records = cls.bulk_update_upload_status(user, upload_ids)
          
               if not updated_records['success_ids']:
                    results['error_count'] = len(upload_ids)
                    
                    return results
               
               results['success_records'] = updated_records['updated_records']
               
               # Verify file exists in S3
               # file_exists = cls.check_file_exists(file_upload.file_path)
               # cls.get_public_url(file_upload.file_path),
               
               logger.info(f"Successfully validated bulk upload.")
          except Exception as e:
               logger.error(f"Failed to validate upload operations: {str(e)}")

          results['success_count'] = updated_record_count
          results['error_count'] = total_record_count - updated_record_count
     
          return results
     
     @staticmethod
     def _create_bulk_upload_record(user, uploads):
          """
          Helper method to create upload record in database
          """
          from apps.authentication.models import FileUpload
          
          upload_objects = []
    
          for upload_data in uploads:
               upload_obj = FileUpload(
                    user=user,
                    original_filename=upload_data['filename'],
                    file_size=upload_data.get('file_size', 0),  # Add file_size to your upload_data
                    file_type=upload_data['file_type'],
                    file_path=upload_data['file_path'],
                    content_type=upload_data.get('content_type', 'application/octet-stream'),
                    upload_status='pending',
                    upload_url_expires_at=datetime.now() + timedelta(minutes=5)
               )
               
               upload_objects.append(upload_obj)
          
          created_records = FileUpload.objects.bulk_create(upload_objects)
          
          logger.info(f"Bulk created {len(created_records)} upload records for user {user.id}")

          return created_records

     @staticmethod
     def bulk_update_upload_status(user, upload_ids):
          """
          General method for all types of file upload for changing the upload 
          status after success in bulk
          """
          from apps.authentication.models import FileUpload
          
          # Filter valid ids
          valid_ids = list(
               FileUpload.objects.filter(
                    id__in=upload_ids,
                    user=user,
                    upload_status='pending'
               ).values_list("id", flat=True)
          )
          
          # Bulk update
          FileUpload.objects.filter(id__in=valid_ids).update(
               upload_status='uploaded',
               uploaded_at=datetime.now()
          )
          
          # Get updated records
          updated_records = FileUpload.objects.filter(id__in=valid_ids, user=user)
          
          return {
               "updated_records": updated_records,
               "success_ids": valid_ids
          }

     @classmethod
     def setup_bucket_cors(cls):
          """Setup CORS configuration for the S3 bucket"""
          try:
               service = cls()
               
               cors_configuration = {
                    'CORSRules': [
                         {
                         'AllowedHeaders': ['*'],
                         'AllowedMethods': ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
                         'AllowedOrigins': [
                              'http://localhost:5173',
                              'http://localhost:3000',
                              'http://localhost:8080',
                              'https://yourdomain.com',
                              'https://www.yourdomain.com'
                         ],
                         'ExposeHeaders': ['ETag', 'x-amz-meta-*'],
                         'MaxAgeSeconds': 3000
                         }
                    ]
               }
               
               service.s3_client.put_bucket_cors(
                    Bucket=service.bucket_name,
                    CORSConfiguration=cors_configuration
               )
               
               logger.info(f"CORS configuration applied successfully to bucket: {service.bucket_name}")
               return True
               
          except ClientError as e:
               logger.error(f"Error setting CORS: {str(e)}")
               return False