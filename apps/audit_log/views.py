from rest_framework.views import APIView
from rest_framework.response import Response
from .constants import ActivityActions
from .models import UserActivityLog
from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudUserDynamicPermission

class AuthenticatedUserLogsView(APIView):
     """
     API endpoint to retrieve all activity logs for the authenticated user.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]

     def get(self, request):
          logs = UserActivityLog.objects.filter(user=request.user).order_by('-timestamp')
          data = [{"action": log.action, "timestamp": log.timestamp} for log in logs]
          
          return Response({"logs": data}, status=status.HTTP_200_OK)

class AuthenticatedUserLogsByActionView(APIView):
     """
     API endpoint to retrieve logs for the authenticated user filtered by action.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]

     def get(self, request):
          action = request.GET.get('action')

          if not action:
               return Response({"error": "Action parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

          if action not in ActivityActions.list():
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

          logs = UserActivityLog.objects.filter(user=request.user, action=action).order_by('-timestamp')
          data = [{"action": log.action, "timestamp": log.timestamp} for log in logs]
          
          return Response({"logs": data}, status=status.HTTP_200_OK)

class AllUserLogsView(APIView):
     """
     API endpoint to retrieve all activity logs for all users.
     """

     def get(self, request):
          logs = UserActivityLog.objects.all().order_by('-timestamp')
          data = [{"user": log.user.username, "action": log.action, "timestamp": log.timestamp} for log in logs]
          
          return Response({"logs": data}, status=status.HTTP_200_OK)

class AllUserLogsByActionView(APIView):
     """
     API endpoint to retrieve logs for all users filtered by action.
     """

     def get(self, request):
          action = request.GET.get('action')

          if not action:
               return Response({"error": "Action parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

          if action not in ActivityActions.list():
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

          logs = UserActivityLog.objects.filter(action=action).order_by('-timestamp')
          data = [{"user": log.user.username, "action": log.action, "timestamp": log.timestamp} for log in logs]
          
          return Response({"logs": data}, status=status.HTTP_200_OK)

class ActionCountsView(APIView):
     """Retrieve the count of each action performed by all users."""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserDynamicPermission]

     def get(self, request):
          action = request.query_params.get('action', None)
          
          # Check if the action is valid
          if action not in ActivityActions.list():
               return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

          # Count occurrences of the action from all users
          action_count = UserActivityLog.objects.filter(action=action).count()

          # Return the count for the specific action
          return Response({"action": action, "count": action_count}, status=status.HTTP_200_OK)