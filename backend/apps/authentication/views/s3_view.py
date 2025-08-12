from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from services.storage.s3_service import S3Service
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from apps.authentication.models import FileUpload
from datetime import datetime, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["File Upload"])
class GenerateUploadURLAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          """
          Generate presigned URL for uploading files to S3
          """
          try:
               # Validate authentication
               if not request.user or not request.user.is_authenticated:
                    raise ValidationError("User not authenticated")
               
               # Get parameters
               file_type = request.query_params.get('file_type')
               filename = request.query_params.get('filename')
               file_size = request.query_params.get('file_size')
               content_type = request.query_params.get('content_type')
               
               # Auto-detect content type if not provided
               if not content_type and filename:
                    content_type = S3Service.get_content_type_from_filename(filename)
               
               # Clean and validate content type
               if content_type:
                    content_type = content_type.lower().strip()
               
               # Convert file_size to integer if provided
               if file_size:
                    try:
                         file_size = int(file_size)
                    except ValueError:
                         raise ValidationError("Invalid file_size format")
               
               # Generate unique file path
               file_path = S3Service.generate_unique_file_path(
                    user_id=request.user.id,
                    file_type=file_type,
                    original_filename=filename
               )
               
               # Generate presigned URL with proper content type
               upload_data = S3Service.generate_presigned_upload_url(
                    file_path=file_path,
                    file_type=content_type,  # Use the validated content type
                    file_size=file_size,
                    expiration=3600
               )
               
               # Create tracking record
               file_upload = FileUpload.objects.create(
                    user=request.user,
                    file_type=file_type,
                    original_filename=filename,
                    file_path=file_path,
                    file_size=file_size,
                    content_type=content_type,
                    upload_url_expires_at=datetime.now() + timedelta(hours=1)
               )
               
               response_data = {
                    'upload_id': str(file_upload.id),
                    'upload_url': upload_data['upload_url'],
                    'fields': upload_data['fields'],
                    'file_path': file_path,
                    'expires_in': 3600,
                    'expected_content_type': upload_data['content_type'],
                    'instructions': {
                         'method': 'POST',
                         'description': 'Use exact fields provided in the response',
                         'important': f'Content-Type must be exactly: {upload_data["content_type"]}'
                    }
               }
               
               return Response(
                    CustomResponse.success("Upload URL generated successfully", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error generating upload URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate upload URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["File Upload"])
class ConfirmUploadAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Confirm successful file upload",
          request={
               'application/json': {
                    'type': 'object',
                    'properties': {
                         'upload_id': {'type': 'string', 'description': 'Upload ID from generate URL endpoint'},
                         'file_size': {'type': 'integer', 'description': 'Actual uploaded file size'},
                    },
                    'required': ['upload_id']
               }
          }
     )
     def post(self, request):
          """
          Confirm that file was successfully uploaded to S3
          """
          try:
               if not request.user or not request.user.is_authenticated:
                    raise ValidationError("User not authenticated")
               
               upload_id = request.data.get('upload_id')
               file_size = request.data.get('file_size')
               
               if not upload_id:
                    raise ValidationError("upload_id is required")
               
               # Get upload record
               try:
                    file_upload = FileUpload.objects.get(
                         id=upload_id,
                         user=request.user,
                         upload_status='pending'
                    )
               except FileUpload.DoesNotExist:
                    raise ValidationError("Invalid upload_id or upload already processed")
               
               # Check if file exists in S3
               if not S3Service.check_file_exists(file_upload.file_path):
                    raise ValidationError("File not found in S3. Upload may have failed.")
               
               # Update upload record
               file_upload.upload_status = 'uploaded'
               file_upload.uploaded_at = datetime.now()
               if file_size:
                    file_upload.file_size = file_size
               file_upload.save()
               
               # Generate download URL for immediate access
               download_url = S3Service.generate_presigned_download_url(
                    file_upload.file_path,
                    expiration=3600
               )
               
               response_data = {
                    'upload_id': str(file_upload.id),
                    'file_path': file_upload.file_path,
                    'download_url': download_url,
                    'file_type': file_upload.file_type,
                    'uploaded_at': file_upload.uploaded_at,
                    'upload_status': 'uploaded'
               }
               
               return Response(
                    CustomResponse.success("File upload confirmed successfully", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error confirming upload: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to confirm upload"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["File Upload"])
class GetDownloadURLAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Get download URL for uploaded file",
          parameters=[
               OpenApiParameter(
                    name='upload_id',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    required=True,
                    description='Upload ID of the file'
               ),
          ]
     )
     def get(self, request):
          """
          Generate download URL for uploaded file
          """
          try:
               if not request.user or not request.user.is_authenticated:
                    raise ValidationError("User not authenticated")
               
               upload_id = request.query_params.get('upload_id')
               
               if not upload_id:
                    raise ValidationError("upload_id is required")
               
               # Get upload record
               try:
                    file_upload = FileUpload.objects.get(
                         id=upload_id,
                         user=request.user,
                         upload_status='uploaded'
                    )
               except FileUpload.DoesNotExist:
                    raise ValidationError("File not found or not uploaded")
               
               # Generate download URL
               download_url = S3Service.generate_presigned_download_url(
                    file_upload.file_path,
                    expiration=3600
               )
               
               response_data = {
                    'upload_id': str(file_upload.id),
                    'download_url': download_url,
                    'file_type': file_upload.file_type,
                    'original_filename': file_upload.original_filename,
                    'file_size': file_upload.file_size,
                    'expires_in': 3600
               }
               
               return Response(
                    CustomResponse.success("Download URL generated successfully", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error generating download URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate download URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )