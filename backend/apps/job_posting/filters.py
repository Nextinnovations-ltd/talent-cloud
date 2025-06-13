import django_filters
from django.db.models import Q
from datetime import datetime, timedelta
from .models import JobPost, JobType, ProjectDurationType, WorkType

class JobPostFilter(django_filters.FilterSet):
     title = django_filters.CharFilter(lookup_expr='icontains')
     description = django_filters.CharFilter(lookup_expr='icontains')
     location = django_filters.CharFilter(lookup_expr='icontains')
     specialization = django_filters.NumberFilter(field_name='specialization_id')
     role = django_filters.NumberFilter(field_name='role_id')
     experience_level = django_filters.NumberFilter(field_name='experience_level_id')
     job_type = django_filters.ChoiceFilter(choices=JobType.choices)
     work_type = django_filters.ChoiceFilter(choices=WorkType.choices)
     project_duration = django_filters.ChoiceFilter(choices=ProjectDurationType.choices)
     salary_rate = django_filters.CharFilter(method='filter_salary_range')
     list_by_any_time = django_filters.CharFilter(method='filter_posted_time')

     class Meta:
          model = JobPost
          fields = [
               'title', 'description', 'location',
               'specialization', 'role', 'experience_level', 
               'job_type', 'work_type', 'is_salary_negotiable',
               'project_duration'
          ]
     
     def filter_salary_range(self, queryset, name, value):
          print(f"Filtering salary_range with value: {value}")
          try:
               min_salary, max_salary = map(float, value.split('-'))
          except Exception as e:
               print(f"Salary range parsing error: {e}")
               return queryset.none()

          return queryset.filter(
               Q(
                    salary_mode='fixed',
                    salary_fixed__gte=min_salary,
                    salary_fixed__lte=max_salary
               ) |
               Q(
                    salary_mode='range',
                    salary_max__gte=min_salary,
                    salary_min__lte=max_salary
               )
          )

     def filter_posted_time(self, queryset, name, value):
          print(f"Filtering filter_posted_time with value: {value}")
          now = datetime.now()
          mapping = {
               '24h': now - timedelta(hours=24),
               '7d': now - timedelta(days=7),
               '30d': now - timedelta(days=30)
          }
          filter_date = mapping.get(value)
          if not filter_date:
               return queryset.none()

          return queryset.filter(created_at__gte=filter_date)