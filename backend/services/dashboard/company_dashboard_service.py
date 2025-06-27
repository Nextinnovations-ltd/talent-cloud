from apps.job_posting.models import JobApplication, JobPost
from services.dashboard.shared_dashboard_service import SharedDashboardService

class CompanyDashboardService:  
     @staticmethod
     def get_company_statistics(company):
          # Job Posted counts, Applicants, Bookmarks
          jobs = JobPost.objects.filter(posted_by__company = company)
          
          job_posts_count = jobs.count()
          job_post_applicants_count = SharedDashboardService.get_company_applicant_count(company)
          job_post_bookmarks_count = SharedDashboardService.get_company_bookmark_count(company)
          job_post_views_count = SharedDashboardService.get_company_view_count(company)
          
          return {
               'message': 'Succefully generated company statistics',
               'data': {
                    'total_job_posts': job_posts_count,
                    'job_post_applicants_count': job_post_applicants_count,
                    'job_post_bookmarks_count': job_post_bookmarks_count,
                    'job_post_views_count': job_post_views_count
               }
          }
     
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
                    'role': role.name,
                    'applied_date': application.created_at,
                    'profile_image_url': user.profile_image_url,
               })
          
          return {
               'message': 'Succefully generated applicants by most recent order.',
               'data': result
          }
     
     @staticmethod
     def get_company_job_posts_by_latest_order(company):
          # Get all applicants from all job posts
          job_posts = JobPost.objects.filter(
               posted_by__company=company
          ).select_related(
               'specialization'
          ).only(
               'specialization__name'
          ).order_by('-created_at')
          
          result = []
          
          for job_post in job_posts:
               specialization = getattr(job_post, 'specialization', None)
               
               result.append({
                    'id': job_post.pk,
                    'title': job_post.title,
                    'specialization_name': specialization.name if specialization else None,
                    'job_post_status': job_post.job_post_status,
                    'applicant_count': job_post.applicant_count,
                    'view_count': job_post.view_count,
                    'posted_date': job_post.created_at,
               })
          
          return {
               'message': 'Succefully generated job posts by most recent order.',
               'data': result
          }
     
     @staticmethod
     def get_active_job_posts(company):
          # Get all applicants from all job posts
          job_posts = JobPost.objects.active().filter(
               posted_by__company=company
          ).select_related(
               'specialization'
          ).only(
               'specialization__name'
          ).order_by('-created_at')
          
          result = []
          
          for job_post in job_posts:
               specialization = getattr(job_post, 'specialization', None)
               
               result.append({
                    'id': job_post.pk,
                    'title': job_post.title,
                    'specialization_name': specialization.name if specialization else None,
                    'job_post_status': job_post.job_post_status,
                    'applicant_count': job_post.applicant_count,
                    'view_count': job_post.view_count,
                    'posted_date': job_post.created_at,
               })
          
          return {
               'message': 'Succefully generated active job posts by most recent order.',
               'data': result
          }
     
     @staticmethod
     def get_draft_job_posts(company):
          # Get all applicants from all job posts
          job_posts = JobPost.objects.draft().filter(
               posted_by__company=company
          ).select_related(
               'specialization'
          ).only(
               'specialization__name'
          ).order_by('-created_at')
          
          result = []
          
          for job_post in job_posts:
               specialization = getattr(job_post, 'specialization', None)
               
               result.append({
                    'id': job_post.pk,
                    'title': job_post.title,
                    'specialization_name': specialization.name if specialization else None,
                    'job_post_status': job_post.job_post_status,
                    'applicant_count': job_post.applicant_count,
                    'view_count': job_post.view_count,
                    'posted_date': job_post.created_at,
               })
          
          return {
               'message': 'Succefully generated draft job posts by most recent order.',
               'data': result
          }
          
     @staticmethod
     def get_expired_job_posts(company):
          # Get all applicants from all job posts
          job_posts = JobPost.objects.expired().filter(
               posted_by__company=company
          ).select_related(
               'specialization'
          ).only(
               'specialization__name'
          ).order_by('-created_at')
          
          result = []
          
          for job_post in job_posts:
               specialization = getattr(job_post, 'specialization', None)
               
               result.append({
                    'id': job_post.pk,
                    'title': job_post.title,
                    'specialization_name': specialization.name if specialization else None,
                    'job_post_status': job_post.job_post_status,
                    'applicant_count': job_post.applicant_count,
                    'view_count': job_post.view_count,
                    'posted_date': job_post.created_at,
               })
          
          return {
               'message': 'Succefully generated expired job posts by most recent order.',
               'data': result
          }