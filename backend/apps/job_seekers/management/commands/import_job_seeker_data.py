from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Import all JobSeeker related data from CSV files"

    def handle(self, *args, **options):
        self.stdout.write("🚀 Starting JobSeeker data import...")
        self.stdout.write("=" * 50)
        
        # Frontend now uses embedded constants for onboarding data
        # call_command('import_university')
        # self.stdout.write("-" * 30)
        # 
        # call_command('import_specialization')
        # self.stdout.write("-" * 30)
        # 
        # call_command('import_role')
        # self.stdout.write("-" * 30)
        # 
        # call_command('import_skill')
        # self.stdout.write("-" * 30)
        # 
        # call_command('import_experience_level')
        # self.stdout.write("-" * 30)
        # 
        # call_command('import_language')
        
        self.stdout.write("=" * 50)
        
        self.stdout.write(self.style.SUCCESS("✅ All JobSeeker data import complete (import commands disabled)"))
