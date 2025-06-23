
from apps.job_posting.models import JobApplication, JobPost
from django.db.models import Sum

class CompanyDashboardService:
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
     def get_company_statistics(company):
          # Job Posted counts, Applicants, Bookmarks
          jobs = JobPost.objects.filter(posted_by__company = company)
          
          job_posts_count = jobs.count()
          job_post_applicants_count = CompanyDashboardService.get_company_applicant_count(company)
          job_post_bookmarks_count = CompanyDashboardService.get_company_bookmark_count(company)
          job_post_views_count = CompanyDashboardService.get_company_view_count(company)
          
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
               'job_post', 'job_post__posted_by', 'job_seeker__user',
          ).order_by('-created_at')
          
          result = []
          
          for application in applications:
               job_seeker = application.job_seeker
               user = job_seeker.user
               # occupation = job_seeker.occupation
               
               result.append({
                    'id': user.pk,
                    'name': user.name,
                    # 'role': user.role.name,
                    'applied_date': application.created_at,
                    'profile_image_url': user.profile_image_url,
               })
          
          return {
               'message': 'Succefully generated most recent applicants by order.',
               'data': result
          }