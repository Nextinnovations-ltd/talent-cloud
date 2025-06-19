from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from utils.response import CustomResponse

class CustomListAPIView(ListAPIView):
     success_message = "Fetched successfully"
     use_pagination = True
     
     def list(self, request, *args, **kwargs):
          queryset = self.filter_queryset(self.get_queryset())

          if self.use_pagination and self.paginator is not None:
               page = self.paginate_queryset(queryset)
               if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    paginated_data = self.get_paginated_response(serializer.data).data

                    return Response(
                         CustomResponse.success(
                         message=self.success_message,
                         data=paginated_data
                         ),
                         status=status.HTTP_200_OK
                    )

          #if no pagination
          serializer = self.get_serializer(queryset, many=True)
          
          return Response(
               CustomResponse.success(
                    message=self.success_message,
                    data=serializer.data
               ),
               status=status.HTTP_200_OK
          )

class CustomCreateAPIView(CreateAPIView):
     success_message = "Created successfully"

     def create(self, request, *args, **kwargs):
          serializer = self.get_serializer(data=request.data)

          if not serializer.is_valid():
               return Response(
                    CustomResponse.error(
                         message="Validation failed",
                         errors=serializer.errors
                    ),
                    status=status.HTTP_400_BAD_REQUEST
               )

          self.perform_create(serializer)
          
          return Response(
               CustomResponse.success(
                    message=self.success_message,
                    data=serializer.data
               ),
               status=status.HTTP_201_CREATED
          )

class CustomUpdateAPIView(UpdateAPIView):
     update_message = "Fetched successfully"

     def patch(self, request, *args, **kwargs):
          instance = self.get_object()
          serializer = self.get_serializer(instance, data=request.data, partial=True)
          
          serializer.is_valid(raise_exception=True)
          
          self.perform_update(serializer)

          return Response(
               CustomResponse.success(self.update_message, serializer.data),
               status=status.HTTP_200_OK
          )

class CustomRetrieveDestroyAPIView(RetrieveDestroyAPIView):
     retrieve_message = "Fetched successfully"
     destroy_message = "Deleted successfully"

     def retrieve(self, request, *args, **kwargs):
          instance = self.get_object()
          serializer = self.get_serializer(instance)
          
          return Response(
               CustomResponse.success(self.retrieve_message, serializer.data),
               status=status.HTTP_200_OK
          )

     def destroy(self, request, *args, **kwargs):
          instance = self.get_object()
          
          self.perform_destroy(instance)
          
          return Response(
               CustomResponse.success(self.destroy_message, data=None),
               status=status.HTTP_200_OK
          )

class CustomRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
     retrieve_message = "Fetched successfully"
     update_message = "Updated successfully"
     destroy_message = "Deleted successfully"

     def retrieve(self, request, *args, **kwargs):
          instance = self.get_object()
          serializer = self.get_serializer(instance)
          
          return Response(
               CustomResponse.success(self.retrieve_message, serializer.data),
               status=status.HTTP_200_OK
          )

     def patch(self, request, *args, **kwargs):
          instance = self.get_object()
          serializer = self.get_serializer(instance, data=request.data, partial=True)
          
          if not serializer.is_valid():
               return Response(
                    CustomResponse.error("Validation failed", serializer.errors),
                    status=status.HTTP_400_BAD_REQUEST
               )
          
          self.perform_update(serializer)

          return Response(
               CustomResponse.success(self.update_message, serializer.data),
               status=status.HTTP_200_OK
          )
     
     def put(self, request, *args, **kwargs):
          raise MethodNotAllowed("PUT")

     def destroy(self, request, *args, **kwargs):
          instance = self.get_object()
          
          self.perform_destroy(instance)
          
          return Response(
               CustomResponse.success(self.destroy_message, data=None),
               status=status.HTTP_200_OK
          )
