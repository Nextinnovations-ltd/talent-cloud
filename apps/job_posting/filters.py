import django_filters

from .models import JobType, ProjectDurationType, SalaryModeType, PerSalaryType, WorkType
from .models import JobPost, JobSeekerSkill

class JobPostFilter(django_filters.FilterSet):
     title = django_filters.CharFilter(lookup_expr='icontains')
     description = django_filters.CharFilter(lookup_expr='icontains')
     location = django_filters.CharFilter(lookup_expr='icontains')

     specialization = django_filters.NumberFilter(field_name='specialization_id')
     role = django_filters.NumberFilter(field_name='role_id')
     experience_level = django_filters.NumberFilter(field_name='experience_level_id')

     # To filter by multiple skills, use ?skills=1&skills=2
     skills = django_filters.ModelMultipleChoiceFilter(
          queryset=JobSeekerSkill.objects.all(),
          field_name='skills__id',
          to_field_name='id',
          lookup_expr='exact'
     )

     experience_years__gte = django_filters.NumberFilter(field_name='experience_years', lookup_expr='gte')
     experience_years__lte = django_filters.NumberFilter(field_name='experience_years', lookup_expr='lte')

     salary_min__gte = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
     salary_min__lte = django_filters.NumberFilter(field_name='salary_min', lookup_expr='lte')
     
     salary_max__gte = django_filters.NumberFilter(field_name='salary_max', lookup_expr='gte')
     salary_max__lte = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')
     
     salary_fixed__gte = django_filters.NumberFilter(field_name='salary_fixed', lookup_expr='gte')
     salary_fixed__lte = django_filters.NumberFilter(field_name='salary_fixed', lookup_expr='lte')

     job_type = django_filters.ChoiceFilter(choices=JobType.choices)
     work_type = django_filters.ChoiceFilter(choices=WorkType.choices)
     salary_mode = django_filters.ChoiceFilter(choices=SalaryModeType.choices)
     per_salary_type = django_filters.ChoiceFilter(choices=PerSalaryType.choices)
     project_duration = django_filters.ChoiceFilter(choices=ProjectDurationType.choices)

     is_salary_negotiable = django_filters.BooleanFilter()

     last_application_date__gte = django_filters.DateFilter(field_name='last_application_date', lookup_expr='gte')
     last_application_date__lte = django_filters.DateFilter(field_name='last_application_date', lookup_expr='lte')
     last_application_date = django_filters.DateFilter(field_name='last_application_date', lookup_expr='exact')

     class Meta:
          model = JobPost
          fields = [
               'title', 'description', 'location',
               'specialization', 'role', 'skills', 'experience_level',
               'experience_years__gte', 'experience_years__lte',
               'job_type', 'work_type',
               'salary_mode', 'per_salary_type',
               'salary_min__gte', 'salary_min__lte',
               'salary_max__gte', 'salary_max__lte',
               'salary_fixed__gte', 'salary_fixed__lte',
               'is_salary_negotiable',
               'project_duration',
               'last_application_date', 'last_application_date__gte', 'last_application_date__lte'
          ]