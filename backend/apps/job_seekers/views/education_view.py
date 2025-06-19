from .base_viewset import BaseModelViewSet
from ..serializers.education_serializer import EducationSerializer
from ..models import JobSeekerEducation
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Job Seeker"])
class EducationViewSet(BaseModelViewSet):
     serializer_class = EducationSerializer
     queryset = JobSeekerEducation.objects.all()