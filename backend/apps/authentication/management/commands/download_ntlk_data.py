import nltk
from django.core.management.base import BaseCommand
from nltk.downloader import Downloader

REQUIRED_NLTK_PACKAGES = [
    'punkt_tab',
    'wordnet', # For lemmatization data
    'averaged_perceptron_tagger_eng'
]

class Command(BaseCommand):
     help = 'Downloads required NLTK data packages if they are not already installed.'

     def handle(self, *args, **options):
          self.stdout.write(self.style.NOTICE("Checking NLTK data status..."))
          
          downloader = Downloader()
          missing_packages = []

          # 1. Check which packages are missing
          for package in REQUIRED_NLTK_PACKAGES:
               if not downloader.is_installed(package):
                    missing_packages.append(package)

          if not missing_packages:
               self.stdout.write(self.style.SUCCESS("All required NLTK packages are already installed."))
               return

          self.stdout.write(
               self.style.WARNING(
                    f"The following NLTK packages are missing and will be downloaded: {', '.join(missing_packages)}"
               )
          )

          # 2. Download missing packages
          try:
               for package in missing_packages:
                    self.stdout.write(f"Downloading '{package}'...")
                    nltk.download(package, quiet=True)
                    self.stdout.write(self.style.SUCCESS(f"Successfully downloaded '{package}'."))
               
          except Exception as e:
               self.stderr.write(self.style.ERROR(f"An error occurred during NLTK download: {e}"))
               self.stderr.write(self.style.ERROR("Please ensure you have an active internet connection."))
               return

          self.stdout.write(self.style.SUCCESS("\nNLTK data setup complete!"))