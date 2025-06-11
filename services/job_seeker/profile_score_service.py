from apps.job_seekers.models import JobSeeker
from services.job_seeker.job_seeker_service import JobSeekerService

class ProfileScoreService:
     @staticmethod
     def generate_profile_completion_percentage(user):
          profile_score = ProfileScoreService.calculate_profile_completion_percentage(user)
          
          return {
               'message': "Successfully generated user profile score",
               'data': profile_score
          }
     
     @staticmethod
     def calculate_profile_completion_percentage(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          weights = {
               "cv": 20,
               "profile": 20,
               "skills": 15,
               "work_experiences": 15,
               "educations": 10,
               "certifications": 10,
               "languages": 5,
               "social_links": 5
          }
          
          profile_score = {
               "completion_percentage": 0,
               "cv": False,
               "profile": False,
               "skill": False,
               "experience": False,
               "education": False,
               "certification": False,
               "language": False,
               "social_skill": False
          }
          
          current_completion_percentage = 0
          
          # Resume
          if job_seeker.resume_url:
               current_completion_percentage += weights["cv"]
               profile_score["cv"] = True
          
          # Profile
          if ProfileScoreService._validate_profile(job_seeker):
               current_completion_percentage += weights["profile"]
               profile_score["profile"] = True
               
          
          # Skill
          if ProfileScoreService._validate_skill(job_seeker):
               current_completion_percentage += weights["skills"]
               profile_score["skill"] = True
               
          # Work Experience
          if ProfileScoreService._validate_work_experience(job_seeker):
               current_completion_percentage += weights["work_experiences"]
               profile_score["experience"] = True
          
          # Education
          if ProfileScoreService._validate_education(job_seeker):
               current_completion_percentage += weights["educations"]
               profile_score["education"] = True
          
          # Certification
          if ProfileScoreService._validate_certification(job_seeker):
               current_completion_percentage += weights["certifications"]
               profile_score["certification"] = True
          
          # Language
          if ProfileScoreService._validate_language(job_seeker):
               current_completion_percentage += weights["languages"]
               profile_score["language"] = True
          
          # Social Link
          if ProfileScoreService._validate_social_link(job_seeker):
               current_completion_percentage += weights["social_links"]
               profile_score["social_skill"] = True
          
          profile_score["completion_percentage"] = current_completion_percentage
          
          return profile_score
     
     @staticmethod
     def get_profile_completion_percentage(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          weights = {
               "cv": 20,
               "profile": 20,
               "skills": 15,
               "work_experiences": 15,
               "educations": 10,
               "certifications": 10,
               "languages": 5,
               "social_links": 5
          }
          
          completion_percentage = 0
          
          # Resume
          if job_seeker.resume_url:
               completion_percentage += weights["cv"]
          
          # Profile
          if ProfileScoreService._validate_profile(job_seeker):
               completion_percentage += weights["profile"]

          # Skill
          if ProfileScoreService._validate_skill(job_seeker):
               completion_percentage += weights["skills"]
               
          # Work Experience
          if ProfileScoreService._validate_work_experience(job_seeker):
               completion_percentage += weights["work_experiences"]
          
          # Education
          if ProfileScoreService._validate_education(job_seeker):
               completion_percentage += weights["educations"]
          
          # Certification
          if ProfileScoreService._validate_certification(job_seeker):
               completion_percentage += weights["certifications"]
          
          # Language
          if ProfileScoreService._validate_language(job_seeker):
               completion_percentage += weights["languages"]
          
          # Social Link
          if ProfileScoreService._validate_social_link(job_seeker):
               completion_percentage += weights["social_links"]
          
          return completion_percentage
     
     @staticmethod
     def _get_job_seeker_occupation(job_seeker: JobSeeker):
          return job_seeker.occupations.first() if job_seeker.occupations.exists() else None
     
     @staticmethod
     def _validate_profile(job_seeker: JobSeeker):
          if not job_seeker.name:
               return False
          
          if not job_seeker.username:
               return False
          
          if not job_seeker.phone_number or not job_seeker.country_code:
               return False
          
          if not job_seeker.date_of_birth:
               return False
          
          if not job_seeker.address:
               return False
          
          job_seeker_occupation = ProfileScoreService._get_job_seeker_occupation(job_seeker)
          
          # If jobseeker occupation not exists yet
          if not job_seeker_occupation:
               return False
          
          if not job_seeker_occupation.specialization:
               return False
          
          if not job_seeker_occupation.experience_level:
               return False
          
          return True
     
     @staticmethod
     def _validate_skill(job_seeker: JobSeeker):
          job_seeker_occupation = ProfileScoreService._get_job_seeker_occupation(job_seeker)
          
          if not job_seeker_occupation:
               return False
          
          return True if job_seeker_occupation.skills.exists() else False
     
     @staticmethod
     def _validate_work_experience(job_seeker: JobSeeker):
          return True if job_seeker.experiences.exists() else False
     
     @staticmethod
     def _validate_education(job_seeker: JobSeeker):
          return True if job_seeker.educations.exists() else False
     
     @staticmethod
     def _validate_certification(job_seeker: JobSeeker):
          return True if job_seeker.certifications.exists() else False
     
     @staticmethod
     def _validate_language(job_seeker: JobSeeker):
          return True if job_seeker.language_proficiencies.exists() else False
     
     @staticmethod
     def _validate_social_link(job_seeker: JobSeeker):
          return True if job_seeker.sociallinks.exists() else False
               

