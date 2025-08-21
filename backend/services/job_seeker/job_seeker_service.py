import json
from django.db import transaction
from django.core import exceptions as django_exceptions
from rest_framework.exceptions import ValidationError
from apps.job_seekers.models import JobSeeker, JobSeekerExperienceLevel, JobSeekerLanguageProficiency, JobSeekerOccupation, JobSeekerRole, JobSeekerSkill, JobSeekerSocialLink, SpokenLanguage
from apps.job_seekers.serializers.occupation_serializer import JobSeekerExperienceLevelSerializer, JobSeekerRoleSerializer
from apps.users.models import Address, TalentCloudUser
from services.storage.s3_service import S3Service

# Constants
class OnboardingConstants:
    MINIMUM_SKILLS_REQUIRED = 5
    VALID_STEPS = [1, 2, 3, 4]
    DEFAULT_PROFILE_IMAGE = "https://images.unsplash.com/5/unsplash-kitsune-4.jpg"

class JobSeekerService:
     @staticmethod
     def get_job_seeker_user(user):
          """
          Retrieves the job seeker user from the user object.
          This method checks if the request has a user attribute and if that user has a jobseeker attribute.
          """
          if hasattr(user, 'jobseeker'):
               return user.jobseeker
          return None
     
     @staticmethod
     def get_job_seeker_resume_url(user):
          """
          Retrieves the job seeker resume url and uploaded time.
          """
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)

          return {
               'message': "Successfully fetched job seeker resume.",
               'data': {
                    'resume_url': S3Service.get_public_url(job_seeker.resume_url),
                    'resume_uploaded_time': job_seeker.resume_upload_time,
               }
          }
     
     @staticmethod
     def modify_jobseeker_username(user, username):
          """
          Modifies the jobseeker's username to be auto-generated.
          This method checks if the user has a jobseeker attribute and modifies the username accordingly.
          """
          if not username:
               raise ValidationError("Username cannot be empty.")

          try:
               # Check if the user is a job seeker
               job_seeker = JobSeekerService.get_job_seeker_user(user)
               
               if job_seeker:
                    if JobSeeker.objects.filter(username=username).exists():
                         raise ValidationError("Username already exists.")
                    
                    job_seeker.username = username
                    job_seeker.save()
                    
                    return job_seeker
          except JobSeeker.DoesNotExist:
               raise ValidationError("Job seeker user does not exist.")
     
     @staticmethod
     def get_onboarding_data(user, step):
          JobSeekerService._validate_step_number(step)
          
          job_seeker = JobSeekerService._validate_job_seeker(user)
          
          occupation = JobSeekerService._get_or_create_occupation(job_seeker)
          
          if step == 1:
               return JobSeekerService._get_step_1_data(job_seeker, occupation)
          elif step == 2:
               return JobSeekerService._get_step_2_data(occupation)
          elif step == 3:
               return JobSeekerService._get_step_3_data(occupation)
          elif step == 4:
               return JobSeekerService._get_step_4_data(occupation)
     
     @staticmethod
     def _get_step_1_data(job_seeker: JobSeeker, occupation: JobSeekerOccupation):
          """Get step 1 onboarding data (profile basics)"""
          profile_url = S3Service.get_public_url(job_seeker.profile_image_url) if job_seeker.profile_image_url else None
          
          return {
               'message': "Step 1 data retrieved successfully.",
               'data': {
                    'profile_image_url': profile_url,
                    'name': job_seeker.name,
                    'tagline': job_seeker.tagline,
                    'experience_level_id': occupation.experience_level_id if occupation else None,
                    'experience_years': occupation.experience_years if occupation else None,
               }
          }
     
     @staticmethod
     def _get_step_2_data(occupation: JobSeekerOccupation):
          """Get step 2 onboarding data (specialization)"""
          has_specialization = occupation and occupation.specialization
          return {
               'message': "Step 2 data retrieved successfully." if has_specialization else "No data existed yet.",
               'data': {
                    'specialization_id': occupation.specialization.id
               } if has_specialization else None
          }
     
     @staticmethod
     def _get_step_3_data(occupation: JobSeekerOccupation):
          """Get step 3 onboarding data (role)"""
          has_role = occupation and occupation.role
          return {
               'message': "Step 3 data retrieved successfully." if has_role else "No data existed yet.",
               'data': {
                    'role_id': occupation.role.id
               } if has_role else None
          }
     
     @staticmethod
     def _get_step_4_data(occupation: JobSeekerOccupation):
          """Get step 4 onboarding data (skills)"""
          skills = occupation.skills.all() if occupation else []
          return {
               'message': "Step 4 data retrieved successfully." if skills else "No data existed yet.",
               'data': {
                    'skills': [{'id': skill.id, 'title': skill.title} for skill in skills]
               } if skills else None
          }

     @staticmethod
     def perform_onboarding(user, step, data):
          """
          Perform onboarding steps for job seekers with validation
          """
          if step == 0:
               # If step is 0, get current step from job seeker
               job_seeker = JobSeekerService._validate_job_seeker(user)
               step = job_seeker.onboarding_step
               
          # Validate step number
          JobSeekerService._validate_step_number(step)
          
          # Get validated job seeker and occupation
          job_seeker = JobSeekerService._validate_job_seeker(user)
          occupation = JobSeekerService._get_or_create_occupation(job_seeker)
          
          # Validate input data for the current step
          JobSeekerService._validate_onboarding_data(step, data, occupation)
          
          # Execute the appropriate step
          if step == 1:
               return JobSeekerService._perform_step_1(job_seeker, occupation, data)
          elif step == 2:
               return JobSeekerService._perform_step_2(job_seeker, occupation, data)
          elif step == 3:
               return JobSeekerService._perform_step_3(job_seeker, occupation, data)
          elif step == 4:
               return JobSeekerService._perform_step_4(job_seeker, occupation, data)
     
     @staticmethod
     def _perform_step_1(job_seeker: JobSeeker, occupation: JobSeekerOccupation, data: dict):
          """Perform onboarding step 1: Basic profile information"""
          name = data.get('name', None)
          tagline = data.get('tagline', None)
          experience_level_id = data.get('experience_level_id', None)
          experience_years = data.get('experience_years', None)
          
          with transaction.atomic():
               # Update job seeker profile
               job_seeker.name = name
               job_seeker.tagline = tagline
               job_seeker.onboarding_step = 2
               
               # Update occupation
               occupation.experience_level_id = experience_level_id
               occupation.experience_years = experience_years
               
               # Save with error handling
               JobSeekerService._safe_model_save(job_seeker, "Job seeker profile")
               JobSeekerService._safe_model_save(occupation, "Occupation")
               
          return {'message': "Step 1 completed successfully."}
     
     @staticmethod
     def _perform_step_2(job_seeker: JobSeeker, occupation: JobSeekerOccupation, data: dict):
          """Perform onboarding step 2: Specialization selection"""
          specialization_id = data.get('specialization_id', None)
          
          with transaction.atomic():
               # Clear role if specialization changes
               if occupation.specialization_id != specialization_id:
                    occupation.role = None
                    
               occupation.specialization_id = specialization_id
               job_seeker.onboarding_step = 3
               
               # Save with error handling
               JobSeekerService._safe_model_save(occupation, "Occupation specialization")
               JobSeekerService._safe_model_save(job_seeker, "Job seeker progress")
               
          return {'message': "Step 2 completed successfully."}
     
     @staticmethod
     def _perform_step_3(job_seeker: JobSeeker, occupation: JobSeekerOccupation, data: dict):
          """Perform onboarding step 3: Role selection"""
          role_id = data.get('role_id', None)
          
          with transaction.atomic():
               # Validate role belongs to current specialization
               JobSeekerService._validate_role_specialization_match(role_id, occupation.specialization_id)
               
               occupation.role_id = role_id
               job_seeker.onboarding_step = 4
               
               # Save with error handling
               JobSeekerService._safe_model_save(occupation, "Occupation role")
               JobSeekerService._safe_model_save(job_seeker, "Job seeker progress")
               
          return {'message': "Step 3 completed successfully."}
     
     @staticmethod
     def _perform_step_4(job_seeker: JobSeeker, occupation: JobSeekerOccupation, data: dict):
          """Perform onboarding step 4: Skills selection"""
          skill_id_list = json.loads(data.get('skill_id_list', '[]')) if isinstance(data.get('skill_id_list'), str) else data.get('skill_id_list', [])
          
          with transaction.atomic():
               # Clear existing skills and add new ones
               occupation.skills.clear()
               if skill_id_list:
                    occupation.skills.add(*skill_id_list)
               
               job_seeker.onboarding_step = 5  # Onboarding complete
               
               # Save with error handling
               JobSeekerService._safe_model_save(occupation, "Occupation skills")
               JobSeekerService._safe_model_save(job_seeker, "Job seeker progress")
               
          return {
               'message': "Onboarding completed successfully.",
               'data': {
                    'skills_added': len(skill_id_list),
                    'onboarding_complete': True
               }
          }

     @staticmethod
     def get_job_seeker_profile_section_options():
          role_list = JobSeekerRole.objects.all()
          experience_level_list = JobSeekerExperienceLevel.objects.all()
          
          return {
               'message': "Successfully fetched job seeker profile selection options.",
               'data': {
                    'role_list': JobSeekerRoleSerializer(role_list, many=True).data,
                    'experience_level_list': JobSeekerExperienceLevelSerializer(experience_level_list, many=True).data,
               }
          }
     
     @staticmethod
     def get_job_seeker_profile_info(user: TalentCloudUser):
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)
          
          occupation: JobSeekerOccupation = getattr(job_seeker, 'occupation', None)

          try:
               social_links = job_seeker.social_links
          except JobSeekerSocialLink.DoesNotExist:
               social_links = None
          
          profile_response = JobSeekerService.build_job_seeker_profile_response(job_seeker, occupation, social_links)
               
          return {
               'message': "Profile information is generated.",
               'data': profile_response
          }
     
     @staticmethod
     def perform_job_seeker_profile_info_update(user, data):
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)

          with transaction.atomic():
               # Extract and update JobSeeker profile fields
               job_seeker.name = data.get("name", job_seeker.name)
               job_seeker.username = data.get("username", job_seeker.username)
               # job_seeker.email = data.get("email", job_seeker.email)
               job_seeker.is_open_to_work = data.get("is_open_to_work", job_seeker.is_open_to_work)
               job_seeker.expected_salary = data.get("expected_salary", job_seeker.expected_salary)
               job_seeker.country_code = data.get("country_code", job_seeker.country_code)
               job_seeker.phone_number = data.get("phone_number", job_seeker.phone_number)
               job_seeker.date_of_birth = data.get("date_of_birth", job_seeker.date_of_birth)
               job_seeker.tagline = data.get("tagline", None)
               job_seeker.bio = data.get("bio", None)

               # Address Create, Update
               address_data = data.get("address", None)
               
               if address_data:
                    country_id = address_data.get("country_id", None)
                    city_id = address_data.get("city_id", None)
                    address_field = address_data.get("address", None)
                    
                    address = job_seeker.address
                    
                    if not address:
                         address = Address.objects.create(
                              country_id=country_id,
                              city_id=city_id,
                              address=address_field
                         )
                         job_seeker.address = address
                    else:
                         address.country_id = country_id
                         address.city_id = city_id
                         address.address = address_field
                         address.save()
               
               job_seeker.save()

               # Occupation Create, Update
               specialization_id = data.get("specialization_id", None)
               role_id = data.get("role_id", None)
               experience_level_id = data.get("experience_level_id", None)
               experience_years = data.get("experience_years", None)
               
               occupation = getattr(job_seeker, 'occupation', None)
               
               if not occupation:
                    occupation = JobSeekerOccupation.objects.create(
                         user = job_seeker
                    )
               
               # Handle specialization and role updates
               if specialization_id or role_id:
                    # If updating specialization, clear role if it doesn't match the new specialization
                    if specialization_id:
                         occupation.specialization_id = specialization_id
                         # If role is provided, validate it belongs to the new specialization
                         if role_id:
                              try:
                                   from apps.job_seekers.models import JobSeekerRole
                                   role = JobSeekerRole.objects.get(id=role_id)
                                   if role.specialization_id != specialization_id:
                                        raise ValidationError(f"Selected role does not belong to the selected specialization.")
                                   occupation.role_id = role_id
                              except JobSeekerRole.DoesNotExist:
                                   raise ValidationError("Invalid role selected.")
                         else:
                              # Clear role if only specialization is updated
                              occupation.role = None
                    
                    # If only role is updated (no specialization change)
                    elif role_id and not specialization_id:
                         try:
                              from apps.job_seekers.models import JobSeekerRole
                              role = JobSeekerRole.objects.get(id=role_id)
                              # Ensure the current specialization matches the role's specialization
                              if occupation.specialization and role.specialization != occupation.specialization:
                                   raise ValidationError("Selected role does not belong to specialization. Please update specialization first.")
                              occupation.role_id = role_id
                              # If no current specialization, set it from the role
                              if not occupation.specialization:
                                   occupation.specialization = role.specialization
                         except JobSeekerRole.DoesNotExist:
                              raise ValidationError("Invalid role selected.")
               
               if experience_level_id:
                    occupation.experience_level_id = experience_level_id

               if experience_years:
                    occupation.experience_years = experience_years

               occupation.save()
               
               # Social Link Create, Update
               try:
                    social_links = job_seeker.social_links
               except JobSeekerSocialLink.DoesNotExist:
                    social_links = None
               
               if not social_links:
                    social_links = JobSeekerSocialLink.objects.create(
                         user = job_seeker
                    )
               
               social_links.facebook_social_url = data.get("facebook_url", None)
               social_links.linkedin_social_url = data.get("linkedin_url", None)
               social_links.github_social_url = data.get("github_url", None)
               social_links.behance_social_url = data.get("behance_url", None)
               social_links.portfolio_social_url = data.get("portfolio_url", None)

               social_links.save()
               
          # Prepare response data
          response = JobSeekerService.build_job_seeker_profile_response(job_seeker, occupation, social_links)

          return {
               'message': "Profile updated successfully.",
               'data': response
          }
     
     @staticmethod
     def build_job_seeker_profile_response(
          job_seeker: JobSeeker, 
          occupation: JobSeekerOccupation = None,
          social_links: JobSeekerSocialLink = None
     ):
          profile_url = S3Service.get_public_url(job_seeker.profile_image_url) if job_seeker.profile_image_url else None
          resume_url = S3Service.get_public_url(job_seeker.resume_url) if job_seeker.resume_url else None
          
          return {
               'profile_image_url': profile_url,
               'name': job_seeker.name,
               'username': job_seeker.username,
               'email': job_seeker.email,
               'specialization': {
                    'id': occupation.specialization.id,
                    'name': occupation.specialization.name,
               } if occupation and occupation.specialization else None,
               'role': {
                    'id': occupation.role.id,
                    'name': occupation.role.name,
               } if occupation and occupation.role else None,
               'experience_level': {
                    'id': occupation.experience_level.id,
                    'level': occupation.experience_level.level,
               } if occupation and occupation.experience_level else None,
               'experience_years': occupation.experience_years if occupation else None,
               'is_open_to_work': job_seeker.is_open_to_work,
               'expected_salary': job_seeker.expected_salary,
               'country_code': job_seeker.country_code,
               'phone_number': job_seeker.phone_number,
               'date_of_birth': job_seeker.date_of_birth,
               'tagline': job_seeker.tagline,
               'bio': job_seeker.bio,
               'resume_url': resume_url,
               'resume_uploaded_time': job_seeker.resume_upload_time,
               # Address
               'address': JobSeekerService._get_extracted_address(job_seeker),
               
               # Social Links
               'facebook_url': social_links.facebook_social_url if social_links else None,
               'linkedin_url': social_links.linkedin_social_url if social_links else None,
               'behance_url': social_links.behance_social_url if social_links else None,
               'portfolio_url': social_links.portfolio_social_url if social_links else None,
               'github_url': social_links.github_social_url if social_links else None,
          }

      
     @staticmethod
     def get_job_seeker_video_url(user: TalentCloudUser):
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)
               
          return {
               'message': "Profile information is generated.",
               'data': {
                    "video_url": job_seeker.video_url
               }
          }
     
     @staticmethod
     def update_job_seeker_video_url(user: TalentCloudUser, data):
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)
          
          video_url = data.get("video_url", None)
          
          job_seeker.video_url=video_url
          
          job_seeker.save()
          
          return {
               'message': "Video url is updated.",
               'data': {
                    "video_url": job_seeker.video_url
               }
          }

     @staticmethod
     def get_job_seeker_skills(user):
          """Get job seeker skills with proper error handling"""
          jobseeker = JobSeekerService._validate_job_seeker(user)
          jobseeker_occupation = getattr(jobseeker, 'occupation', None)

          if not jobseeker_occupation:
               return {
                    'message': "No occupation data exists yet.",
                    'data': []
               }

          jobseeker_skills = (
               list(jobseeker_occupation.skills.values("id", "title"))
               if jobseeker_occupation.skills.exists() 
               else []
          )

          return {
               'message': "Successfully fetched job seeker skills.",
               'data': jobseeker_skills 
          }
     
     @staticmethod
     def perform_job_seeker_skills_update(user, data):
          """Update job seeker skills with enhanced validation and error handling"""
          jobseeker = JobSeekerService._validate_job_seeker(user)
          jobseeker_occupation = JobSeekerService._get_or_create_occupation(jobseeker)

          with transaction.atomic():
               # Handle skills - can be either IDs or new skill names
               skill_data = data.get("skill_list", [])
               skill_ids = []
               created_skills = []

               for skill_item in skill_data:
                    if isinstance(skill_item, dict):
                         # If it's a dict, check for 'id' or 'title'
                         if 'id' in skill_item and skill_item['id']:
                              # Existing skill by ID
                              try:
                                   skill = JobSeekerSkill.objects.get(id=skill_item['id'])
                                   skill_ids.append(skill.id)
                              except JobSeekerSkill.DoesNotExist:
                                   raise ValidationError(f"Skill with ID {skill_item['id']} does not exist")
                         elif 'title' in skill_item and skill_item['title']:
                              # New skill by title
                              skill_title = skill_item['title'].strip()
                              if skill_title:
                                   # Check if skill already exists (case-insensitive)
                                   existing_skill = JobSeekerSkill.objects.filter(
                                        title__iexact=skill_title
                                   ).first()
                                   
                                   if existing_skill:
                                        skill_ids.append(existing_skill.id)
                                   else:
                                        # Create new skill
                                        new_skill = JobSeekerSkill.objects.create(title=skill_title)
                                        skill_ids.append(new_skill.id)
                                        created_skills.append({
                                             'id': new_skill.id,
                                             'title': new_skill.title
                                        })
                         else:
                              raise ValidationError("Each skill must have either 'id' or 'title'")
                    elif isinstance(skill_item, (int, str)):
                         # If it's a simple ID (backward compatibility)
                         try:
                              skill_id = int(skill_item)
                              skill = JobSeekerSkill.objects.get(id=skill_id)
                              skill_ids.append(skill.id)
                         except (ValueError, JobSeekerSkill.DoesNotExist):
                              # If it's not a valid ID, treat it as a title
                              skill_title = str(skill_item).strip()
                              if skill_title:
                                   existing_skill = JobSeekerSkill.objects.filter(
                                        title__iexact=skill_title
                                   ).first()
                                   
                                   if existing_skill:
                                        skill_ids.append(existing_skill.id)
                                   else:
                                        new_skill = JobSeekerSkill.objects.create(title=skill_title)
                                        skill_ids.append(new_skill.id)
                                        created_skills.append({
                                             'id': new_skill.id,
                                             'title': new_skill.title
                                        })
                    else:
                         raise ValidationError("Invalid skill data format")

               # Clear existing skills and set new ones
               jobseeker_occupation.skills.clear()
               if skill_ids:
                    jobseeker_occupation.skills.add(*skill_ids)

               # Save with error handling
               JobSeekerService._safe_model_save(jobseeker_occupation, "Job seeker skills")

          return {
               'message': "Successfully updated job seeker skills.",
               'data': {
                    'skill_ids': skill_ids,
                    'created_skills': created_skills,
                    'total_skills': len(skill_ids)
               }
          }
     
     @staticmethod
     def get_job_seeker_langauges(user):
          jobseeker_user = JobSeekerService.get_job_seeker_user(user)
               
          languages = (
               [
                    {
                         'proficiency': lang['proficiency_level'],
                         'language_id': lang['language__id'],
                         'language_name': lang['language__name']
                    }
                    for lang in
                    jobseeker_user.language_proficiencies.values("proficiency_level", "language__id", "language__name")
               ]
               if jobseeker_user.language_proficiencies.exists() 
               else []
          )
     
          return {
               'message': "Successfully generated user occupation",
               'data': languages
          }
     
     @staticmethod
     def perform_job_seeker_languages_update(user, data):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          if not job_seeker:
               raise ValidationError("No job seeker with this data")
          
          language_list = data.get("language_list", [])  # [{'language_id': 1, 'proficiency': 'intermediate'}, ...]
          
          if not isinstance(language_list, list) or not language_list:
               return {
                    'message': "Failed to update language proficiency.",
                    'data': None
               }
          
          with transaction.atomic():
               for lang in language_list:
                    JobSeekerService._update_single_language(
                         job_seeker,
                         lang.get("language_id", None),
                         lang.get("proficiency", "None")
                    )
          
          return {
               'message': "Successfully updated job seeker language proficiency.",
               'data': None
          }
     
     @staticmethod
     def get_job_seeker_social_link(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          try:
               social_links = job_seeker.social_links
          except JobSeekerSocialLink.DoesNotExist:
               social_links = None

          profile_data = {
               'facebook_url': social_links.facebook_social_url if social_links else None,
               'linkedin_url': social_links.linkedin_social_url if social_links else None,
               'behance_url': social_links.behance_social_url if social_links else None,
               'portfolio_url': social_links.portfolio_social_url if social_links else None,
               'github_url': social_links.github_social_url if social_links else None,
          }
               
          return {
               'message': "Social Link information is generated.",
               'data': profile_data
          }
     
     @staticmethod
     def perform_job_seeker_social_link_update(user, data):
          job_seeker = JobSeekerService.get_job_seeker_user(user)

          with transaction.atomic():
               # Extract and update JobSeeker social links
               try:
                    social_links = job_seeker.social_links
               except JobSeekerSocialLink.DoesNotExist:
                    social_links = None

               # Extract and update/create social links
               social_data = {
                    "facebook_social_url": data.get("facebook_url", social_links.facebook_social_url if social_links else None),
                    "linkedin_social_url": data.get("linkedin_url", social_links.linkedin_social_url if social_links else None),
                    "behance_social_url": data.get("behance_url", social_links.behance_social_url if social_links else None),
                    "portfolio_social_url": data.get("portfolio_url", social_links.portfolio_social_url if social_links else None),
                    "github_social_url": data.get("github_url", social_links.github_social_url if social_links else None),
               }

               social_link, created = JobSeekerSocialLink.objects.update_or_create(
                    user=job_seeker, defaults=social_data
               )

          # Prepare response data
          social_link_data = {
               'facebook_url': social_link.facebook_social_url,
               'linkedin_url': social_link.linkedin_social_url,
               'behance_url': social_link.behance_social_url,
               'portfolio_url': social_link.portfolio_social_url,
               'github_url': social_link.github_social_url,
          }

          return {
               'message': "Social links updated successfully.",
               'data': social_link_data
          }
     
     @staticmethod
     def get_job_seeker_setting_info(user):
          job_seeker = JobSeekerService.get_job_seeker_user(user)

          return {
               'message': "Setting information is successfully retrieved.",
               'data': {
                    'email': job_seeker.email
               }
          }
          
     @staticmethod
     def _get_extracted_address(job_seeker: JobSeeker):
          address: Address = job_seeker.address
          
          if not address:
               return None
          
          return {
               'city': {
                    'id': address.city.id,
                    'name': address.city.name,
               } if address.city else None,
               'country': {
                    'id': address.country.id,
                    'name': address.country.name,
               } if address.country else None,
               'address': address.address
          }
          
     @staticmethod
     def _update_single_language(job_seeker, language_id, proficiency_level):
          if not language_id:
               return None
          
          try:
               proficiency = JobSeekerLanguageProficiency.objects.get(user=job_seeker, language_id = language_id)
          
               proficiency.proficiency_level = proficiency_level
               proficiency.save()
          except JobSeekerLanguageProficiency.DoesNotExist:
               # Create new if doesn't exist
               JobSeekerLanguageProficiency.objects.create(
                    user=job_seeker,
                    language_id=language_id,
                    proficiency_level=proficiency_level
               )
     @staticmethod
     def _get_or_create_occupation(job_seeker: JobSeeker) -> JobSeekerOccupation:
          """Get existing occupation or create a new one for the job seeker"""
          occupation = getattr(job_seeker, 'occupation', None)
          
          if not occupation:
               occupation = JobSeekerOccupation.objects.create(user=job_seeker)
          
          return occupation
     
     @staticmethod
     def _validate_job_seeker(user) -> JobSeeker:
          """Validate and return job seeker, raise error if not found"""
          job_seeker = JobSeekerService.get_job_seeker_user(user)
          
          if not job_seeker:
               raise ValidationError("User is not a job seeker")
          
          return job_seeker
     
     @staticmethod
     def _validate_step_number(step: int):
          """Validate onboarding step number"""
          if step not in OnboardingConstants.VALID_STEPS:
               raise ValidationError("Invalid step number.")
     
     @staticmethod
     def _validate_role_specialization_match(role_id: int, specialization_id: int):
          """Validate that role belongs to the given specialization"""
          if not specialization_id:
               raise ValidationError("Please select a specialization first before choosing a role.")
               
          try:
               from apps.job_seekers.models import JobSeekerRole
               role = JobSeekerRole.objects.get(id=role_id)
               if role.specialization_id != specialization_id:
                    raise ValidationError("Selected role does not belong to the current specialization.")
          except JobSeekerRole.DoesNotExist:
               raise ValidationError("Invalid role selected.")
     
     @staticmethod
     def _safe_model_save(model_instance, error_context: str = ""):
          """
          Safely save a model instance, converting Django ValidationError to DRF ValidationError if exists
          """
          try:
               model_instance.save()
          except django_exceptions.ValidationError as e:
               # Convert Django model validation error to DRF validation error
               error_message = str(e.messages[0]) if hasattr(e, 'messages') and e.messages else str(e)
               if error_context:
                    error_message = f"{error_context}: {error_message}"
               raise ValidationError(error_message)
     
     @staticmethod
     def _validate_onboarding_data(step: int, data: dict, occupation: JobSeekerOccupation = None):
          """
          Validate onboarding data based on step
          """
          if step == 1:
               required_fields = ['name', 'experience_level_id', 'experience_years']
               
               for field in required_fields:
                    if not data.get(field):
                         raise ValidationError(f"{field.replace('_', ' ').title()} is required.")
          
          elif step == 2:
               if not data.get('specialization_id'):
                    raise ValidationError("Specialization can't be empty.")
          
          elif step == 3:
               if not data.get('role_id'):
                    raise ValidationError("Role can't be empty.")
               
               if not occupation or not occupation.specialization_id:
                    raise ValidationError("Please complete specialization selection first.")
          
          elif step == 4:
               skill_list = json.loads(data.get('skill_id_list', '[]')) if isinstance(data.get('skill_id_list'), str) else data.get('skill_id_list', [])
               
               if len(skill_list) < OnboardingConstants.MINIMUM_SKILLS_REQUIRED:
                    raise ValidationError(f"Choose minimum {OnboardingConstants.MINIMUM_SKILLS_REQUIRED} skillsets.")