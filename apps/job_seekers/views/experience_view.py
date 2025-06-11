from .base_viewset import BaseModelViewSet
from ..serializers.experience_serializer import ExperienceSerializer
from ..models import JobSeekerExperience

class ExperienceViewSet(BaseModelViewSet):
     serializer_class = ExperienceSerializer
     queryset = JobSeekerExperience.objects.all()