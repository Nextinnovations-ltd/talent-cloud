from services.job_seeker.certification_service import CertificationService
from ..models import JobSeekerCertification
from ..serializers.certification_serializer import CertificationCreateUpdateSerializer, CertificationDisplaySerializer
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserPermission
from utils.response import CustomResponse
import logging

logger = logging.getLogger(__name__)


# @extend_schema(tags=["Job Seeker"])
# class CertificationViewSet(BaseModelViewSet):
#      serializer_class = CertificationSerializer
#      queryset = JobSeekerCertification.objects.all()

@extend_schema(tags=["Job Seeker Certification"])
class JobSeekerCertificationListAPIView(APIView):
     """
     List all certifications and create new certification
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          """Get all certifications for the authenticated job seeker"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          certifications = JobSeekerCertification.objects.filter(
               user=job_seeker
          ).order_by('-issued_date', '-created_at')
          
          serializer = CertificationDisplaySerializer(
               certifications, 
               many=True,
               context={'request': request}
          )
          
          return Response(
               CustomResponse.success(
                    "Certifications retrieved successfully.",
                    serializer.data
               ),
               status=status.HTTP_200_OK
          )
     
     def post(self, request):
          """Create a new certification"""
          upload_id = request.data.get('Certification_image_upload_id')

          serializer = CertificationCreateUpdateSerializer(
               data=request.data,
               context={'request': request}
          )
          
          if serializer.is_valid():
               certification_data = CertificationService.performed_certification_creation(request.user, serializer.validated_data, upload_id)
               
               return Response(
                    CustomResponse.success(
                         "Certification created successfully.",
                         certification_data
                    ),
                    status=status.HTTP_201_CREATED
               )
          
          return Response(
               CustomResponse.error(
                    "Validation failed.",
                    serializer.errors
               ),
               status=status.HTTP_400_BAD_REQUEST
          )

@extend_schema(tags=["Job Seeker Certifications"])
class JobSeekerCertificationDetailAPIView(APIView):
     """
     Retrieve, update or delete a specific certification
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get_object(self, request, certification_id):
          """Get certification object ensuring it belongs to the authenticated user"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return None

          try:
               certification = JobSeekerCertification.objects.get(
                    id=certification_id,
                    user=job_seeker
               )
               
               return certification
          except JobSeekerCertification.DoesNotExist:
               raise ValidationError("Certification not found.")

     def get(self, request, certification_id):
          """Get a specific certification"""
          certification = self.get_object(request, certification_id)
          
          if not certification:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          serializer = CertificationDisplaySerializer(
               certification,
               context={'request': request}
          )
          
          return Response(
               CustomResponse.success(
                    "Certification retrieved successfully.",
                    serializer.data
               ),
               status=status.HTTP_200_OK
          )

     def put(self, request, certification_id):
          """Update a certification"""
          certification = self.get_object(request, certification_id)
          
          
          if not certification:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )
          
          upload_id = request.data.get('Certification_image_upload_id')
          
          serializer = CertificationCreateUpdateSerializer(
               instance=certification,
               data=request.data,
               partial=True,
               context={'request': request}
          )
          
          if serializer.is_valid():
               try:
                    if upload_id:
                         logger.info(f"Updating certification {certification_id} with new image (upload_id: {upload_id})")
                         
                         certification_data = CertificationService.performed_certification_update(
                              request.user,
                              certification, 
                              serializer.validated_data, 
                              upload_id
                         )
                         
                         return Response(
                         CustomResponse.success(
                              "Certification updated successfully with new image.",
                              certification_data
                         ),
                         status=status.HTTP_200_OK
                         )
                    else:
                         logger.info(f"Updating certification {certification_id} without image change")
                         
                         certification_data = CertificationService.performed_certification_update(
                              request.user,
                              certification, 
                              serializer.validated_data
                         )
                         
                         return Response(
                         CustomResponse.success(
                              "Certification updated successfully.",
                              certification_data
                         ),
                         status=status.HTTP_200_OK
                         )
               except Exception as e:
                    logger.error(f"Error updating certification {certification_id}: {str(e)}")
                    return Response(
                         CustomResponse.error("Failed to update certification"),
                         status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
          
          return Response(
               CustomResponse.error(
                    "Validation failed.",
                    serializer.errors
               ),
               status=status.HTTP_400_BAD_REQUEST
          )

     def delete(self, request, certification_id):
          """Delete a certification"""
          certification = self.get_object(request, certification_id)

          if not certification:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )

          certification.delete()

          return Response(
               CustomResponse.success("Certification deleted successfully."),
               status=status.HTTP_200_OK
          )


@extend_schema(tags=["Certification Image Upload"])
class CertificationImageUploadUrlAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Generate presigned URL for certification image upload"
     )
     def post(self, request):
          """
          Generate presigned URL when user confirms certification image upload
          """
          try:
               filename = request.data.get('filename')
               file_size = request.data.get('file_size')
               content_type = request.data.get('content_type')
               
               # Validation
               if not filename:
                    raise ValidationError("filename is required")
               if not file_size:
                    raise ValidationError("file_size is required")
               if len(filename.strip()) == 0:
                    raise ValidationError("filename cannot be empty")
               
               response_data = CertificationService.generate_certification_image_upload_url(request.user, filename, file_size, content_type)
               
               logger.info(f"Generated certification image upload URL for user {request.user.id}")
               
               return Response(
                    CustomResponse.success("Certification image upload URL generated", response_data),
                    status=status.HTTP_200_OK
               )
          except Exception as e:
               logger.error(f"Error generating certification image upload URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate upload URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Certification Image Delete"])
class CertificationImageDeleteAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Delete the uploaded certification image.",
     )
     def get_object(self, request, project_id):
          """Get certification object ensuring it belongs to the authenticated user"""
          try:
               job_seeker = request.user.jobseeker
          except AttributeError:
               return None

          return get_object_or_404(
               JobSeekerCertification,
               id=project_id,
               user=job_seeker
          )
     
     def post(self, request, certification_id):
          """
          Delete the uploaded certification image
          """
          certification = self.get_object(request, certification_id)

          if not certification_id:
               return Response(
                    CustomResponse.error("Job seeker profile not found."),
                    status=status.HTTP_404_NOT_FOUND
               )

          try:
               CertificationService.performed_certification_image_deletion(request.user, certification)
               
               return Response(
                    CustomResponse.success("Certification image deleted successfully."),
                    status=status.HTTP_200_OK
               )
               
          except Exception as e:
               logger.error(f"Error deleting certification image of project {certification_id}: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to delete certification image"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )
     