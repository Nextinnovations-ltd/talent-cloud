from django.urls import path
from .views import ActiveJobPostListAPIView, AllJobPostApplicantListAPIView, AllJobPostListAPIView, CompanyStatisticsAPIView, DraftJobPostListAPIView, ExpiredJobPostListAPIView


urlpatterns = [
   path('dashboard/company/statistics/', CompanyStatisticsAPIView.as_view(), name='company-statistics'),
   path('dashboard/company/job-posts/all/', AllJobPostListAPIView.as_view(), name='company-job-post-list'),
   path('dashboard/company/job-posts/active/', ActiveJobPostListAPIView.as_view(), name='active-job-post-list'),
   path('dashboard/company/job-posts/draft/', DraftJobPostListAPIView.as_view(), name='draft-job-post-list'),
   path('dashboard/company/job-posts/expired/', ExpiredJobPostListAPIView.as_view(), name='expired-job-post-list'),
   path('dashboard/company/applicants/all/', AllJobPostApplicantListAPIView.as_view(), name='company-job-post-applicant-list'),
]