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

     @staticmethod
     def get_phone_number(country_code=None, phone_number=None):
          if country_code is not None and phone_number is not None:
               return f"{country_code}{phone_number}"
          
          if phone_number:
               return phone_number
          
          return None