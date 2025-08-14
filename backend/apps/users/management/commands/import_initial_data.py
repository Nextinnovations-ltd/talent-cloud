from django.core.management.base import BaseCommand
from django.core.management import call_command
import time

class Command(BaseCommand):
     help = "Import all initial data required after deployment"

     def add_arguments(self, parser):
          parser.add_argument(
               '--skip-location',
               action='store_true',
               help='Skip importing location data'
          )
          parser.add_argument(
               '--skip-notifications',
               action='store_true',
               help='Skip importing notification templates'
          )
          parser.add_argument(
               '--skip-jobseeker',
               action='store_true',
               help='Skip importing job seeker data'
          )
          parser.add_argument(
               '--location-only',
               action='store_true',
               help='Import only location data'
          )
          parser.add_argument(
               '--notifications-only',
               action='store_true',
               help='Import only notification templates'
          )
          parser.add_argument(
               '--jobseeker-only',
               action='store_true',
               help='Import only job seeker data'
          )

     def handle(self, *args, **options):
          start_time = time.time()
          
          self.stdout.write("=" * 60)
          self.stdout.write(self.style.SUCCESS("🚀 STARTING INITIAL DATA IMPORT PROCESS"))
          self.stdout.write("=" * 60)
          
          # Handle single command options
          if options['location_only']:
               self._import_location_data()
               self._print_completion(start_time)
               return
               
          if options['notifications_only']:
               self._import_notification_templates()
               self._print_completion(start_time)
               return
               
          if options['jobseeker_only']:
               self._import_jobseeker_data()
               self._print_completion(start_time)
               return
          
          # Import all data (with skip options)
          if not options['skip_location']:
               self._import_location_data()
               
          if not options['skip_notifications']:
               self._import_notification_templates()
               
          if not options['skip_jobseeker']:
               self._import_jobseeker_data()
          
          self._print_completion(start_time)

     def _import_location_data(self):
          self.stdout.write("\n" + "="*50)
          self.stdout.write("🌍 IMPORTING LOCATION DATA")
          self.stdout.write("="*50)
          try:
               call_command('import_location')
               self.stdout.write(self.style.SUCCESS("✅ Location data import completed"))
          except Exception as e:
               self.stdout.write(self.style.ERROR(f"❌ Location data import failed: {str(e)}"))
               raise

     def _import_notification_templates(self):
          self.stdout.write("\n" + "="*50)
          self.stdout.write("📧 IMPORTING NOTIFICATION TEMPLATES")
          self.stdout.write("="*50)
          try:
               call_command('import_notification_template')
               self.stdout.write(self.style.SUCCESS("✅ Notification templates import completed"))
          except Exception as e:
               self.stdout.write(self.style.ERROR(f"❌ Notification templates import failed: {str(e)}"))
               raise

     def _import_jobseeker_data(self):
          self.stdout.write("\n" + "="*50)
          self.stdout.write("👥 IMPORTING JOBSEEKER DATA")
          self.stdout.write("="*50)
          try:
               call_command('import_job_seeker_data')
               self.stdout.write(self.style.SUCCESS("✅ JobSeeker data import completed"))
          except Exception as e:
               self.stdout.write(self.style.ERROR(f"❌ JobSeeker data import failed: {str(e)}"))
               raise

     def _print_completion(self, start_time):
          elapsed_time = time.time() - start_time
          minutes = int(elapsed_time // 60)
          seconds = int(elapsed_time % 60)
          
          self.stdout.write("\n" + "="*60)
          self.stdout.write(self.style.SUCCESS("🎉 ALL IMPORTS COMPLETED SUCCESSFULLY!"))
          self.stdout.write(f"⏱️  Total time: {minutes}m {seconds}s")
          self.stdout.write("="*60)