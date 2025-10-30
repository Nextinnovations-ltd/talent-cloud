import requests
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudAllPermission
from .serializers import DifyGenerationSerializer
from rest_framework.throttling import ScopedRateThrottle

logger = logging.getLogger(__name__)

class GenerateDifyOutlineView(APIView):
     """
     A proxy API view that securely calls the Dify workflow endpoint.
     """
     authentication_classes = [TokenAuthentication] 
     permission_classes = [TalentCloudAllPermission]

     # Throttling
     throttle_classes = [ScopedRateThrottle]
     throttle_scope = 'ai_generation'

     def post(self, request, *args, **kwargs):
          """
          Handles the POST request from the frontend.
          """
          serializer = DifyGenerationSerializer(data=request.data)
          
          if not serializer.is_valid():
               return Response(
                    {"success": False, "error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
               )

          validated_data = serializer.validated_data
          task_type = validated_data.get('task_type')
          input_text = validated_data.get('input_text')
          max_output_length = validated_data.get('max_output_length', 1000)
          
          dify_user_id = f"tc-{str(request.user.username)}"

          dify_inputs = {
               'task_type': task_type,
               'input_text': input_text
          }
          
          if task_type == 'job_description' and max_output_length:
               dify_inputs['max_output_length'] = max_output_length

          
          dify_payload = {
               'inputs': dify_inputs,
               'response_mode': 'blocking', 
               'user': dify_user_id
          }

          dify_api_url = getattr(settings, 'DIFY_API_URL', None)
          dify_api_key = getattr(settings, 'DIFY_API_KEY', None)

          if not dify_api_url or not dify_api_key:
               logger.error("DIFY_API_URL or DIFY_API_KEY is not configured in settings.")
               return Response(
                    {"success": False, "error": "AI service is not configured."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

          headers = {
               'Authorization': f'Bearer {dify_api_key}',
               'Content-Type': 'application/json'
          }

          try:
               response = requests.post(
                    dify_api_url,
                    headers=headers,
                    json=dify_payload,
                    timeout=60 
               )
               
               response.raise_for_status() 

               dify_result = response.json()

               
               if dify_result.get('data', {}).get('status') != 'succeeded':
                    dify_error = dify_result.get('data', {}).get('error', 'Unknown Dify workflow error')
                    logger.warning(f"Dify workflow failed for user {dify_user_id}: {dify_error}")
                    
                    return Response(
                         {"success": False, "error": f"AI workflow failed: {dify_error}"},
                         status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

               
               generated_text = dify_result.get('data', {}).get('outputs', {}).get('output')
               tokens_used = dify_result.get('data', {}).get('total_tokens')

               if generated_text is None:
                    logger.error(f"Dify response for user {dify_user_id} missing 'output' field.")
                    return Response(
                         {"success": False, "error": "AI response was incomplete."},
                         status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

               return Response(
                    {
                         "success": True,
                         "generated_text": generated_text,
                         "tokens_used": tokens_used
                    },
                    status=status.HTTP_200_OK
               )

          except requests.exceptions.Timeout:
               logger.error(f"Dify API call timed out for user {dify_user_id}.")
               return Response(
                    {"success": False, "error": "The AI generation request timed out."},
                    status=status.HTTP_504_GATEWAY_TIMEOUT
               )
          except requests.exceptions.RequestException as e:
               logger.error(f"Dify API request failed for user {dify_user_id}: {e}")
               return Response(
                    {"success": False, "error": f"Could not connect to AI service: {e}"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
               )
          except Exception as e:
               logger.error(f"An unexpected error occurred during Dify call for user {dify_user_id}: {e}")
               return Response(
                    {"success": False, "error": "An internal server error occurred."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )
