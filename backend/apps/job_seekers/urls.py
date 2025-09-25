from rest_framework.urls import path
from rest_framework.routers import DefaultRouter
from apps.job_seekers.views.profile_view import JobSeekerDefaultResumeAPIView, JobSeekerDeleteResumeAPIView, JobSeekerLanguageAPIView, JobSeekerResumeAPIView, JobSeekerResumeListAPIView, JobSeekerVideoAPIView, JobSeekerProfileAPIView, JobSeekerProfileSelectionOptionsAPIView, JobSeekerSettingAPIView, JobSeekerSkillAPIView, ProfileScoreAPIView
from apps.job_seekers.views.special_skills_views import JobSeekerSpecialSkillDetailAPIView, JobSeekerSpecialSkillListAPIView
from apps.job_seekers.views.project_views import JobSeekerProjectListAPIView, JobSeekerProjectDetailAPIView, ProjectImageDeleteAPIView, ProjectImageUploadUrlAPIView
from apps.job_seekers.views.address_view import CityAPIView, CountryAPIView
from apps.job_seekers.views.upload_view import ConfirmProfileUploadAPIView, ProfileImageUploadAPIView, ProfileResumeUploadAPIView
from .views.certification_view import CertificationViewSet
from .views.education_view import EducationViewSet, UniversityAPIView
from .views.experience_view import ExperienceViewSet
from .views.occupation_view import JobSeekerLanguageOptionViewSet, JobSeekerSpecializationViewSet, JobSeekerRoleViewSet, JobSeekerSkillViewSet, JobSeekerExperienceLevelViewSet, JobSeekerOccupationViewSet
from .views.onboarding_view import OnboardingAPIView, ModifyUsernameAPIView, S3UploadAPIView

router = DefaultRouter()

router.register(r'certifications', CertificationViewSet, basename='certifications')
router.register(r'educations', EducationViewSet, basename='educations')
router.register(r'experiences', ExperienceViewSet, basename='experiences'),
router.register(r'specializations', JobSeekerSpecializationViewSet, basename='specializations')
router.register(r'roles', JobSeekerRoleViewSet, basename='roles')
router.register(r'skills', JobSeekerSkillViewSet, basename='skills')
router.register(r'experience-levels', JobSeekerExperienceLevelViewSet, basename='experience-levels')
router.register(r'languages', JobSeekerLanguageOptionViewSet, basename='language-options')
router.register(r'occupations', JobSeekerOccupationViewSet, basename='occupations')


urlpatterns = [
     path('onboarding/', OnboardingAPIView.as_view(), name='perform-onboarding'),
     path('update-username/', ModifyUsernameAPIView.as_view(), name='update-username'),
     
     path('university-list/', UniversityAPIView.as_view(), name='university-data'),
     
     # Location Data
     path('location/country-list/', CountryAPIView.as_view(), name='country-data'),
     path('location/city-list/<int:country_id>/', CityAPIView.as_view(), name='city-data'),
     
     # Special Skill
     path('jobseeker/special-skills/', JobSeekerSpecialSkillListAPIView.as_view(), name='special-skills-list'),
     path('jobseeker/special-skills/<int:skill_id>/', JobSeekerSpecialSkillDetailAPIView.as_view(), name='special-skills-detail'),     # Retrieve, update, or delete a specific special skill
     
     # Project
     path('jobseeker/projects/upload/project-image/', ProjectImageUploadUrlAPIView.as_view(), name='get-project-image-upload-url'),
     path('jobseeker/projects/<int:project_id>/images/delete/', ProjectImageDeleteAPIView.as_view(), name='get-project-image-upload-url'),
     path('jobseeker/projects/', JobSeekerProjectListAPIView.as_view(), name='projects-list-create'),
     path('jobseeker/projects/<int:project_id>/', JobSeekerProjectDetailAPIView.as_view(), name='projects-detail'),
     
     # Profile
     path('jobseeker/profile/', JobSeekerProfileAPIView.as_view(), name='jobseeker-profile'),
     path('jobseeker/skill/', JobSeekerSkillAPIView.as_view(), name='jobseeker-skill'),
     
     # Language
     path('jobseeker/language/', JobSeekerLanguageAPIView.as_view(), name='jobseeker-language'),
     
     # Video
     path('jobseeker/video-introduction/', JobSeekerVideoAPIView.as_view(), name='jobseeker-video'),
     
     # Profile Score
     path('jobseeker/profile-score/', ProfileScoreAPIView.as_view(), name='jobseeker-profile-score'),
     
     # Setting
     path('jobseeker/setting/', JobSeekerSettingAPIView.as_view(), name='jobseeker-setting'),
     
     # S3 Upload Test
     path('s3/upload/', S3UploadAPIView.as_view(), name='s3-upload'),
     
     # Resume
     path('jobseeker/profile/resume/', JobSeekerResumeAPIView.as_view(), name='profile-resume-info'),
     path('jobseeker/profile/resumes/list/', JobSeekerResumeListAPIView.as_view(), name='profile-resume-list'),
     path('jobseeker/profile/resumes/<int:resume_id>/set-default/', JobSeekerDefaultResumeAPIView.as_view(), name='set-resume-as-default'),
     path('jobseeker/profile/resumes/<int:resume_id>/remove/', JobSeekerDeleteResumeAPIView.as_view(), name='remove-resume'),
     path('jobseeker/profile/upload/resume/', ProfileResumeUploadAPIView.as_view(), name='profile-resume-upload'),
     
     # Profile Image
     path('jobseeker/profile/upload/image/', ProfileImageUploadAPIView.as_view(), name='profile-image-upload'),
     
     # S3 Upload Confirm
     path('jobseeker/profile/upload/confirm/', ConfirmProfileUploadAPIView.as_view(), name='confirm-profile-upload'),
]

urlpatterns += router.urls