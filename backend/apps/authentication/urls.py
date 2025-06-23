from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import CompanyAdminLoginAPIView, CompanyAdminRegisterAPIView, SuperAdminLoginAPIView, SuperAdminRegisterAPIView, AuthenticationViewSet, SuperAdminVerifyLoginAPIView, VerifyTokenAPIView, GoogleAuthAPIView, LinkedinAuthAPIView, FacebookAuthAPIView, OAuthVerifyTokenAPIView, RefreshTokenAPIView, UserInfoAPIView

router = SimpleRouter()
router.register(r'auth', AuthenticationViewSet, basename='login')

urlpatterns=[
    path('auth/company-admin/login/', CompanyAdminLoginAPIView.as_view(), name='company-admin-login'),
    path('auth/company-admin/register/', CompanyAdminRegisterAPIView.as_view(), name='company-admin-register'),
    path('auth/admin/login/', SuperAdminLoginAPIView.as_view(), name='admin-login'),
    path('auth/admin/verify-login/', SuperAdminVerifyLoginAPIView.as_view(), name='verify-admin-login'),
    path('auth/admin/register/', SuperAdminRegisterAPIView.as_view(), name='admin-register'),
    path('auth/verify-token/', VerifyTokenAPIView.as_view(), name='verify-token'),
    path('auth/me/', UserInfoAPIView.as_view(), name = 'me'),
    path('auth/accounts/google/', GoogleAuthAPIView.as_view(), name="google-auth-callback"),
    path('auth/accounts/linkedin/', LinkedinAuthAPIView.as_view(), name="linkedin-auth-callback"),
    path('auth/accounts/facebook/', FacebookAuthAPIView.as_view(), name="facebook-auth-callback"),
    path('auth/verify-oauth/', OAuthVerifyTokenAPIView.as_view(), name="verify-oauth"),
    path('auth/refresh-token/', RefreshTokenAPIView.as_view(), name='refresh_view'),
]

urlpatterns += router.urls