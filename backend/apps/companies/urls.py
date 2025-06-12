from django.urls import path
from .views import (
    CompanyListCreateAPIView,
    CompanyDetailAPIView,
    IndustryListAPIView,
    UnauthenticatedCompanyCreateAPIView,
)

urlpatterns = [
    path('industries/', IndustryListAPIView.as_view(), name='industry-list'),
    path('companies/', CompanyListCreateAPIView.as_view(), name='company-list-create'),
    path('companies/<slug:slug>/', CompanyDetailAPIView.as_view(), name='company-detail'),
    path('companies/register/', UnauthenticatedCompanyCreateAPIView.as_view(), name='company-register-unauthenticated'),
]
