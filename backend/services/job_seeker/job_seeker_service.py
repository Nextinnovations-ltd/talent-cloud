import json
from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.job_seekers.models import JobSeeker, JobSeekerExperienceLevel, JobSeekerLanguageProficiency, JobSeekerOccupation, JobSeekerRole, JobSeekerSkill, JobSeekerSocialLink, SpokenLanguage
from apps.job_seekers.serializers.occupation_serializer import JobSeekerExperienceLevelSerializer, JobSeekerRoleSerializer, JobSeekerSkillSerializer, SpokenLanguageSerializer
from apps.users.models import Address, TalentCloudUser

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
          job_seeker = JobSeekerService.get_job_seeker_user(user)

          job_seeker_occupation = getattr(job_seeker, 'occupation', None)
          
          if step == 1:
               return {
                    'message': "Step 1 data retrieved successfully.",
                    'data': {
                         'profile_image_url': job_seeker.profile_image_url,
                         'name': job_seeker.name,
                         'tagline': job_seeker.tagline,
                         'experience_level_id': job_seeker_occupation.experience_level_id if job_seeker_occupation else None,
                         'experience_years': job_seeker_occupation.experience_years if job_seeker_occupation else None,
                    }
               }
          elif step == 2:
               return {
                    'message': "Step 2 data retrieved successfully." if job_seeker_occupation else "No data existed yet.",
                    'data': {
                         'specialization_id': job_seeker_occupation.specialization.id
                    } if job_seeker_occupation else None
               }
          elif step == 3:
               return {
                    'message': "Step 3 data retrieved successfully." if job_seeker_occupation else "No data existed yet.",
                    'data': {
                         'role_id': job_seeker_occupation.role.id
                    } if job_seeker_occupation else None
               }
          elif step == 4:
               skills = job_seeker_occupation.skills.all() if job_seeker_occupation else []
               return {
                    'message': "Step 4 data generated." if skills else "No data existed yet.",
                    'data': {
                         'skills': [skill.id for skill in skills]
                    }  if job_seeker_occupation else None
               }
          else:
               raise ValidationError("Invalid step number.")

     @staticmethod
     def perform_onboarding(user, step, data):
          if step == 0:
               step = job_seeker.onboarding_step
               
          job_seeker: JobSeeker = JobSeekerService.get_job_seeker_user(user)
          
          job_seeker_occupation: JobSeekerOccupation = getattr(job_seeker, 'occupation', None)
          
          if step == 1:
               name = data.get('name', None)
               tagline = data.get('tagline', None)
               experience_level_id = data.get('experience_level_id', None)
               experience_years = data.get('experience_years', None)
               address_data = data.get('address', None)
               # profile_image = request.FILES.get('profile_image', None)

               # Perform Image Upload
               profile_image_url = "https://images.unsplash.com/5/unsplash-kitsune-4.jpg"
               
               with transaction.atomic():
                    job_seeker.profile_image_url = profile_image_url
                    job_seeker.name = name
                    job_seeker.tagline = tagline
                    
                    if job_seeker_occupation:
                         job_seeker_occupation.experience_level_id = experience_level_id
                         job_seeker_occupation.experience_years = experience_years
                         job_seeker_occupation.save()
                    else:
                         JobSeekerOccupation.objects.create(
                              user = job_seeker,
                              experience_level_id = experience_level_id,
                              experience_years = experience_years
                         )
                    
                    if address_data:
                         address: Address = getattr(job_seeker, 'address', None)
                         
                         if address:
                              address.address = address_data.get('address', None)
                              address.city_id = address_data.get('city',None)
                              address.country_id = address_data.get('country', None)

                              address.save()
                         else:
                              address = Address.objects.create(
                                   address= address_data.get('address', None),
                                   city_id = address_data.get('city',None),
                                   country_id = address_data.get('country', None)
                              )
                         
                         job_seeker.address = address
                       
                    job_seeker.onboarding_step = 2
                    
                    job_seeker.save()
               
                    return {
                         'message': "Step 1 succeed."
                    }
          elif step == 2:
               specialization_id = data.get('specialization_id', None)
               
               if not specialization_id:
                    raise ValidationError("Specialization can't be empty.")

               with transaction.atomic():
                    # Check user already have occupation
                    if job_seeker_occupation:
                         job_seeker_occupation.specialization_id = specialization_id
                         job_seeker_occupation.save()
                    else:
                         JobSeekerOccupation.objects.create(
                              user = job_seeker,
                              specialization_id = specialization_id
                         )
                    
                    job_seeker.onboarding_step = 3
                    
                    job_seeker.save()
               
                    return {
                         'message': "Step 2 succeed."
                    }
          elif step == 3:
               role_id = data.get('role_id', None)
               
               if not role_id:
                    raise ValidationError("Role can't be empty.")
               
               with transaction.atomic():
                    if job_seeker_occupation:
                         job_seeker_occupation.role_id = role_id
                         job_seeker_occupation.save()
                    else:
                         JobSeekerOccupation.objects.create(
                              user = job_seeker,
                              role_id = role_id
                         )

                    job_seeker.onboarding_step = 4
                    
                    job_seeker.save()
                    
                    return {
                         'message': "Step 3 succeed."
                    }
          elif step == 4:
               # Convert to list from formdata string
               skill_id_list = json.loads(data.get('skill_id_list', []))
               
               if len(skill_id_list) < 5:
                    raise ValidationError("Choose minimum 5 skillsets.")
               
               with transaction.atomic():                    
                    if not job_seeker_occupation:
                         job_seeker_occupation = JobSeekerOccupation.objects.create(
                              user = job_seeker
                         )
                    
                    job_seeker_occupation.skills.add(*skill_id_list)
                    job_seeker_occupation.save()
                         
                    job_seeker.onboarding_step = 5
                    
                    job_seeker.save()
                    
                    return {
                         'message': "Step 4 succeed."
                    }
          else:
               raise ValidationError("Invalid step number.")

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

          # if not occupation:
          #      raise ValidationError("No occupation related data existed yet.")
          
          social_links = getattr(job_seeker, 'social_links', None)

          if social_links:
               social_links = social_links.first()
          
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
               job_seeker.resume_url = data.get("resume_url", None)

                # Address Create, Update
               address_data = data.get("address", None)
               
               if address_data:
                    country_id = address_data.get("country_id", None)
                    city_id = address_data.get("city_id", None)
                    address_field = address_data.get("address", None)
                    
                    address = getattr(job_seeker, 'address', None)
                    
                    if not address:
                         address = Address.objects.create(
                              country_id=country_id
                         )
                    
                    address.city_id = city_id
                    address.address = address_field
                    
                    address.save()
                    
                    job_seeker.address = address
               
               job_seeker.save()

               # Occupation Create, Update
               role_id = data.get("role_id", None)
               experience_level_id = data.get("experience_level_id", None)
               experience_years = data.get("experience_years", None)
               
               occupation = getattr(job_seeker, 'occupation', None)
               
               if not occupation:
                    occupation = JobSeekerOccupation.objects.create(
                         user = job_seeker
                    )
               
               if role_id:
                    occupation.role_id = role_id
               
               if experience_level_id:
                    occupation.experience_level_id = experience_level_id

               if experience_years:
                    occupation.experience_years = experience_years

               occupation.save()
               
               # Social Link Create, Update
               social_links = job_seeker.social_links.first()
               
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
          return {
               'profile_image_url': job_seeker.profile_image_url,
               'name': job_seeker.name,
               'username': job_seeker.username,
               'email': job_seeker.email,
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
               'resume_url': job_seeker.resume_url,
               
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
     def get_skill_options():
          skills = JobSeekerSkill.objects.all()

          return {
               'message': "Successfully fetched job seeker skills options.",
               'data': {
                    'skills': JobSeekerSkillSerializer(skills, many=True).data
               }
          }
     
     @staticmethod
     def get_job_seeker_skills(user):
          jobseeker = JobSeekerService.get_job_seeker_user(user)

          jobseeker_occupation = getattr(jobseeker, 'occupation', None)

          if not jobseeker_occupation:
               return {
                    'message': "No occupation data existed yet.",
                    'data': {
                         'skills': []
                    }     
               }

          jobseeker_skills = (
               list(jobseeker_occupation.skills.values("id", "title"))
               if jobseeker_occupation.skills.exists() 
               else []
          )

          return {
               'message': "Successfully fetched job seeker skills.",
               'data': {
                    'skills': jobseeker_skills
               }     
          }
     
     @staticmethod
     def perform_job_seeker_skills_update(user, data):
          jobseeker = JobSeekerService.get_job_seeker_user(user)

          if not jobseeker:
               raise ValidationError("User is not a job seeker")

          jobseeker_occupation = getattr(jobseeker, 'occupation', None)

          with transaction.atomic():
               # Create or update the JobSeekerOccupation
               if not jobseeker_occupation:
                    jobseeker_occupation = JobSeekerOccupation.objects.create(
                         user=jobseeker
                    )

               # Set ManyToManyField for skills
               skill_id_list = data.get("skill_list", [])
               jobseeker_occupation.skills.add(*skill_id_list)

               jobseeker_occupation.save()

          return {
               'message': "Successfully updated job seeker skills.",
               'data': {
                    'skills': skill_id_list
               }
          }
     
     @staticmethod
     def get_language_options():
          languages = SpokenLanguage.objects.all()

          return {
               'message': "Successfully generated all language options.",
               'data': {
                    'languages': SpokenLanguageSerializer(languages, many=True).data
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
               'data': {
                    'language_list': languages
               }
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
          
          if JobSeekerSocialLink.objects.filter(user = job_seeker).exists():
               social_links = JobSeekerSocialLink.objects.get(user = job_seeker)
          else:
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
               if JobSeekerSocialLink.objects.filter(user = job_seeker).exists():
                    social_links = JobSeekerSocialLink.objects.get(user = job_seeker)
               else:
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
          address = getattr(job_seeker, 'address', None)

          if address:
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
          
          return None
          
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