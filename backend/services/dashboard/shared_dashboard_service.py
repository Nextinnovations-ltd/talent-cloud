from apps.job_posting.models import JobApplication, JobPost, StatusChoices
from rest_framework.exceptions import NotFound
from django.db.models import Sum

class SharedDashboardService:
     @staticmethod
     def get_company(user):
          company = getattr(user, 'company', None)
          
          if not company:
               raise NotFound("Company doesn't exist for the user.")
          return company
     
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
     def get_company_applicants_queryset(company, is_recent=False):
          # Get all applicants from all job posts
          queryset = SharedDashboardService._get_applicants_queryset(company)
          
          if is_recent:
               queryset[:4]
          
          return queryset
     
     @staticmethod
     def get_job_specific_applicants_queryset(company, job_id):
          return SharedDashboardService._get_applicants_queryset(company, job_id)
          
     @staticmethod
     def _get_applicants_queryset(company, job_id=None):
          # Get all applicants from all job posts
          
          filters = {
               'job_post__posted_by__company': company,
          }
          
          if job_id:
               filters['job_post__id'] = job_id
               
          return JobApplication.objects.filter(
               **filters
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
     def get_recent_job_post_queryset(company):
          """Generate Recent Job Post Queryset
          """
          queryset = SharedDashboardService.get_job_post_queryset(company)
          
          return queryset[:4]
          
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