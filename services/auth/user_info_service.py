from rest_framework.exceptions import ValidationError
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
     def get_user_profile_info(user):
          """
          Returns the user's profile information like profile image URL, role, onboarding step,
          and whether the username is auto-generated.
          """
          try:
               # Get the user info
               user_info = UserInfoService.get_user_obj(user)
               
               # Check if the username is auto-generated
               is_generated_username = check_auto_generated_username(user_info.username)
               
               # Prepare the response data
               return {
                    'profile_image_url': user_info.profile_image_url,
                    'role': user_info.role.name,
                    'onboarding_step': user_info.onboarding_step,
                    'is_generated_username': is_generated_username
               }
          except Exception as e:
               raise ValidationError(f"Error retrieving user info: {str(e)}")