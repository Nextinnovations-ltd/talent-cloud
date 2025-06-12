from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserDynamicPermission, IsJobSeekerAndOwnerPermission
from utils.response import CustomResponse

class BaseModelViewSet(ModelViewSet):
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsJobSeekerAndOwnerPermission]

     def get_jobseeker_user(self, request):
          """Helper method to fetch the jobseeker associated with the current user."""
          return request.user.jobseeker

     def list(self, request, *args, **kwargs):
          """Override the list method to filter by jobseeker."""
          jobseeker_user = self.get_jobseeker_user(request)
          
          queryset = self.get_queryset().filter(user=jobseeker_user)

          serializer = self.get_serializer(queryset, many=True)

          return Response(CustomResponse.success("Successfully fetch all item list", serializer.data), status=status.HTTP_200_OK)

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
          
class MinimalBaseViewSet(ModelViewSet):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]
     
     def list(self, request, *args, **kwargs):
          """Override the list method to filter by jobseeker."""
          
          queryset = self.filter_queryset(self.get_queryset())
          
          serializer = self.get_serializer(queryset, many=True)
          
          return Response(CustomResponse.success("Successfully fetch all item list", serializer.data), status=status.HTTP_200_OK)

     def perform_create(self, serializer):
          serializer.save()

     def create(self, request, *args, **kwargs):
          serializer = self.get_serializer(data=request.data)
          
          serializer.is_valid(raise_exception=True)
          
          self.perform_create(serializer)
          
          return Response(CustomResponse.success("Successfully created", serializer.data), status=status.HTTP_200_OK)

     def update(self, request, *args, **kwargs):
          kwargs['partial'] = True
          response = super().update(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully updated", response.data),
               status=status.HTTP_200_OK
          )
     
     def destroy(self, request, *args, **kwargs):
          super().destroy(request, *args, **kwargs)

          return Response(
               CustomResponse.success("Successfully deleted."),
               status=status.HTTP_200_OK
          )