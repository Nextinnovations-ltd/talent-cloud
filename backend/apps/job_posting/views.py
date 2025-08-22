from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from apps.job_posting.filters import JobPostFilter
from apps.job_posting.models import BookmarkedJob, JobApplication, JobPost, StatusChoices
from drf_spectacular.utils import extend_schema, extend_schema_view
from apps.job_posting.serializers import (
    BookmarkedJobSerializer,
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
    JobApplicationStatusUpdateSerializer,
    JobPostDetailSerializer,
    JobPostListSerializer,
    JobPostSerializer,
)
from apps.job_seekers.models import JobSeeker
from services.job_posting.job_application_service import JobApplicationService
from services.job_posting.job_service import JobService
from rest_framework.exceptions import ValidationError
from utils.view.custom_api_views import CustomListAPIView, CustomRetrieveDestroyAPIView, CustomRetrieveUpdateDestroyAPIView
from utils.response import CustomResponse
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsCompanyAdminOrSuperadminForJobPost, TalentCloudAllPermission, TalentCloudUserDynamicPermission
from core.middleware.permission import (
    TalentCloudUserPermission,
    TalentCloudAdminOrSuperAdminPermission,
    IsOwnerOfApplication,
    IsCompanyAdminOrSuperadminForApplication
)
from core.constants.s3.constants import FILE_TYPES
from services.job_seeker.file_upload_service import FileUploadService

import logging

logger = logging.getLogger(__name__)

# region Job Post Views

@extend_schema(tags=["Job Post"])
class JobPostCreateAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission]

     def post(self, request):
          try:
               # The business logic for creating a job post is moved to JobService
               job_post, serializer = JobService.create_job(request.data, request.user)
               return Response(CustomResponse.success("Successfully created the job post.", serializer.data), status=status.HTTP_201_CREATED)
          except ValidationError as e:
               # The service layer raises ValidationError on invalid data
               return Response(CustomResponse.error("Error creating the job post.", e.detail), status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Job Post"])
class JobPostEditDetailAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsCompanyAdminOrSuperadminForJobPost]
     
     def get_object(self, pk):
          return get_object_or_404(JobPost, pk=pk)

     def get(self, request, pk):
          job_post = self.get_object(pk)
          serializer = JobPostSerializer(job_post)
          
          return Response(CustomResponse.success("Successfully fetched job post details", serializer.data), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Post"])
class JobPostActionAPIView(APIView):
     authentication_classes = [TokenAuthentication]

     def get_permissions(self):
          if self.request.method == 'GET':
               return [TalentCloudAllPermission()]
          else:
               return [IsCompanyAdminOrSuperadminForJobPost()]

     def get_object(self, pk):
          # This method is still needed for permission checks and to pass the instance to the service
          return get_object_or_404(JobPost, pk=pk)

     def get(self, request, pk):
          try:
               job_post = JobService.get_job_post_detail(pk, request.user)
               serializer = JobPostDetailSerializer(job_post, context={ 'request': request })
               return Response(CustomResponse.success("Successfully fetched job post.", serializer.data), status=status.HTTP_200_OK)
          except NotFound as e:
               return Response(CustomResponse.error(str(e)), status=status.HTTP_404_NOT_FOUND)
          except Exception as e:
               return Response(CustomResponse.error(f"An unexpected error occurred: {str(e)}"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

     def patch(self, request, pk):
          instance = self.get_object(pk) # Get instance for permission check
          self.check_object_permissions(request, instance) # Perform permission check
          
          try:
               serializer = JobService.update_job_post(instance, request.data, partial=True)
               return Response(CustomResponse.success("Successfully updated job post.", serializer.data), status=status.HTTP_200_OK)
          except ValidationError as e:
               return Response(CustomResponse.error("Error updating job post.", e.detail), status=status.HTTP_400_BAD_REQUEST)
          except Exception as e:
               return Response(CustomResponse.error(f"An unexpected error occurred: {str(e)}"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

     def delete(self, request, pk):
          instance = self.get_object(pk) # Get instance for permission check
          self.check_object_permissions(request, instance) # Perform permission check
          
          try:
               JobService.delete_job_post(instance)
               return Response(CustomResponse.success("Successfully deleted the job post."), status=status.HTTP_200_OK)
          except Exception as e:
               return Response(CustomResponse.error(f"An unexpected error occurred: {str(e)}"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endregion Job Post Views


# region Job Post List Views

class RecentJobPostListAPIView(CustomListAPIView):
     queryset = JobPost.objects.all().select_related('role', 'experience_level', 'posted_by')
     serializer_class = JobPostListSerializer
     use_pagination = False
     success_message = "Successfully fetched all recent job posts."

     def get_queryset(self):
          return JobService.get_recent_jobs_queryset()

@extend_schema(tags=["Job Post"])
class JobPostListAPIView(CustomListAPIView):
     queryset = JobPost.objects.all().select_related('role', 'experience_level', 'posted_by')
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer

     success_message = "Successfully fetched all job posts."

@extend_schema(tags=["Job Post"])
class JobDiscoveryAPIView(CustomListAPIView):
     """Smart job discovery that adapts to user profile completeness"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer
     filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
     filterset_class = JobPostFilter
     search_fields = ['title', 'description', 'location']
     ordering_fields = [ 'created_at', 'experience_years' ]
     ordering = ['-created_at']
     
     def has_filters(self, params):
          return any(
               key in params
               for key in [
                    'search', 'job_type', 'work_type', 'experience_level',
                    'experience_year', 'salary_rate', 'company_size', 'specialization',
                    'role', 'location', 'list_by_any_time', 'project_duration'
               ]
          )
     
     def get_queryset(self):
          """Return jobs based on user profile completeness and preferences"""
          user = self.request.user

          has_filters = self.has_filters(self.request.query_params)
          
          # Step 1: Check if user has a JobSeeker profile
          try:
               jobseeker = JobSeeker.objects.prefetch_related(
                    'occupation__skills', 'occupation__specialization'
               ).get(user=user.jobseeker)
          except (JobSeeker.DoesNotExist, AttributeError):
               # New user - show popular/newest jobs
               return JobService.get_popular_jobs_queryset() if not has_filters else JobPost.objects.none()
          
          # Step 2: Check if user has occupation data
          occupation = getattr(jobseeker, 'occupation', None)
          
          if not occupation:
               # User exists but no occupation - show newest jobs with message
               return JobService.get_newest_jobs_queryset() if not has_filters else JobPost.objects.none()
          
          # Step 3: Try to get matched jobs
          matched_jobs = JobService.get_matched_jobs_queryset(occupation)
          
          if matched_jobs.exists():
               return matched_jobs

          if has_filters:
               return JobPost.objects.none()
          
          # Step 4: Fallback if no matches found
          profile_completion = JobService.get_filter_completion_score(user)
          
          if profile_completion < 60:  # Less than 60% complete
               return JobService.get_popular_jobs_queryset()
          
          return JobService.get_newest_jobs_queryset()
     
     def list(self, request, *args, **kwargs):
          """Override list to add metadata about job discovery"""
          response = super().list(request, *args, **kwargs)
         
          original_data = response.data.get('data', {})
          
          has_filters = self.has_filters(request.query_params)
          
          # Add discovery metadata
          discovery_info = self._get_discovery_info(request.user, has_filters)
          
          enhanced_data = {}
          
          if has_filters:
               enhanced_data = {
                    'discovery_type': discovery_info['type']
               }
          else:
               enhanced_data = {
                    'discovery_type': discovery_info['type'],
                    'setup_completion': discovery_info.get('filter_setup_completion', 0),
                    'suggestions': discovery_info.get('suggestions', []),
               }
          
          # Merge with original data
          if isinstance(original_data, dict) and 'results' in original_data:
               # Paginated response
               enhanced_data.update(original_data)
          else:
               # Non-paginated response
               enhanced_data['results'] = original_data
          
          # Return new response with enhanced data
          return Response(
               CustomResponse.success(
                    discovery_info['message'],
                    enhanced_data
               )
          )
     
     def _get_discovery_info(self, user, has_filters=False):
          """Get information about how jobs were discovered"""
          try:
               if has_filters:
                    return {
                         'type': 'filtered',
                         'message': 'Fetched filtered job posts.'
                    }
               
               jobseeker = user.jobseeker
               
               if not hasattr(jobseeker, 'occupation') or not jobseeker.occupation:
                    return {
                         'type': 'newest',
                         'message': 'Complete your profile to see personalized job recommendations. Here are the latest opportunities:',
                         'suggestions': ['Set up your occupation and skills', 'Add your specialization', 'Complete your profile']
                    }
               
               occupation = jobseeker.occupation
               profile_completion = JobService.get_filter_completion_score(user)
               
               # Check if matched jobs found
               matched_jobs = JobService.get_matched_jobs_queryset(occupation)
               
               if matched_jobs.exists():
                    return {
                         'type': 'matched',
                         'message': f'Found jobs matching your profile',
                         'filter_setup_completion': profile_completion
                    }
               elif profile_completion < 60:
                    return {
                         'type': 'popular',
                         'message': 'Complete your profile for better job matches. Here are popular opportunities:',
                         'filter_setup_completion': profile_completion,
                         'suggestions': ['Add more skills', 'Update your specialization', 'Add your occupation role']
                    }
               else:
                    return {
                         'type': 'newest',
                         'message': 'No perfect matches found yet. Here are the latest opportunities:',
                         'filter_setup_completion': profile_completion,
                         'suggestions': ['Try expanding your skill preferences', 'Consider remote opportunities']
                    }
                    
          except (JobSeeker.DoesNotExist, AttributeError):
               return {
                    'type': 'popular',
                    'message': 'Welcome! Here are some popular job opportunities to get you started:',
                    'suggestions': ['Update your job seeker profile', 'Set up your skills and preferences']
               }

@extend_schema(tags=["Job Post"])
class JobSearchListAPIView(CustomListAPIView):
     """
     General endpoint for searching and filtering JobPost objects.
     """
     serializer_class = JobPostListSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
     filterset_class = JobPostFilter
     ordering_fields = [ 'created_at', 'salary_min', 'experience_years' ]
     ordering = ['-created_at']    # Set default ordering
     search_fields = [ 'title', 'description', 'location' ] # Fields for searching (eg. ?search=keyword)
     success_message = "Jobs Fetched successfully"

     def get_queryset(self):
          """
          Returns the base queryset of active JobPost objects with valid application dates.
          The filter backends will then apply additional search, filter, and ordering.
          """
          queryset = JobPost.objects.active().filter(is_accepting_applications=True)

          queryset = queryset.distinct()

          # select_related and prefetch_related for optimization
          queryset = queryset.select_related(
               'role', 'experience_level', 'specialization', 'posted_by'
          )

          return queryset

@extend_schema(tags=["Job Post"])
class NewestJobPostAPIView(CustomListAPIView):
     queryset = JobPost.objects.active().filter(is_accepting_applications=True)\
        .order_by('-created_at')\
        .select_related('role', 'experience_level', 'posted_by')
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer

     success_message = "Successfully fetched latest job posts."

@extend_schema(tags=["Job Post"])
class MatchedJobPostAPIView(CustomListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer
     filter_backends = [DjangoFilterBackend, SearchFilter]
     filterset_class = JobPostFilter
     search_fields = [ 'title', 'description', 'location' ] 
     
     def get_queryset(self):
          try:
               jobseeker = self.request.user.jobseeker
               occupation = getattr(jobseeker, 'occupation', None)
               
               if not occupation:
                    return JobPost.objects.none()
               
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
          except (JobSeeker.DoesNotExist, AttributeError):
               # Return empty queryset instead of raising exception
               return JobPost.objects.none()

     def list(self, request, *args, **kwargs):
          """Override list to add metadata about matched job discovery"""
          response = super().list(request, *args, **kwargs)
         
          original_data = response.data.get('data', {})
          
          # Merge with original data
          if original_data.get('count', 0) > 0:
               
               message = "Successfully fetchd all matched jobs."
          else:
               message = "No matched jobs found for you. Please update your profile."
          
          # Return new response with enhanced data
          return Response(
               CustomResponse.success(
                    message,
                    original_data
               )
          )
     
@extend_schema(tags=["Company Job Post"])
class CompanyJobListView(CustomListAPIView):
     """
     API endpoint for Admin/Superadmin to list all job posts for their company.
     URL: /api/v1/company-job-posts/ (GET)
     """
     serializer_class = JobPostListSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission, IsCompanyAdminOrSuperadminForApplication]
     use_pagination = False

     def get_queryset(self):
          # Filter job posts by admin/superadmin
          return JobPost.objects.filter(posted_by=self.request.user)

# endregion Job Post List Views


# region Job Post Metric Views

# @extend_schema_view(get=extend_schema(tags=["Job Post"]))
# class JobPostMetricViewAPIView(APIView):
#      authentication_classes = [TokenAuthentication]
#      permission_classes = [TalentCloudSuperAdminPermission]

#      def get(self, request, pk):
#           metric = get_object_or_404(JobPostMetric, job_post_id=pk)
#           serializer = JobPostMetricSerializer(metric)
          
#           return Response(serializer.data, status=status.HTTP_200_OK)

# @extend_schema_view(get=extend_schema(tags=["Job Post"]))
# class IncrementJobPostViewCountAPIView(APIView):
#      authentication_classes = [TokenAuthentication]
#      permission_classes = [TalentCloudSuperAdminPermission]

#      def post(self, request, pk):
#           metric, created = JobPostMetric.objects.get_or_create(job_post_id=pk)
          
#           metric.view_count += 1
#           metric.save()
          
#           return Response({'view_count': metric.view_count}, status=status.HTTP_200_OK)

# endregion Job Post Metric Views


# region Job Application Views


@extend_schema(tags=["Cover Upload"])
class CoverLetterUploadUrlAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     @extend_schema(
          summary="Generate presigned URL for cover upload",
          request={
               'application/json': {
                    'type': 'object',
                    'properties': {
                         'filename': {'type': 'string', 'description': 'Original filename'},
                         'file_size': {'type': 'integer', 'description': 'File size in bytes'},
                         'content_type': {'type': 'string', 'description': 'MIME type (optional)'},
                    },
                    'required': ['filename', 'file_size']
               }
          }
     )
     def post(self, request):
          """
          Generate presigned URL when user confirms cover letter upload
          """
          try:
               filename = request.data.get('filename')
               file_size = request.data.get('file_size')
               content_type = request.data.get('content_type')
               
               # Validation
               if not filename:
                    raise ValidationError("filename is required")
               if not file_size:
                    raise ValidationError("file_size is required")
               if len(filename.strip()) == 0:
                    raise ValidationError("filename cannot be empty")
               
               response_data = FileUploadService.upload_file(request.user, filename, file_size, content_type, FILE_TYPES.COVER_LETTER)
               
               logger.info(f"Generated cover letter upload URL for user {request.user.id}")
               
               return Response(
                    CustomResponse.success("Cover letter upload URL generated", response_data),
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"Validation error in cover letter upload: {str(e)}")
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error generating cover letter upload URL: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to generate upload URL"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Job Post-Application"])
class JobApplicationCreateView(APIView):
     """
     API endpoint for Job Seekers to apply for a job post.
     URL: /api/jobposts/{job_post_id}/applications/ (POST)
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     @extend_schema(
          description="Create a new job application",
          request=JobApplicationCreateSerializer,
          responses={
               201: JobApplicationSerializer,
               400: "Validation Error",
               404: "Job Post Not Found"
          }
     )
     def post(self, request, job_post_id):
          cover_letter_upload_id = request.data.get('cover_letter_upload_id')
          
          # Validation
          if not job_post_id:
               raise ValidationError("Job post cannot be empty")
          if not cover_letter_upload_id:
               raise ValidationError("Cover letter is required")

          
          # Create application using service
          application = JobApplicationService.perform_application_submission(
               user=request.user,
               job_post_id=job_post_id,
               cover_letter_upload_id=cover_letter_upload_id
          )
          
          # Return success response
          response_serializer = JobApplicationSerializer(application, context={'request': request})
          
          return Response(
               CustomResponse.success("Application submitted successfully.", response_serializer.data),
               status=status.HTTP_201_CREATED
          )

@extend_schema(tags=["Job Post-Application"])
class JobSeekerApplicationListView(CustomListAPIView):
     """
     API endpoint for a Job Seeker to list their own applications.
     URL: /api/my-applications/ (GET)
     """
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     use_pagination = False
     
     def get_queryset(self):
          job_seeker = get_object_or_404(JobSeeker, user=self.request.user)
          return JobApplication.objects.filter(job_seeker=job_seeker)

@extend_schema(tags=["Job Post-Application"])
class JobSeekerApplicationDetailView(CustomRetrieveDestroyAPIView):
     """
     API endpoint for a Job Seeker to view or withdraw a specific application.
     URL: /api/my-applications/{id}/ (GET, DELETE)
     """
     queryset = JobApplication.objects.all()
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission, IsOwnerOfApplication]

@extend_schema(tags=["Company Job Post-Application"])
class CompanyJobApplicationsListView(CustomListAPIView):
     """
     API endpoint for Admin/Superadmin to list applications for a specific job post in their company.
     URL: /api/v1/company-job-posts/{id}/applications (GET)
     """
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission]
     use_pagination = False

     def get_queryset(self):
          # Get the job post from the URL parameter
          job_post_id = self.kwargs.get('job_post_id')
          job_post = get_object_or_404(JobPost, id=job_post_id)

          # Ensure the job post belongs to the authenticated user's company
          user = self.request.user
          if user.company != job_post.posted_by.company:
               return JobApplication.objects.none()

          # Filter applications by the job post
          return JobApplication.objects.filter(job_post=job_post)

# @extend_schema(tags=["Company Job Post-Application"])
@extend_schema_view(
    get=extend_schema(tags=["Company Job Post-Application"]),
    patch=extend_schema(tags=["Company Job Post-Application"]),
    delete=extend_schema(tags=["Company Job Post-Application"]),
    put=extend_schema(exclude=True),  # Hides PUT
)
class CompanyApplicationDetailView(CustomRetrieveUpdateDestroyAPIView):
     """
     API endpoint for Admin/Superadmin to view, update, or delete a specific application.
     URL: /api/applications/{id}/ (GET, PATCH, PUT, DELETE)
     """
     queryset = JobApplication.objects.all()
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission, IsCompanyAdminOrSuperadminForApplication]

     def get_serializer_class(self):
          if self.request.method in ['PATCH']:
               return JobApplicationStatusUpdateSerializer
          return self.serializer_class
     
     def perform_update(self, serializer):
          """Override to add notification for status updates"""
          old_status = self.get_object().application_status
          application = serializer.save()
          new_status = application.application_status
          
          # Send notification if status changed
          if old_status != new_status:
               try:
                    from services.notification.notification_service import NotificationHelpers
                    
                    # NotificationService.send_notification(
                    #      title="Application Status Update",
                    #      message=f"Your application for '{application.job_post.title}' has been updated to: {new_status}",
                    #      notification_type=NotificationType.JOB_APPLIED,  # Could add APPLICATION_STATUS_UPDATE type
                    #      target_users=[application.job_seeker.user],
                    #      destination_url=f"/my-applications/{application.id}",
                    #      channel=NotificationChannel.BOTH,
                    #      email_context={
                    #           'application': application,
                    #           'old_status': old_status,
                    #           'new_status': new_status
                    #      }
                    # )
                    logger.info(f"Application status update notification sent for application: {application.id}")
               except Exception as e:
                    logger.error(f"Failed to send application status update notification: {str(e)}")
                    # Don't fail the update if notification fails

# endregion Job Application Views


# region Bookmarked Job Views

@extend_schema(tags=["Job Post-Bookmark"])
class BookmarkJobView(APIView):
     """
     API endpoint for Job Seekers to bookmark or unbookmark a job post.
     URL: /api/jobposts/{job_post_id}/bookmark/ (POST, DELETE)
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def post(self, request, job_post_id):
          job_post = get_object_or_404(JobPost, id=job_post_id)
          job_seeker = get_object_or_404(JobSeeker, user=request.user)

          # Check if already bookmarked
          if BookmarkedJob.objects.filter(job_post=job_post, job_seeker=job_seeker).exists():
               return Response(CustomResponse.error("Job is already bookmarked."), status=status.HTTP_400_BAD_REQUEST)

          bookmarked_job = BookmarkedJob.objects.create(job_post=job_post, job_seeker=job_seeker)
          serializer = BookmarkedJobSerializer(bookmarked_job, context={'request': request})
          
          return Response(CustomResponse.success("Bookmarked the job.", serializer.data), status=status.HTTP_201_CREATED)

@extend_schema(tags=["Job Post-Bookmark"])
class BookmarkJobDeleteAPIView(APIView):
     """
     API endpoint for Job Seekers to delete a bookmarked job.
     URL: /api/my-bookmarks/bookmark_id/ (DELETE)
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def delete(self, request, bookmark_id):
          job_seeker = get_object_or_404(JobSeeker, user=request.user)
          
          bookmark = get_object_or_404(BookmarkedJob, id=bookmark_id, job_seeker=job_seeker)
          bookmark.delete()

          return Response(CustomResponse.success("Successfully deleted the job post bookmark."), status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=["Job Post-Bookmark"])
class BookmarkDeleteAPIView(APIView):
     """
     API endpoint for Job Seekers to delete a bookmarked job.
     URL: /api/my-bookmarks/bookmark_id/ (DELETE)
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def delete(self, request, job_post_id):
          job_seeker = get_object_or_404(JobSeeker, user=request.user)
          
          bookmark = get_object_or_404(BookmarkedJob, job_post_id=job_post_id, job_seeker=job_seeker)
          bookmark.delete()

          return Response(CustomResponse.success("Successfully deleted the job post bookmark."), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Post-Bookmark"])
class JobSeekerBookmarkedJobListView(CustomListAPIView):
     """
     API endpoint for a Job Seeker to list their bookmarked jobs.
     URL: /api/my-bookmarks/ (GET)
     """
     serializer_class = BookmarkedJobSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     use_pagination = False

     def get_queryset(self):
          job_seeker = get_object_or_404(JobSeeker, user=self.request.user)
          return BookmarkedJob.objects.filter(job_seeker=job_seeker)

# endregion Bookmarked Job Views