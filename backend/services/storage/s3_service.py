import mimetypes, boto3, uuid
from datetime import datetime
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
                    Fields=fields,  # This was missing in your original code
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
                    'content_type': file_type  # Return the expected content type
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
     def generate_unique_file_path(cls, user_id, file_type, original_filename=None):
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
               'resume': f'resumes/{file_name}.{extension}',
               'profile_image': f'profiles/{file_name}.{extension}',
               'cover_letter': f'cover-letters/{file_name}.{extension}',
               'company_logo': f'companies/logos/{file_name}.{extension}',
               'job_attachment': f'jobs/attachments/{file_name}.{extension}',
               'document': f'documents/{file_name}.{extension}'
          }
          
          return path_mapping.get(file_type, f'misc/{file_name}.{extension}')

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