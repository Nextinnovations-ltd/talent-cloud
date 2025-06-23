from django.shortcuts import redirect
from django.db import transaction
from rest_framework import status
from rest_framework import views, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES
from services.auth.auth_service import AuthenticationService
from services.auth.token_service import TokenService
from services.auth.user_info_service import UserInfoService
from services.user.email_service import AuthEmailService
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer, ForgetPasswordSerializer, ResetPasswordSerializer, VerifyRegistrationSerializer
from services.auth.oauth_service import FacebookOAuthService, GoogleOAuthService, LinkedinOAuthService
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserDynamicPermission
from utils.response import CustomResponse
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Authentication-Company Admin"])
class CompanyAdminLoginAPIView(views.APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        
        if not email and not password:
            raise ValidationError("Invalid email or password!")
        
        with transaction.atomic():
            user = AuthenticationService.is_authenticated(email, password, ROLES.ADMIN)
            
            # AuthEmailService.verify_user_loggedin(email)
            
            result = AuthenticationService.generate_login_success_response(user)
        
        response = Response(status=status.HTTP_200_OK)
        
        response.set_cookie(key='refresh_token', value=result['refresh_token'], httponly=True)
        response.data = CustomResponse.success("User is authenticated.", {
            'token': result['access_token'],
            'is_generated_username': result['is_generated_username']
        })
        
        return response

@extend_schema(tags=["Authentication-Company Admin"])
class CompanyAdminRegisterAPIView(views.APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        company_slug = data.get('company_slug', None)
        role = ROLES.ADMIN
        
        if not company_slug:
            raise ValidationError("Company Admin user can't be created without company referal")
        
        if TalentCloudUser.objects.filter(email=email).exists():
            raise ValidationError("Talent cloud user with this email already exists.")
        
        # Create super admin user and response verify token 
        token = AuthenticationService.register_company_admin_user(email, password, role, company_slug)
        
        return Response(CustomResponse.success('Company admin user has been created successfully.', { 'token': token }), status=status.HTTP_201_CREATED)


@extend_schema(tags=["Authentication-Superadmin"])
class SuperAdminLoginAPIView(views.APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        
        if not email and not password:
            raise ValidationError("Invalid email or password!")
        
        with transaction.atomic():
            user = AuthenticationService.is_authenticated(email, password, ROLES.SUPERADMIN)
            
            AuthEmailService.verify_user_loggedin(email)
            
            result = AuthenticationService.generate_login_success_response(user)
        
        response = Response(status=status.HTTP_200_OK)
        
        response.set_cookie(key='refresh_token', value=result['refresh_token'], httponly=True)
        response.data = CustomResponse.success("User is authenticated.", {
            'token': result['access_token'],
            'is_generated_username': result['is_generated_username']
        })
        
        return response

@extend_schema(tags=["Authentication-Superadmin"])
class SuperAdminRegisterAPIView(views.APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        role = ROLES.SUPERADMIN
        
        if TalentCloudUser.objects.filter(email=email).exists():
            raise ValidationError("Talent cloud user with this email already exists.")
        
        # Create super admin user and response verify token 
        token = AuthenticationService.register_user_with_role(email, password, role)
        
        return Response(CustomResponse.success('Super admin user has been created successfully.', { 'token': token }), status=status.HTTP_201_CREATED)

@extend_schema(tags=["Authentication-Superadmin"])
class SuperAdminVerifyLoginAPIView(views.APIView):
    def post(self, request):
        token = request.data.get('token')
        verification_code = request.data.get('verification_code')
        
        if not token or not verification_code:
            return Response(CustomResponse.error('Token and verification code are required.'), status=status.HTTP_400_BAD_REQUEST)
        
        AuthenticationService.verify_logged_in_user(token, verification_code)
        
        return Response(CustomResponse.success('User login has been approved.'), status=status.HTTP_200_OK)

@extend_schema(tags=["Authentication-Job Seeker"])
class AuthenticationViewSet(viewsets.ModelViewSet):
    queryset = TalentCloudUser.objects.all()

    def get_serializer_class(self):
        if self.action == 'login':
            return LoginSerializer
        elif self.action == 'register':
            return RegisterSerializer
        elif self.action == 'forget_password':
            return ForgetPasswordSerializer
        elif self.action == 'reset_password':
            return ResetPasswordSerializer
        elif self.action == 'verify_registration':
            return VerifyRegistrationSerializer
        return UserSerializer

    def get_queryset(self):
        # Denied retrieving all users
        if self.action == 'list':
            return TalentCloudUser.objects.none()
        return super().get_queryset()

    # Denied for creating user directly from UserSerializer
    def create(self, request):
        return Response(CustomResponse.error('Method not allowed.', None))

    #Login for the verified user
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        
        if not email and not password:
            raise ValidationError("Invalid email or password!")
        
        user = AuthenticationService.is_authenticated(email, password)
        
        result = AuthenticationService.generate_login_success_response(user)

        response = Response(status=status.HTTP_200_OK)
        
        response.set_cookie(key='refresh_token', value=result['refresh_token'], httponly=True)
        response.data = CustomResponse.success("User is authenticated.", {
            'token': result['access_token'],
            'is_generated_username': result['is_generated_username']
        })
        
        return response
        
    #Register user
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        role = ROLES.USER
        
        if TalentCloudUser.objects.filter(email=email).exists():
            raise ValidationError("Talent cloud user with this email already exists.")
        
        # Create super admin user and response verify token 
        token = AuthenticationService.register_user_with_role(email, password, role)
        
        return Response(CustomResponse.success('Job Seeker user has been created successfully.', { 'token': token }), status=status.HTTP_201_CREATED)
        
    #Verify registered user
    @action(detail=False, methods=['post'], url_path='verify-registration')
    def verify_registration(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(CustomResponse.success('User has been verified successfully.', None), status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='resend-activation')
    def resend_activation(self, request):
        """ Resend verification code to user when expired
        """
        token = request.data.get('token', None)
        
        if not token:
            return Response(CustomResponse.error('No token is found.'), status=status.HTTP_400_BAD_REQUEST)
        
        message = AuthenticationService.resend_activation_token(token)
        
        return Response(CustomResponse.success(message), status=status.HTTP_200_OK)

    #Request the code when the user forget the password
    @action(detail=False, methods=['post'], url_path='forget-password')
    def forget_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(CustomResponse.success('Password reset link has been sent to your email.'), status=status.HTTP_200_OK)

    #Reset the password using the generated reset code
    @action(detail=False, methods=['post'], url_path='reset-password')
    def reset_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(CustomResponse.success('Password has been reset successfully.'), status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='check-token-validity')
    def check_token_validity(self, request):
        """Check token validity for reset and registration action.
        """
        token = request.data.get('token', None)
        action = request.data.get('action', 'registration') # action can be "registration" or "reset"
        
        if not token:
            return Response(CustomResponse.error('No token is found.'), status=status.HTTP_400_BAD_REQUEST)
        
        AuthenticationService.check_token_validity(token, action)
        
        return Response(CustomResponse.success("Token is valid."), status=status.HTTP_200_OK)

@extend_schema(tags=["OAuth-Job Seeker"])
class GoogleAuthAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        auth_code = request.query_params.get("code")

        if not auth_code:
            return Response({"error": "Authorization code missing"}, status=400)

        redirect_url = GoogleOAuthService.process_google_oauth(auth_code)
        
        return redirect(redirect_url)

@extend_schema(tags=["OAuth-Job Seeker"])
class LinkedinAuthAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        data = request.query_params
        auth_code = data.get("code")

        if not auth_code:
            return Response({"error": "Authorization code missing"}, status=400)

        # Exchange code with access token and decode the token for user information
        redirect_url = LinkedinOAuthService.process_linkedin_oauth(auth_code)
        
        return redirect(redirect_url)

@extend_schema(tags=["OAuth-Job Seeker"])
class FacebookAuthAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        data = request.query_params
        
        auth_code = data.get("code")

        if not auth_code:
            return Response({"error": "Authorization code missing"}, status=400)

        # Exchange auth code for access token and user info
        redirect_url = FacebookOAuthService.process_facebook_oauth(auth_code)
        
        return redirect(redirect_url)

@extend_schema(tags=["Authentication-Job Seeker"])
class UserInfoAPIView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudUserDynamicPermission]

    def get(self, request):
        response_data = UserInfoService.get_user_profile_info(request.user)
        
        return Response(CustomResponse.success("Username Information retrieved.", response_data), status=status.HTTP_200_OK)

@extend_schema(tags=["Authentication-Job Seeker"])
class VerifyTokenAPIView(views.APIView):
    def post(self, request):
        token = request.data.get('token', None)

        if not token:
            return Response(CustomResponse.error("Token is required."), status=status.HTTP_400_BAD_REQUEST)

        # Call the service to authenticate the token
        user = TokenService.authenticate_token(token)
        
        return Response(CustomResponse.success("Access token is valid."), status=status.HTTP_200_OK)

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

@extend_schema(tags=["Authentication-Job Seeker"])    
class RefreshTokenAPIView(views.APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')    
        
        if not refresh_token:
            raise ValidationError("Refresh token not found in cookies.")

        token = TokenService.refresh_access_token(refresh_token)
        response = Response(status=status.HTTP_200_OK)
        
        response.data = CustomResponse.success(
            "Access token regenerated.",
            {
                'token': token
            })
        
        return response