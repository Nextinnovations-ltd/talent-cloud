# from django.db.models.signals import post_save, post_delete
# from django.dispatch import receiver
# from .models import JobPostView

# @receiver(post_save, sender=JobPostView)
# def update_view_count_on_save(sender, instance, created, **kwargs):
#      if created:
#           job_post = instance.job_post
#           job_post.view_count = job_post.views.count()
#           job_post.save(update_fields=['view_count'])

# @receiver(post_delete, sender=JobPostView)
# def update_view_count_on_delete(sender, instance, **kwargs):
#      job_post = instance.job_post
#      job_post.view_count = job_post.views.count()
#      job_post.save(update_fields=['view_count'])