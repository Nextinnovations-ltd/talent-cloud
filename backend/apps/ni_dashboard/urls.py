from rest_framework.urls import path
from apps.ni_dashboard.views import JobSeekerDetailAPIView, JobSeekerListAPIView, JobSeekerStatisticsAPIView, NIAdminListAPIView, SuperAdminPairingAPIView

urlpatterns = [
    path('dashboard/ni/statistics', JobSeekerStatisticsAPIView.as_view(), name='job_seeker_statistics'),
    path('dashboard/ni/listings', JobSeekerListAPIView.as_view(), name='job_seeker_list'),
    path('dashboard/ni/admin/all', NIAdminListAPIView.as_view(), name='ni_admin_list'),
    path('dashboard/ni/job-seeker/<int:user_id>', JobSeekerDetailAPIView.as_view(), name='job_seeker_details'),
    path('pair-company/', SuperAdminPairingAPIView.as_view(), name='pair-superadmin-to-company'),
]
