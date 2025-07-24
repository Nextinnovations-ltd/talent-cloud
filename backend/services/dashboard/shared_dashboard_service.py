from apps.job_posting.models import JobApplication, JobPost, StatusChoices
from apps.job_seekers.models import JobSeekerSpecialization
from django.db.models import Sum

class SharedDashboardService:
     @staticmethod
     def get_company_applicant_count(company):
          # Get all applicants from all job posts
          return JobPost.objects.filter(posted_by__company=company).aggregate(
               total_applicants=Sum('applicant_count')
          )['total_applicants'] or 0
          
     @staticmethod
     def get_company_bookmark_count(company):
          # Get all applicants from all job posts
          return JobPost.objects.filter(posted_by__company=company).aggregate(
               total_bookmarks=Sum('bookmark_count')
          )['total_bookmarks'] or 0
          
     @staticmethod
     def get_company_view_count(company):
          # Get all applicants from all job posts
          return JobPost.objects.filter(posted_by__company=company).aggregate(
               total_views=Sum('view_count')
          )['total_views'] or 0
     
     @staticmethod
     def get_company_applicants_by_latest_order(company):
          # Get all applicants from all job posts
          applications = JobApplication.objects.filter(
               job_post__posted_by__company=company
          ).select_related(
               'job_post', 
               'job_post__posted_by', 
               'job_seeker__user', 
               'job_seeker__occupation',
               'job_seeker__occupation__role'
          ).only(
               'created_at',
               'job_post__posted_by__company',
               'job_seeker__user__id',
               'job_seeker__user__name',
               'job_seeker__user__profile_image_url',
               'job_seeker__occupation__role__name'
          ).order_by('-created_at')
          
          result = []
          
          for application in applications:
               job_seeker = application.job_seeker
               user = job_seeker.user
               role = getattr(getattr(job_seeker, 'occupation', None), 'role', None)
               
               result.append({
                    'applicant_id': user.pk,
                    'name': user.name,
                    'phone_number': f"{user.country_code}{user.phone_number}" if user.country_code is not None and user.phone_number is not None else None,
                    'email': user.email,
                    'role': role.name,
                    'is_open_to_work': job_seeker.is_open_to_work,
                    'address': user.get_address,
                    'profile_image_url': user.profile_image_url,
               })
          
          return {
               'message': 'Succefully generated applicants by most recent order.',
               'data': result
          }
     
     # @staticmethod
     # def get_company_job_posts_by_latest_order(company):
     #      result = SharedDashboardService.get_job_post_list_by_status(company)

     #      return {
     #           'message': 'Succefully generated job posts by most recent order.',
     #           'data': result
     #      }
     
     # @staticmethod
     # def get_active_job_posts(company):
     #      result = SharedDashboardService.get_job_post_list_by_status(company, StatusChoices.ACTIVE)

     #      return {
     #           'message': 'Succefully generated active job posts by most recent order.',
     #           'data': result
     #      }
     
     # @staticmethod
     # def get_draft_job_posts(company):
     #      result = SharedDashboardService.get_job_post_list_by_status(company, StatusChoices.DRAFT)

     #      return {
     #           'message': 'Succefully generated draft job posts by most recent order.',
     #           'data': result
     #      }
          
     # @staticmethod
     # def get_expired_job_posts(company):
     #      result = SharedDashboardService.get_job_post_list_by_status(company, StatusChoices.EXPIRED)

     #      return {
     #           'message': 'Succefully generated expired job posts by most recent order.',
     #           'data': result
     #      }
     
     @staticmethod
     def get_job_post_queryset_by_status(company, status = None):
          """Generate Job Post Queryset by job post status parameter
          """
          queryset = SharedDashboardService.get_job_post_queryset(company)
          
          if status == StatusChoices.ACTIVE:
               return queryset.active()
          elif status == StatusChoices.DRAFT:
               return queryset.draft()
          elif status == StatusChoices.EXPIRED:
               return queryset.expired()
          else:
               return queryset
          
     @staticmethod
     def get_job_post_queryset(company):
          return JobPost.objects.filter(
               posted_by__company=company
          ).select_related(
               'specialization'
          ).only(
               'specialization__name'
          ).order_by('-created_at')
          
     @staticmethod
     def build_job_post_response(job_post: JobPost):
          specialization: JobSeekerSpecialization = getattr(job_post, 'specialization', None)
          
          return {
               'id': job_post.pk,
               'title': job_post.title,
               'company': job_post.get_company_name,
               'specialization_name': specialization.name if specialization else None,
               'job_post_status': job_post.job_post_status,
               'applicant_count': job_post.applicant_count,
               'view_count': job_post.view_count,
               'posted_date': job_post.created_at,
               'deadline_date': job_post.last_application_date,
          }
     
     @staticmethod
     def toggle_job_post_status(job_post_id):
          try:
               job_post = JobPost.objects.get(id=job_post_id)
          except JobPost.DoesNotExist:
               return {
                    'success': False,
                    'message': 'Job post not found',
                    'data': None
               }
          
          current_status = job_post.job_post_status
          
          # Only allow toggling between active and expired
          if current_status != StatusChoices.EXPIRED:
               job_post.job_post_status = StatusChoices.EXPIRED
               new_status = 'expired'
          else:
               job_post.job_post_status = StatusChoices.ACTIVE  
               new_status = 'active'
          
          job_post.save()
          
          return {
               'message': f'Job post status successfully changed from {current_status} to {new_status}',
               'data': {
                    'job_post_id': job_post_id,
                    'previous_status': current_status,
                    'new_status': new_status
               }
          }
          