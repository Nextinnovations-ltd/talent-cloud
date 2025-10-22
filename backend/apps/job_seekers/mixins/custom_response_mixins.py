from rest_framework.response import Response
from rest_framework import status
from utils.response import CustomResponse

class CustomResponseMixin:
     """
     Applies a custom success response format to generic views.
     """
     
     def create(self, request, *args, **kwargs):
          response = super().create(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully created", response.data),
               status=response.status_code, 
               headers=response.headers
          )

     def list(self, request, *args, **kwargs):
          response = super().list(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully fetched list", response.data),
               status=response.status_code
          )

     def retrieve(self, request, *args, **kwargs):
          response = super().retrieve(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully fetched item", response.data),
               status=response.status_code
          )

     def update(self, request, *args, **kwargs):
          kwargs['partial'] = True
          response = super().update(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully updated", response.data),
               status=response.status_code
          )

     def destroy(self, request, *args, **kwargs):
          super().destroy(request, *args, **kwargs)
          return Response(
               CustomResponse.success("Successfully deleted"),
               status=status.HTTP_200_OK 
          )