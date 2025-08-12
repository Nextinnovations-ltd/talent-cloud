from django.urls import path
from apps.test_app.views import TestCeleryTaskAPIView

urlpatterns = [
    path('test/celery/', TestCeleryTaskAPIView.as_view(), name='test-celery'),
]