from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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