from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from apps.companies.models import Company
from apps.users.models import TalentCloudUser
from core.constants.constants import PARENT_COMPANY, ROLES
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudSuperAdminPermission
from services.dashboard.dashboard_service import DashboardService
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["NI Dashboard"])
class JobSeekerStatisticsAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_job_seeker_statistics()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class JobSeekerListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_job_seeker_list()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class JobSeekerDetailAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request, user_id):
          if not user_id:
               return Response(CustomResponse.success("User not found with this id."), status=status.HTTP_404_NOT_FOUND)
          
          result = DashboardService.get_job_seeker_detail(user_id)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class NIAdminListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_ni_admin_list()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

# region Company Approval Process

@extend_schema(tags=["NI Dashboard"])
class CompanyApprovalAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def post(self, request, slug):
          try:
               company = Company.objects.get(slug=slug)
          except Company.DoesNotExist:
               raise NotFound("Company not found!")
          
          if company.is_verified:
               return Response(
                    CustomResponse.error("Company already verified."),
                    status=status.HTTP_400_BAD_REQUEST
               )
          
          company.is_verified = True
          company.save()
          
          return Response(
               CustomResponse.error("Company approved successfully."),
               status=status.HTTP_200_OK
          )

# endregion Company Approval Process


# Tempory Endpoint to pair Superadmin with NI Parent Company
@extend_schema(tags=["NI Dashboard"])
class SuperAdminPairingAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def post(self, request):
          super_admin_list = TalentCloudUser.objects.filter(role__name=ROLES.SUPERADMIN)
          
          if not super_admin_list.exists():
               return Response(CustomResponse.success('No superadmin exists.'), status=status.HTTP_200_OK)
          
          parent_company, created = Company.objects.get_or_create(name=PARENT_COMPANY.name)
          
          if created:
               print("Parent company not exist yet. Creating...")
          
          super_admin_list.update(company=parent_company)
          
          return Response(CustomResponse.success('Successfully paired superadmin with parent company.'), status=status.HTTP_200_OK)