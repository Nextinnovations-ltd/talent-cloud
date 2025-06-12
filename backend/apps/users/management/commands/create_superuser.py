from django.core.management import BaseCommand
from apps.users.models import TalentCloudUser, Role

class Command(BaseCommand):
     help = 'Create a initial user with superuser role'
     
     def handle(self, *args, **options):
          print("Creating all the roles for talent cloud platform")
          
          print("Creating SuperAdmin Role")
          Role.objects.get_or_create(name='superadmin')
          
          print("Creating Admin Role")
          Role.objects.get_or_create(name='admin')
          
          print("Creating User Role")
          Role.objects.get_or_create(name='user')
          
          print("Creating TalentCloudUser")
          try:
               user = TalentCloudUser.objects.get(email='sa@tc.io')
               
               print("Talent Cloud super admin user already exists!")
          except TalentCloudUser.DoesNotExist:
               role, created = Role.objects.get_or_create(name='superadmin')
               
               user = TalentCloudUser.objects.create_superuser(
                    username='superadmin',
                    email='sa@tc.io',
                    password='default',
                    role=role
               )
               
               print("Talent Cloud Superuser created successfully!")
               print(
                    f"""
                         email: sa@tc.io
                         password: default
                    """
               )