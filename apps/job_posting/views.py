from amqp import NotFound
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from apps.job_posting.filters import JobPostFilter
from apps.job_posting.models import BookmarkedJob, JobApplication, JobPost, JobPostMetric
from apps.job_posting.serializers import (
    BookmarkedJobSerializer,
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
    JobApplicationStatusUpdateSerializer,
    JobPostDetailSerializer,
    JobPostListSerializer,
    JobPostSerializer,
    JobPostMetricSerializer
)
from apps.job_seekers.models import JobSeeker
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsCompanyAdminOrSuperadminForJobPost, TalentCloudAllPermission, TalentCloudUserDynamicPermission, TalentCloudSuperAdminPermission
from core.middleware.permission import (
    TalentCloudUserPermission,
    TalentCloudAdminOrSuperAdminPermission,
    IsOwnerOfApplication,
    IsCompanyAdminOrSuperadminForApplication
)

# region Job Post Views

class JobPostListCreateAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     
     def get_permissions(self):
          if self.request.method == 'GET':
               return [TalentCloudAllPermission()]
          elif self.request.method == 'POST':
               return [TalentCloudSuperAdminPermission()]
          
          return super().get_permissions()

     def get(self, request):
          job_posts = JobPost.objects.all().select_related(
               'role', 'experience_level', 'posted_by'
          )
          
          serializer = JobPostListSerializer(job_posts, many=True)
          
          return Response(serializer.data, status=status.HTTP_200_OK)

     def post(self, request):
          serializer = JobPostSerializer(data=request.data)
          
          if serializer.is_valid():
               serializer.save(posted_by=request.user)
               return Response(serializer.data, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobPostEditDetailAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsCompanyAdminOrSuperadminForJobPost]
     
     def get_object(self, pk):
          return get_object_or_404(JobPost, pk=pk)

     def get(self, request, pk):
          job_post = self.get_object(pk)
          serializer = JobPostSerializer(job_post)
          
          return Response(serializer.data, status=status.HTTP_200_OK)

class JobPostActionAPIView(APIView):
     authentication_classes = [TokenAuthentication]

     def get_permissions(self):
          if self.request.method == 'GET':
               return [TalentCloudAllPermission()]
          else:
               return [IsCompanyAdminOrSuperadminForJobPost()]

     def get_object(self, pk):
          return get_object_or_404(JobPost, pk=pk)

     def get(self, request, pk):
          job_post = self.get_object(pk)
          serializer = JobPostDetailSerializer(job_post)
          
          return Response(serializer.data, status=status.HTTP_200_OK)

     def put(self, request, pk):
          instance = self.get_object(pk)
          self.check_object_permissions(request, instance)
          
          serializer = JobPostSerializer(instance, data=request.data)
          
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     def patch(self, request, pk):
          instance = self.get_object(pk)
          self.check_object_permissions(request, instance)
          
          serializer = JobPostSerializer(instance, data=request.data, partial=True)
          
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     def delete(self, request, pk):
          instance = self.get_object(pk)
          self.check_object_permissions(request, instance)
          
          instance.delete()
          
          return Response(status=status.HTTP_204_NO_CONTENT)

class NewestJobPostAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]

     def get(self, request):
          job_posts = JobPost.objects.filter(is_accepting_applications=True)\
               .order_by('-created_at')[:20]\
               .select_related('role', 'experience_level', 'posted_by')
          
          serializer = JobPostListSerializer(job_posts, many=True)
          
          return Response(serializer.data, status=status.HTTP_200_OK)

class MatchedJobPostAPIView(ListAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     serializer_class = JobPostListSerializer
     filter_backends = [DjangoFilterBackend]
     filterset_class = JobPostFilter
     
     def get_queryset(self):
          jobseeker = JobSeeker.objects.prefetch_related(
               'occupations__skills', 'occupations__specialization'
          ).get(user=self.request.user.jobseeker)

          occupation = jobseeker.occupations.first()
            
          if not occupation:
               raise NotFound("No occupation found for the user. Cannot find matched jobs.")

          skill_ids = occupation.skills.values_list('id', flat=True)
          specialization_id = occupation.specialization_id

          # Q object for filtering by user profile match (skills OR specialization)
          user_match_q = Q(skills__id__in=skill_ids) | Q(specialization_id=specialization_id)

          # Filter 1: Must be accepting applications
          queryset = JobPost.objects.filter(is_accepting_applications=True)

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

class JobSearchAPIView(ListAPIView):
     """
     General endpoint for searching and filtering JobPost objects.
     """
     serializer_class = JobPostListSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
     filterset_class = JobPostFilter

     # Fields for searching (eg. ?search=keyword)
     search_fields = [
          'title',
          'description',
          'location',
          # 'specialization__name',
          # 'role__name',
          # 'skills__name',
     ]

     # Fields for ordering
     ordering_fields = [
          'created_at',
          'salary_min',
          'salary_max',
          'experience_years',
          'last_application_date',
     ]

     # Set default ordering
     ordering = ['-created_at']

     def get_queryset(self):
          """
          Returns the base queryset of active JobPost objects with valid application dates.
          The filter backends will then apply additional search, filter, and ordering.
          """
          queryset = JobPost.objects.filter(is_accepting_applications=True)

          # Apply the default date filter
          today = date.today()
          date_filter_q = Q(last_application_date__gte=today) | Q(last_application_date__isnull=True)
          queryset = queryset.filter(date_filter_q)

          queryset = queryset.distinct()

          # select_related and prefetch_related for optimization
          queryset = queryset.select_related(
               'role', 'experience_level', 'posted_by'
          )

          return queryset

class JobPostMetricViewAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get(self, request, pk):
          metric = get_object_or_404(JobPostMetric, job_post_id=pk)
          serializer = JobPostMetricSerializer(metric)
          
          return Response(serializer.data, status=status.HTTP_200_OK)

class IncrementJobPostViewCountAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def post(self, request, pk):
          metric, created = JobPostMetric.objects.get_or_create(job_post_id=pk)
          
          metric.view_count += 1
          metric.save()
          
          return Response({'view_count': metric.view_count}, status=status.HTTP_200_OK)

# endregion Job Post Views


# region Job Application Views

class JobApplicationCreateView(CreateAPIView):
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

class JobSeekerApplicationListView(ListAPIView):
     """
     API endpoint for a Job Seeker to list their own applications.
     URL: /api/my-applications/ (GET)
     """
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get_queryset(self):
          job_seeker = get_object_or_404(JobSeeker, user=self.request.user)
          return JobApplication.objects.filter(job_seeker=job_seeker)

class JobSeekerApplicationDetailView(RetrieveDestroyAPIView):
     """
     API endpoint for a Job Seeker to view or withdraw a specific application.
     URL: /api/my-applications/{id}/ (GET, DELETE)
     """
     queryset = JobApplication.objects.all()
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission, IsOwnerOfApplication]

class CompanyJobListView(ListAPIView):
     """
     API endpoint for Admin/Superadmin to list all job posts for their company.
     URL: /api/v1/company-job-posts/ (GET)
     """
     serializer_class = JobPostSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission, IsCompanyAdminOrSuperadminForApplication]

     def get_queryset(self):
          # Filter job posts by admin/superadmin
          return JobPost.objects.filter(posted_by=self.request.user)

class CompanyJobApplicationsListView(ListAPIView):
     """
     API endpoint for Admin/Superadmin to list applications for a specific job post in their company.
     URL: /api/v1/company-job-posts/{id}/applications (GET)
     """
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission]

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

class CompanyApplicationDetailView(RetrieveUpdateDestroyAPIView):
     """
     API endpoint for Admin/Superadmin to view, update, or delete a specific application.
     URL: /api/applications/{id}/ (GET, PATCH, PUT, DELETE)
     """
     queryset = JobApplication.objects.all()
     serializer_class = JobApplicationSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminOrSuperAdminPermission, IsCompanyAdminOrSuperadminForApplication]

     def get_serializer_class(self):
          if self.request.method in ['PATCH', 'PUT']:
               return JobApplicationStatusUpdateSerializer
          return self.serializer_class

     def perform_update(self, serializer):
          serializer.save()

     def perform_destroy(self, instance):
          instance.delete()

# endregion Job Application Views


# region Bookmarked Job Views

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
               return Response(
                    {"detail": "Job already bookmarked."},
                    status=status.HTTP_400_BAD_REQUEST
               )

          bookmarked_job = BookmarkedJob.objects.create(job_post=job_post, job_seeker=job_seeker)
          serializer = BookmarkedJobSerializer(bookmarked_job)
          return Response(serializer.data, status=status.HTTP_201_CREATED)

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

          return Response(status=status.HTTP_204_NO_CONTENT)

class JobSeekerBookmarkedJobListView(ListAPIView):
     """
     API endpoint for a Job Seeker to list their bookmarked jobs.
     URL: /api/my-bookmarks/ (GET)
     """
     serializer_class = BookmarkedJobSerializer
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get_queryset(self):
          job_seeker = get_object_or_404(JobSeeker, user=self.request.user)
          return BookmarkedJob.objects.filter(job_seeker=job_seeker)

class IsBookmarkedView(APIView):
     """
     API endpoint for a Job Seeker to check if a specific job post is bookmarked.
     URL: /api/my-bookmarks/{bookmark_id}/is_bookmarked/ (GET)
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]

     def get(self, request, bookmark_id):
          job_seeker = get_object_or_404(JobSeeker, user=request.user)

          is_bookmarked = BookmarkedJob.objects.filter(id=bookmark_id, job_seeker=job_seeker).exists()

          return Response({"is_bookmarked": is_bookmarked}, status=status.HTTP_200_OK)

# endregion Bookmarked Job Views