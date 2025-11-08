from rest_framework import serializers
from apps.job_posting.models import ApplicationStatus, JobSeeker, JobApplication, JobPost
from apps.job_seekers.models import JobSeekerCertification, JobSeekerEducation, JobSeekerExperience, JobSeekerProject
from apps.ni_dashboard.models import FavouriteJobSeeker
from services.job_seeker.job_seeker_service import JobSeekerService
from utils.datetime.format_helpers import get_formatted_date_range, format_date_for_display, calculate_age

class JobPostDashboardSerializer(serializers.ModelSerializer):
     company = serializers.SerializerMethodField()
     specialization_name = serializers.CharField(source='specialization.name', read_only=True)
     posted_date = serializers.DateTimeField(source='created_at', read_only=True)
     deadline_date = serializers.DateField(source='last_application_date', read_only=True)
     skills = serializers.SerializerMethodField()

     class Meta:
          model = JobPost
          fields = [
               'id',
               'title',
               'company',
               'specialization_name',
               'skills',
               'job_post_status',
               'applicant_count',
               'view_count',
               'posted_date',
               'deadline_date',
          ]

     def get_company(self, obj: JobPost):
          return obj.get_company_name
     
     def get_skills(self, obj: JobPost):
          return obj.get_skill_list

class ApplicantDashboardSerializer(serializers.Serializer):
     application_id = serializers.IntegerField(source='id')
     applicant_id = serializers.IntegerField(source='job_seeker.user.id')
     application_status = serializers.CharField()
     job_post_id = serializers.IntegerField(source='job_post.id')
     name = serializers.CharField(source='job_seeker.name')
     phone_number = serializers.SerializerMethodField()
     email = serializers.CharField(source='job_seeker.email')
     role = serializers.SerializerMethodField()
     address = serializers.SerializerMethodField()
     experience_years = serializers.SerializerMethodField()
     is_open_to_work = serializers.BooleanField(source='job_seeker.is_open_to_work')
     applied_date = serializers.DateTimeField(source='created_at', read_only=True)
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     cover_letter_url = serializers.SerializerMethodField()
     is_shortlisted = serializers.SerializerMethodField()
     
     class Meta:
          model = JobApplication
          fields = [
               'application_id',
               'applicant_id',
               'application_status',
               'job_post_id',
               'name',
               'phone_number',
               'email',
               'role',
               'address',
               'experience_years',
               'is_open_to_work',
               'applied_date',
               'profile_image_url',
               'resume_url',
               'cover_letter_url',
               'is_shortlisted'
          ]
     
     def get_phone_number(self, obj: JobApplication):
          user = obj.job_seeker.user
          
          if user.country_code and user.phone_number:
               return f"{user.country_code}{user.phone_number}"

          return None
     
     def get_role(self, obj: JobApplication):
          job_seeker: JobSeeker = obj.job_seeker
          occupation = getattr(job_seeker, 'occupation', None)
          return getattr(occupation.role, 'name', None) if occupation and occupation.role else None
     
     def get_experience_years(self, obj: JobApplication):
          job_seeker: JobSeeker = obj.job_seeker
          occupation = getattr(job_seeker, 'occupation', None)
          return occupation.experience_years
          
     def get_address(self, obj: JobApplication):
          return obj.job_seeker.get_address
     
     def get_profile_image_url(self, obj: JobApplication):
          return obj.job_seeker.profile_image_url
     
     def get_resume_url(self, obj: JobApplication):
          return obj.resume_url
     
     def get_cover_letter_url(self, obj: JobApplication):
          return obj.cover_letter_url

     def get_is_shortlisted(self, obj: JobApplication):
          return True if obj.application_status == ApplicationStatus.SHORTLISTED else False

# Job Seeker Serializers

class JobSeekerListDashboardSerializer(serializers.ModelSerializer):
     phone_number = serializers.SerializerMethodField()
     role = serializers.SerializerMethodField()
     experience_years = serializers.SerializerMethodField()
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     is_favourite = serializers.BooleanField()
     
     class Meta:
          model = JobSeeker
          fields = [
               'id',
               'name',
               'email',
               'phone_number',
               'role',
               'experience_years',
               'is_open_to_work',
               'profile_image_url',
               'resume_url',
               'is_favourite'
          ]
     
     def get_phone_number(self, obj: JobSeeker):
          return obj.get_phone_number
     
     def get_role(self, obj: JobSeeker):
          return obj.get_role
     
     def get_experience_years(self, obj: JobSeeker):
          return obj.get_experience_year
     
     def get_profile_image_url(self, obj: JobSeeker):
          return obj.profile_image_url
     
     def get_resume_url(self, obj: JobSeeker):
          return obj.resume_url

class FavouriteJobSeekerListDashboardSerializer(serializers.ModelSerializer):
     id = serializers.IntegerField(source='user.id')
     name = serializers.CharField(source='user.name')
     email = serializers.CharField(source='user.email')
     phone_number = serializers.SerializerMethodField()
     role = serializers.SerializerMethodField()
     experience_years = serializers.SerializerMethodField()
     is_open_to_work = serializers.BooleanField(source='user.is_open_to_work')
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     favorited_date = serializers.DateTimeField(source='created_at', read_only=True)
     
     class Meta:
          model = FavouriteJobSeeker
          fields = [
               'id',
               'name',
               'email',
               'phone_number',
               'role',
               'experience_years',
               'is_open_to_work',
               'profile_image_url',
               'resume_url',
               'favorited_date'
          ]
     
     def get_phone_number(self, obj: FavouriteJobSeeker):
        return obj.user.get_phone_number
    
     def get_role(self, obj: FavouriteJobSeeker):
          return obj.user.get_role
     
     def get_experience_years(self, obj: FavouriteJobSeeker):
          return obj.user.get_experience_year
     
     def get_profile_image_url(self, obj: FavouriteJobSeeker):
          return obj.user.profile_image_url
     
     def get_resume_url(self, obj: FavouriteJobSeeker):
          return obj.user.resume_url

class FavouriteJobSeekerDashboardSerializer(serializers.Serializer):
     id = serializers.CharField(source='user.id')
     name = serializers.CharField(source='user.name')
     email = serializers.CharField(source='user.email')
     company_name = serializers.CharField(source='company.name')
     
     class Meta:
          model = FavouriteJobSeeker
          fields = [
               'id', 'name', 'email', 'company_name'
          ]

class JobSeekerOverviewSerializer(serializers.ModelSerializer):
     profile_image_url = serializers.SerializerMethodField()
     resume_url = serializers.SerializerMethodField()
     cover_letter_url = serializers.SerializerMethodField()
     phone_number = serializers.SerializerMethodField()
     address = serializers.SerializerMethodField()
     social_links = serializers.SerializerMethodField()
     occupation = serializers.SerializerMethodField()
     recent_application = serializers.SerializerMethodField()
     recent_applied_jobs = serializers.SerializerMethodField()
     age = serializers.SerializerMethodField()
     
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          self._cached_application = None
          self._application_fetched = False
     
     def get_application(self, obj: JobSeeker):
          """Get and cache the application to avoid multiple queries"""
          if self._application_fetched:
               return self._cached_application
          
          application_id = self.context.get("application_id")
          
          if not application_id:
               self._cached_application = None
          else:
               try:
                    self._cached_application = JobApplication.objects.get(
                         id=application_id, 
                         job_seeker=obj
                    )
               except JobApplication.DoesNotExist:
                    self._cached_application = None
          
          self._application_fetched = True
          return self._cached_application
     
     class Meta:
          model=JobSeeker
          fields=[
               'name', 'email', 'bio', 'phone_number', 'address', 'is_open_to_work',
               'expected_salary', 'profile_image_url', 'resume_url', 'cover_letter_url', 
               'age', 'occupation', 'social_links', 'recent_application',
               'recent_applied_jobs',
          ]
     
     def get_age(self, obj:JobSeeker):
          return calculate_age(obj.date_of_birth)
     
     def get_profile_image_url(self, obj:JobSeeker):
          return obj.profile_image_url

     def get_resume_url(self, obj:JobSeeker):
          application = self.get_application(obj)
          
          if not application:
               return obj.resume_url
          
          return application.resume_url

     def get_cover_letter_url(self, obj: JobSeeker):
          application = self.get_application(obj)
          
          if not application:
               return None
          
          return application.cover_letter_url

     def get_phone_number(self, obj:JobSeeker):
          return obj.get_phone_number

     def get_address(self, obj:JobSeeker):
          return obj.get_address

     def get_social_links(self, obj:JobSeeker):
          return JobSeekerService.get_job_seeker_social_links(obj)
     
     def get_occupation(self, obj):
          return JobSeekerService.get_occupation_info(obj)
     
     def get_recent_application(self, obj: JobSeeker):
          return obj.recent_application
     
     def get_recent_applied_jobs(self, obj: JobSeeker):
          latest_job_applications = obj.latest_job_applications
          
          return JobSeekerRecentAppliedJobSerializer(latest_job_applications, many=True).data

class JobSeekerRecentAppliedJobSerializer(serializers.ModelSerializer):
     job_id = serializers.IntegerField(source='job_post.id')
     position = serializers.CharField(source='job_post.title')
     applicant_count = serializers.IntegerField(source='job_post.applicant_count')
     applied_date = serializers.DateTimeField(source='job_post.created_at')
     company = serializers.SerializerMethodField()
     skills = serializers.SerializerMethodField()
     salary = serializers.SerializerMethodField()

     class Meta:
          model = JobApplication
          fields = [
               'job_id',
               'position',
               'applicant_count',
               'applied_date',
               'company',
               'skills',
               'salary'
          ]

     def get_company(self, obj: JobApplication):
          return obj.job_post.get_company_name
     
     def get_skills(self, obj: JobApplication):
          return obj.job_post.get_skill_list
     
     def get_salary(self, obj: JobApplication):
          return obj.job_post.get_salary

class DashboardJobSeekerProjectSerializer(serializers.ModelSerializer):
     """Serializer for displaying project card"""
     project_image_url = serializers.SerializerMethodField()
     duration = serializers.SerializerMethodField()
     class Meta:
          model = JobSeekerProject
          fields = [
               'id', 'title', 'description', 'project_image_url', 'duration', 'tags'
          ]

     def get_project_image_url(self, obj: JobSeekerProject):
          return obj.project_image_url

     def get_duration(self, obj:JobSeekerProject):
          return get_formatted_date_range(obj.start_date, obj.end_date, obj.is_ongoing)

class DashboardJobSeekerExperienceSerializer(serializers.ModelSerializer):
     duration = serializers.SerializerMethodField()
     class Meta:
          model = JobSeekerExperience
          fields = ['id', 'title', 'organization', 'description', 'duration']
     
     def get_duration(self, obj:JobSeekerExperience):
          return get_formatted_date_range(obj.start_date, obj.end_date, obj.is_present_work)

class DashboardJobSeekerEducationSerializer(serializers.ModelSerializer):
     institution = serializers.SerializerMethodField()
     duration = serializers.SerializerMethodField()
     class Meta:
          model = JobSeekerEducation
          fields = ['id', 'degree', 'institution', 'description', 'duration']

     def get_institution(self, obj:JobSeekerEducation):
          return obj.institution_name

     def get_duration(self, obj:JobSeekerEducation):
          return get_formatted_date_range(obj.start_date, obj.end_date, obj.is_currently_attending)

class DashboardJobSeekerCertificationSerializer(serializers.ModelSerializer):     
     duration = serializers.SerializerMethodField()
     class Meta:
          model = JobSeekerCertification
          fields = [ 'id', 'title', 'organization', 'duration' , 'url', 'credential_id']
     
     def get_duration(self, obj:JobSeekerCertification):
          if obj.has_expiration_date:
               return f"Expiration Date: {format_date_for_display(obj.expiration_date)}"
          
          return f"Issued {format_date_for_display(obj.issued_date)} . No expiration Date"