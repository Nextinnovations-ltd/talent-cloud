from django.urls import path
from .views import GenerateDifyOutlineView

app_name = 'dify_integration'

urlpatterns = [
     path('integration/dify/generate-outline/', GenerateDifyOutlineView.as_view(), name='generate-outline'),
]
