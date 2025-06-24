from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from services.dashboard.company_dashboard_service import CompanyDashboardService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudAdminPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import NotFound

@extend_schema(tags=["Company Dashboard"])
class CompanyStatisticsAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_company_statistics(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class AllJobPostApplicantListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_company_applicants_by_latest_order(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class AllJobPostListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_company_job_posts_by_latest_order(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class ActiveJobPostListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_active_job_posts(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class DraftJobPostListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_draft_job_posts(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class ExpiredJobPostListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          result = CompanyDashboardService.get_expired_job_posts(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)