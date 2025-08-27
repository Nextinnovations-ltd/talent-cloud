from django.urls import path
from rest_framework.routers import SimpleRouter
from apps.authentication.views.invitation_view import (
    SendNIAdminInvitationAPIView,
    SendCompanyAdminInvitationAPIView,
    ValidateInvitationTokenAPIView,
    RegisterAdminUserAPIView,
    MyInvitationsAPIView,
    RevokeInvitationAPIView,
    InvitationStatisticsAPIView
)
from apps.authentication.views.auth_view import (
    CompanyAdminLoginAPIView, 
    CompanyAdminRegisterAPIView, 
    SuperAdminLoginAPIView, 
    SuperAdminRegisterAPIView, 
    AuthenticationViewSet, 
    SuperAdminVerifyLoginAPIView, 
    VerifyTokenAPIView,  
    RefreshTokenAPIView, 
    UserInfoAPIView
)
from apps.authentication.views.s3_view import (
    ConfirmUploadAPIView, 
    GenerateUploadURLAPIView, 
    GetDownloadURLAPIView
)
from apps.authentication.views.oauth_view import (
    FacebookAuthAPIView, 
    GoogleAuthAPIView, 
    LinkedinAuthAPIView, 
    OAuthStateGenerationAPIView, 
    OAuthVerifyTokenAPIView
)

router = SimpleRouter()
router.register(r'auth', AuthenticationViewSet, basename='login')

urlpatterns=[
    # Auth
    path('auth/company-admin/login/', CompanyAdminLoginAPIView.as_view(), name='company-admin-login'),
    path('auth/company-admin/register/', CompanyAdminRegisterAPIView.as_view(), name='company-admin-register'),
    path('auth/admin/login/', SuperAdminLoginAPIView.as_view(), name='admin-login'),
    path('auth/admin/verify-login/', SuperAdminVerifyLoginAPIView.as_view(), name='verify-admin-login'),
    path('auth/admin/register/', SuperAdminRegisterAPIView.as_view(), name='admin-register'),
    path('auth/verify-token/', VerifyTokenAPIView.as_view(), name='verify-token'),
    path('auth/refresh-token/', RefreshTokenAPIView.as_view(), name='refresh_view'),
    path('auth/me/', UserInfoAPIView.as_view(), name = 'me'),
    
    # OAuth
    path('auth/oauth/generate-state/', OAuthStateGenerationAPIView.as_view(), name="generate-oauth-state"),
    path('auth/accounts/google/', GoogleAuthAPIView.as_view(), name="google-auth-callback"),
    path('auth/accounts/linkedin/', LinkedinAuthAPIView.as_view(), name="linkedin-auth-callback"),
    path('auth/accounts/facebook/', FacebookAuthAPIView.as_view(), name="facebook-auth-callback"),
    path('auth/verify-oauth/', OAuthVerifyTokenAPIView.as_view(), name="verify-oauth"),
    
    # User Invitations
    path('invitations/ni-admin/', SendNIAdminInvitationAPIView.as_view(), name='send_ni_admin_invitation'),
    path('invitations/company-admin/', SendCompanyAdminInvitationAPIView.as_view(), name='send_company_admin_invitation'),
    path('invitations/validate/<str:token>/', ValidateInvitationTokenAPIView.as_view(), name='validate_invitation_token'),
    path('invitations/register/', RegisterAdminUserAPIView.as_view(), name='register_admin_user'),
    path('invitations/my-invitations/', MyInvitationsAPIView.as_view(), name='list_my_invitations'),
    path('invitations/<int:invitation_id>/revoke/', RevokeInvitationAPIView.as_view(), name='revoke_invitation'),
    path('invitations/statistics/', InvitationStatisticsAPIView.as_view(), name='get_invitation_statistics'),
    
    # S3 Upload endpoints for testing, will delete later
    path('s3/upload/generate-url/', GenerateUploadURLAPIView.as_view(), name='generate-upload-url'),
    path('s3/upload/confirm/', ConfirmUploadAPIView.as_view(), name='confirm-upload'),
    path('s3/upload/download-url/', GetDownloadURLAPIView.as_view(), name='get-download-url'),
]

urlpatterns += router.urls