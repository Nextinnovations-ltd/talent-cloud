from rest_framework.decorators import action
from rest_framework.response import Response
from services.job_seeker.occupation_service import JobSeekerRoleService
from .base_viewset import BaseModelViewSet, MinimalBaseViewSet
from ..models import JobSeekerSpecialization, JobSeekerSkill, JobSeekerRole, JobSeekerExperienceLevel, JobSeekerOccupation, SpokenLanguage
from ..serializers.occupation_serializer import JobSeekerSpecializationSerializer, JobSeekerSkillSerializer, JobSeekerRoleSerializer, JobSeekerExperienceLevelSerializer, JobSeekerOccupationSerializer, JobSeekerSpokenLanguageSerializer
from utils.response import CustomResponse

class JobSeekerSpecializationViewSet(MinimalBaseViewSet):
    queryset = JobSeekerSpecialization.objects.all()
    serializer_class = JobSeekerSpecializationSerializer

class JobSeekerRoleViewSet(MinimalBaseViewSet):
    queryset = JobSeekerRole.objects.all()
    serializer_class = JobSeekerRoleSerializer
    
    @action(detail=False, methods=['get'], url_path='by-specialization/(?P<specialization_id>[^/.]+)')
    def by_specialization(self, request, specialization_id=None):
        roles = JobSeekerRoleService.get_roles_by_specialization(specialization_id)
        serializer = self.get_serializer(roles, many=True)
        
        return Response(CustomResponse.success("Successfully fetched all specific roles.", serializer.data))

class JobSeekerSkillViewSet(MinimalBaseViewSet):
    queryset = JobSeekerSkill.objects.all()
    serializer_class = JobSeekerSkillSerializer

class JobSeekerExperienceLevelViewSet(MinimalBaseViewSet):
    queryset = JobSeekerExperienceLevel.objects.all()
    serializer_class = JobSeekerExperienceLevelSerializer

class JobSeekerLanguageOptionViewSet(MinimalBaseViewSet):
    queryset = SpokenLanguage.objects.all()
    serializer_class = JobSeekerSpokenLanguageSerializer

class JobSeekerOccupationViewSet(BaseModelViewSet):
    queryset = JobSeekerOccupation.objects.all()
    serializer_class = JobSeekerOccupationSerializer