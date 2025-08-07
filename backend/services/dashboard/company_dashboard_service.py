from apps.job_posting.models import JobPost
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