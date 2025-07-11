from django.urls import path
from .views import (
    BookmarkDeleteAPIView,
    CompanyJobListView,
    JobPostEditDetailAPIView,
    JobPostCreateAPIView,
    JobPostActionAPIView,
    JobPostListAPIView,
    JobSearchListAPIView,
    MatchedJobPostAPIView,
    NewestJobPostAPIView,
    JobApplicationCreateView,
    JobSeekerApplicationListView,
    JobSeekerApplicationDetailView,
    CompanyJobApplicationsListView,
    CompanyApplicationDetailView,
    BookmarkJobView,
    JobSeekerBookmarkedJobListView,
)

urlpatterns = [
    # Endpoints related to Job Post
    path('job-posts/', JobPostCreateAPIView.as_view(), name='jobpost-list-create'),
    path('job-posts/all/', JobPostListAPIView.as_view(), name='jobpost-list'),
    path('job-posts/newest/', NewestJobPostAPIView.as_view(), name='recent-jobpost-list'),
    path('job-posts/matched/', MatchedJobPostAPIView.as_view(), name='matched-jobpost-list'),
    path('job-posts/search/', JobSearchListAPIView.as_view(), name='matched-jobpost-list'),
    path('job-posts/<int:pk>/', JobPostActionAPIView.as_view(), name='jobpost-detail'),
    path('job-posts/edit/<int:pk>/', JobPostEditDetailAPIView.as_view(), name='jobpost-edit-detail'),
    
    # Job Seeker Application Endpoints
    path('job-posts/<int:job_post_id>/applications/', JobApplicationCreateView.as_view(), name='jobpost-applications-create'), # POST only for seekers
    path('my-applications/', JobSeekerApplicationListView.as_view(), name='my-applications-list'),
    path('my-applications/<int:pk>/', JobSeekerApplicationDetailView.as_view(), name='my-applications-detail'),

    # Job Application Endpoints for Company Admins
    path('company-job-posts/', CompanyJobListView.as_view(), name='company-jobpost-list'), # GET only for admins
    path('company-job-posts/<int:job_post_id>/applications/', CompanyJobApplicationsListView.as_view(), name='jobpost-applications-list'), # GET only for admins
    path('applications/<int:pk>/', CompanyApplicationDetailView.as_view(), name='application-detail'),

    # Bookmarked Job Endpoints (Job Seeker)
    path('my-bookmarks/', JobSeekerBookmarkedJobListView.as_view(), name='my-bookmarks-list'),
    path('job-posts/<int:job_post_id>/bookmark/', BookmarkJobView.as_view(), name='jobpost-bookmark'), # POST
    path('my-bookmarks/<int:job_post_id>/', BookmarkDeleteAPIView.as_view(), name='delete-jobpost-bookmark'), # DELETE
    
    # path('job-posts/<int:pk>/metrics/', JobPostMetricViewAPIView.as_view(), name='jobpost-metrics'),
    # path('job-posts/<int:pk>/increment-view/', IncrementJobPostViewCountAPIView.as_view(), name='jobpost-increment-view'),
]
