import boto3, uuid
import mimetypes
from botocore.exceptions import ClientError
from datetime import datetime
from django.conf import settings
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
          timestamp = datetime.now().strftime('%Y/%m/%d')
          unique_id = str(uuid.uuid4())
          
          # Extract file extension
          if original_filename:
               extension = original_filename.split('.')[-1].lower()
          else:
               extension = 'unknown'
          
          # Organize by file type and user
          path_mapping = {
               'resume': f'resumes/{user_id}/{timestamp}/{unique_id}.{extension}',
               'profile_photo': f'profiles/{user_id}/photos/{unique_id}.{extension}',
               'cover_letter': f'cover-letters/{user_id}/{timestamp}/{unique_id}.{extension}',
               'company_logo': f'companies/{user_id}/logos/{unique_id}.{extension}',
               'job_attachment': f'jobs/{user_id}/attachments/{timestamp}/{unique_id}.{extension}',
               'document': f'documents/{user_id}/{timestamp}/{unique_id}.{extension}'
          }
          
          return path_mapping.get(file_type, f'misc/{user_id}/{timestamp}/{unique_id}.{extension}')

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