from django.urls import path
from apps.ni_dashboard.views import CompanyApprovalAPIView
from .views import (
    CompanyCreateAPIView,
    CompanyListAPIView,
    CompanyDetailAPIView,
    IndustryListAPIView,
    RelatedCompanyInfoAPIView,
    UnauthenticatedCompanyCreateAPIView,
)

urlpatterns = [
    path('industries/', IndustryListAPIView.as_view(), name='industry-list'),
    path('company/register/', UnauthenticatedCompanyCreateAPIView.as_view(), name='company-register-unauthenticated'),
    path('related-company-info/', RelatedCompanyInfoAPIView.as_view(), name='related-company-info'),
    path('company/', CompanyCreateAPIView.as_view(), name='company-create'),
    path('company/list/', CompanyListAPIView.as_view(), name='company-list'),
    path('company/<slug:slug>/approve/', CompanyApprovalAPIView.as_view(), name='company-approval-by-admin'),
    path('company/<slug:slug>/', CompanyDetailAPIView.as_view(), name='company-detail'),
]
