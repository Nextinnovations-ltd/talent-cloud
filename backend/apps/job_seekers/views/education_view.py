from .base_viewset import BaseModelViewSet
from ..serializers.education_serializer import EducationSerializer
from ..models import JobSeekerEducation

class EducationViewSet(BaseModelViewSet):
     serializer_class = EducationSerializer
     queryset = JobSeekerEducation.objects.all()