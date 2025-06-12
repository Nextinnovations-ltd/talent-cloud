from django.urls import path
from .views import (
    ActionCountsView,
    AuthenticatedUserLogsView,
    AuthenticatedUserLogsByActionView,
    AllUserLogsView,
    AllUserLogsByActionView,
)

urlpatterns = [
    path('logs/', AuthenticatedUserLogsView.as_view(), name='authenticated-user-logs'),
    path('logs/action/', AuthenticatedUserLogsByActionView.as_view(), name='authenticated-user-logs-by-action'),
    path('logs/all/', AllUserLogsView.as_view(), name='all-user-logs'),
    path('logs/all/action/', AllUserLogsByActionView.as_view(), name='all-user-logs-by-action'),
    path("logs/action-counts/", ActionCountsView.as_view(), name="action-counts"),
]
