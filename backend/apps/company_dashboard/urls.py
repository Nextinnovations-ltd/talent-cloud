from django.urls import path
from .views import AllJobPostApplicantListAPIView, CompanyStatisticsAPIView


urlpatterns = [
   path('dashboard/company/statistics', CompanyStatisticsAPIView.as_view(), name='company-statistics'),
   path('dashboard/company/applicants/all/', AllJobPostApplicantListAPIView.as_view(), name='company-job-post-applicant-list'),
]