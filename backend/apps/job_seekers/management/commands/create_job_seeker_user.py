from django.core.management import BaseCommand
from apps.users.models import TalentCloudUser, Role
from apps.job_seekers.models import JobSeeker

class Command(BaseCommand):
     help = 'Create a initial job seeker user'
     
     def handle(self, *args, **options):
          try:
               user = TalentCloudUser.objects.get(email='js@tc.io')
               
               print("Talent Cloud Job Seeker user already exists!")
          except TalentCloudUser.DoesNotExist:
               role, created = Role.objects.get_or_create(name='user')
               
               user = JobSeeker.objects.create_user_with_role(
                    email='js@tc.io',
                    password='default',
                    role=role,
                    is_verified = True
               )
               
               print("Talent Cloud Job Seeker User created successfully!")
               print(
                    f"""
                         email: js@tc.io
                         password: default
                    """
               )