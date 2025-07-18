from django.db import models
from apps.job_seekers.models import JobSeeker, JobSeekerExperienceLevel, JobSeekerRole, JobSeekerSkill, JobSeekerSpecialization
from apps.users.models import TalentCloudUser
from services.models import TimeStampModel

class JobType(models.TextChoices):
     FULL_TIME = 'full_time', 'Full Time'
     PART_TIME = 'part_time', 'Part Time'

class WorkType(models.TextChoices):
     ONSITE = 'onsite', 'Onsite'
     WFH = 'work_from_home', 'Work From Home'
     HYBRID = 'hybrid', 'Hybrid'

class SalaryModeType(models.TextChoices):
     Fixed = 'fixed', 'Fixed'
     Range = 'range', 'Range'

class PerSalaryType(models.TextChoices):
     HOURLY = 'hourly', 'hour'
     MONTHLY = 'monthly', 'month'

class ProjectDurationType(models.TextChoices):
     LessThanOneMonth = "less_than_1_month", "Less than 1 month"
     OneToThreeMonth = "1_to_3_months", "1 to 3 months"
     ThreeToSixMonth = "3_to_6_months", "3 to 6 months"
     MoreThanSixMonth = "more_than_6_months", "More than 6 months"
     Ongoing = "ongoing", "Ongoing / Indefinite"

class StatusChoices(models.TextChoices):
     PENDING = 'pending', 'pending'
     ACTIVE = 'active', 'Active'
     DRAFT = 'draft', 'Draft'
     EXPIRED = 'expired', 'Expired'

class JobPostQuerySet(models.QuerySet):
     def active(self):
          return self.filter(job_post_status=StatusChoices.ACTIVE)

     def pending(self):
          return self.filter(job_post_status=StatusChoices.PENDING)

     def draft(self):
          return self.filter(job_post_status=StatusChoices.DRAFT)

     def expired(self):
          return self.filter(job_post_status=StatusChoices.EXPIRED)

     def auto_expired(self):
          """Get jobs that are automatically expired by date (even if status isn't updated)."""
          from datetime import date
          today = date.today()
          return self.filter(
               models.Q(last_application_date__lt=today) | 
               models.Q(job_post_status=StatusChoices.EXPIRED)
          )
     
     def effectively_active(self):
          """Get jobs that are effectively active (can receive applications)."""
          from datetime import date
          today = date.today()
          return self.filter(
               job_post_status=StatusChoices.ACTIVE,
               is_accepting_applications=True
          ).exclude(
               last_application_date__lt=today
          )

class JobPostManager(models.Manager):
     def get_queryset(self):
          return JobPostQuerySet(self.model, using=self._db)

     def active(self):
          return self.get_queryset().active()

     def expired(self):
          return self.get_queryset().expired()

     def pending(self):
          return self.get_queryset().pending()

     def draft(self):
          return self.get_queryset().draft()

     def auto_expired(self):
          return self.get_queryset().auto_expired()
     
     def effectively_active(self):
          return self.get_queryset().effectively_active()


# Job Post
class JobPost(TimeStampModel):
     title = models.CharField(max_length=255)
     
     description = models.TextField(blank=True, null=True)
     responsibilities = models.TextField(blank=True, null=True)
     requirements = models.TextField(blank=True, null=True)
     offered_benefits = models.TextField(blank=True, null=True)
     
     location = models.CharField(max_length=255, null=True, blank=True)
     specialization = models.ForeignKey(JobSeekerSpecialization, on_delete=models.SET_NULL, related_name="job_post", null=True, blank=True)
     role = models.ForeignKey(JobSeekerRole, on_delete=models.SET_NULL, related_name='job_posts', null=True, blank=True)
     skills = models.ManyToManyField(JobSeekerSkill, related_name='job_posts', blank=True)
     experience_level = models.ForeignKey(
          JobSeekerExperienceLevel,
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='job_posts'
     )
     experience_years = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
     
     job_type = models.CharField(max_length=50, choices=JobType.choices)
     work_type = models.CharField(max_length=50, choices=WorkType.choices)
     
     number_of_positions = models.PositiveIntegerField(default=1)
     
     salary_mode = models.CharField(max_length=10, choices=SalaryModeType.choices, default=SalaryModeType.Fixed, blank=True)
     salary_type = models.CharField(max_length=10, choices=PerSalaryType.choices, default=PerSalaryType.MONTHLY, blank=True)
     
     salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
     salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
     salary_fixed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
     is_salary_negotiable = models.BooleanField(default=False)
     
     project_duration = models.CharField(max_length=50, choices=ProjectDurationType.choices, null=True, blank=True)
     posted_by = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE, related_name='job_posts')  # NI Admin only
     last_application_date = models.DateField(null=True, blank=True)
     is_accepting_applications = models.BooleanField(default=True)

     view_count = models.PositiveIntegerField(default=0)
     applicant_count = models.PositiveIntegerField(default=0)
     bookmark_count = models.PositiveIntegerField(default=0)
     
     job_post_status = models.CharField(max_length=50, choices=StatusChoices.choices, default=StatusChoices.ACTIVE, blank=True)
     
     objects = JobPostManager()

     def is_expired(self):
          """
          Check if the job post is expired based on:
          1. Manual status (job_post_status = 'expired')
          2. Automatic expiration (last_application_date has passed)
          """
          from datetime import date
          
          # Check manual expiration status
          if self.job_post_status == StatusChoices.EXPIRED:
               return True
          
          # Check automatic expiration based on last application date
          if self.last_application_date:
               today = date.today()
               if self.last_application_date < today:
                    return True
          
          return False

     def is_effectively_active(self):
          """
          Check if the job post is effectively active (can receive applications)
          """
          return (
               self.job_post_status == StatusChoices.ACTIVE and
               self.is_accepting_applications and
               not self.is_expired()
          )

     def get_effective_status(self):
          """
          Get the effective status of the job post considering both manual and automatic expiration
          """
          if self.is_expired():
               return StatusChoices.EXPIRED
          return self.job_post_status

     def __str__(self):
          return f"{self.title} - {self.get_effective_status()}"

# End Job Post

# Job Application
class ApplicationStatus(models.TextChoices):
    """
    Defines the possible states for a job application.
    """
    APPLIED = 'applied', 'Applied'
    UNDER_REVIEW = 'under_review', 'Under Review'
    SHORTLISTED = 'shortlisted', 'Shortlisted'
    INTERVIEW_SCHEDULED = 'interview_scheduled', 'Interview Scheduled'
    OFFER_EXTENDED = 'offer_extended', 'Offer Extended'
    ACCEPTED = 'accepted', 'Accepted'
    REJECTED = 'rejected', 'Rejected'
    WITHDRAWN = 'withdrawn', 'Withdrawn'

class JobApplication(TimeStampModel):
     """
     Represents a job seeker's application to a specific job post.
     """
     job_post = models.ForeignKey(
          JobPost,
          on_delete=models.CASCADE,
          related_name='applications',
          help_text="The job post the seeker is applying for."
     )
     job_seeker = models.ForeignKey(
          JobSeeker,
          on_delete=models.CASCADE,
          related_name='applications',
          help_text="The job seeker who submitted the application."
     )
     status = models.CharField(
          max_length=50,
          choices=ApplicationStatus.choices,
          default=ApplicationStatus.APPLIED,
          help_text="The current status of the application."
     )
     cover_letter = models.TextField(
          null=True,
          blank=True,
          help_text="Optional cover letter submitted with the application."
     )
     application_resume_url = models.URLField(
          max_length=2048,
          null=True,
          blank=True,
          help_text="URL of the resume submitted for this specific application (optional). If not provided, the seeker's current resume_url is typically used."
     )

     class Meta:
          verbose_name = "Job Application"
          verbose_name_plural = "Job Applications"
          unique_together = ('job_post', 'job_seeker')
          ordering = ['-created_at']

     def __str__(self):
          return f"Application for '{self.job_post.title}' by {self.job_seeker.user.email}"

     def save(self, *args, **kwargs):
          is_new = self._state.adding
          super().save(*args, **kwargs)
          
          if is_new:
               self.job_post.applicant_count = self.job_post.applications.count()
               self.job_post.save(update_fields=['applicant_count'])

     def delete(self, *args, **kwargs):
          job_post = self.job_post
          super().delete(*args, **kwargs)
          job_post.applicant_count = job_post.applications.count()
          job_post.save(update_fields=['applicant_count'])
          
# End Job Application

# Job Post Bookmark

class BookmarkedJob(TimeStampModel):
     """
     Represents a job seeker bookmarking a specific job post.
     Many-to-Many relationship 'through' model between JobSeeker and JobPost.
     """
     job_post = models.ForeignKey(
          JobPost,
          on_delete=models.CASCADE,
          related_name='bookmarks',
          help_text="The job post that is bookmarked."
     )
     job_seeker = models.ForeignKey(
          JobSeeker,
          on_delete=models.CASCADE,
          related_name='bookmarked_jobs',
          help_text="The job seeker who bookmarked the job."
     )

     class Meta:
          verbose_name = "Bookmarked Job"
          verbose_name_plural = "Bookmarked Jobs"
          unique_together = ('job_post', 'job_seeker')
          ordering = ['-created_at']

     def __str__(self):
          return f"'{self.job_post.title}' bookmarked by {self.job_seeker.user.email}"

     def save(self, *args, **kwargs):
          is_new = self._state.adding
          super().save(*args, **kwargs)
          
          if is_new:
               self.job_post.bookmark_count = self.job_post.bookmarks.count()
               self.job_post.save(update_fields=['bookmark_count'])

     def delete(self, *args, **kwargs):
          job_post = self.job_post
          super().delete(*args, **kwargs)
          
          job_post.bookmark_count = job_post.bookmarks.count()
          job_post.save(update_fields=['bookmark_count'])

# End Job Post Bookmark

# region Job Post View

class JobPostView(TimeStampModel):
     job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE)
     job_post = models.ForeignKey(JobPost, related_name='views', on_delete=models.CASCADE)

     class Meta:
        unique_together = ('job_post', 'job_seeker')
        ordering = ['-created_at']

     def __str__(self):
          return f"{self.job_seeker.user.email} viewed '{self.job_post.title}'"

     def save(self, *args, **kwargs):
          is_new = self._state.adding
          
          super().save(*args, **kwargs)

          if is_new:
               self.job_post.view_count = self.job_post.views.count()
               self.job_post.save(update_fields=['view_count'])

     def delete(self, *args, **kwargs):
          job_post = self.job_post
          
          super().delete(*args, **kwargs)
          
          job_post.view_count = job_post.views.count()
          job_post.save(update_fields=['view_count'])

# endregion Job Post View

class JobPostMetric(models.Model):
     class EventType(models.TextChoices):
          VIEW = 'view', 'View'
          APPLY = 'apply', 'Apply'
          BOOKMARK = 'bookmark', 'Bookmark'

     job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='metrics')
     user = models.ForeignKey(TalentCloudUser, on_delete=models.SET_NULL, null=True, blank=True)
     event_type = models.CharField(max_length=20, choices=EventType.choices)
     created_at = models.DateTimeField(auto_now_add=True)
     metadata = models.JSONField(null=True, blank=True)

     def __str__(self):
          return f"{self.event_type} on {self.job_post.title} at {self.created_at}"