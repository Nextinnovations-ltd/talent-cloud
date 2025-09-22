from rest_framework.urls import path
from apps.ni_dashboard.views import (
    ApplicantRejectAPIView,
    ApplicantShortListAPIView,
    CompanyListAPIView,
    FavouriteJobSeekerAPIView,
    FavouriteJobSeekerListAPIView,
    FavouriteJobSeekerRemovalAPIView,
    JobSeekerCertificationListAPIView,
    JobSeekerEducationListAPIView,
    JobSeekerExperienceListAPIView,
    JobSeekerOverviewAPIView,
    JobSeekerProjectListAPIView,
    JobSeekerRoleStatisticsAPIView,
    JobSeekerVideoURLAPIView,
    NIApplicantListAPIView, 
    JobSeekerStatisticsAPIView, 
    NIAdminListAPIView,
    NIJobSpecificApplicantListAPIView,
    NIJobSpecificRejectedApplicantListAPIView,
    NIJobSpecificShortlistedApplicantListAPIView,
    NIRegisteredJobSeekerListAPIView,
    RecentApplicantListAPIView,
    RecentJobListAPIView, 
    SuperAdminPairingAPIView,
    AllJobPostListAPIView,
    ActiveJobPostListAPIView,
    DraftJobPostListAPIView,
    ExpiredJobPostListAPIView,
    CompanyApprovalAPIView,
    ToggleJobPostStatusAPIView
)

urlpatterns = [
    # =============================================================================
    # ADMIN MANAGEMENT
    # =============================================================================
    path('dashboard/ni/admin/all', NIAdminListAPIView.as_view(), name='ni_admin_list'),
    
    # =============================================================================
    # COMPANY MANAGEMENT  
    # =============================================================================
    path('dashboard/ni/companies/', CompanyListAPIView.as_view(), name='company_list'),
    path('dashboard/ni/companies/<slug:slug>/approve/', CompanyApprovalAPIView.as_view(), name='ni-company-approval'),
    path('dashboard/ni/companies/pair/', SuperAdminPairingAPIView.as_view(), name='pair-superadmin-to-company'),
    
    # =============================================================================
    # STATISTICS & ANALYTICS
    # =============================================================================
    path('dashboard/ni/statistics', JobSeekerStatisticsAPIView.as_view(), name='job_seeker_statistics'),
    path('dashboard/ni/statistics/role/', JobSeekerRoleStatisticsAPIView.as_view(), name='job_seeker_role_statistics'),
    
    # =============================================================================
    # JOB POSTS MANAGEMENT
    # =============================================================================
    path('dashboard/ni/job-posts/all/', AllJobPostListAPIView.as_view(), name='ni-all-job-post-list'),
    path('dashboard/ni/job-posts/recent/', RecentJobListAPIView.as_view(), name='ni-recent-job-post-list'),
    path('dashboard/ni/job-posts/active/', ActiveJobPostListAPIView.as_view(), name='ni-active-job-post-list'),
    path('dashboard/ni/job-posts/draft/', DraftJobPostListAPIView.as_view(), name='ni-draft-job-post-list'),
    path('dashboard/ni/job-posts/expired/', ExpiredJobPostListAPIView.as_view(), name='ni-expired-job-post-list'),
    path('dashboard/ni/job-posts/<int:job_post_id>/toggle-status/', ToggleJobPostStatusAPIView.as_view(), name='ni-toggle-job-post-status'),
    
    # =============================================================================
    # JOB APPLICATIONS MANAGEMENT
    # =============================================================================
    path('dashboard/ni/applicants/recent/', RecentApplicantListAPIView.as_view(), name='recent-applicant-list'),
    path('dashboard/ni/applicants/', NIApplicantListAPIView.as_view(), name='applicant-list'),
    # Job-specific applications
    path('dashboard/ni/job-posts/<int:job_id>/applicants/', NIJobSpecificApplicantListAPIView.as_view(), name='ni-all-job-post-list'),
    path('dashboard/ni/job-posts/<int:job_id>/applicants/shortlisted', NIJobSpecificShortlistedApplicantListAPIView.as_view(), name='ni-shortlisted-job-post-list'),
    path('dashboard/ni/job-posts/<int:job_id>/applicants/rejected', NIJobSpecificRejectedApplicantListAPIView.as_view(), name='ni-shortlisted-job-post-list'),
    # Application Actions
    path('dashboard/ni/job-posts/<int:job_id>/applicants/<int:applicant_id>/shortlist/', ApplicantShortListAPIView.as_view(), name='ni-applicant-shortlist-action'),
    path('dashboard/ni/job-posts/<int:job_id>/applicants/<int:applicant_id>/reject/', ApplicantRejectAPIView.as_view(), name='ni-applicant-reject-action'),
    
    # =============================================================================
    # JOB SEEKERS MANAGEMENT
    # =============================================================================
    path('dashboard/ni/job-seekers/all/', NIRegisteredJobSeekerListAPIView.as_view(), name='registered-job-seeker-list'), 
    # Job Seeker Details(same with applicant details)
    path('dashboard/ni/job-seekers/<int:user_id>/overview/', JobSeekerOverviewAPIView.as_view(), name='job-seeker-overview'),
    path('dashboard/ni/job-seekers/<int:user_id>/projects/', JobSeekerProjectListAPIView.as_view(), name='job-seeker-project-list'),
    path('dashboard/ni/job-seekers/<int:user_id>/video/', JobSeekerVideoURLAPIView.as_view(), name='job-seeker-video-url'),
    path('dashboard/ni/job-seekers/<int:user_id>/experiences/', JobSeekerExperienceListAPIView.as_view(), name='job-seeker-experience-list'),
    path('dashboard/ni/job-seekers/<int:user_id>/educations/', JobSeekerEducationListAPIView.as_view(), name='job-seeker-education-list'),
    path('dashboard/ni/job-seekers/<int:user_id>/certifications/', JobSeekerCertificationListAPIView.as_view(), name='job-seeker-certification-list'),
    
    # =============================================================================
    # FAVOURITES MANAGEMENT
    # =============================================================================
    path('dashboard/ni/favourites/job-seekers/', FavouriteJobSeekerListAPIView.as_view(), name='favourite-job-seeker-list'),
    path('dashboard/ni/favourites/job-seekers/<int:user_id>/remove/', FavouriteJobSeekerRemovalAPIView.as_view(), name='remove-favourite-job-seeker'),
    path('dashboard/ni/favourites/job-seekers/<int:user_id>/', FavouriteJobSeekerAPIView.as_view(), name='add-job-seeker-to-favourite'),
]
