from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    ValidationError, 
    NotFound, 
    PermissionDenied, 
    AuthenticationFailed,
    MethodNotAllowed,
    Throttled,
    APIException
)
from django.core.exceptions import (
    ObjectDoesNotExist, 
    ValidationError as DjangoValidationError,
    PermissionDenied as DjangoPermissionDenied
)
from django.db import IntegrityError, DatabaseError
from django.http import Http404
from utils.response import CustomResponse
import logging
import traceback
from django.conf import settings

# Configure logger
logger = logging.getLogger('exception_handler')

class CustomAPIException(APIException):
    """Custom API Exception with enhanced functionality"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'A custom error occurred'
    default_code = 'custom_error'

    def __init__(self, detail=None, code=None, status_code=None):
        if status_code:
            self.status_code = status_code
        super().__init__(detail=detail or self.default_detail, code=code or self.default_code)

def custom_exception_handler(exc, context):
    """
    Enhanced custom exception handler with standardized error responses
    """
    # Get context information for logging
    request = context.get('request')
    view = context.get('view')
    
    # Create error context for logging
    error_context = _build_error_context(request, view, exc)
    
    # Call DRF's default exception handler first
    response = exception_handler(exc, context)
    
    # Handle DRF exceptions
    if response is not None:
        standardized_response = _handle_drf_exceptions(exc, response, error_context)
        return standardized_response
    
    # Handle Django and custom exceptions
    return _handle_non_drf_exceptions(exc, error_context)

def _build_error_context(request, view, exc):
    """Build context information for error logging"""
    return {
        'view': view.__class__.__name__ if view else 'Unknown',
        'method': request.method if request else 'Unknown',
        'path': request.path if request else 'Unknown', 
        'user_id': getattr(request.user, 'id', None) if request and hasattr(request, 'user') else None,
        'user_email': getattr(request.user, 'email', None) if request and hasattr(request, 'user') else None,
        'is_authenticated': request.user.is_authenticated if request and hasattr(request, 'user') else False,
        'ip_address': _get_client_ip(request) if request else None,
        'user_agent': request.META.get('HTTP_USER_AGENT', '') if request else '',
        'exception_type': exc.__class__.__name__,
        'exception_message': str(exc)
    }

def _get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')

def _handle_drf_exceptions(exc, response, error_context):
    """Handle DRF exceptions with standardized responses"""
    
    # Map exception types to user-friendly messages
    exception_messages = {
        ValidationError: "Validation failed. Please check your input data.",
        NotFound: "The requested resource was not found.",
        PermissionDenied: "You don't have permission to perform this action.",
        AuthenticationFailed: "Authentication failed. Please check your credentials.",
        MethodNotAllowed: "This HTTP method is not allowed for this endpoint.",
        Throttled: "Too many requests. Please try again later.",
    }
    
    # Get appropriate message
    message = exception_messages.get(type(exc), "An error occurred while processing your request.")
    
    # Handle specific cases
    if isinstance(exc, ValidationError):
        _log_validation_error(exc, error_context)
        
        # Check if it's a simple string message (like from your auth service)
        if isinstance(exc.detail, str):
            # Use the custom message directly
            response.data = CustomResponse.error(message=exc.detail)
        elif isinstance(exc.detail, list) and len(exc.detail) == 1 and isinstance(exc.detail[0], str):
            # Single error message in a list
            response.data = CustomResponse.error(message=exc.detail[0])
        else:
            # Complex validation errors with field-specific errors
            response.data = CustomResponse.error(
                message="Validation failed. Please check your input data.",
                errors=_format_validation_errors(response.data)
            )
    elif isinstance(exc, Throttled):
        _log_throttled_request(exc, error_context)
        # Add retry-after information for throttled requests
        retry_after = getattr(exc, 'wait', None)
        error_data = {'retry_after': retry_after} if retry_after else None
        response.data = CustomResponse.error(
            message=f"Too many requests. Please try again in {retry_after} seconds." if retry_after else message,
            data=error_data
        )
    elif isinstance(exc, (NotFound, PermissionDenied)):
        _log_client_error(exc, error_context)
        response.data = CustomResponse.error(message=str(exc.detail))
    elif isinstance(exc, AuthenticationFailed):
        _log_auth_error(exc, error_context)
        response.data = CustomResponse.error(message=str(exc.detail))
    else:
        # Generic DRF exception
        _log_generic_error(exc, error_context, response.status_code)
        response.data = CustomResponse.error(
            message=message,
            errors=response.data if isinstance(response.data, dict) else None
        )
    
    return response

def _handle_non_drf_exceptions(exc, error_context):
    """Handle Django core exceptions and custom exceptions"""
    
    # Django ObjectDoesNotExist
    if isinstance(exc, ObjectDoesNotExist):
        _log_client_error(exc, error_context)
        return Response(
            CustomResponse.error(message="The requested resource was not found."),
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Django ValidationError
    if isinstance(exc, DjangoValidationError):
        _log_validation_error(exc, error_context)
        return Response(
            CustomResponse.error(
                message="Data validation failed.",
                errors=_format_django_validation_errors(exc)
            ),
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Django PermissionDenied
    if isinstance(exc, DjangoPermissionDenied):
        _log_client_error(exc, error_context)
        return Response(
            CustomResponse.error(message="You don't have permission to perform this action."),
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Http404
    if isinstance(exc, Http404):
        _log_client_error(exc, error_context)
        return Response(
            CustomResponse.error(message="The requested page or resource was not found."),
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Database Integrity Error
    if isinstance(exc, IntegrityError):
        _log_database_error(exc, error_context)
        return Response(
            CustomResponse.error(message="A database constraint was violated. Please check your data."),
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # General Database Error
    if isinstance(exc, DatabaseError):
        _log_database_error(exc, error_context)
        return Response(
            CustomResponse.error(message="A database error occurred. Please try again later."),
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Custom API Exception
    if isinstance(exc, CustomAPIException):
        _log_custom_error(exc, error_context)
        return Response(
            CustomResponse.error(message=str(exc.detail)),
            status=exc.status_code
        )
    
    # Unhandled exceptions
    _log_server_error(exc, error_context)
    
    # Don't expose sensitive information in production
    if settings.DEBUG:
        error_message = f"Unhandled error: {str(exc)}"
        error_data = {
            'exception_type': exc.__class__.__name__,
            'traceback': traceback.format_exc().split('\n')
        }
    else:
        error_message = "An unexpected error occurred. Please try again later."
        error_data = None
    
    return Response(
        CustomResponse.error(
            message=error_message,
            data=error_data
        ),
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

def _format_validation_errors(error_data):
    """Format DRF validation errors consistently"""
    if isinstance(error_data, dict):
        return error_data
    elif isinstance(error_data, list):
        return {'non_field_errors': error_data}
    else:
        return {'detail': str(error_data)}

def _format_django_validation_errors(exc):
    """Format Django validation errors"""
    if hasattr(exc, 'error_dict'):
        return exc.error_dict
    elif hasattr(exc, 'error_list'):
        return {'non_field_errors': [str(error) for error in exc.error_list]}
    else:
        return {'detail': str(exc)}

# Logging functions for different error types
def _log_validation_error(exc, context):
    """Log validation errors"""
    logger.warning(f"Validation Error: {exc} | Context: {context}")

def _log_client_error(exc, context):
    """Log client errors (4xx)"""
    logger.warning(f"Client Error: {exc} | Context: {context}")

def _log_auth_error(exc, context):
    """Log authentication errors"""
    logger.warning(f"Authentication Error: {exc} | Context: {context}")

def _log_throttled_request(exc, context):
    """Log throttled requests"""
    logger.warning(f"Throttled Request: {exc} | Context: {context}")

def _log_database_error(exc, context):
    """Log database errors"""
    logger.error(f"Database Error: {exc} | Context: {context}", exc_info=True)

def _log_custom_error(exc, context):
    """Log custom API errors"""
    logger.warning(f"Custom API Error: {exc} | Context: {context}")

def _log_generic_error(exc, context, status_code):
    """Log generic errors based on status code"""
    if status_code >= 500:
        logger.error(f"Server Error: {exc} | Context: {context}", exc_info=True)
    else:
        logger.warning(f"Client Error: {exc} | Context: {context}")

def _log_server_error(exc, context):
    """Log unhandled server errors"""
    logger.error(f"Unhandled Server Error: {exc} | Context: {context}", exc_info=True)
    
    # Optional: Send critical error notifications
    if hasattr(settings, 'SEND_ERROR_NOTIFICATIONS') and settings.SEND_ERROR_NOTIFICATIONS:
        _send_critical_error_notification(exc, context)

def _send_critical_error_notification(exc, context):
    """Send notifications for critical errors (optional)"""
    try:
        from django.core.mail import send_mail
        
        subject = f"[TalentCloud] Critical Error: {exc.__class__.__name__}"
        message = f"""
        Critical error occurred in TalentCloud:
        
        Exception: {exc}
        View: {context.get('view', 'Unknown')}
        Path: {context.get('path', 'Unknown')}
        User: {context.get('user_email', 'Anonymous')}
        IP: {context.get('ip_address', 'Unknown')}
        
        Full context: {context}
        """
        
        if hasattr(settings, 'ADMINS') and settings.ADMINS:
            admin_emails = [admin[1] for admin in settings.ADMINS]
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=admin_emails,
                fail_silently=True
            )
    except Exception as e:
        logger.error(f"Failed to send critical error notification: {e}")