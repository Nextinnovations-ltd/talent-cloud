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
     experience_year = django_filters.CharFilter(method='filter_experience_year')
     list_by_any_time = django_filters.CharFilter(method='filter_posted_time')
     company_size = django_filters.CharFilter(method='filter_company_size')
     
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
          
     def filter_experience_year(self, queryset, name, value):
          print(f"Filtering experience year with value: {value}")
          try:
               min_year, max_year = map(float, value.split('-'))
          except Exception as e:
               print(f"Experience year parsing error: {e}")
               return queryset.none()

          return queryset.filter(
               Q(
                    experience_years__gte=min_year,
                    experience_years__lte=max_year
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
     
     def filter_company_size(self, queryset, name, value):
          print(f"Filtering company size with value: {value}")
          
          # For direct company size match (most common case)
          if value in ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']:
               return queryset.filter(posted_by__company__size=value)
          
          # For custom range filtering
          try:
               min_size, max_size = map(int, value.split('-'))
          except Exception as e:
               print(f"Company size parsing error: {e}")
               return queryset.none()

          # Map to company size choices based on range
          valid_sizes = []
          
          if min_size <= 10:
               valid_sizes.append('1-10')
          if min_size <= 50 and max_size >= 11:
               valid_sizes.append('11-50')
          if min_size <= 200 and max_size >= 51:
               valid_sizes.append('51-200')
          if min_size <= 500 and max_size >= 201:
               valid_sizes.append('201-500')
          if min_size <= 1000 and max_size >= 501:
               valid_sizes.append('501-1000')
          if min_size <= 5000 and max_size >= 1001:
               valid_sizes.append('1001-5000')
          if min_size <= 10000 and max_size >= 5001:
               valid_sizes.append('5001-10000')
          if max_size > 10000:
               valid_sizes.append('10000+')
          
          if not valid_sizes:
               return queryset.none()
               
          return queryset.filter(posted_by__company__size__in=valid_sizes)