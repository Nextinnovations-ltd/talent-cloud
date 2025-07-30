from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from apps.job_posting.models import JobPost
from services.dashboard.shared_dashboard_service import SharedDashboardService
from services.dashboard.company_dashboard_service import CompanyDashboardService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsCompanyAdminForJobPost, TalentCloudAdminPermission
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
               
          result = SharedDashboardService.get_company_applicants_queryset(company)
          
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
               
          result = SharedDashboardService.get_company_job_posts_by_latest_order(company)
          
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
               
          result = SharedDashboardService.get_active_job_posts(company)
          
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
               
          result = SharedDashboardService.get_draft_job_posts(company)
          
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
               
          result = SharedDashboardService.get_expired_job_posts(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company Dashboard"])
class ToggleJobPostStatusAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsCompanyAdminForJobPost]
     
     def post(self, request, job_post_id):
          if not job_post_id:
               return Response(
                    CustomResponse.error("Job post ID is required."),
                    status=status.HTTP_400_BAD_REQUEST
               )

          try:
               job_post = JobPost.objects.get(id=job_post_id)
          except JobPost.DoesNotExist:
               return Response(
                    CustomResponse.error("Job post not found."),
                    status=status.HTTP_404_NOT_FOUND
               )

          self.check_object_permissions(request, job_post)
          
          result = SharedDashboardService.toggle_job_post_status(job_post_id)
          
          return Response(
               CustomResponse.success(result['message'], result['data']),
               status=status.HTTP_200_OK
          )