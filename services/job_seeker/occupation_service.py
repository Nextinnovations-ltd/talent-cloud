from apps.job_seekers.models import JobSeekerRole

class JobSeekerRoleService:
     @staticmethod
     def update_job_seeker_role(instance, validated_data):
          # Prevent specialization update
          if 'specialization' in validated_data and validated_data['specialization'] != instance.specialization:
               raise ValueError("The 'specialization' field cannot be updated.")

          instance.name = validated_data.get('name', instance.name)
          instance.save()
          
          return instance

     @staticmethod
     def get_roles_by_specialization(specialization_id):
          if not specialization_id:
               raise ValueError("Specialization can't be empty.")

          return JobSeekerRole.objects.filter(specialization_id=specialization_id)