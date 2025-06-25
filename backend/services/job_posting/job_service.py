from apps.job_posting.serializers import JobPostSerializer, JobPostDetailSerializer
from apps.job_posting.models import JobPost, JobPostView
from apps.job_seekers.models import JobSeeker
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

class JobService():
     @staticmethod
     def create_job(data, user):
          serializer = JobPostSerializer(data=data)
          serializer.is_valid(raise_exception=True)
          job_post = serializer.save(posted_by=user)
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
     def update_job_post(job_post_instance, data, partial=False):
          serializer = JobPostSerializer(job_post_instance, data=data, partial=partial)
          serializer.is_valid(raise_exception=True) # This will raise ValidationError if invalid
          serializer.save()
          return serializer

     @staticmethod
     def delete_job_post(job_post_instance):
          job_post_instance.delete()