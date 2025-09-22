from django.db import models
from apps.companies.models import Company
from apps.job_seekers.models import JobSeeker
from services.models import TimeStampModel

class FavouriteJobSeeker(TimeStampModel):
     """
     Model to store favorite job seeker for company
     """
     user = models.ForeignKey(
          JobSeeker, 
          on_delete=models.CASCADE,
          related_name='favorite_applicant',
          help_text="The user who marked this applicant as favorite"
     )
     company = models.ForeignKey(
          Company,
          on_delete=models.CASCADE,
          related_name='favorite_applicants',
          help_text="The company this favorite belongs to"
     )
     created_by = models.CharField(
          max_length=255,
          null=True,
          blank=True
     )
     updated_by = models.CharField(
          max_length=255,
          null=True,
          blank=True
     )
     
     class Meta:
          db_table = 'ni_dashboard_favorite_applicants'
          verbose_name = 'Favorite Applicant'
          verbose_name_plural = 'Favorite Applicants'
          unique_together = ['user', 'company']
          indexes = [
               models.Index(fields=['user', 'company'], name='idx_user_company_fav')
          ]
          ordering = ['-created_at']
     
     def __str__(self):
          return f"{self.user.email} - {self.company.name} (Favorite)"
     
     @property
     def job_seeker(self):
          """Quick access to the job seeker"""
          return self.user
     
     @property
     def job_seeker_name(self):
          """Get job seeker name"""
          return self.job_seeker.name
     
     @property
     def job_seeker_email(self):
          """Get job seeker email"""
          return self.job_seeker.email