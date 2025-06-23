from django.urls import path
from .views import AllJobPostApplicantListAPIView, AllJobPostListAPIView, CompanyStatisticsAPIView


urlpatterns = [
   path('dashboard/company/statistics/', CompanyStatisticsAPIView.as_view(), name='company-statistics'),
   path('dashboard/company/job-posts/all/', AllJobPostListAPIView.as_view(), name='company-job-post-list'),
   path('dashboard/company/applicants/all/', AllJobPostApplicantListAPIView.as_view(), name='company-job-post-applicant-list'),
]