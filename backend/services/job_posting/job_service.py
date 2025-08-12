from datetime import date
from apps.job_posting.serializers import JobPostSerializer
from apps.job_posting.models import JobPost, JobPostView, StatusChoices
from apps.job_seekers.models import JobSeeker, JobSeekerOccupation
from django.shortcuts import get_object_or_404
from django.db.models import Q
from services.job_seeker.profile_score_service import ProfileScoreService
from services.notification.notification_service import NotificationHelpers
import logging

logger = logging.getLogger(__name__)

class JobService():
     @staticmethod
     def create_job(data, user):
          serializer = JobPostSerializer(data=data)
          serializer.is_valid(raise_exception=True)
          job_post = serializer.save(posted_by=user)
          
          # Send notifications about the new job posting
          try:
               NotificationHelpers.notify_job_posted(
                    job_post,
                    user
               )
               logger.info(f"Job posting notifications sent for job: {job_post.title}")
          except Exception as e:
               logger.error(f"Failed to send job posting notifications: {str(e)}")
               # Don't fail the job creation if notifications fail
          
          return job_post, serializer

     @staticmethod
     def get_job_post_detail(job_post_id, request_user):
          job_post = get_object_or_404(JobPost, pk=job_post_id)

          try:
               job_seeker = request_user.jobseeker
          except JobSeeker.DoesNotExist:
               job_seeker = None

          if job_seeker:
               # Create or get the view record
               JobPostView.objects.get_or_create(job_post=job_post, job_seeker=job_seeker)

          return job_post

     @staticmethod
     def get_matched_jobs_queryset(occupation: JobSeekerOccupation):
          """Get jobs matching user's occupation"""
          queryset = JobPost.objects.active().filter(
               is_accepting_applications=True,
               job_post_status=StatusChoices.ACTIVE,
               number_of_positions__gt=0
          )

          today = date.today()
          queryset = queryset.filter(
               Q(last_application_date__gte=today) | Q(last_application_date__isnull=True)
          )
          
          user_match_q = Q()
          
          # Build matching query
          skill_ids = list(occupation.skills.values_list('id', flat=True))
          
          if skill_ids:
               user_match_q |= Q(skills__id__in=skill_ids)

          if occupation.specialization_id:
               user_match_q |= Q(specialization_id=occupation.specialization_id)

          if occupation.role_id:
               user_match_q |= Q(role_id=occupation.role_id)
          
          # Filter 2: Must match user's profile
          if user_match_q:
               queryset = queryset.filter(user_match_q)
          else:
               # Return empty queryset because there's no profile data to match against
               return JobPost.objects.none()
          
          return queryset.distinct().order_by('-created_at').select_related(
               'role', 'experience_level', 'posted_by'
          )
     
     @staticmethod
     def get_popular_jobs_queryset():
          """Get popular jobs for new users"""
          from django.db.models import F
          
          return JobPost.objects.active().filter(
               is_accepting_applications=True,
               job_post_status=StatusChoices.ACTIVE
          ).annotate(
               popularity_score=F('view_count') + F('applicant_count') * 3
          ).filter(
               number_of_positions__gt=0
          ).order_by('-popularity_score', '-created_at').select_related(
               'role', 'experience_level', 'posted_by'
          )
     
     def get_newest_jobs_queryset():
          """Get newest jobs as fallback"""
          today = date.today()
          date_filter_q = Q(last_application_date__gte=today) | Q(last_application_date__isnull=True)
          
          return JobPost.objects.active().filter(
               is_accepting_applications=True,
               job_post_status=StatusChoices.ACTIVE,
               number_of_positions__gt=0
          ).filter(date_filter_q).order_by('-created_at').select_related(
               'role', 'experience_level', 'posted_by'
          )
     
     def get_recent_jobs_queryset():
          """Get recent jobs as fallback"""
          today = date.today()
          date_filter_q = Q(last_application_date__gte=today) | Q(last_application_date__isnull=True)
          
          return JobPost.objects.active().filter(
               is_accepting_applications=True,
               job_post_status=StatusChoices.ACTIVE,
               number_of_positions__gt=0
          ).filter(date_filter_q).order_by('-created_at').select_related(
               'role', 'experience_level', 'posted_by'
          )[:3]

     @staticmethod
     def get_filter_completion_score(user):
          """Calculate job filter completion score"""
          completion_score = 0
          total_score = 100
          
          completion_score = ProfileScoreService.calculate_job_filter_profile_score(user)
          
          return min(completion_score, total_score)
     
     @staticmethod
     def update_job_post(job_post_instance, data, partial=False):
          serializer = JobPostSerializer(job_post_instance, data=data, partial=partial)
          serializer.is_valid(raise_exception=True) # This will raise ValidationError if invalid
          serializer.save()
          return serializer

     @staticmethod
     def delete_job_post(job_post_instance):
          job_post_instance.delete()