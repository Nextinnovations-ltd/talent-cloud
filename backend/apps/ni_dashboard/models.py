from django.db import models
from apps.job_posting.models import JobApplication
from apps.companies.models import Company
from apps.job_seekers.models import JobSeeker

class FavoriteApplicant(models.Model):
     """
     Model to store favorite applicants for company users
     """
     user = models.ForeignKey(
          JobSeeker, 
          on_delete=models.CASCADE,
          related_name='favorite_applicants',
          help_text="The user who marked this applicant as favorite"
     )
     company = models.ForeignKey(
          Company,
          on_delete=models.CASCADE,
          related_name='favorite_applicants',
          help_text="The company this favorite belongs to"
     )
     job_application = models.ForeignKey(
          JobApplication,
          on_delete=models.CASCADE,
          related_name='favorited_by',
          help_text="The job application that was favorited"
     )
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     notes = models.TextField(
          blank=True,
          null=True,
          help_text="Optional notes about why this applicant was favorited"
     )
     
     class Meta:
          db_table = 'ni_dashboard_favorite_applicants'
          verbose_name = 'Favorite Applicant'
          verbose_name_plural = 'Favorite Applicants'
          unique_together = ['user', 'company', 'job_application']
          indexes = [
               models.Index(fields=['user', 'company'], name='idx_user_company_fav'),
               models.Index(fields=['company', 'created_at'], name='idx_company_created_fav'),
               models.Index(fields=['job_application'], name='idx_job_application_fav'),
          ]
          ordering = ['-created_at']
     
     def __str__(self):
          return f"{self.user.email} - {self.job_application.job_seeker.name} (Favorite)"
     
     @property
     def job_seeker(self):
          """Quick access to the job seeker"""
          return self.job_application.job_seeker
     
     @property
     def applicant_name(self):
          """Get applicant name"""
          return self.job_application.job_seeker.name
     
     @property
     def applicant_email(self):
          """Get applicant email"""
          return self.job_application.job_seeker.email