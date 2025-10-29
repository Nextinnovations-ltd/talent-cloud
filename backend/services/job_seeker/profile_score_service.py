from apps.job_seekers.models import JobSeeker, JobSeekerOccupation
from services.job_seeker.job_seeker_service import JobSeekerService

class ProfileScoreService:
     PROFILE_SUB_WEIGHTS = {
          'name': 3,
          'username': 2,
          'contact': 3,
          'date_of_birth': 1,
          'address': 1,
          'occupation_exists': 2,
          'specialization': 3,
          'role': 3,
          'experience_level': 2,
          'experience_years': 2,
          'social_link': 3,
          'TOTAL_POSSIBLE': 25
     }
          
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
               "cv": 35,
               "profile": 25,
               "skill": 10,
               "experience": 10,
               "education": 10,
               "certification": 5,
               "language": 5
               # "social_links": 5
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
               "missing_profile_fields": []
          }
          
          current_completion_percentage = 0
          
          # Resume
          if job_seeker.resume_url:
               current_completion_percentage += weights["cv"]
               profile_score["cv"] = True
          
          # Profile
          profile_sub_score, missing_fields = ProfileScoreService._validate_profile(job_seeker)
          
          current_completion_percentage += profile_sub_score
          profile_score["missing_profile_fields"] = missing_fields
          
          if profile_sub_score == ProfileScoreService.PROFILE_SUB_WEIGHTS['TOTAL_POSSIBLE']:
               profile_score["profile"] = True
          
          # Skill
          if ProfileScoreService._validate_skill(job_seeker):
               current_completion_percentage += weights["skill"]
               profile_score["skill"] = True
               
          # Work Experience
          if ProfileScoreService._validate_work_experience(job_seeker):
               current_completion_percentage += weights["experience"]
               profile_score["experience"] = True
          
          # Education
          if ProfileScoreService._validate_education(job_seeker):
               current_completion_percentage += weights["education"]
               profile_score["education"] = True
          
          # Certification
          if ProfileScoreService._validate_certification(job_seeker):
               current_completion_percentage += weights["certification"]
               profile_score["certification"] = True
          
          # Language
          if ProfileScoreService._validate_language(job_seeker):
               current_completion_percentage += weights["language"]
               profile_score["language"] = True
          
          profile_score["completion_percentage"] = current_completion_percentage
          
          return profile_score
     
     @staticmethod
     def get_profile_completion_percentage(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          weights = {
               "cv": 35,
               "profile": 25,
               "skill": 10,
               "experience": 10,
               "education": 10,
               "certification": 5,
               "language": 5
          }
          
          completion_percentage = 0
          
          # Resume
          if job_seeker.resume_url:
               completion_percentage += weights["cv"]

          profile_sub_score, _ = ProfileScoreService._validate_profile(job_seeker)
          completion_percentage += profile_sub_score

          # Skill
          if ProfileScoreService._validate_skill(job_seeker):
               completion_percentage += weights["skill"]
               
          # Work Experience
          if ProfileScoreService._validate_work_experience(job_seeker):
               completion_percentage += weights["experience"]
          
          # Education
          if ProfileScoreService._validate_education(job_seeker):
               completion_percentage += weights["education"]
          
          # Certification
          if ProfileScoreService._validate_certification(job_seeker):
               completion_percentage += weights["certification"]
          
          # Language
          if ProfileScoreService._validate_language(job_seeker):
               completion_percentage += weights["language"]
          
          return completion_percentage
     
     @staticmethod
     def calculate_job_filter_profile_score(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          weights = {
               "skills": 30,
               "specialization": 35,
               "role": 35
          }
          
          completion_percentage = 0
          
          occupation = ProfileScoreService._get_job_seeker_occupation(job_seeker)
          
          if not occupation:
               return completion_percentage
          
          # Skill
          if ProfileScoreService._validate_skill(job_seeker):
               completion_percentage += weights["skills"]
          
          if ProfileScoreService._validate_specialization(occupation):
               completion_percentage += weights["specialization"]
          
          if ProfileScoreService._validate_role(occupation):
               completion_percentage += weights["role"]
          
          return completion_percentage

     @staticmethod
     def _get_job_seeker_occupation(job_seeker: JobSeeker):
          return getattr(job_seeker, 'occupation', None)
     
     @staticmethod
     def _validate_profile(job_seeker: JobSeeker) -> tuple[int, list[str]]:
          """
          Calculates a profile completeness score (0-25) and returns the score
          AND a list of missing field names.
          """
          if not job_seeker:
               return 0, list(ProfileScoreService.PROFILE_SUB_WEIGHTS.keys())

          score = 0
          missing_fields = []
          weights = ProfileScoreService.PROFILE_SUB_WEIGHTS

          if getattr(job_seeker, 'name', None):
               score += weights['name']
          else:
               missing_fields.append('name')

          if getattr(job_seeker, 'username', None):
               score += weights['username']
          else:
               missing_fields.append('username')

          if getattr(job_seeker, 'phone_number', None) and getattr(job_seeker, 'country_code', None):
               score += weights['contact']
          else:
               missing_fields.append('contact')

          if getattr(job_seeker, 'date_of_birth', None):
               score += weights['date_of_birth']
          else:
               missing_fields.append('date_of_birth')

          if getattr(job_seeker, 'address', None):
               score += weights['address']
          else:
               missing_fields.append('address')

          job_seeker_occupation = ProfileScoreService._get_job_seeker_occupation(job_seeker)

          if job_seeker_occupation:
               score += weights['occupation_exists']

               if getattr(job_seeker_occupation, 'specialization', None):
                    score += weights['specialization']
               else:
                    missing_fields.append('specialization')

               if getattr(job_seeker_occupation, 'role', None):
                    score += weights['role']
               else:
                    missing_fields.append('role')

               if getattr(job_seeker_occupation, 'experience_level', None):
                    score += weights['experience_level']
               else:
                    missing_fields.append('experience_level')
               
               exp_years = getattr(job_seeker_occupation, 'experience_years', None)
               if exp_years is not None:
                    score += weights['experience_years']
               else:
                    missing_fields.append('experience_years')
          else:
               score += 0
               missing_fields.append('occupation_details')
          
          if ProfileScoreService._validate_social_link(job_seeker):
               score += weights['social_link']
          else:
               missing_fields.append('social_link')

          final_score = min(score, weights['TOTAL_POSSIBLE'])

          return final_score, missing_fields
     
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
          return True if hasattr(job_seeker, 'social_links') else False
               
     @staticmethod
     def _validate_specialization(occupation: JobSeekerOccupation):
          return True if occupation.specialization else False
     
     def _validate_role(occupation: JobSeekerOccupation):
          return True if occupation.role else False