from django.db.models import Case, When, IntegerField, F, FloatField
from rest_framework.filters import OrderingFilter
import logging

logger = logging.getLogger(__name__)

class ApplicantOrderingFilter(OrderingFilter):
     """
     Custom ordering filter that handles experience_years and open_to_work sorting
     """
     
     def filter_queryset(self, request, queryset, view):
          ordering = self.get_ordering(request, queryset, view)
          
          if ordering:
               custom_ordering = []
               
               for order_field in ordering:
                    field_name = order_field.lstrip('-')
                    
                    if field_name == 'experience_years':
                         queryset = self._ensure_experience_annotation(queryset)
                         custom_ordering.append(order_field)
                    elif field_name == 'open_to_work':
                         queryset = self._ensure_open_to_work_annotation(queryset)
                         custom_ordering.append(order_field.replace('open_to_work', 'open_to_work_sort'))
                    else:
                         custom_ordering.append(order_field)
               
               if custom_ordering:
                    queryset = queryset.order_by(*custom_ordering)
          
          return queryset
     
     def _ensure_experience_annotation(self, queryset):
          """Add experience_years annotation using occupation experience_years"""
          if not self._has_annotation(queryset, 'experience_years'):
               logger.debug("Adding experience_years annotation from occupation")
               return self._add_experience_annotation(queryset)
          else:
               logger.debug("experience_years annotation already exists")
               return queryset
     
     def _ensure_open_to_work_annotation(self, queryset):
          """Ensure open_to_work_sort annotation exists"""
          if not self._has_annotation(queryset, 'open_to_work_sort'):
               logger.debug("Adding open_to_work_sort annotation")
               return self._add_open_to_work_annotation(queryset)
          else:
               logger.debug("open_to_work_sort annotation already exists")
               return queryset
     
     def _add_experience_annotation(self, queryset):
          """
          Add experience years annotation using the existing occupation experience_years field
          This is much simpler and more efficient than calculating from experiences
          """
          try:
               return queryset.annotate(
                    experience_years=Case(
                         When(
                         job_seeker__occupation__experience_years__isnull=False,
                         then=F('job_seeker__occupation__experience_years')
                         ),
                         default=0,
                         output_field=FloatField()
                    )
               )
          except Exception as e:
               logger.error(f"Error adding experience annotation: {str(e)}")
               return queryset
     
     def _add_open_to_work_annotation(self, queryset):
          """Add open_to_work annotation"""
          try:
               return queryset.annotate(
                    open_to_work_sort=Case(
                         When(job_seeker__is_open_to_work=True, then=1),
                         When(job_seeker__is_open_to_work=False, then=0),
                         default=0,
                         output_field=IntegerField()
                    )
               )
          except Exception as e:
               logger.error(f"Error adding open_to_work annotation: {str(e)}")
               return queryset
     
     def _has_annotation(self, queryset, annotation_name):
          """Check if queryset already has a specific annotation"""
          try:
               if (hasattr(queryset, 'query') and 
                    hasattr(queryset.query, 'annotations') and 
                    annotation_name in queryset.query.annotations):
                    return True
               return False
          except (AttributeError, TypeError):
               return False