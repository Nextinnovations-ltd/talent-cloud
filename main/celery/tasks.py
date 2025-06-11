from celery import shared_task
import time, logging

logger = logging.getLogger(__name__)

@shared_task
def add(x, y):
    time.sleep(5)  # Simulate a delay (e.g., a long computation)
    result = x + y
    print(f"Task completed! {x} + {y} = {result}")
    return result
