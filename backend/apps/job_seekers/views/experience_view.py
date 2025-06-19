from .base_viewset import BaseModelViewSet
from ..serializers.experience_serializer import ExperienceSerializer
from ..models import JobSeekerExperience
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Job Seeker"])
class ExperienceViewSet(BaseModelViewSet):
     serializer_class = ExperienceSerializer
     queryset = JobSeekerExperience.objects.all()