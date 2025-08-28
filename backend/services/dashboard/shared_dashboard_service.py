from apps.job_posting.models import ApplicationStatus, JobApplication, JobPost, StatusChoices
from services.notification.notification_service import NotificationHelpers
from rest_framework.exceptions import NotFound, ValidationError
from django.db import transaction
from django.db.models import Sum, Max, F

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
               queryset = queryset[:4]
          
          return queryset
     
     @staticmethod
     def get_job_specific_applicants_queryset(company, job_id):
          return SharedDashboardService._get_applicants_queryset(company, job_id)
          
     @staticmethod
     def get_shortlisted_applicants_by_specific_job_queryset(company, job_id):
          return SharedDashboardService._get_applicants_queryset(company, job_id, ApplicationStatus.SHORTLISTED)
     
     @staticmethod
     def get_rejected_applicants_by_specific_job_queryset(company, job_id):
          return SharedDashboardService._get_applicants_queryset(company, job_id, ApplicationStatus.REJECTED)
     
     
     @staticmethod
     def perform_shortlisting_applicant(job_id, applicant_id):
          with transaction.atomic():
               try:
                    application = JobApplication.objects.get(
                         job_post__id=job_id,
                         job_seeker__id=applicant_id
                    )
                    
                    if application.application_status == ApplicationStatus.SHORTLISTED:
                         raise ValidationError("Application is already in shortlisted state.")

                    
                    new_status = ApplicationStatus.SHORTLISTED
                    
                    application.application_status = new_status
                    application.save()
                    
                    NotificationHelpers.notify_application_shortlisted(
                         application,
                         new_status
                    )
               except JobApplication.DoesNotExist:
                    raise NotFound("Application not found.")

     @staticmethod
     def remove_from_shortlist(job_id, applicant_id):
          """
          Remove candidate from shortlist with proper tracking
          """
          with transaction.atomic():
               try:
                    application = JobApplication.objects.get(
                         job_post__id=job_id,
                         job_seeker__id=applicant_id
                    )

                    if application.application_status == ApplicationStatus.REJECTED:
                         raise ValidationError("Application is already in reject state")
                    elif application.application_status != ApplicationStatus.SHORTLISTED:
                         raise ValidationError("Application must be in 'shortlisted' status to remove from shortlist")

                    application.application_status = ApplicationStatus.REJECTED
                    application.save()
                    
                    NotificationHelpers.notify_application_rejected(
                         application
                    )
               except JobApplication.DoesNotExist:
                    raise NotFound("Application not found.")


     @staticmethod
     def _get_applicants_queryset(company, job_id=None, application_status=None):
          # Get all applicants from all job posts
          
          filters = {
               'job_post__posted_by__company': company,
          }
          
          if job_id:
               filters['job_post__id'] = job_id
               
          if application_status:
               filters['application_status'] = application_status

          subquery = (
               JobApplication.objects
               .filter(**filters)
               .values("job_seeker")  # group by job_seeker
               .annotate(latest_created_at=Max("created_at"))  # get most recent
          )

          return JobApplication.objects.filter(
               **filters,
               created_at__in=subquery.values("latest_created_at")
          ).select_related(
               'job_post', 
               'job_post__posted_by', 
               'job_seeker__user', 
               'job_seeker__occupation',
               'job_seeker__occupation__role'
          ).only(
               'created_at',
               'job_post__id',
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