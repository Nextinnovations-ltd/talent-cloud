from apps.job_seekers.models import JobSeekerCertification, JobSeekerEducation, JobSeekerExperience

class ExperienceService:
     @staticmethod
     def get_experiences(user_id):
          return JobSeekerExperience.objects.filter(user__id=user_id).order_by('-created_at')

class EducationService:
     @staticmethod
     def get_educations(user_id):
          return JobSeekerEducation.objects.filter(user__id=user_id).order_by('-created_at')

class CertificationService:
     @staticmethod
     def get_certifications(user_id):
          return JobSeekerCertification.objects.filter(user__id=user_id).order_by('-created_at')