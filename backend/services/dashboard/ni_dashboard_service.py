from apps.job_seekers.models import JobSeeker
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES
from core.middleware.chunk_optimizer import chunked_queryset
from services.job_seeker.profile_score_service import ProfileScoreService

class DashboardService:
     @staticmethod
     def get_job_seeker_statistics():
          job_seeker_users = JobSeeker.objects.all()
          total_users = JobSeeker.objects.count()
          verified_users = JobSeeker.objects.filter(is_verified=True).count()
          unverified_users = JobSeeker.objects.filter(is_verified=False).count()
          completed_profile_count = 0
          
          for chunked_user_list in chunked_queryset(job_seeker_users, 50):
               for user in chunked_user_list:
                    completion_percentage = ProfileScoreService.get_profile_completion_percentage(user)
                    if completion_percentage >= 80:     
                         completed_profile_count += 1
               

          return {
               'message': 'Succefully generated job seeker count',
               'data': {
                    'total_user_count': total_users,
                    'verified_user_count': verified_users,
                    'unverified_user_count': unverified_users,
                    'completed_profiles_count': completed_profile_count
               }
          }
     
     @staticmethod
     def get_job_seeker_list():
          job_seekers = JobSeeker.objects.all()

          job_seeker_list = []
          for user in job_seekers:
               job_seeker_list.append({
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'username': user.username,
                    'status': 'Inactive' if user.status is False else ('Verified' if user.is_verified is True else 'Unverified'),
                    'registered_data': user.created_at,
               })

          
          return {
               'message': 'Succefully generated job seeker count',
               'data': {
                    'job_seeker_list': job_seeker_list
               }
          }
     
     @staticmethod
     def get_job_seeker_detail(user_id):
          try:
               user = JobSeeker.objects.get(id=user_id)
          except JobSeeker.DoesNotExist:
               return {
                    'message': 'Job seeker not found',
                    'data': None
               }

          profile_completion_score = ProfileScoreService.calculate_profile_completion_percentage(user)

          return {
               'message': 'Successfully fetched job seeker details',
               'data': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name if user.name is not None else None,
                    'username': user.username,
                    'phone_number': f"{user.country_code}{user.phone_number}" if user.country_code is not None and user.phone_number is not None else None,
                    'address': user.address if user.address is not None else None,
                    'profile_image_url': user.profile_image_url,
                    'is_verified': user.is_verified,
                    'status': 'Inactive' if user.status is False else ('Verified' if user.is_verified is True else 'Unverified'),
                    'profile_completion_score': profile_completion_score,
               }
          }

     @staticmethod
     def get_ni_admin_list():
          ni_super_admins = TalentCloudUser.objects.filter(role__name=ROLES.SUPERADMIN)

          ni_super_admins_list = []
          for user in ni_super_admins:
               ni_super_admins_list.append({
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'username': user.username,
                    'status': 'Inactive' if user.status is False else ('Verified' if user.is_verified is True else 'Unverified'),
                    'registered_data': user.created_at,
               })

          
          return {
               'message': 'Succefully retrieved NI super admin listing.',
               'data': {
                    'ni_admin_list': ni_super_admins_list
               }
          }