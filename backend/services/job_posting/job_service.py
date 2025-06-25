from apps.job_posting.serializers import JobPostSerializer

class JobService():
     @staticmethod
     def create_job(data, user):
          serializer = JobPostSerializer(data=data)
          serializer.is_valid(raise_exception=True)
          job_post = serializer.save(posted_by=user)
          return job_post, serializer