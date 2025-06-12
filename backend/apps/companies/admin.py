from django.contrib import admin
from apps.companies.models import Industry
from apps.job_seekers.admin import CsvUploadMixin

@admin.register(Industry)
class JobSeekerSpecializationAdmin(CsvUploadMixin):
     list_display = (
          'name',
     )
     model_fields = ['name',]
     model_route = "companies/industry"