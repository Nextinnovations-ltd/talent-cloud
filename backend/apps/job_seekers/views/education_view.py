from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from apps.job_seekers.mixins.custom_response_mixins import CustomResponseMixin
from utils.response import CustomResponse
from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsJobSeekerAndOwnerPermission, TalentCloudUserPermission
from ..serializers.education_serializer import EducationSerializer, UniversitySerializer
from ..models import JobSeekerEducation, University

@extend_schema(tags=["Import Data"])
class UniversityAPIView(APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          universities = University.objects.all()
          serializer = UniversitySerializer(universities, many=True)

          return Response(CustomResponse.success("Successfully fetched university list.", serializer.data), status=status.HTTP_200_OK)

@extend_schema(tags=["Job Seeker"])
class EducationListCreateAPIView(CustomResponseMixin, ListCreateAPIView):
     """
     Handles GET (list) and POST (create) for Job Seeker Education.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsJobSeekerAndOwnerPermission]
     serializer_class = EducationSerializer
     pagination_class = None

     def get_jobseeker_from_request(self):
          """Helper method to fetch the jobseeker"""
          if hasattr(self.request.user, 'jobseeker'):
               return self.request.user.jobseeker
          return None

     def get_queryset(self):
          """
          This view should only return objects for the currently
          authenticated jobseeker.
          """
          jobseeker_user = self.get_jobseeker_from_request()
          if not jobseeker_user:
               return JobSeekerEducation.objects.none()
          return JobSeekerEducation.objects.filter(user=jobseeker_user)

     def perform_create(self, serializer):
          """Ensure the created object is associated with the current jobseeker."""
          jobseeker_user = self.get_jobseeker_from_request()
          serializer.save(user=jobseeker_user)

     def list(self, request, *args, **kwargs):
          response = super(ListCreateAPIView, self).list(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully fetch all education list", response.data),
               status=response.status_code
          )

@extend_schema(tags=["Job Seeker"])
class EducationRetrieveUpdateDestroyAPIView(CustomResponseMixin, RetrieveUpdateDestroyAPIView):
     """
     Handles GET (retrieve), PATCH (update), and DELETE (destroy) 
     for a single Job Seeker Education item.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsJobSeekerAndOwnerPermission]
     serializer_class = EducationSerializer
     pagination_class = None
     
     def get_jobseeker_from_request(self):
          """Helper method to fetch the jobseeker"""
          if hasattr(self.request.user, 'jobseeker'):
               return self.request.user.jobseeker
          return None
     
     def get_queryset(self):
          """
          This view should only allow modification/retrieval of objects
          for the currently authenticated jobseeker.
          """
          jobseeker_user = self.get_jobseeker_from_request()
          if not jobseeker_user:
               return JobSeekerEducation.objects.none()
          return JobSeekerEducation.objects.filter(user=jobseeker_user)