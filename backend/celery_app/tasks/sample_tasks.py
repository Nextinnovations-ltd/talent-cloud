from celery import shared_task
import time, logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, name='sample_tasks.add')
def add(self, x, y):
    """
    Sample task that adds two numbers with a delay
    """
    try:
        logger.info(f"Starting addition task: {x} + {y}")
        
        # Simulate a delay (e.g., a long computation)
        time.sleep(5)
        
        result = x + y
        logger.info(f"Task completed! {x} + {y} = {result}")
        
        return {
            'result': result,
            'operands': {'x': x, 'y': y},
            'message': f"Successfully added {x} + {y} = {result}"
        }
        
    except Exception as exc:
        logger.error(f"Task failed: {str(exc)}")
        # Retry the task with exponential backoff
        raise self.retry(exc=exc, countdown=60, max_retries=3)

@shared_task(name='sample_tasks.hello_world')
def hello_world(name="World"):
    """
    Simple hello world task for testing
    """
    logger.info(f"Hello task started for: {name}")
    time.sleep(1)
    
    message = f"Hello, {name}! Task completed successfully."
    logger.info(message)
    
    return {
        'message': message,
        'name': name,
        'status': 'completed'
    }