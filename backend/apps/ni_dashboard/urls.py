from rest_framework.urls import path
from apps.ni_dashboard.views import (
    CompanyListAPIView,
    JobSeekerRoleStatisticsAPIView,
    NIApplicantListAPIView, 
    JobSeekerStatisticsAPIView, 
    NIAdminListAPIView, 
    SuperAdminPairingAPIView,
    AllJobPostListAPIView,
    ActiveJobPostListAPIView,
    DraftJobPostListAPIView,
    ExpiredJobPostListAPIView,
    CompanyApprovalAPIView,
    ToggleJobPostStatusAPIView
)

urlpatterns = [
    path('dashboard/ni/admin/all', NIAdminListAPIView.as_view(), name='ni_admin_list'),
    path('dashboard/ni/statistics', JobSeekerStatisticsAPIView.as_view(), name='job_seeker_statistics'),
    path('dashboard/ni/statistics/role/', JobSeekerRoleStatisticsAPIView.as_view(), name='job_seeker_role_statistics'),
    path('dashboard/ni/applicants/', NIApplicantListAPIView.as_view(), name='job_seeker_list'),
    path('dashboard/ni/companies/', CompanyListAPIView.as_view(), name='company_list'),
    path('dashboard/ni/job-posts/all/', AllJobPostListAPIView.as_view(), name='ni-all-job-post-list'),
    path('dashboard/ni/job-posts/active/', ActiveJobPostListAPIView.as_view(), name='ni-active-job-post-list'),
    path('dashboard/ni/job-posts/draft/', DraftJobPostListAPIView.as_view(), name='ni-draft-job-post-list'),
    path('dashboard/ni/job-posts/expired/', ExpiredJobPostListAPIView.as_view(), name='ni-expired-job-post-list'),
    path('dashboard/ni/job-posts/<int:job_post_id>/toggle-status/', ToggleJobPostStatusAPIView.as_view(), name='ni-toggle-job-post-status'),
    path('dashboard/ni/companies/<slug:slug>/approve/', CompanyApprovalAPIView.as_view(), name='ni-company-approval'),
    path('pair-company/', SuperAdminPairingAPIView.as_view(), name='pair-superadmin-to-company'),
]
