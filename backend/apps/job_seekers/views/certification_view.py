from ..models import JobSeekerCertification
from ..serializers.certification_serializer import CertificationSerializer
from .base_viewset import BaseModelViewSet
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Job Seeker"])
class CertificationViewSet(BaseModelViewSet):
     serializer_class = CertificationSerializer
     queryset = JobSeekerCertification.objects.all()