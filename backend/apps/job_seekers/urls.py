from rest_framework.urls import path
from rest_framework.routers import DefaultRouter
from apps.job_seekers.views.profile_view import JobSeekerLanguageAPIView, JobSeekerVideoAPIView, JobSeekerProfileAPIView, JobSeekerProfileSelectionOptionsAPIView, JobSeekerSettingAPIView, JobSeekerSkillAPIView, ProfileScoreAPIView
from apps.job_seekers.views.special_skills_views import JobSeekerSpecialSkillDetailAPIView, JobSeekerSpecialSkillListAPIView
from apps.job_seekers.views.project_views import JobSeekerProjectListAPIView, JobSeekerProjectDetailAPIView
from apps.job_seekers.views.address_view import CityAPIView, CountryAPIView
from .views.certification_view import CertificationViewSet
from .views.education_view import EducationViewSet
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
     
     # Location Data
     path('location/country-list/', CountryAPIView.as_view(), name='country-data'),
     path('location/city-list/<int:country_id>/', CityAPIView.as_view(), name='city-data'),
     
     path('jobseeker/special-skills/', JobSeekerSpecialSkillListAPIView.as_view(), name='special-skills-list'),
     path('jobseeker/special-skills/<int:skill_id>/', JobSeekerSpecialSkillDetailAPIView.as_view(), name='special-skills-detail'),     # Retrieve, update, or delete a specific special skill
     path('jobseeker/projects/', JobSeekerProjectListAPIView.as_view(), name='projects-list-create'),
     path('jobseeker/projects/<int:project_id>/', JobSeekerProjectDetailAPIView.as_view(), name='projects-detail'),
     path('jobseeker/profile/', JobSeekerProfileAPIView.as_view(), name='jobseeker-profile'),
     path('jobseeker/skill/', JobSeekerSkillAPIView.as_view(), name='jobseeker-skill'),
     path('jobseeker/projects/', JobSeekerProjectListAPIView.as_view(), name='projects-list-create'),
     path('jobseeker/projects/<int:project_id>/', JobSeekerProjectDetailAPIView.as_view(), name='projects-detail'),     # Retrieve, update, or delete a specific project
     path('jobseeker/language/', JobSeekerLanguageAPIView.as_view(), name='jobseeker-language'),
     path('jobseeker/video-introduction/', JobSeekerVideoAPIView.as_view(), name='jobseeker-video'),
     path('jobseeker/profile-score/', ProfileScoreAPIView.as_view(), name='jobseeker-profile-score'),
     path('jobseeker/setting/', JobSeekerSettingAPIView.as_view(), name='jobseeker-setting'),
     path('s3/upload/', S3UploadAPIView.as_view(), name='s3-upload'),
]

urlpatterns += router.urls