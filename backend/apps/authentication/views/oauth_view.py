from django.shortcuts import redirect
from rest_framework import status
from rest_framework import views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from core.constants.constants import OAUTH_PROVIDERS
from services.auth.token_service import TokenService
from services.auth.oauth_service import FacebookOAuthService, GithubOAuthService, GoogleOAuthService, LinkedinOAuthService
from utils.response import CustomResponse
from utils.oauth.validation import OAuthValidator
from utils.oauth.rate_limiting import oauth_rate_limited
from utils.oauth.csrf_protection import OAuthStateManager
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger(__name__)

@extend_schema(tags=["OAuth-Job Seeker"])
class GoogleAuthAPIView(views.APIView):
     # CSRF protection decorator
     oauth_provider = OAUTH_PROVIDERS.GOOGLE
     
     @oauth_rate_limited
     def get(self, request, *args, **kwargs):
          try:
               # Get and validate input parameters
               raw_auth_code = request.query_params.get("code")
               raw_state = request.query_params.get("state")
               
               if not raw_auth_code:
                    return Response(
                         CustomResponse.error("Authorization code is required"), 
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate authorization code format
               auth_code = OAuthValidator.validate_auth_code(raw_auth_code, OAUTH_PROVIDERS.GOOGLE)
               
               # Get client information for logging and state validation
               ip_address = OAuthValidator.sanitize_ip_address(request.META.get('REMOTE_ADDR', ''))
               user_agent = OAuthValidator.sanitize_user_agent(request.META.get('HTTP_USER_AGENT', ''))
               logger.info(f"Google OAuth attempt from IP: {ip_address}, User-Agent: {user_agent[:100]}")
               
               # Validate state parameter for CSRF protection
               if raw_state:
                    try:
                         # Validate state format first
                         state = OAuthValidator.validate_state_parameter(raw_state)
                         # Then validate and consume state for CSRF protection
                         OAuthStateManager.validate_and_consume_state(
                         state, OAUTH_PROVIDERS.GOOGLE,
                         request.META.get('REMOTE_ADDR', ''), 
                         request.META.get('HTTP_USER_AGENT', '')
                         )
                         logger.info(f"Google OAuth state validation successful from IP: {ip_address}")
                    except ValidationError as e:
                         logger.warning(f"Google OAuth CSRF protection failed: {str(e)} from IP: {ip_address}")
                         return Response(
                         CustomResponse.error(f"CSRF protection failed.", {str(e)}), 
                         status=status.HTTP_400_BAD_REQUEST
                         )
               else:
                    # Log missing state parameter but don't fail (for backward compatibility)
                    logger.warning(f"Google OAuth missing state parameter from IP: {ip_address}")

               redirect_url = GoogleOAuthService.process_google_oauth(auth_code)
               
               return redirect(redirect_url)
               
          except ValidationError as e:
               logger.warning(f"Google OAuth validation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error(str(e)), 
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Google OAuth authentication failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error("Google authentication service temporarily unavailable"), 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )
               
@extend_schema(tags=["OAuth-Job Seeker"])
class GithubAuthAPIView(views.APIView):
     # CSRF protection decorator
     oauth_provider = OAUTH_PROVIDERS.GITHUB
     
     @oauth_rate_limited
     def get(self, request, *args, **kwargs):
          try:
               # Get and validate input parameters
               raw_auth_code = request.query_params.get("code")
               raw_state = request.query_params.get("state")
               
               if not raw_auth_code:
                    return Response(
                         CustomResponse.error("Authorization code is required"), 
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate authorization code format
               auth_code = OAuthValidator.validate_auth_code(raw_auth_code, OAUTH_PROVIDERS.GITHUB)
               
               # Get client information for logging and state validation
               ip_address = OAuthValidator.sanitize_ip_address(request.META.get('REMOTE_ADDR', ''))
               user_agent = OAuthValidator.sanitize_user_agent(request.META.get('HTTP_USER_AGENT', ''))
               logger.info(f"Github OAuth attempt from IP: {ip_address}, User-Agent: {user_agent[:100]}")
               
               # Validate state parameter for CSRF protection
               if raw_state:
                    try:
                         # Validate state format first
                         state = OAuthValidator.validate_state_parameter(raw_state)
                         # Then validate and consume state for CSRF protection
                         OAuthStateManager.validate_and_consume_state(
                         state, OAUTH_PROVIDERS.GITHUB, 
                         request.META.get('REMOTE_ADDR', ''), 
                         request.META.get('HTTP_USER_AGENT', '')
                         )
                         logger.info(f"Github OAuth state validation successful from IP: {ip_address}")
                    except ValidationError as e:
                         logger.warning(f"Github OAuth CSRF protection failed: {str(e)} from IP: {ip_address}")
                         return Response(
                         CustomResponse.error(f"CSRF protection failed.", {str(e)}), 
                         status=status.HTTP_400_BAD_REQUEST
                         )
               else:
                    # Log missing state parameter but don't fail (for backward compatibility)
                    logger.warning(f"Github OAuth missing state parameter from IP: {ip_address}")

               redirect_url = GithubOAuthService.process_github_oauth(auth_code)
               
               return redirect(redirect_url)
               
          except ValidationError as e:
               logger.warning(f"Github OAuth validation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error(str(e)), 
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Github OAuth authentication failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error("Github authentication service temporarily unavailable"), 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["OAuth-Job Seeker"])
class LinkedinAuthAPIView(views.APIView):
     oauth_provider = OAUTH_PROVIDERS.LINKEDIN  # For CSRF protection decorator
     
     @oauth_rate_limited
     def get(self, request, *args, **kwargs):
          try:
               # Get and validate input parameters
               raw_auth_code = request.query_params.get("code")
               raw_state = request.query_params.get("state")

               if not raw_auth_code:
                    return Response(
                         CustomResponse.error("Authorization code is required"), 
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate authorization code format
               auth_code = OAuthValidator.validate_auth_code(raw_auth_code, OAUTH_PROVIDERS.LINKEDIN)
               
               # Get client information for logging and state validation
               ip_address = OAuthValidator.sanitize_ip_address(request.META.get('REMOTE_ADDR', ''))
               user_agent = OAuthValidator.sanitize_user_agent(request.META.get('HTTP_USER_AGENT', ''))
               logger.info(f"LinkedIn OAuth attempt from IP: {ip_address}, User-Agent: {user_agent[:100]}")
               
               # Validate state parameter for CSRF protection
               if raw_state:
                    try:
                         # Validate state format first
                         state = OAuthValidator.validate_state_parameter(raw_state)
                         # Then validate and consume state for CSRF protection
                         OAuthStateManager.validate_and_consume_state(
                         state, OAUTH_PROVIDERS.LINKEDIN,
                         request.META.get('REMOTE_ADDR', ''), 
                         request.META.get('HTTP_USER_AGENT', '')
                         )
                         logger.info(f"LinkedIn OAuth state validation successful from IP: {ip_address}")
                    except ValidationError as e:
                         logger.warning(f"LinkedIn OAuth CSRF protection failed: {str(e)} from IP: {ip_address}")
                         return Response(
                         CustomResponse.error(f"CSRF protection failed: {str(e)}"), 
                         status=status.HTTP_400_BAD_REQUEST
                         )
               else:
                    # Log missing state parameter but don't fail (for backward compatibility)
                    logger.warning(f"LinkedIn OAuth missing state parameter from IP: {ip_address}")

               # Exchange code with access token and decode the token for user information
               redirect_url = LinkedinOAuthService.process_linkedin_oauth(auth_code)
               
               return redirect(redirect_url)
               
          except ValidationError as e:
               logger.warning(f"LinkedIn OAuth validation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error(str(e)), 
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"LinkedIn OAuth authentication failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error("LinkedIn authentication service temporarily unavailable"), 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["OAuth-Job Seeker"])
class FacebookAuthAPIView(views.APIView):
     oauth_provider = 'facebook'  # For CSRF protection decorator
    
     @oauth_rate_limited
     def get(self, request, *args, **kwargs):
          try:
               # Get and validate input parameters
               raw_auth_code = request.query_params.get("code")
               raw_state = request.query_params.get("state")

               if not raw_auth_code:
                    return Response(
                         CustomResponse.error("Authorization code is required"), 
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate authorization code format
               auth_code = OAuthValidator.validate_auth_code(raw_auth_code, 'facebook')
               
               # Get client information for logging and state validation
               ip_address = OAuthValidator.sanitize_ip_address(request.META.get('REMOTE_ADDR', ''))
               user_agent = OAuthValidator.sanitize_user_agent(request.META.get('HTTP_USER_AGENT', ''))
               logger.info(f"Facebook OAuth attempt from IP: {ip_address}, User-Agent: {user_agent[:100]}")
               
               # Validate state parameter for CSRF protection
               if raw_state:
                    try:
                         # Validate state format first
                         state = OAuthValidator.validate_state_parameter(raw_state)
                         # Then validate and consume state for CSRF protection
                         OAuthStateManager.validate_and_consume_state(
                         state, 'facebook', 
                         request.META.get('REMOTE_ADDR', ''), 
                         request.META.get('HTTP_USER_AGENT', '')
                         )
                         logger.info(f"Facebook OAuth state validation successful from IP: {ip_address}")
                    except ValidationError as e:
                         logger.warning(f"Facebook OAuth CSRF protection failed: {str(e)} from IP: {ip_address}")
                         return Response(
                         CustomResponse.error(f"CSRF protection failed: {str(e)}"), 
                         status=status.HTTP_400_BAD_REQUEST
                         )
               else:
                    # Log missing state parameter but don't fail (for backward compatibility)
                    logger.warning(f"Facebook OAuth missing state parameter from IP: {ip_address}")

               # Exchange auth code for access token and user info
               redirect_url = FacebookOAuthService.process_facebook_oauth(auth_code)
               
               return redirect(redirect_url)
               
          except ValidationError as e:
               logger.warning(f"Facebook OAuth validation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error(str(e)), 
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Facebook OAuth authentication failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error("Facebook authentication service temporarily unavailable"), 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )


@extend_schema(tags=["OAuth-Job Seeker"])
class OAuthVerifyTokenAPIView(views.APIView):
     def post(self, request, *args, **kwargs):
          token = request.data.get('token', None)
          
          if not token:
               raise ValidationError("Token cannot be empty.")

          user_role, onboarding_step, is_generated_username, refresh_token = TokenService.verify_token_and_generate_refresh_token(token)
          
          response = Response(status=status.HTTP_200_OK)
          response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
          
          response.data = CustomResponse.success("User is authenticated.", {
               'token': token,
               'role': user_role,
               'onboarding_step': onboarding_step,
               'is_generated_username': is_generated_username
          })
          
          return response

@extend_schema(tags=["OAuth-Job Seeker"])
class OAuthStateGenerationAPIView(views.APIView):
     """
     Endpoint for generating OAuth state parameters for CSRF protection
     Frontend should call this before redirecting to OAuth provider
     """
     
     @oauth_rate_limited
     def post(self, request, *args, **kwargs):
          try:
               # Get and validate provider
               provider = request.data.get('provider')
               
               if not provider:
                    return Response(
                         CustomResponse.error("Provider is required"), 
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate provider name
               validated_provider = OAuthValidator.validate_provider_name(provider)
               
               # Get client information
               ip_address = request.META.get('REMOTE_ADDR', '')
               user_agent = request.META.get('HTTP_USER_AGENT', '')
               
               # Sanitize for logging
               sanitized_ip = OAuthValidator.sanitize_ip_address(ip_address)
               sanitized_user_agent = OAuthValidator.sanitize_user_agent(user_agent)
               
               logger.info(f"OAuth state generation request for {validated_provider} from IP: {sanitized_ip}")
               
               # Generate state parameter
               state = OAuthStateManager.generate_state(validated_provider, ip_address, user_agent)
               
               return Response(
                    CustomResponse.success("OAuth state generated successfully", {
                         'state': state,
                         'provider': validated_provider,
                         'expires_in': OAuthStateManager.STATE_EXPIRY_SECONDS
                    }), 
                    status=status.HTTP_200_OK
               )
               
          except ValidationError as e:
               logger.warning(f"OAuth state generation validation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error(str(e)), 
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"OAuth state generation failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
               return Response(
                    CustomResponse.error("State generation service temporarily unavailable"), 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )