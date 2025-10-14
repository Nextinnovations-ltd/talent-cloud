from django.urls import path
from .views import (
    BookmarkDeleteAPIView,
    CompanyJobListView,
    ConfirmJobApplicationResumeUploadAPIView,
    CoverLetterUploadUrlAPIView,
    ExpiredJobPostAPIView,
    JobApplicationResumeUrlAPIView,
    JobDiscoveryAPIView,
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
    PopularSuggestionAPIView,
    RecentJobPostListAPIView,
)

urlpatterns = [
    # Endpoints related to Job Post
    path('job-posts/', JobPostCreateAPIView.as_view(), name='jobpost-list-create'),
    path('job-posts/all/', JobPostListAPIView.as_view(), name='jobpost-list'),
    path('job-posts/expired/', ExpiredJobPostAPIView.as_view(), name='expired-jobpost-list'), # For super admin and job seeker
    path('job-posts/newest/', NewestJobPostAPIView.as_view(), name='recent-jobpost-list'),
    
    
    # Recent Jobs
    path('job-posts/recent/', RecentJobPostListAPIView.as_view(), name='recent-jobpost-list'),
    
    path('search/suggestions/popular/', PopularSuggestionAPIView.as_view(), name='popular-suggestion-keywords'),
    
    # Jobs Search
    path('job-posts/discover/', JobDiscoveryAPIView.as_view(), name='discover-jobpost-list'),
    path('job-posts/search/', JobSearchListAPIView.as_view(), name='matched-jobpost-list'),
    
    # Matched Jobs
    path('job-posts/matched/', MatchedJobPostAPIView.as_view(), name='matched-jobpost-list'),
    
    # Jobs Details and Edit
    path('job-posts/<int:pk>/', JobPostActionAPIView.as_view(), name='jobpost-detail'),
    path('job-posts/edit/<int:pk>/', JobPostEditDetailAPIView.as_view(), name='jobpost-edit-detail'),
    
    # Job Application Endpoints for Super Admin and Company Admins
    path('job-posts/', CompanyJobListView.as_view(), name='company-jobpost-list'), # GET only for superadmin and admins, currently not using
    path('job-posts/<int:job_post_id>/applications/', CompanyJobApplicationsListView.as_view(), name='jobpost-applications-list'), # GET only for superadmins and admins
    path('applications/<int:pk>/', CompanyApplicationDetailView.as_view(), name='application-detail'),
    
    # Job Seeker Application Endpoints
    path('job-posts/<int:job_post_id>/apply/', JobApplicationCreateView.as_view(), name='jobpost-applications-create'), # POST only for seekers
    path('application/upload/cover-letter/', CoverLetterUploadUrlAPIView.as_view(), name='get-cover-letter-upload-url'),
    path('my-applications/', JobSeekerApplicationListView.as_view(), name='my-applications-list'),
    path('my-applications/<int:pk>/', JobSeekerApplicationDetailView.as_view(), name='my-applications-detail'),
    
    # Job Seeker Application Resume
    path('jobseeker/application/upload/resume/', JobApplicationResumeUrlAPIView.as_view(), name='application-resume-upload'),
    path('jobseeker/application/upload/confirm/', ConfirmJobApplicationResumeUploadAPIView.as_view(), name='confirm-application-resume-upload'),
    
    # Bookmarked Job Endpoints (Job Seeker)
    path('my-bookmarks/', JobSeekerBookmarkedJobListView.as_view(), name='my-bookmarks-list'),
    path('job-posts/<int:job_post_id>/bookmark/', BookmarkJobView.as_view(), name='jobpost-bookmark'), # POST
    path('my-bookmarks/<int:job_post_id>/', BookmarkDeleteAPIView.as_view(), name='delete-jobpost-bookmark'), # DELETE
    
    # path('job-posts/<int:pk>/metrics/', JobPostMetricViewAPIView.as_view(), name='jobpost-metrics'),
    # path('job-posts/<int:pk>/increment-view/', IncrementJobPostViewCountAPIView.as_view(), name='jobpost-increment-view'),
]
