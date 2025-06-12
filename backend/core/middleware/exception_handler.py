from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from utils.response import CustomResponse
from core.middleware.error_handler import CustomError
from rest_framework.exceptions import APIException
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response

class CustomAPIException(APIException):
    status_code = 400 
    default_detail = 'Something went wrong'
    default_code = 'error'

    def __init__(self, detail=None, code=None, data=None):
        super().__init__(detail=detail or self.default_detail, code=code or self.default_code)

def custom_exception_handler(exc, context):
    # Call the default exception handler first to get the standard error response.
    response = exception_handler(exc, context)
    
    if isinstance(exc, ValidationError):
        # Custom response for ValidationError
        response.data = CustomResponse.error(
            message=CustomError.set(response.data),
            data=response.data
        )

    elif isinstance(exc, ObjectDoesNotExist):
        return Response(
            CustomResponse.error(
                message=str(exc),
                data=None
            ),
            status=404
        )
            
    elif isinstance(exc, CustomAPIException):
        # Custome Exception
        response.data = CustomResponse.error(
            message=str(exc.detail),
            data=None
        )
    
    elif response is not None:
        # Handle other exception types if needed
        response.data = CustomResponse.error(
            message=CustomError.set(response.data),
            data=response.data
        )
    
    return response