from datetime import date
import pytest
from apps.job_seekers.models import (
     JobSeeker, JobSeekerExperience, JobSeekerEducation, JobSeekerCertification,
     JobSeekerSpecialization, JobSeekerRole, JobSeekerSkill,
     JobSeekerExperienceLevel, JobSeekerOccupation, JobSeekerSocialLink,
     SpokenLanguage, JobSeekerLanguageProficiency
)
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES

@pytest.fixture
def create_job_seeker() -> JobSeeker:
     return TalentCloudUser.objects.create_user_with_role(email="jobseeker@tc.io", password="default", role_name=ROLES.USER)

class TestJobSeekerModels:
     @pytest.mark.django_db
     def test_create_experience(self, create_job_seeker):
          experience = JobSeekerExperience.objects.create(
               user=create_job_seeker,
               title="Software Engineer",
               organization="Next Innovation",
               job_type="remote",
               work_type="fulltime",
               description="Experience of 2 years in Next Innovations"
          )

          assert experience.user == create_job_seeker
          assert experience.title == "Software Engineer"
          assert experience.organization == "Next Innovation"
          assert not experience.is_present_work  # Default value

     @pytest.mark.django_db
     def test_create_education(self, create_job_seeker):
          education = JobSeekerEducation.objects.create(
               user=create_job_seeker,
               degree="Bachelor of Science",
               institution="University of Information Technology",
               start_date=date(2018, 1, 1),
               end_date=date(2022, 1, 1)
          )

          assert education.user == create_job_seeker
          assert education.degree == "Bachelor of Science"
          assert education.institution == "University of Information Technology"

     @pytest.mark.django_db
     def test_create_certification(self, create_job_seeker):
          certification = JobSeekerCertification.objects.create(
               user=create_job_seeker,
               title="AWS Certified Developer",
               organization="Amazon",
               issued_date=date(2023, 6, 1)
          )

          assert certification.user == create_job_seeker
          assert certification.title == "AWS Certified Developer"
          assert certification.organization == "Amazon"
          assert str(certification) == "AWS Certified Developer from Amazon"

     @pytest.mark.django_db
     def test_create_language_proficiency(self, create_job_seeker):
          language = SpokenLanguage.objects.create(name="English")
          
          proficiency = JobSeekerLanguageProficiency.objects.create(
               user=create_job_seeker,
               language=language,
               proficiency_level="business"
          )

          assert proficiency.user == create_job_seeker
          assert proficiency.language.name == "English"
          assert proficiency.proficiency_level == "business"

     @pytest.mark.django_db
     def test_job_seeker_social_links(self, create_job_seeker):
          social_links = JobSeekerSocialLink.objects.create(
               user=create_job_seeker, 
               github_social_url="https://github.com/testuser"
          )

          assert social_links.user == create_job_seeker
          assert social_links.github_social_url == "https://github.com/testuser"

     @pytest.mark.django_db
     def test_job_seeker_occupation(self, create_job_seeker):
          specialization = JobSeekerSpecialization.objects.create(name="IT Engineering")
          role = JobSeekerRole.objects.create(specialization=specialization, name="Software Engineer")
          skill = JobSeekerSkill.objects.create(title="Python")
          exp_level = JobSeekerExperienceLevel.objects.create(level="intermediate")

          occupation = JobSeekerOccupation.objects.create(
               user=create_job_seeker,
               specialization=specialization,
               role=role,
               experience_level=exp_level
          )

          occupation.skills.add(skill)

          assert occupation.specialization.name == "IT Engineering"
          assert occupation.role.name == "Software Engineer"
          assert occupation.skills.count() == 1
          assert occupation.experience_level.level == "intermediate"

     @pytest.mark.django_db
     def test_create_certification(self, create_job_seeker):
          certification = JobSeekerCertification.objects.create(
               user=create_job_seeker,
               title="AWS Certified Developer",
               organization="Amazon",
               issued_date=date(2023, 1, 1)
          )

          assert certification.user == create_job_seeker
          assert certification.title == "AWS Certified Developer"
          assert certification.organization == "Amazon"

     @pytest.mark.django_db
     def test_create_specialization(self):
          specialization = JobSeekerSpecialization.objects.create(
               name="Backend Development"
          )

          assert specialization.name == "Backend Development"

     @pytest.mark.django_db
     def test_create_skill(self):
          skill = JobSeekerSkill.objects.create(
               title="Python"
          )

          assert skill.title == "Python"

     @pytest.mark.django_db
     def test_create_experience_level(self):
          level = JobSeekerExperienceLevel.objects.create(
               level="Senior"
          )

          assert level.level == "Senior"

     @pytest.mark.django_db
     def test_create_spoken_language(self):
          language = SpokenLanguage.objects.create(
               name="English"
          )

          assert language.name == "English"