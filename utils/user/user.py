import uuid
from core.constants.constants import AUTO_GENERATED_USERNAME_PREFIX

def generate_unique_username():
     generated_username = f'{AUTO_GENERATED_USERNAME_PREFIX}{_generate_uuid_postfix()}'
     
     from apps.users.models import TalentCloudUser
     while TalentCloudUser.objects.filter(username=generated_username).exists():
          generated_username = f'{AUTO_GENERATED_USERNAME_PREFIX}{_generate_uuid_postfix()}'
     
     return generated_username

def check_auto_generated_username(username):
     return username.startswith(AUTO_GENERATED_USERNAME_PREFIX)

def _generate_uuid_postfix():
     return str(uuid.uuid4())[:8]
