from rest_framework import status
from rest_framework.response import Response
from apps.job_posting.serializers import JobPostSerializer
from utils.response import CustomResponse

class JobService():
     @staticmethod
     def create_job(data, user):
          serializer = JobPostSerializer(data=data)
          
          serializer.is_valid(raise_exception=True)
          
          job_post = serializer.save(posted_by=user)
          
          return job_post, serializer
          # return Response(CustomResponse.success("Successfully created the job post.", serializer.data), status=status.HTTP_201_CREATED)
          
          # return Response(CustomResponse.error("Error creating the job post."), status=status.HTTP_400_BAD_REQUEST)