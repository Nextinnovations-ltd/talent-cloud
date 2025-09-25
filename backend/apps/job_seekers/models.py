from django.db import models
from apps.users.models import TalentCloudUser
from apps.authentication.models import FileUpload
from services.models import TimeStampModel

class JobSeeker(TalentCloudUser):
     user = models.OneToOneField(TalentCloudUser, on_delete=models.CASCADE, parent_link=True)
     onboarding_step = models.IntegerField(default=1)
     video_url = models.TextField(null=True, blank=True)
     is_open_to_work = models.BooleanField(default=True)
     tagline = models.CharField(max_length=150, null=True, blank=True)
     expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

     def __str__(self):
          return f'{self.user.username} - {self.user.email}'
     
     def resume(self):
          """Get the default Resume"""
          return self.resume_documents.filter(is_default=True).first()

     @property
     def resume_upload_time(self):
          """Get the upload time of the resume"""
          resume = self.resume()
          
          if not resume:
               return None
          
          return resume.file_upload.uploaded_at if resume.file_upload else None

     @property
     def resume_upload_file(self):
          """Get the resume url"""
          resume: Resume = self.resume()
          
          if not resume:
               return None
          
          return resume.file_upload

     @property
     def resume_url(self):
          """Get the resume url"""
          resume: Resume = self.resume()
          
          if not resume:
               return None
          
          return resume.resume_url
     
     @property
     def resume_path(self):
          """Get the resume path"""
          resume = self.resume()
          
          if not resume or not resume.resume_path:
               return None
          
          return resume.resume_path

     @property
     def resume_file_list(self):
          """Get all Resume list"""
          return self.resume_documents.all()

     @property
     def recent_application(self):
          """Get job seeker latest application"""
          from services.job_seeker.job_seeker_service import JobSeekerService
          return JobSeekerService.get_latest_application(self)
     
     @property
     def latest_job_applications(self):
          """Get job seeker latest job applications"""
          from services.job_seeker.job_seeker_service import JobSeekerService
          return JobSeekerService.get_latest_job_applications(self)

     @property
     def get_role(self):
          occupation = getattr(self, 'occupation', None)
          return getattr(occupation.role, 'name', None) if occupation and occupation.role else None

     @property
     def get_experience_year(self):
          """Get Job Seeker Experience Year"""
          from services.job_seeker.job_seeker_service import JobSeekerService
          return JobSeekerService.get_job_seeker_experience_year(self)
     
class Resume(TimeStampModel):
     job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='resume_documents')
     title = models.CharField(max_length=255, help_text="Display name for this CV", null=True, blank=True)
     resume_path = models.URLField(max_length=2048, null=True, blank=True)
     file_upload = models.ForeignKey(FileUpload, on_delete=models.SET_NULL, null=True, blank=True)
     is_default = models.BooleanField(default=False, help_text="Is this the default CV?")
     
     class Meta:
          ordering = ['-is_default', '-created_at']
          constraints = [
               models.UniqueConstraint(
                    fields=['job_seeker'],
                    condition=models.Q(is_default=True),
                    name='unique_default_cv_per_jobseeker'
               )
          ]

     def __str__(self):
          default_indicator = " (Default)" if self.is_default else ""
          return f"{self.job_seeker.name} - {self.title}{default_indicator}"

     def save(self, *args, **kwargs):
          # If CV is being set as default, remove default from other CVs
          if self.is_default:
               Resume.objects.filter(
                    job_seeker=self.job_seeker,
                    is_default=True
               ).exclude(pk=self.pk).update(is_default=False)
          
          # Make default
          elif not Resume.objects.filter(job_seeker=self.job_seeker).exists():
               self.is_default = True
               
          super().save(*args, **kwargs)

     @property
     def file_path(self):
          """Get the file URL from the associated FileUpload"""
          return self.file_upload.file_path if self.file_upload else None
     
     @property
     def resume_url(self):
          """Get the resume url"""
          if not self.file_upload:
               return None
          
          return self.file_upload.public_url
          # return FileUrlService.get_resume_public_url(self.resume_path)
     
class University(TimeStampModel):
     """
     University/Institution model for job seeker education
     """
     UNIVERSITY_TYPES = (
          ('public', 'Public University'),
          ('private', 'Private University'),
          ('international', 'International University'),
          ('institute', 'Institute/College'),
          ('academy', 'Academy'),
          ('college', 'Education College'),
          ('other', 'Other'),
     )
     id = models.CharField(
          max_length=20,
          primary_key=True,
          unique=True
     )
     name = models.CharField(max_length=255, help_text="Full university name")
     short_name = models.CharField(max_length=100, null=True, blank=True, help_text="Abbreviated name")
     university_type = models.CharField(max_length=20, choices=UNIVERSITY_TYPES, default='public')
     country = models.CharField(max_length=100, help_text="Country where university is located")
     state = models.CharField(max_length=100, null=True, blank=True, help_text="State/Region in Myanmar")
     website_url = models.URLField(max_length=500, null=True, blank=True, help_text="Official website")
     is_verified = models.BooleanField(default=True, help_text="Is this an officially verified university")
     
     class Meta:
          verbose_name = "University"
          verbose_name_plural = "Universities"
          ordering = ['country', 'state', 'name']
          indexes = [
               models.Index(fields=['country']),
               models.Index(fields=['state']),
          ]
     
     def __str__(self):
          if self.state:
               return f"{self.name} ({self.state})"
          return f"{self.name} ({self.country})"

     @classmethod
     def get_universities_by_region(cls, state):
          """Get universities by Myanmar state/region"""
          return cls.objects.filter(
               status=True,
               state=state
          ).order_by('name')
     
     @classmethod
     def get_all_active_universities(cls):
          """Get all active universities"""
          return cls.objects.filter(status=True).order_by('country', 'state', 'name')

class JobSeekerEducation(TimeStampModel):
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='educations')
     degree = models.CharField(max_length=100)
     custom_institution = models.CharField(max_length=255, null=True, blank=True)
     institution = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True)
     start_date = models.DateField(null=True, blank=True)
     end_date = models.DateField(null=True, blank=True)
     description = models.TextField(null=True, blank=True)
     is_currently_attending = models.BooleanField(default=False)

     class Meta:
          ordering = ['-start_date', '-created_at']
     
     def __str__(self):
          return f'{self.degree} from {self.custom_institution}'

     def clean(self):
          """Validate that either university or custom_institution is provided"""
          from django.core.exceptions import ValidationError
          
          if not self.institution and not self.custom_institution:
               raise ValidationError("Either select a university or provide a custom institution name.")
          
          if self.institution and self.custom_institution:
               raise ValidationError("Please select either a university from dropdown OR provide custom institution, not both.")

     @property
     def institution_name(self):
          """Get the institution name (either from university or custom)"""
          if self.institution:
               return self.institution.name
          return self.custom_institution
          
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

class JobSeekerCertification(TimeStampModel):
     user = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='certifications')
     title = models.CharField(max_length=255)
     organization = models.CharField(max_length=255)
     issued_date = models.DateField(null=True, blank=True)
     expiration_date = models.DateField(null=True, blank=True)
     has_expiration_date = models.BooleanField(default=False)
     url = models.URLField(max_length=2048, null=True, blank=True)
     credential_id = models.PositiveIntegerField(null=True, blank=True)

     class Meta:
          ordering = ['-issued_date', '-created_at']

     def __str__(self):
          return f'{self.title} from {self.organization}'

class JobSeekerProject(TimeStampModel):
     """
     Represents a project completed by a job seeker
     """
     from apps.authentication.models import FileUpload
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
     # project_image_url = models.URLField(
     #      max_length=2048, 
     #      null=True, 
     #      blank=True, 
     #      help_text="URL to project screenshot or image"
     # )
     project_image_file = models.ForeignKey(
          FileUpload,
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='project_images'
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
     
     @property
     def project_image_url(self):
          if not self.project_image_file:
               return None
          return self.project_image_file.public_url

class JobSeekerSpecialization(TimeStampModel):
     id = models.CharField(
          max_length=10, 
          primary_key=True,
          unique=True
     )
     name = models.CharField(max_length=150)
     description = models.TextField(null=True, blank= True)
     specialization_image_url = models.URLField(max_length=2048, null=True, blank=True)
     
     def __str__(self):
          return f"{self.name} - {self.description}"

class JobSeekerRole(TimeStampModel):
     id = models.CharField(
          max_length=10,
          primary_key=True,
          unique=True
     )
     specialization = models.ForeignKey(JobSeekerSpecialization, on_delete=models.CASCADE, to_field="id")
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

     def clean(self):
          """Validate that role belongs to the selected specialization"""
          from django.core.exceptions import ValidationError
          
          # If both specialization and role are provided, validate they match
          if self.specialization and self.role:
               if self.role.specialization != self.specialization:
                    raise ValidationError("Selected role does not belong to specialization. Please update specialization first.")
          
          # If role is provided but no specialization, that's invalid
          if self.role and not self.specialization:
               raise ValidationError("Specialization is required when selecting a role.")

     def save(self, *args, **kwargs):
          # Run validation before saving
          self.clean()
          super().save(*args, **kwargs)

     def __str__(self):
          return f"{self.user.username}"

class JobSeekerSocialLink(TimeStampModel):
     user = models.OneToOneField(JobSeeker, related_name='social_links', on_delete=models.CASCADE)
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