from os import name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.companies.models import Company
from apps.users.models import TalentCloudUser
from core.constants.constants import PARENT_COMPANY, ROLES
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudSuperAdminPermission
from services.dashboard.dashboard_service import DashboardService
from utils.response import CustomResponse

class JobSeekerStatisticsAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_job_seeker_statistics()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

class JobSeekerListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_job_seeker_list()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

class JobSeekerDetailAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request, user_id):
          if not user_id:
               return Response(CustomResponse.success("User not found with this id."), status=status.HTTP_404_NOT_FOUND)
          
          result = DashboardService.get_job_seeker_detail(user_id)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

class NIAdminListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_ni_admin_list()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

# Tempory Endpoint to pair Superadmin with NI Parent Company
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
          
          # for super_admin in super_admin_list:
          #      super_admin.company = parent_company
               
          #      super_admin.save()
          
          return Response(CustomResponse.success('Successfully paired superadmin with parent company.'), status=status.HTTP_200_OK)