from rest_framework.urls import path
from apps.ni_super_admin.views import JobSeekerDetailAPIView, JobSeekerListAPIView, JobSeekerStatisticsAPIView, NIAdminListAPIView, SuperAdminPairingAPIView

urlpatterns = [
    path('dashboard/job_seeker/statistics', JobSeekerStatisticsAPIView.as_view(), name='job_seeker_statistics'),
    path('dashboard/job_seeker/listings', JobSeekerListAPIView.as_view(), name='job_seeker_list'),
    path('dashboard/job_seeker/<int:user_id>/details', JobSeekerDetailAPIView.as_view(), name='job_seeker_details'),
    path('dashboard/ni_admin/listings', NIAdminListAPIView.as_view(), name='ni_admin_list'),
    path('pair-company/', SuperAdminPairingAPIView.as_view(), name='pair-superadmin-to-company'),
]
