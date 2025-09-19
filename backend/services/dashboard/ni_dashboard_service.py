from rest_framework.exceptions import ValidationError
from django.db.models import Exists, OuterRef
from apps.job_seekers.models import JobSeeker
from apps.users.models import TalentCloudUser
from apps.job_posting.models import JobPost
from apps.job_posting.models import StatusChoices
from apps.ni_dashboard.models import FavouriteJobSeeker
from services.storage.s3_service import S3Service
from services.dashboard.shared_dashboard_service import SharedDashboardService
from core.constants.constants import ROLES
from core.middleware.chunk_optimizer import chunked_queryset
from services.job_seeker.profile_score_service import ProfileScoreService
import logging

logger = logging.getLogger('dashboard_service')

class NIDashboardService:  
     @staticmethod
     def get_ni_admin_list():
          """
          Get list of all NI super administrators
          """
          try:
               ni_super_admins = TalentCloudUser.objects.filter(
                    role__name=ROLES.SUPERADMIN
               ).select_related('role').order_by('-created_at')

               if not ni_super_admins.exists():
                    logger.info("No super admin users found")
                    
                    return {
                         'message': 'No super admin users found',
                         'data': {
                              'ni_admin_list': []
                         }
                    }

               # Build admin list
               ni_super_admins_list = []

               for user in ni_super_admins:
                    try:
                         admin_data = {
                              'id': user.id,
                              'email': user.email,
                              'name': user.name,
                              'username': user.username,
                              'status': NIDashboardService._get_user_status(user),
                              'profile_image_url': user.profile_image_url,
                              'registered_date': user.created_at,
                         }
                         
                         ni_super_admins_list.append(admin_data)
                    except Exception as e:
                         logger.warning(f"Error processing admin user {user.id}: {str(e)}")
                         # Continue processing other users
                         continue
               
               logger.info(f"Successfully retrieved {len(ni_super_admins_list)} super admin users")
               
               return {
                    'message': 'Succefully retrieved NI super admin listing.',
                    'data': {
                         'ni_admin_list': ni_super_admins_list
                    }
               }
          except Exception as e:
               logger.error(f"Error in get_ni_admin_list: {str(e)}", exc_info=True)
               raise ValidationError("Failed to retrieve admin list")

     @staticmethod
     def get_ni_admin_profile_information(user):
          pass
     
     @staticmethod
     def get_percent(count, total):
          try:
               return round((count / total * 100), 2) if total > 0 else 0.0
          except (TypeError, ZeroDivisionError):
               logger.warning(f"Invalid percentage calculation: count={count}, total={total}")
               return 0.0
       
     @staticmethod
     def get_job_seeker_statistics(company):
          """
          Get comprehensive job seeker and job post statistics for a company
          """
          try:
               if not company:
                    raise ValidationError("Company is required to generate statistics")
               
               # Job Post Statistics with error handling
               try:
                    jobs = JobPost.objects.filter(posted_by__company = company)
                    
                    job_posts_count = jobs.count()
                    job_post_active_count = jobs.filter(job_post_status=StatusChoices.ACTIVE).count()
                    job_post_draft_count = jobs.filter(job_post_status=StatusChoices.DRAFT).count()
                    job_post_expired_count = jobs.filter(job_post_status=StatusChoices.EXPIRED).count()
               except Exception as e:
                    logger.error(f"Error fetching job post statistics for company {company.id}: {str(e)}")
                    raise ValidationError("Failed to retrieve job post statistics")

               try:
                    job_post_applicants_count = SharedDashboardService.get_company_applicant_count(company)
                    job_post_bookmarks_count = SharedDashboardService.get_company_bookmark_count(company)
                    job_post_views_count = SharedDashboardService.get_company_view_count(company)
               except Exception as e:
                    logger.error(f"Error fetching company metrics for company {company.id}: {str(e)}")
                    raise ValidationError("Failed to retrieve company engagement metrics")
               
               # Global Job Seeker Statistics
               try:
                    total_users = JobSeeker.objects.count()
                    verified_users = JobSeeker.objects.filter(is_verified=True).count()
                    unverified_users = JobSeeker.objects.filter(is_verified=False).count()
                    
                    # Calculate completed profiles with chunking for performance
                    completed_profile_count = NIDashboardService._calculate_completed_profiles()
               except Exception as e:
                    logger.error(f"Error fetching job seeker statistics: {str(e)}")
                    raise ValidationError("Failed to retrieve job seeker statistics")
               
               job_post_active = {
                    'count': job_post_active_count,
                    'percent': NIDashboardService.get_percent(job_post_active_count, job_posts_count)
               }
               job_post_draft = {
                    'count': job_post_draft_count,
                    'percent': NIDashboardService.get_percent(job_post_draft_count, job_posts_count)
               }
               job_post_expired = {
                    'count': job_post_expired_count,
                    'percent': NIDashboardService.get_percent(job_post_expired_count, job_posts_count)
               }
               
               logger.info(f"Successfully generated statistics for company {company.id}")
               
               return {
                    'message': 'Succefully generated job seeker count',
                    'data': {
                         'total_job_posts': job_posts_count,
                         'job_post_active': job_post_active,
                         'job_post_draft': job_post_draft,
                         'job_post_expired': job_post_expired,
                         'job_post_applicants_count': job_post_applicants_count,
                         'job_post_bookmarks_count': job_post_bookmarks_count,
                         'job_post_views_count': job_post_views_count,
                         
                         'total_user_count': total_users,
                         'verified_user_count': verified_users,
                         'unverified_user_count': unverified_users,
                         'completed_profiles_count': completed_profile_count
                    }
               }
          except Exception as e:
               logger.error(f"Unexpected error in get_job_seeker_statistics: {str(e)}", exc_info=True)
               raise ValidationError("Failed to generate job seeker statistics")
     
     
     @staticmethod
     def get_job_seeker_statistics_by_occupation_role():
          """
          Generate statistics about job seeker counts based on top six occupation roles
          """
          from django.db.models import Count
          from apps.job_seekers.models import JobSeekerOccupation
          
          try:
               # Get job seeker counts by occupation role, ordered by count (descending)
               role_statistics = JobSeekerOccupation.objects.select_related('role').filter(
                    role__isnull=False
               ).values(
                    'role__id',
                    'role__name',
                    'role__specialization__name'
               ).annotate(
                    job_seeker_count=Count('user', distinct=True)
               ).order_by('-job_seeker_count')[:6]  # Get top 6 roles

               if not role_statistics:
                    logger.info("No job seeker occupation statistics found")
                    
                    return {
                         'message': 'No job seeker occupation data available',
                         'data': {
                              'total_job_seekers_with_roles': 0,
                              'top_occupation_roles': []
                         }
                    }
               
               total_job_seekers_with_roles = JobSeekerOccupation.objects.filter(
                    role__isnull=False
               ).count()
               
               # Format the data with percentages
               formatted_statistics = []
               
               for role_stat in role_statistics:
                    try:
                         count = role_stat['job_seeker_count']
                         percentage = NIDashboardService.get_percent(count, total_job_seekers_with_roles)
                         
                         formatted_statistics.append({
                              'role_id': role_stat['role__id'],
                              'role_name': role_stat['role__name'],
                              'specialization_name': role_stat['role__specialization__name'],
                              'job_seeker_count': count,
                              'percentage': percentage
                         })
                    except Exception as e:
                         logger.warning(f"Error processing role statistics: {str(e)}")
                         continue

               logger.info(f"Successfully generated occupation role statistics for {len(formatted_statistics)} roles")
               
               return {
                    'message': 'Successfully generated job seeker statistics by top occupation roles',
                    'data': {
                         'total_job_seekers_with_roles': total_job_seekers_with_roles,
                         'top_occupation_roles': formatted_statistics
                    }
               }
          except Exception as e:
               logger.error(f"Error in get_job_seeker_statistics_by_occupation_role: {str(e)}", exc_info=True)
               raise ValidationError("Failed to generate occupation role statistics")
     
     @staticmethod
     def get_registered_job_seeker_list(user):
          company = SharedDashboardService.get_company(user)
          
          favourite_subquery = FavouriteJobSeeker.objects.filter(
               user=OuterRef('pk'),
               company=company
          )
          return JobSeeker.objects.annotate(
               is_favourite=Exists(favourite_subquery)
          ).filter(status=True).select_related(
               'occupation',
               'occupation__role'
          ).only(
               'id', 'name', 'email', 'is_open_to_work',
               'profile_image_path', 'tagline',
               'country_code', 'phone_number',
               'occupation__experience_years', 'occupation__role__name'
          ).order_by('-created_at')

     @staticmethod
     def _calculate_completed_profiles():
          """
          Calculate completed profiles using chunked processing for performance
          """
          try:
               job_seeker_users = JobSeeker.objects.all()
               completed_profile_count = 0
               
               for chunked_user_list in chunked_queryset(job_seeker_users, 50):
                    for user in chunked_user_list:
                         try:
                              completion_percentage = ProfileScoreService.get_profile_completion_percentage(user)
                              if completion_percentage >= 80:
                                   completed_profile_count += 1
                         except Exception as e:
                              logger.warning(f"Error calculating profile completion for user {user.id}: {str(e)}")
                              # Continue processing other users
                              continue
               
               return completed_profile_count
               
          except Exception as e:
               logger.error(f"Error in _calculate_completed_profiles: {str(e)}")
               # Return 0 instead of failing the entire operation
               return 0

     @staticmethod
     def _get_user_status(user):
          """
          Helper method to determine user status consistently
          """
          try:
               if hasattr(user, 'status') and user.status is False:
                    return 'Inactive'
               elif hasattr(user, 'is_verified') and user.is_verified is True:
                    return 'Verified'
               else:
                    return 'Unverified'
          except Exception:
               return 'Unknown'