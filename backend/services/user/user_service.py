from apps.job_seekers.models import JobSeekerSocialLink

class UserService:
     @staticmethod
     def get_address(address):
          """
          Get the City, Country format address for user
          """
          if not address:
               return None
          
          parts = []
          
          if address.city:
               parts.append(address.city.name)
          
          if address.country:
               parts.append(address.country.name)
          
          return ', '.join(parts) if parts else None

          # skills = occupation.skills.all() if occupation else []

     @staticmethod
     def get_phone_number(country_code=None, phone_number=None):
          if country_code is not None and phone_number is not None:
               return f"{country_code}{phone_number}"
          
          if phone_number:
               return phone_number
          
          return None
     
     @staticmethod
     def get_profile_image_url(image_path=None):
          from services.storage.s3_service import S3Service
          
          if not image_path:
               return None
          
          return S3Service.get_public_url(image_path)
     
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
     