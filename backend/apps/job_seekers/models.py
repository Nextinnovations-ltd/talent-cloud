from django.db import models
from apps.users.models import TalentCloudUser
from services.models import TimeStampModel

class JobSeeker(TalentCloudUser):
     user = models.OneToOneField(TalentCloudUser, on_delete=models.CASCADE, parent_link=True)
     onboarding_step = models.IntegerField(default=1)
     resume_url = models.URLField(max_length=2048, null=True, blank=True)
     is_open_to_work = models.BooleanField(default=True)
     tagline = models.CharField(max_length=150, null=True, blank=True)
     expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

     def __str__(self):
          return f'{self.user.username} - {self.user.email}'

# region PROFILE DETAILS
class JobSeekerExperience(TimeStampModel):
     WORK_TYPE_CHOICES = (
          ('fulltime', 'Full-time'),
          ('parttime', 'Part-time'),
          ('freelance', 'Freelance'),
          ('contract', 'Contract'),
          ('internship', 'Internship'),
     )

     JOB_TYPE_CHOICES = (
          ('remote', 'Remote'),
          ('onsite', 'On-site'),
          ('hybrid', 'Hybrid'),
     )

     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name="experiences")
     title = models.CharField(max_length=100, null=True, blank=True)
     organization = models.CharField(max_length=100, null=True, blank=True)
     job_type = models.CharField(max_length=100, choices=JOB_TYPE_CHOICES, null=True, blank=True)
     work_type = models.CharField(max_length=100, choices=WORK_TYPE_CHOICES, null=True, blank=True)
     start_date = models.DateField(null=True, blank=True)
     end_date = models.DateField(null=True, blank=True)
     description = models.TextField(null=True, blank=True)
     is_present_work = models.BooleanField(default=False)

     def __str__(self):
          return f"{self.title} - {self.organization}"

class JobSeekerEducation(TimeStampModel):
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='educations')
     degree = models.CharField(max_length=100)
     institution = models.CharField(max_length=255)
     start_date = models.DateField(null=True, blank=True)
     end_date = models.DateField(null=True, blank=True)
     description = models.TextField(null=True, blank=True)
     is_currently_attending = models.BooleanField(default=False)

     def __str__(self):
          return f'{self.degree} from {self.institution}'

class JobSeekerCertification(TimeStampModel):
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='certifications')
     title = models.CharField(max_length=255)
     organization = models.CharField(max_length=255)
     issued_date = models.DateField(null=True, blank=True)
     expiration_date = models.DateField(null=True, blank=True)
     has_expiration_date = models.BooleanField(default=False)
     url = models.URLField(max_length=2048, null=True, blank=True)
     credential_id = models.PositiveIntegerField(null=True, blank=True)

     def __str__(self):
          return f'{self.title} from {self.organization}'

# endregion PROFILE DETAILS

class JobSeekerProject(TimeStampModel):
     """
     Represents a project completed by a job seeker
     """
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='projects')
     title = models.CharField(max_length=255, help_text="Project title")
     description = models.TextField(help_text="Detailed description of the project")
     tags = models.JSONField(
          default=list,
          blank=True,
          help_text="List of technologies, tools, or frameworks used in the project (e.g., ['Python', 'Django', 'React'])"
     )
     project_url = models.URLField(
          max_length=2048, 
          null=True, 
          blank=True, 
          help_text="URL to live project or demo"
     )
     project_image_url = models.URLField(
          max_length=2048, 
          null=True, 
          blank=True, 
          help_text="URL to project screenshot or image"
     )
     start_date = models.DateField(null=True, blank=True, help_text="Project start date")
     end_date = models.DateField(null=True, blank=True, help_text="Project completion date")
     is_ongoing = models.BooleanField(default=False, help_text="Is this project still ongoing")
     team_size = models.PositiveSmallIntegerField(
          null=True, 
          blank=True, 
          help_text="Number of team members (including yourself)"
     )
     
     class Meta:
          verbose_name = "Job Seeker Project"
          verbose_name_plural = "Job Seeker Projects"
          ordering = ['-start_date', '-created_at']
     
     def __str__(self):
          return f"{self.user.username} - {self.title}"

# region OCCUPATIONS
class JobSeekerSpecialization(TimeStampModel):
     name = models.CharField(max_length=150)
     description = models.TextField(null=True, blank= True)
     specialization_image_url = models.URLField(max_length=2048, null=True, blank=True)
     
     def __str__(self):
          return f"{self.name} - {self.description}"

class JobSeekerRole(TimeStampModel):
     specialization = models.ForeignKey(JobSeekerSpecialization, on_delete=models.CASCADE, default=1)
     name = models.CharField(max_length=150)
     role_image_url = models.URLField(max_length=2048, null=True, blank=True)
     
     def __str__(self):
          return f"{self.name}"

class JobSeekerSkill(TimeStampModel):
     title = models.CharField(max_length=50, default="Test")
     
     def __str__(self):
          return f'{self.title}'

class JobSeekerSpecialSkill(TimeStampModel):
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='special_skills')
     skill = models.ForeignKey(JobSeekerSkill, on_delete=models.CASCADE)
     year_of_experience = models.PositiveSmallIntegerField(
          null=True, 
          blank=True,
          help_text="Years of experience with this skill"
     )
     
     class Meta:
          unique_together = ['user', 'skill']  # Prevent duplicate skills for same user
          verbose_name = "Job Seeker Special Skill"
          verbose_name_plural = "Job Seeker Special Skills"
     
     def __str__(self):
          return f"{self.user.username} - {self.skill.title} ({self.year_of_experience}yrs)"
     
     def save(self, *args, **kwargs):
          # Check if user already has 6 special skills
          if not self.pk:  # Only check for new records
               existing_skills_count = JobSeekerSpecialSkill.objects.filter(user=self.user).count()
               if existing_skills_count >= 6:
                    from django.core.exceptions import ValidationError
                    raise ValidationError("A job seeker cannot have more than 6 special skills.")
          super().save(*args, **kwargs)

class JobSeekerExperienceLevel(TimeStampModel):
     level = models.CharField(max_length=50)
     
     def __str__(self):
          return f"{self.level}"

class JobSeekerOccupation(TimeStampModel):
     user = models.OneToOneField(JobSeeker, related_name='occupation', on_delete=models.CASCADE)
     specialization = models.ForeignKey(JobSeekerSpecialization, on_delete=models.SET_NULL, null=True)
     role = models.ForeignKey(JobSeekerRole, on_delete=models.SET_NULL, null=True)
     skills = models.ManyToManyField(JobSeekerSkill, blank=True)
     experience_level = models.ForeignKey(JobSeekerExperienceLevel, on_delete=models.SET_NULL, null=True)
     experience_years = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)

     class Meta:
          indexes = [
               models.Index(fields=['specialization', 'role','experience_level'])  # Composite index on both fields
          ]

     def __str__(self):
          return f"{self.user.username}"

class JobSeekerSocialLink(TimeStampModel):
     user = models.ForeignKey(JobSeeker, related_name='sociallinks', on_delete=models.CASCADE)
     facebook_social_url = models.URLField(max_length=2048, null=True, blank=True)
     linkedin_social_url = models.URLField(max_length=2048, null=True, blank=True)
     behance_social_url = models.URLField(max_length=2048, null=True, blank=True)
     portfolio_social_url = models.URLField(max_length=2048, null=True, blank=True)
     github_social_url = models.URLField(max_length=2048, null=True, blank=True)

class SpokenLanguage(TimeStampModel):
     name = models.CharField(max_length=255)

class JobSeekerLanguageProficiency(TimeStampModel):
     PROFICIENCY_CHOICE = (
          ('none', 'None'),
          ('basic', 'Basic Level'),
          ('intermediate', 'Intermediate Level'),
          ('business', 'Business Level'),
          ('native', 'Native Level')
     )
     
     user = models.ForeignKey(JobSeeker, related_name='language_proficiencies', on_delete=models.CASCADE)
     language = models.ForeignKey(SpokenLanguage, on_delete=models.CASCADE)
     proficiency_level = models.CharField(max_length=255, choices=PROFICIENCY_CHOICE, default='basic')

# endregion OCCUPATION