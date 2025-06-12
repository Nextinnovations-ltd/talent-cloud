import pytest
from apps.users.models import Role, TalentCloudUser
from core.constants.constants import ROLES

class TestBaseUserModels:
     @pytest.mark.django_db
     def test_role_creation(self):
          role = Role.objects.create(name=ROLES.ADMIN)
          
          assert str(role) == ROLES.ADMIN

     @pytest.mark.django_db
     def test_create_base_user(self):
          role = Role.objects.create(name=ROLES.USER)
          
          user = TalentCloudUser.objects.create(
               email="user@tc.io",
               username="tc_user",
               role=role,
          )
          
          assert str(user) == "user@tc.io"
          assert user.role.name == ROLES.USER

     @pytest.mark.django_db
     def test_create_admin(self):
          role = Role.objects.create(name=ROLES.ADMIN)
          
          admin_user = TalentCloudUser.objects.create_user_with_role(
               username="tc_admin",
               email="admin@tc.io",
               role = role
          )
          
          assert admin_user.is_staff
          assert not admin_user.is_superuser
          assert admin_user.role.name == ROLES.ADMIN

     @pytest.mark.django_db
     def test_create_superadmin(self):
          super_user = TalentCloudUser.objects.create_superuser(
               username="tc_superadmin",
               email="superadmin@tc.io"
          )
          
          assert super_user.is_staff
          assert super_user.is_superuser
          assert super_user.role.name == ROLES.SUPERADMIN