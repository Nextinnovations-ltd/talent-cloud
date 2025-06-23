from rest_framework.decorators import action
from rest_framework.response import Response
from services.job_seeker.occupation_service import JobSeekerRoleService
from .base_viewset import BaseModelViewSet, MinimalBaseViewSet
from ..models import JobSeekerSpecialization, JobSeekerSkill, JobSeekerRole, JobSeekerExperienceLevel, JobSeekerOccupation, SpokenLanguage
from ..serializers.occupation_serializer import JobSeekerSpecializationSerializer, JobSeekerSkillSerializer, JobSeekerRoleSerializer, JobSeekerExperienceLevelSerializer, JobSeekerOccupationSerializer, JobSeekerSpokenLanguageSerializer
from utils.response import CustomResponse
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Specialization Data"])
class JobSeekerSpecializationViewSet(MinimalBaseViewSet):
    queryset = JobSeekerSpecialization.objects.all()
    serializer_class = JobSeekerSpecializationSerializer

@extend_schema(tags=["Role Data"])
class JobSeekerRoleViewSet(MinimalBaseViewSet):
    queryset = JobSeekerRole.objects.all()
    serializer_class = JobSeekerRoleSerializer
    
    @action(detail=False, methods=['get'], url_path='by-specialization/(?P<specialization_id>[^/.]+)')
    def by_specialization(self, request, specialization_id=None):
        roles = JobSeekerRoleService.get_roles_by_specialization(specialization_id)
        serializer = self.get_serializer(roles, many=True)
        
        return Response(CustomResponse.success("Successfully fetched all specific roles.", serializer.data))

@extend_schema(tags=["Skill Data"])
class JobSeekerSkillViewSet(MinimalBaseViewSet):
    queryset = JobSeekerSkill.objects.all()
    serializer_class = JobSeekerSkillSerializer

@extend_schema(tags=["Experience Level Data"])
class JobSeekerExperienceLevelViewSet(MinimalBaseViewSet):
    queryset = JobSeekerExperienceLevel.objects.all()
    serializer_class = JobSeekerExperienceLevelSerializer

@extend_schema(tags=["Language Data"])
class JobSeekerLanguageOptionViewSet(MinimalBaseViewSet):
    queryset = SpokenLanguage.objects.all()
    serializer_class = JobSeekerSpokenLanguageSerializer

@extend_schema(tags=["Job Seeker"])
class JobSeekerOccupationViewSet(BaseModelViewSet):
    queryset = JobSeekerOccupation.objects.all()
    serializer_class = JobSeekerOccupationSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            # Customize this based on the actual error message or just handle all
            raise ValidationError({"detail": "This job seeker already has an occupation created."})