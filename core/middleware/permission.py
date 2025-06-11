from rest_framework.permissions import BasePermission
from core.constants.constants import ROLES

class TalentCloudSuperAdminPermission(BasePermission):
    allowed_roles = [ROLES.SUPERADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class TalentCloudAdminPermission(BasePermission):
    allowed_roles = [ROLES.ADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True

        return False

class TalentCloudUserPermission(BasePermission):
    allowed_roles = [ROLES.USER]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class TalentCloudUserDynamicPermission(BasePermission):
    allowed_roles = [ROLES.USER, ROLES.SUPERADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class TalentCloudAdminOrSuperAdminPermission(BasePermission):
    allowed_roles = [ROLES.ADMIN, ROLES.SUPERADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class TalentCloudAllPermission(BasePermission):
    allowed_roles = [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class IsJobSeekerAndOwnerPermission(BasePermission):
    """
    Combines role and object ownership check for JobSeeker.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role) in [ROLES.USER]

    def has_object_permission(self, request, view, obj):
        return hasattr(request.user, 'jobseeker') and obj.user == request.user.jobseeker

class IsOwnerOfApplication(BasePermission):
    """
    Custom permission to only allow a JobSeeker to access their own application.
    For a single JobApplication instance.
    """
    def has_object_permission(self, request, view, obj):
        return obj.job_seeker.user == request.user

class IsOwnerOfBookmarkedJob(BasePermission):
    """
    Custom permission to only allow a JobSeeker to access their own bookmark.
    Assumes the view is for a single BookmarkedJob instance.
    """
    def has_object_permission(self, request, view, obj):
        return obj.job_seeker.user == request.user

class IsCompanyAdminOrSuperadminForJobPost(BasePermission):
    """
    Custom permission to allow Admin/Superadmin to manage JobPosts belonging to their company.
    For a single JobPost instance or a list related to a company.
    """
    def has_permission(self, request, view):
        user = request.user
        if not (user.is_authenticated and user.role and user.role.name in [ROLES.ADMIN, ROLES.SUPERADMIN]):
            return False

        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user.is_authenticated and user.role and user.role.name in [ROLES.ADMIN, ROLES.SUPERADMIN] and user.company == obj.posted_by.company

class IsCompanyAdminOrSuperadminForApplication(BasePermission):
    """
    Custom permission to allow Admin/Superadmin to manage Applications for JobPosts belonging to their company.
    For a single JobApplication instance.
    """
    def has_object_permission(self, request, view, obj):
        # obj is the JobApplication instance
        user = request.user

        return user.is_authenticated and user.role and user.role.name in [ROLES.ADMIN, ROLES.SUPERADMIN] and user.company == obj.job_post.posted_by.company