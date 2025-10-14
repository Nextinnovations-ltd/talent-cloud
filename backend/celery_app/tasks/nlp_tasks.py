from celery import shared_task
from django.db.models import F
from apps.job_posting.models import SearchTerm
import logging

logger = logging.getLogger(__name__)

@shared_task(name='nlp_tasks.calculate_trending_scores_task')
def calculate_trending_scores_task():
     """Calculates the time-weighted score and resets daily counts."""
     logger.info("Starting nightly trending score calculation...")
     
     DECAY_FACTOR = 0.90
     NEW_SEARCH_WEIGHT = 1.0

     # Formula: Score_new = (Score_old * Decay) + (Daily_Count * Weight)
     SearchTerm.objects.all().update(
          weighted_score=(F('weighted_score') * DECAY_FACTOR) + (F('daily_count') * NEW_SEARCH_WEIGHT),
          daily_count=0  # Reset the daily count for the new day
     )

     logger.info("Finished nightly trending score calculation. Daily counts reset.")