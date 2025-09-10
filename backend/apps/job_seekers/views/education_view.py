from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from utils.response import CustomResponse
from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsJobSeekerAndOwnerPermission
from ..serializers.education_serializer import EducationSerializer
from ..models import JobSeekerEducation

@extend_schema(tags=["Job Seeker"])
class EducationViewSet(ModelViewSet):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsJobSeekerAndOwnerPermission]
     serializer_class = EducationSerializer
     queryset = JobSeekerEducation.objects.all()
     
     def get_jobseeker_user(self, request):
          """Helper method to fetch the jobseeker associated with the current user."""
          return request.user.jobseeker

     def list(self, request, *args, **kwargs):
          """Job Seeker related education list"""
          jobseeker_user = self.get_jobseeker_user(request)
          
          queryset = self.get_queryset().filter(user=jobseeker_user)

          serializer = self.get_serializer(queryset, many=True)

          return Response(CustomResponse.success("Successfully fetch all education list", serializer.data), status=status.HTTP_200_OK)

     def perform_create(self, serializer):
          """Ensure the created object is associated with the current jobseeker."""
          jobseeker_user = self.get_jobseeker_user(self.request)
          
          serializer.save(user=jobseeker_user)

     def create(self, request, *args, **kwargs):
          serializer = self.get_serializer(data=request.data)
          
          serializer.is_valid(raise_exception=True)
          
          self.perform_create(serializer)
          
          return Response(CustomResponse.success("Successfully created", serializer.data), status=status.HTTP_200_OK)

     def update(self, request, *args, **kwargs):
          kwargs['partial'] = True
          response = super().update(request, *args, **kwargs)
          
          return Response(
               CustomResponse.success("Successfully updated.", response.data),
               status=status.HTTP_200_OK
          )
     
     def destroy(self, request, *args, **kwargs):
          super().destroy(request, *args, **kwargs)

          return Response(
               CustomResponse.success("Successfully deleted."),
               status=status.HTTP_200_OK
          )