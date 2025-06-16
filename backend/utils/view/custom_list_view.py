from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from utils.response import CustomResponse

class CustomListAPIView(ListAPIView):
     success_message = "Fetched successfully"

     def list(self, request, *args, **kwargs):
          response = super().list(request, *args, **kwargs)
          
          return Response(
               CustomResponse.success(
                    message=self.success_message,
                    data=response.data
               ),
               status=status.HTTP_200_OK
          )
