from django.db import models
from services.models import TimeStampModel
from django.utils.text import slugify

COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1001-5000', '1001-5000 employees'),
        ('5001-10000', '5001-10000 employees'),
        ('10000+', '10000+ employees'),
    ]

class Company(TimeStampModel):
     """
     Represents a company that posts jobs on the platform.
     Associated with Admin/Superadmin users.
     """
     name = models.CharField(
          max_length=255,
          null=False,
          blank=False,
          unique=True,
          help_text="The official name of the company."
     )
     slug = models.SlugField(
          max_length=255,
          unique=True,
          blank=True,
          help_text="URL-friendly version of the company name."
     )
     address = models.CharField(
          max_length=255,
          null=True,
          blank=True,
          help_text="The address of the company."
     )
     image_url = models.URLField(
          null=True,
          blank=True,
          max_length=1024,
          help_text="URL to the company's logo."
     )
     website = models.URLField(
          null=True,
          blank=True,
          max_length=1024,
          help_text="The official website URL of the company."
     )
     description = models.TextField(
          null=True,
          blank=True,
          help_text="A detailed description of the company, its mission, and culture."
     )
     industry = models.CharField(
          max_length=100,
          null=True,
          blank=True,
          help_text="The industry the company operates in (e.g., Technology, Healthcare)."
     )
     size = models.CharField(
          max_length=50,
          null=True,
          blank=True,
          choices=COMPANY_SIZE_CHOICES,
          help_text="The size of the company (number of employees)."
     )
     tagline = models.CharField(
          max_length=150,
          null=True,
          blank=True,
          help_text="A short, catchy tagline for the company."
     )
     contact_email = models.EmailField(
          null=True,
          blank=True,
          help_text="A general contact email for the company."
     )
     contact_phone = models.CharField(
          max_length=20,
          null=True,
          blank=True,
          help_text="A general contact phone number for the company."
     )
     founded_date = models.DateField(
          null=True,
          blank=True,
          help_text="The date the company was founded."
     )
     is_verified = models.BooleanField(
          default=False,
          help_text="Whether the company profile has been verified by the platform."
     )

     class Meta:
          verbose_name = "Company"
          verbose_name_plural = "Companies"

     def __str__(self):
          return self.name

     def save(self, *args, **kwargs):
          # Generate a unique slug if it doesn't exist
          if not self.slug and self.name:
               self.slug = slugify(self.name)
               
               original_slug = self.slug
               counter = 1
               while Company.objects.filter(slug=self.slug).exists():
                    self.slug = f"{original_slug}-{counter}"
                    counter += 1

          super().save(*args, **kwargs)
     
class VerifyRegisteredCompany(TimeStampModel):
    email = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    verification_code = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()
