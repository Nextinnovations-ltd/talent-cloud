from rest_framework.views import APIView
from utils.response import CustomResponse

class CustomBaseAPIView(APIView):
     def finalize_response(self, request, response, *args, **kwargs):
          response = super().finalize_response(request, response, *args, **kwargs)

          if not isinstance(response.data, dict):
               return response

          if "success" in response.data:
               return response

          if 200 <= response.status_code < 300:
               response.data = CustomResponse.success(message="Success", data=response.data)
          else:
               response.data = CustomResponse.error(message="Request failed", errors=response.data)

          return response
