from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from apps.companies.models import Company
from apps.users.models import TalentCloudUser
from apps.companies.serializers import CompanyListSerializer
from apps.ni_dashboard.serializers import JobPostDashboardSerializer
from apps.job_posting.models import StatusChoices
from utils.view.custom_api_views import CustomListAPIView
from services.dashboard.shared_dashboard_service import SharedDashboardService
from core.constants.constants import PARENT_COMPANY, ROLES
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsSuperadminForJobPost, TalentCloudSuperAdminPermission
from services.dashboard.ni_dashboard_service import DashboardService
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["NI Dashboard"])
class NIAdminListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          result = DashboardService.get_ni_admin_list()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["Company"])
class CompanyListAPIView(CustomListAPIView):
     """
     API view to list all companies.
     Handles GET request.
     """
     success_message = "Fetched companies list successfully"
     queryset = Company.objects.all()
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     serializer_class = CompanyListSerializer

@extend_schema(tags=["NI Dashboard"])
class JobSeekerStatisticsAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")

          result = DashboardService.get_job_seeker_statistics(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class JobSeekerRoleStatisticsAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")

          result = DashboardService.get_job_seeker_statistics_by_occupation_role()
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class NIApplicantListAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          try:
               company = request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
          
          result = SharedDashboardService.get_company_applicants_by_latest_order(company)
          
          return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

# @extend_schema(tags=["NI Dashboard"])
# class NIApplicantDetailAPIView(APIView):
#      authentication_classes = [TokenAuthentication]
#      permission_classes = [TalentCloudSuperAdminPermission]
     
#      def get(self, request, user_id):
#           if not user_id:
#                return Response(CustomResponse.success("User not found with this id."), status=status.HTTP_404_NOT_FOUND)
          
#           result = DashboardService.get_job_seeker_detail(user_id)
          
#           return Response(CustomResponse.success(result['message'], result['data']), status=status.HTTP_200_OK)

@extend_schema(tags=["NI Dashboard"])
class AllJobPostListAPIView(CustomListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     serializer_class = JobPostDashboardSerializer
     
     def get_queryset(self):
          try:
               company = self.request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          queryset = SharedDashboardService.get_job_post_queryset_by_status(company)
          
          return queryset
          
@extend_schema(tags=["NI Dashboard"])
class ActiveJobPostListAPIView(CustomListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     serializer_class = JobPostDashboardSerializer
     
     def get_queryset(self):
          try:
               company = self.request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          queryset = SharedDashboardService.get_job_post_queryset_by_status(company, StatusChoices.ACTIVE)
          
          return queryset

@extend_schema(tags=["NI Dashboard"])
class DraftJobPostListAPIView(CustomListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     serializer_class = JobPostDashboardSerializer
     
     def get_queryset(self):
          try:
               company = self.request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          queryset = SharedDashboardService.get_job_post_queryset_by_status(company, StatusChoices.DRAFT)
          
          return queryset

@extend_schema(tags=["NI Dashboard"])
class ExpiredJobPostListAPIView(CustomListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     serializer_class = JobPostDashboardSerializer
     
     def get_queryset(self):
          try:
               company = self.request.user.company
          except:
               raise NotFound("Company didn't exists for the user.")
               
          queryset = SharedDashboardService.get_job_post_queryset_by_status(company, StatusChoices.EXPIRED)
          
          return queryset

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

@extend_schema(tags=["NI Dashboard"])
class ToggleJobPostStatusAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsSuperadminForJobPost]
     
     def post(self, request, job_post_id):
          if not job_post_id:
               return Response(
                    CustomResponse.error("Job post ID is required."),
                    status=status.HTTP_400_BAD_REQUEST
               )
          
          result = SharedDashboardService.toggle_job_post_status(job_post_id)
          
          return Response(
               CustomResponse.success(result['message'], result['data']),
               status=status.HTTP_200_OK
          )

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