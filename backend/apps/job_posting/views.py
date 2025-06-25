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
from apps.job_posting.models import BookmarkedJob, JobApplication, JobPost, JobPostView
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
from services.job_posting.job_service import JobService
from rest_framework.exceptions import ValidationError
from utils.view.custom_api_views import CustomCreateAPIView, CustomListAPIView, CustomRetrieveDestroyAPIView, CustomRetrieveUpdateDestroyAPIView
from utils.response import CustomResponse
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsCompanyAdminOrSuperadminForJobPost, TalentCloudAllPermission, TalentCloudUserDynamicPermission, TalentCloudSuperAdminPermission
from core.middleware.permission import (
    TalentCloudUserPermission,
    TalentCloudAdminOrSuperAdminPermission,
    IsOwnerOfApplication,
    IsCompanyAdminOrSuperadminForApplication
)

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

@extend_schema(tags=["Job Post"])
class JobPostListAPIView(CustomListAPIView):
     queryset = JobPost.objects.all().select_related('role', 'experience_level', 'posted_by')
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer

     success_message = "Successfully fetched all job posts."

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
     filter_backends = [DjangoFilterBackend]
     filterset_class = JobPostFilter
     
     def get_queryset(self):
          jobseeker = JobSeeker.objects.prefetch_related(
               'occupation__skills', 'occupation__specialization'
          ).get(user=self.request.user.jobseeker)

          occupation = getattr(jobseeker, 'occupation', None)
            
          if not occupation:
               raise NotFound("No occupation found for the user. Cannot find matched jobs.")

          skill_ids = occupation.skills.values_list('id', flat=True)
          specialization_id = occupation.specialization_id

          # Q object for filtering by user profile match (skills OR specialization)
          user_match_q = Q(skills__id__in=skill_ids) | Q(specialization_id=specialization_id)

          # Filter 1: Must be accepting applications
          queryset = JobPost.objects.active().filter(is_accepting_applications=True)

          # Filter 2: Must match user's profile
          queryset = queryset.filter(user_match_q)

          # Filter 3 last_application_date must be today or in the future, OR be null
          today = date.today()
          date_filter_q = Q(last_application_date__gte=today) | Q(last_application_date__isnull=True)
          queryset = queryset.filter(date_filter_q)

          # Filter 4 (Optional Default): Only show jobs with positions available
          # queryset = queryset.filter(number_of_positions__gt=0)

          queryset = queryset.distinct()

          # Apply ordering and prefetches
          queryset = queryset.order_by('-created_at')
          queryset = queryset.select_related(
               'role', 'experience_level', 'posted_by'
          )

          return queryset

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

@extend_schema(tags=["Job Post-Application"])
class JobApplicationCreateView(CustomCreateAPIView):
     """
     API endpoint for Job Seekers to apply for a job post.
     URL: /api/jobposts/{job_post_id}/applications/ (POST)
     """
     queryset = JobApplication.objects.all()
     serializer_class = JobApplicationCreateSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def perform_create(self, serializer):
          job_post_id = self.kwargs.get('job_post_id')
          job_post = get_object_or_404(JobPost, id=job_post_id)
          job_seeker = get_object_or_404(JobSeeker, user=self.request.user)

          # Check if the job seeker has already applied to this job post
          if JobApplication.objects.filter(job_post=job_post, job_seeker=job_seeker).exists():
               return Response(
                    {"detail": "You have already applied for this job post."},
                    status=status.HTTP_400_BAD_REQUEST
               )

          serializer.save(job_post=job_post, job_seeker=job_seeker)

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
          serializer = BookmarkedJobSerializer(bookmarked_job)
          
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