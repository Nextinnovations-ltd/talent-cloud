from ..models import JobSeekerCertification
from ..serializers.certification_serializer import CertificationSerializer
from .base_viewset import BaseModelViewSet

class CertificationViewSet(BaseModelViewSet):
     serializer_class = CertificationSerializer
     queryset = JobSeekerCertification.objects.all()