from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from celery_app.tasks.sample_tasks import add, hello_world
from utils.response import CustomResponse

class TestCeleryTaskAPIView(APIView):
     """Test Celery tasks"""

     def post(self, request):
          task_type = request.data.get('task_type', 'add')

          try:
               if task_type == 'add':
                    x = request.data.get('x', 5)
                    y = request.data.get('y', 3)
                    task = add.delay(x, y)

               elif task_type == 'hello':
                    name = request.data.get('name', 'TalentCloud User')
                    task = hello_world.delay(name)
                    
               else:
                    return Response(
                         CustomResponse.error('Invalid task type'),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               return Response(
                    CustomResponse.success(
                         'Task started successfully',
                         {
                         'task_id': task.id,
                         'task_type': task_type,
                         'status': 'PENDING'
                         }
                    ),
                    status=status.HTTP_200_OK
               )
               
          except Exception as e:
               return Response(
                    CustomResponse.error(f'Failed to start task: {str(e)}'),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )
     
     def get(self, request):
          """Get task status"""
          task_id = request.query_params.get('task_id')
          
          if not task_id:
               return Response(
                    CustomResponse.error('task_id parameter required'),
                    status=status.HTTP_400_BAD_REQUEST
               )
          
          try:
               from celery_app.celery import app
               task = app.AsyncResult(task_id)
               
               response_data = {
                    'task_id': task_id,
                    'status': task.status,
                    'ready': task.ready(),
               }
               
               if task.ready():
                    if task.successful():
                         response_data['result'] = task.result
                    elif task.failed():
                         response_data['error'] = str(task.result)
               
               return Response(
                    CustomResponse.success('Task status retrieved', response_data),
                    status=status.HTTP_200_OK
               )
               
          except Exception as e:
               return Response(
                    CustomResponse.error(f'Failed to get task status: {str(e)}'),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )