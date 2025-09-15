from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.http import Http404
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from apps.companies.serializers import CompanySerializer, IndustrySerializer, CompanyWithJobsSerializer
from apps.users.models import TalentCloudUser
from services.company.company_service import BulkUploadService, update_parent_company
from utils.response import CustomResponse
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudAdminOrSuperAdminPermission, TalentCloudAllPermission, TalentCloudSuperAdminPermission, TalentCloudUserPermission
from .models import Company, Industry
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["Industry"])
class IndustryListAPIView(views.APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get(self, request):
          """
          List all industries.
          """
          industries = Industry.objects.all()
          serializer = IndustrySerializer(industries, many=True)
          
          return Response(serializer.data)

class RelatedCompanyInfoAPIView(views.APIView):
     """
     API view to create a new company.
     Handles POST (create) request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission]

     def get(self, request):
          """
          Get authenticated user's company info.
          """
          user:TalentCloudUser = request.user
          
          if hasattr(user, 'company'):
               return Response(CustomResponse.success('Successfully retrived related company information.', {
                    "name": user.company.name,
                    "image_url": user.company.image_url
               }), status=status.HTTP_200_OK)
          
          return Response(CustomResponse.error('Related company not found.'), status=status.HTTP_404_NOT_FOUND)

@extend_schema(tags=["Company"])
class UpdateParentCompanyAPIView(views.APIView):
     """
     API view to update parent company.
     Handles POST (create) request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def post(self, request):
          """
          Update parent company.
          """
          
          updated_company = update_parent_company()
          
          return Response(CompanySerializer(updated_company).data, status=status.HTTP_201_CREATED)

@extend_schema(tags=["Company"])
class CompanyCreateAPIView(views.APIView):
     """
     API view to create a new company.
     Handles POST (create) request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def post(self, request):
          """
          Create a new company.
          """
          serializer = CompanySerializer(data=request.data)
          if serializer.is_valid():
               serializer.validated_data['is_verified'] = True
               
               serializer.save()
               
               return Response(serializer.data, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Company"])
class UnauthenticatedCompanyCreateAPIView(views.APIView):
     authentication_classes = []  # Disable all authentication
     permission_classes = [AllowAny]

     def post(self, request):
          """
          Create a new company for unauthenticated users.
          'is_verified' will default to False.
          """
          serializer = CompanySerializer(data=request.data)

          if serializer.is_valid():
               serializer.validated_data['is_verified'] = False
               company = serializer.save()

               # Send notification to superadmins about new company registration
               try:
                    from services.notification.notification_service import NotificationHelpers
                    
                    NotificationHelpers.notify_company_registration(company)
                    logger.info(f"Company registration notification sent for: {company.name}")
               except Exception as e:
                    logger.error(f"Failed to send company registration notification: {str(e)}")
                    # Don't fail the company creation if notification fails

               return Response(serializer.data, status=status.HTTP_201_CREATED)

          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Company"])
class CompanyListAPIView(views.APIView):
     """
     API view to list all companies.
     Handles GET request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get(self, request):
          """
          List all companies.
          """
          companies = Company.objects.all()
          serializer = CompanySerializer(companies, many=True)
          
          return Response(serializer.data)

@extend_schema(tags=["Company"])
class CompanyDetailAPIView(views.APIView):
     """
     API view to retrieve, update, or delete a specific company.
     """
     authentication_classes = [TokenAuthentication]
     
     def get_permissions(self):
          if self.request.method == 'GET':
               return [TalentCloudAllPermission()]
          else:
               return [TalentCloudSuperAdminPermission()]

     def get_object(self, slug):
          """
          Helper method to retrieve a company by slug.
          """
          try:
               company = Company.objects.get(slug=slug)
               return company
          except Company.DoesNotExist:
               raise Http404

     def get(self, request, slug):
          """
          Retrieve a specific company by slug.
          """
          company = self.get_object(slug)
          serializer = CompanyWithJobsSerializer(company, context={'request': request})
          return Response(serializer.data, status=status.HTTP_200_OK)

     def put(self, request, slug):
          """
          Update a specific company by slug.
          """
          company = self.get_object(slug)
          old_is_verified = company.is_verified
          
          serializer = CompanySerializer(company, data=request.data, partial=True)
          
          if serializer.is_valid():
               updated_company = serializer.save()
               new_is_verified = updated_company.is_verified
               
               # Send notification if company verification status changed
               if old_is_verified != new_is_verified:
                    try:
                         from services.notification.notification_service import NotificationService, NotificationTarget
                         from utils.notification.types import NotificationChannel, NotificationType
                         from apps.users.models import TalentCloudUser
                         
                         # Get company users
                         company_users = TalentCloudUser.objects.filter(
                              company=updated_company, 
                              role__name='admin', 
                              is_active=True
                         )
                         
                         if new_is_verified:
                              # Company was approved
                              NotificationService.send_notification(
                                   title="Company Registration Approved",
                                   message=f"Congratulations! Your company '{updated_company.name}' has been approved and is now active on TalentCloud.",
                                   notification_type=NotificationType.COMPANY_APPROVED,
                                   target_users=list(company_users),
                                   destination_url="/company/dashboard",
                                   channel=NotificationChannel.BOTH,
                                   email_context={'company': updated_company}
                              )
                              logger.info(f"Company approval notification sent for: {updated_company.name}")
                         else:
                              # Company was rejected or revoked
                              reason = request.data.get('rejection_reason', 'Verification status updated by administrator')
                              NotificationService.send_notification(
                                   title="Company Registration Status Updated",
                                   message=f"Your company '{updated_company.name}' verification status has been updated." + (f" Reason: {reason}" if reason else ""),
                                   notification_type=NotificationType.COMPANY_APPROVED,
                                   target_users=list(company_users),
                                   destination_url="/company/dashboard",
                                   channel=NotificationChannel.BOTH,
                                   email_context={'company': updated_company, 'reason': reason}
                              )
                              logger.info(f"Company status notification sent for: {updated_company.name}")
                              
                    except Exception as e:
                         logger.error(f"Failed to send company status notification: {str(e)}")
                         # Don't fail the update if notification fails
               
               return Response(serializer.data, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     def delete(self, request, slug):
          """
          Delete a specific company by slug.
          """
          company = self.get_object(slug)
          company.delete()
          
          # Return a 204 No Content status for successful deletion
          return Response(CustomResponse.success("Deleted successfully."), status=status.HTTP_200_OK)

@extend_schema(tags=["Company - Bulk Upload"])
class BulkUploadInitiateAPIView(views.APIView):
     """API endpoint to initiate bulk file uploads"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Initiate bulk file upload"
     )
     def post(self, request):
          """Initiate bulk upload process"""
          try:
               files_data = request.data.get('files', [])
               
               if not files_data:
                    raise ValidationError("files array is required")
               
               result = BulkUploadService.initiate_bulk_upload(
                    user=request.user,
                    files_data=files_data
               )
               
               return Response(
                    CustomResponse.success("Bulk upload initiated successfully", result),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in bulk upload initiation: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error initiating bulk upload: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to initiate bulk upload"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Bulk Upload"])
class BulkUploadCompleteAPIView(views.APIView):
     """API endpoint to complete bulk file uploads"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Complete bulk file upload"
     )
     def post(self, request):
          """Complete bulk upload process"""
          try:
               upload_ids = request.data.get('upload_ids', [])
               
               if not upload_ids:
                    raise ValidationError("upload_ids array is required")
               
               result = BulkUploadService.complete_bulk_upload(
                    user=request.user,
                    upload_ids=upload_ids
               )
               
               return Response(
                    CustomResponse.success("Bulk upload completed successfully", result['data']),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in bulk upload completion: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error completing bulk upload: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to complete bulk upload"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )