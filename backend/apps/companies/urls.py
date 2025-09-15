from django.urls import path
from apps.ni_dashboard.views import CompanyApprovalAPIView
from .views import (
    BulkUploadCompleteAPIView,
    BulkUploadInitiateAPIView,
    CompanyCreateAPIView,
    CompanyListAPIView,
    CompanyDetailAPIView,
    IndustryListAPIView,
    RelatedCompanyInfoAPIView,
    UnauthenticatedCompanyCreateAPIView,
    UpdateParentCompanyAPIView,
)

urlpatterns = [
    # Update Parent Company
    path('company/update-parent-company/', UpdateParentCompanyAPIView.as_view(), name='company-create'),
    
    path('industries/', IndustryListAPIView.as_view(), name='industry-list'),
    path('company/register/', UnauthenticatedCompanyCreateAPIView.as_view(), name='company-register-unauthenticated'),
    path('related-company-info/', RelatedCompanyInfoAPIView.as_view(), name='related-company-info'),
    path('company/', CompanyCreateAPIView.as_view(), name='company-create'),
    path('company/list/', CompanyListAPIView.as_view(), name='company-list'),
    path('company/<slug:slug>/approve/', CompanyApprovalAPIView.as_view(), name='company-approval-by-admin'),
    path('company/<slug:slug>/', CompanyDetailAPIView.as_view(), name='company-detail'),
    
    # Company Image Files Upload
    path('company/bulk-upload/images/', BulkUploadInitiateAPIView.as_view(), name='bulk-upload-initiate'),
    path('company/bulk-upload/complete/', BulkUploadCompleteAPIView.as_view(), name='bulk-upload-complete'),
]
