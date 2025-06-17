from django.urls import path
from .views import (
    CompanyCreateAPIView,
    CompanyListAPIView,
    CompanyDetailAPIView,
    IndustryListAPIView,
    UnauthenticatedCompanyCreateAPIView,
)

urlpatterns = [
    path('industries/', IndustryListAPIView.as_view(), name='industry-list'),
    path('company/register/', UnauthenticatedCompanyCreateAPIView.as_view(), name='company-register-unauthenticated'),
    path('company/', CompanyCreateAPIView.as_view(), name='company-create'),
    path('company/list/', CompanyListAPIView.as_view(), name='company-list'),
    path('company/<slug:slug>/', CompanyDetailAPIView.as_view(), name='company-detail'),
]
