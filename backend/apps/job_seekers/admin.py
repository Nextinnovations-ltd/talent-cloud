from django.urls import path
from .form import CsvImportForm
from django.contrib import admin
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import JobSeeker, JobSeekerCertification, JobSeekerEducation, JobSeekerExperience, JobSeekerSpecialization, JobSeekerRole, JobSeekerSkill, JobSeekerExperienceLevel, JobSeekerOccupation, SpokenLanguage
import csv

@admin.register(JobSeeker)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'resume_url')  # Adjust these fields as necessary

admin.site.register(JobSeekerCertification)
admin.site.register(JobSeekerEducation)
admin.site.register(JobSeekerExperience)
admin.site.register(JobSeekerOccupation)

class CsvUploadMixin(admin.ModelAdmin):
    template_url = "admin/csv_import.html"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-csv/', self.import_job_seeker_industry, name='import_csv'),
        ]
        return custom_urls + urls

    def import_job_seeker_industry(self, request):
        if request.method == "POST":
            file = request.FILES["csv_file"]
            
            if not file:
                raise ValueError("File not exists.")

            decoded_file = file.read().decode("utf-8-sig").splitlines()
            reader = csv.DictReader(decoded_file)       
            
            for row in reader:
                data = {field.strip(): row[field] for field in reader.fieldnames if field in row}
                
                self.model.objects.get_or_create(**data)

            return HttpResponseRedirect(f"/admin/{self.model_route}/")
        
        form = CsvImportForm()
        return render(request, self.template_url, {"form": form})

@admin.register(JobSeekerSpecialization)
class JobSeekerSpecializationAdmin(CsvUploadMixin):
    list_display = (
        'name', 'description', 'status'
    )
    model_fields = ['name', 'description']
    model_route = "job_seekers/jobseekerspecialization"

@admin.register(JobSeekerRole)
class JobSeekerRoleAdmin(CsvUploadMixin):
    list_display = ('name',)
    model_fields = ['name',]
    model_route = "job_seekers/jobseekerrole"
    
    template_url = "admin/csv_import.html"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-csv/', self.import_roles, name='import_csv'),
        ]
        return custom_urls + urls

    def import_roles(self, request):
        if request.method == "POST":
            file = request.FILES["csv_file"]
            
            if not file:
                raise ValueError("File not exists.")

            decoded_file = file.read().decode("utf-8-sig").splitlines()
            reader = csv.DictReader(decoded_file)       
            
            for row in reader:
                if 'specialization' in reader.fieldnames:
                    row['specialization'] = JobSeekerSpecialization.objects.get(name=row['specialization'])
                self.model.objects.create(**{field: row[field] for field in reader.fieldnames if field in row})
            
            return HttpResponseRedirect(f"/admin/{self.model_route}/")
        
        form = CsvImportForm()
        return render(request, self.template_url, {"form": form})

@admin.register(JobSeekerSkill)
class JobSeekerSkillAdmin(CsvUploadMixin):
    list_display = ('title',)
    model_fields = ['title',]
    model_route = "job_seekers/jobseekerskill"

@admin.register(JobSeekerExperienceLevel)
class JobSeekerExperienceAdmin(CsvUploadMixin):
    list_display = ('level',)
    model_fields = ['level',]
    model_route = "job_seekers/jobseekerexperiencelevel"

@admin.register(SpokenLanguage)
class JobSeekerSpokenLanguageAdmin(CsvUploadMixin):
    list_display = ('name',)
    model_fields = ['name',]
    model_route = "job_seekers/spokenlanguage"