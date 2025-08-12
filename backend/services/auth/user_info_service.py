from rest_framework.exceptions import ValidationError
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES
from utils.user.user import check_auto_generated_username

class UserInfoService:
     @staticmethod
     def get_user_obj(user):
          """
          Retrieves user information, including their profile image, role, onboarding step,
          and whether the username is auto-generated.
          """
          if hasattr(user, 'jobseeker'):
               return user.jobseeker
          return user
     
     @staticmethod
     def is_job_seeker(user: TalentCloudUser):
          """
          Check user is job seeker
          """
          return user.role.name == ROLES.USER

     @staticmethod
     def get_user_profile_info(user: TalentCloudUser):
          """
          Returns the user's profile information like profile image URL, role, onboarding step,
          and whether the username is auto-generated.
          """
          try:
               response = {
                    'profile_image_url': user.profile_image_url,
                    'role': user.role.name,
                    'name': user.name,
                    'email': user.email
               }
               
               # Check user is job seeker
               is_job_seeker = UserInfoService.is_job_seeker(user)
               
               if is_job_seeker:
                    # Check if the username is auto-generated
                    is_generated_username = check_auto_generated_username(user.username)
                    
                    response.update({
                         'onboarding_step': user.jobseeker.onboarding_step if user.jobseeker else 0,
                         'is_generated_username': is_generated_username
                    })

               return response
          except Exception as e:
               raise ValidationError(f"Error retrieving user info: {str(e)}")