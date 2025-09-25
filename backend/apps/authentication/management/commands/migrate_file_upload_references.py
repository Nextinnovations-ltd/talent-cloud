from django.core.management.base import BaseCommand, CommandError
from django.db import transaction, IntegrityError, models
from django.utils import timezone
from apps.authentication.models import FileUpload
from apps.users.models import TalentCloudUser
from apps.job_posting.models import JobApplication
from apps.companies.models import Company
from apps.job_seekers.models import JobSeekerProject
from core.constants.s3.constants import FILE_TYPES
from urllib.parse import urlparse
import uuid
import logging

##### Migration #####
# finished =>
# talent_cloud_user, job_application, job_seeker_project

# pending => company

##### Field changes #####
# finished => talent_cloud_user, job_seeker_project, job_application

logger = logging.getLogger(__name__)

class Command(BaseCommand):
     help = 'Migrate existing file path references to FileUpload foreign keys'
    
     def __init__(self, *args, **kwargs):
          super().__init__(*args, **kwargs)
          self.stats = {
               'talent_cloud_user': {'processed': 0, 'migrated': 0, 'skipped': 0, 'errors': 0},
               'job_application': {'processed': 0, 'migrated': 0, 'skipped': 0, 'errors': 0},
               'company': {'processed': 0, 'migrated': 0, 'skipped': 0, 'errors': 0},
               'job_seeker_project': {'processed': 0, 'migrated': 0, 'skipped': 0, 'errors': 0},
          }

     def add_arguments(self, parser):
          parser.add_argument(
               '--model',
               choices=['talent_cloud_user', 'job_application', 'company', 'job_seeker_project', 'all'],
               default='all',
               help='Which model to migrate (default: all)'
          )
          parser.add_argument(
               '--dry-run',
               action='store_true',
               help='Show what would be migrated without making changes'
          )
          parser.add_argument(
               '--batch-size',
               type=int,
               default=100,
               help='Number of records to process in each batch (default: 100)'
          )
          parser.add_argument(
               '--force',
               action='store_true',
               help='Force migration even if FileUpload reference already exists'
          )
          parser.add_argument(
               '--verbose',
               action='store_true',
               help='Enable verbose logging'
          )

     def handle(self, *args, **options):
          self.dry_run = options['dry_run']
          self.batch_size = options['batch_size']
          self.force = options['force']
          self.verbose = options['verbose']
          model_choice = options['model']
          
          if self.dry_run:
               self.stdout.write(
                    self.style.WARNING('🔍 DRY RUN MODE - No changes will be made')
               )
          
          if self.force:
               self.stdout.write(
                    self.style.WARNING('⚠️  FORCE MODE - Will overwrite existing FileUpload references')
               )
          
          self.stdout.write(f'📦 Batch size: {self.batch_size}')
          self.stdout.write('=' * 60)
          
          try:
               # Execute migrations based on model choice
               if model_choice in ['talent_cloud_user', 'all']:
                    self.migrate_talent_cloud_user_images()
               
               if model_choice in ['job_application', 'all']:
                    self.migrate_job_application_files()
               
               if model_choice in ['company', 'all']:
                    self.migrate_company_images()
               
               if model_choice in ['job_seeker_project', 'all']:
                    self.migrate_job_seeker_project_images()
               
               # Display final statistics
               self.display_migration_summary()
               
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f'❌ Migration failed: {str(e)}')
               )
               raise CommandError(f'Migration failed: {str(e)}')

     def migrate_talent_cloud_user_images(self):
          """Migrate TalentCloudUser profile images"""
          self.stdout.write('\n👤 Migrating TalentCloudUser profile images...')
          
          # Find users with profile_image_url but no profile_image_file
          queryset = TalentCloudUser.objects.exclude(
               profile_image_path__isnull=True
          ).exclude(
               profile_image_path__exact=''
          )
          
          if not self.force:
               queryset = queryset.filter(profile_image_file__isnull=True)
          
          total_count = queryset.count()
          self.stdout.write(f'📊 Found {total_count} TalentCloudUser records to process')
          
          for batch_start in range(0, total_count, self.batch_size):
               batch_end = min(batch_start + self.batch_size, total_count)
               batch = queryset[batch_start:batch_end]
               
               self.stdout.write(f'📦 Processing batch {batch_start + 1}-{batch_end} of {total_count}')
               
               with transaction.atomic():
                    for user in batch:
                         try:
                              self.stats['talent_cloud_user']['processed'] += 1
                              
                              if self.migrate_single_talent_cloud_user(user):
                                   self.stats['talent_cloud_user']['migrated'] += 1
                              else:
                                   self.stats['talent_cloud_user']['skipped'] += 1
                                   
                         except Exception as e:
                              self.stats['talent_cloud_user']['errors'] += 1
                              self.stdout.write(
                                   self.style.ERROR(f'❌ Error migrating user {user.id}: {str(e)}')
                              )
                              if self.verbose:
                                   logger.exception(f"Error migrating TalentCloudUser {user.id}")

     def migrate_single_talent_cloud_user(self, user):
          """Migrate a single TalentCloudUser profile image"""
          if not user.profile_image_path:
               return False
          
          if user.profile_image_file and not self.force:
               if self.verbose:
                    self.stdout.write(f'⏭️  Skipping user {user.id} - already has FileUpload reference')
               return False
          
          if self.dry_run:
               self.stdout.write(
                    f'🔍 Would migrate TalentCloudUser {user.id} ({user.email}): {user.profile_image_path}'
               )
               return True
          
          # Create FileUpload record
          file_upload = self.create_file_upload(
               user=user,
               file_path=user.profile_image_path,
               file_type= FILE_TYPES.PROFILE_IMAGE,
               original_filename=self.extract_filename_from_url(user.profile_image_path, 'profile_image'),
               created_at=user.created_at or timezone.now()
          )
          
          if file_upload:
               user.profile_image_file = file_upload
               user.save(update_fields=['profile_image_file'])
               
               if self.verbose:
                    self.stdout.write(
                    self.style.SUCCESS(f'✅ Migrated TalentCloudUser {user.id} ({user.email})')
                    )
               return True
          
          return False

     def migrate_job_application_files(self):
          """Migrate JobApplication cover letters and resumes"""
          self.stdout.write('\n📄 Migrating JobApplication files...')
          
          # Find applications with file URLs but no file references
          queryset = JobApplication.objects.filter(
               models.Q(cover_letter_url__isnull=False, cover_letter_url__gt='') |
               models.Q(resume_url__isnull=False, resume_url__gt='')
          )
          
          if not self.force:
               queryset = queryset.filter(
                    cover_letter_file__isnull=True,
                    resume_file__isnull=True
               )
          
          total_count = queryset.count()
          self.stdout.write(f'📊 Found {total_count} JobApplication records to process')
          
          for batch_start in range(0, total_count, self.batch_size):
               batch_end = min(batch_start + self.batch_size, total_count)
               batch = queryset[batch_start:batch_end]
               
               self.stdout.write(f'📦 Processing batch {batch_start + 1}-{batch_end} of {total_count}')
               
               with transaction.atomic():
                    for application in batch:
                         try:
                              self.stats['job_application']['processed'] += 1
                              
                              if self.migrate_single_job_application(application):
                                   self.stats['job_application']['migrated'] += 1
                              else:
                                   self.stats['job_application']['skipped'] += 1
                                   
                         except Exception as e:
                              self.stats['job_application']['errors'] += 1
                              self.stdout.write(
                                   self.style.ERROR(f'❌ Error migrating application {application.id}: {str(e)}')
                              )
                              if self.verbose:
                                   logger.exception(f"Error migrating JobApplication {application.id}")

     def migrate_single_job_application(self, application):
          """Migrate a single JobApplication's files"""
          migrated = False
          updated_fields = []
          
          if self.dry_run:
               files_to_migrate = []
               if application.cover_letter_url:
                    files_to_migrate.append(f'cover_letter: {application.cover_letter_url}')
               if application.resume_url:
                    files_to_migrate.append(f'resume : {application.resume_url}')
               
               if files_to_migrate:
                    self.stdout.write(
                    f'🔍 Would migrate JobApplication {application.id}: {", ".join(files_to_migrate)}'
                    )
                    return True
               return False
          
          # Migrate cover letter
          if application.cover_letter_url and (not application.cover_letter_file or self.force):
               cover_letter_file = self.create_file_upload(
                    user=application.job_seeker.user,
                    file_path=application.cover_letter_url,
                    file_type=FILE_TYPES.COVER_LETTER,
                    original_filename=self.extract_filename_from_url(application.cover_letter_url, 'cover_letter'),
                    created_at=application.created_at or timezone.now()
               )
               
               if cover_letter_file:
                    application.cover_letter_file = cover_letter_file
                    updated_fields.append('cover_letter_file')
                    migrated = True
          
          # Migrate resume
          if application.resume_url and (not application.resume_file or self.force):
               resume_file = self.create_file_upload(
                    user=application.job_seeker.user,
                    file_path=application.resume_url,
                    file_type=FILE_TYPES.APPLICATION_RESUME,
                    original_filename=self.extract_filename_from_url(application.resume_url, 'resume'),
                    created_at=application.created_at or timezone.now(),
                    is_user_required = True, # To provide backward compatibality
                    is_file_type_required = False
               )
               
               if resume_file:
                    application.resume_file = resume_file
                    updated_fields.append('resume_file')
                    migrated = True
          
          if updated_fields:
               application.save(update_fields=updated_fields)
               
               if self.verbose:
                    self.stdout.write(
                    self.style.SUCCESS(f'✅ Migrated JobApplication {application.id}: {", ".join(updated_fields)}')
                    )
          
          return migrated

     def migrate_company_images(self):
          """Migrate Company images"""
          self.stdout.write('\n🏢 Migrating Company images...')
          
          # Find companies with image URLs but no file references
          from django.db import models
          queryset = Company.objects.filter(
               models.Q(cover_image_url__isnull=False, cover_image_url__gt='') |
               models.Q(image_url__isnull=False, image_url__gt='')
          )
          
          if not self.force:
               queryset = queryset.filter(
                    cover_image_file__isnull=True,
                    image_file__isnull=True
               )
          
          total_count = queryset.count()
          self.stdout.write(f'📊 Found {total_count} Company records to process')
          
          for batch_start in range(0, total_count, self.batch_size):
               batch_end = min(batch_start + self.batch_size, total_count)
               batch = queryset[batch_start:batch_end]
               
               self.stdout.write(f'📦 Processing batch {batch_start + 1}-{batch_end} of {total_count}')
               
               with transaction.atomic():
                    for company in batch:
                         try:
                              self.stats['company']['processed'] += 1
                              
                              if self.migrate_single_company(company):
                                   self.stats['company']['migrated'] += 1
                              else:
                                   self.stats['company']['skipped'] += 1
                                   
                         except Exception as e:
                              self.stats['company']['errors'] += 1
                              self.stdout.write(
                                   self.style.ERROR(f'❌ Error migrating company {company.id}: {str(e)}')
                              )
                              if self.verbose:
                                   logger.exception(f"Error migrating Company {company.id}")

     def migrate_single_company(self, company):
          """Migrate a single Company's images"""
          migrated = False
          updated_fields = []
          
          # Get company admin
          company_user = self.get_company_user(company)
          
          if not company_user:
               if self.verbose:
                    self.stdout.write(
                    self.style.WARNING(f'⚠️ No user found for company {company.id}, skipping')
                    )
               return False
          
          if self.dry_run:
               files_to_migrate = []
               
               if company.cover_image_url:
                    files_to_migrate.append(f'cover_image: {company.cover_image_url}')
               if company.image_url:
                    files_to_migrate.append(f'logo: {company.image_url}')
               
               if files_to_migrate:
                    self.stdout.write(
                    f'🔍 Would migrate Company {company.id} ({company.name}): {", ".join(files_to_migrate)}'
                    )
                    return True
               return False
          
          # Migrate cover image
          if company.cover_image_url and (not company.cover_image_file or self.force):
               cover_image_file = self.create_file_upload(
                    user=company_user,
                    file_path=company.cover_image_url,
                    file_type=FILE_TYPES.COMPANY_IMAGE,
                    original_filename=self.extract_filename_from_url(company.cover_image_url, FILE_TYPES.COMPANY_IMAGE),
                    created_at=company.created_at or timezone.now(),
                    is_user_required=False,
                    is_file_type_required=True
               )
               
               if cover_image_file:
                    company.cover_image_file = cover_image_file
                    updated_fields.append('cover_image_file')
                    migrated = True
          
          # Migrate logo
          if company.image_url and (not company.image_file or self.force):
               logo_file = self.create_file_upload(
                    user=company_user,
                    file_path=company.image_url,
                    file_type=FILE_TYPES.COMPANY_IMAGE,
                    original_filename=self.extract_filename_from_url(company.image_url, FILE_TYPES.COMPANY_IMAGE),
                    created_at=company.created_at or timezone.now(),
                    is_user_required=False,
                    is_file_type_required=True
               )
               
               if logo_file:
                    company.image_file = logo_file
                    updated_fields.append('image_file')
                    migrated = True
          
          if updated_fields:
               company.save(update_fields=updated_fields)
               
               if self.verbose:
                    self.stdout.write(
                    self.style.SUCCESS(f'✅ Migrated Company {company.id} ({company.name}): {", ".join(updated_fields)}')
                    )
          
          return migrated

     def migrate_job_seeker_project_images(self):
          """Migrate JobSeekerProject images"""
          self.stdout.write('\n🚀 Migrating JobSeekerProject images...')
          
          # Find projects with image URLs but no file references
          queryset = JobSeekerProject.objects.exclude(
               project_image_url__isnull=True
          ).exclude(
               project_image_url__exact=''
          )
          
          if not self.force:
               queryset = queryset.filter(project_image_file__isnull=True)
          
          total_count = queryset.count()
          self.stdout.write(f'📊 Found {total_count} JobSeekerProject records to process')
          
          for batch_start in range(0, total_count, self.batch_size):
               batch_end = min(batch_start + self.batch_size, total_count)
               batch = queryset[batch_start:batch_end]
               
               self.stdout.write(f'📦 Processing batch {batch_start + 1}-{batch_end} of {total_count}')
               
               with transaction.atomic():
                    for project in batch:
                         try:
                              self.stats['job_seeker_project']['processed'] += 1
                              
                              if self.migrate_single_job_seeker_project(project):
                                   self.stats['job_seeker_project']['migrated'] += 1
                              else:
                                   self.stats['job_seeker_project']['skipped'] += 1
                                   
                         except Exception as e:
                              self.stats['job_seeker_project']['errors'] += 1
                              self.stdout.write(
                                   self.style.ERROR(f'❌ Error migrating project {project.id}: {str(e)}')
                              )
                              if self.verbose:
                                   logger.exception(f"Error migrating JobSeekerProject {project.id}")

     def migrate_single_job_seeker_project(self, project):
          """Migrate a single JobSeekerProject image"""
          if not project.project_image_url:
               return False
          
          if project.project_image_file and not self.force:
               if self.verbose:
                    self.stdout.write(f'⏭️  Skipping project {project.id} - already has FileUpload reference')
               return False
          
          if self.dry_run:
               self.stdout.write(
                    f'🔍 Would migrate JobSeekerProject {project.id} ({project.title}): {project.project_image_url}'
               )
               return True
          
          # Create FileUpload record
          file_upload = self.create_file_upload(
               user=project.user.user,
               file_path=project.project_image_url,
               file_type=FILE_TYPES.PROJECT_IMAGE,
               original_filename=self.extract_filename_from_url(project.project_image_url, 'project_image'),
               created_at=project.created_at or timezone.now()
          )
          
          if file_upload:
               project.project_image_file = file_upload
               project.save(update_fields=['project_image_file'])
               
               if self.verbose:
                    self.stdout.write(
                    self.style.SUCCESS(f'✅ Migrated JobSeekerProject {project.id} ({project.title})')
                    )
               return True
          
          return False

     def create_file_upload(self, user, file_path, file_type, original_filename, created_at, is_user_required=True, is_file_type_required=True):
          """Create a FileUpload record"""
          try:
               # Check if FileUpload already exists for this path
               existing = FileUpload.objects.filter(
                    file_path=file_path
               )
               
               if is_user_required:
                    existing = existing.filter(
                         user=user
                    )
               
               if is_file_type_required:
                    existing = existing.filter(
                         file_type=file_type
                    )
               
               existing = existing.first()
               
               if existing:
                    self.stdout.write(f'🔄 Reusing existing FileUpload for {file_path}')
                    if self.verbose:
                         self.stdout.write(f'🔄 Reusing existing FileUpload for {file_path}')
                    return existing
               
               file_upload = FileUpload.objects.create(
                    id=uuid.uuid4(),
                    user=user,
                    file_type=file_type,
                    original_filename=original_filename,
                    file_path=file_path,
                    file_size=0,
                    upload_status='uploaded',
                    uploaded_at=created_at,
                    reference_count=1,
                    created_at=created_at,
                    is_protected=True,
               )
               
               return file_upload
               
          except IntegrityError as e:
               self.stdout.write(
                    self.style.ERROR(f'❌ Database integrity error creating FileUpload: {str(e)}')
               )
               return None
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f'❌ Error creating FileUpload: {str(e)}')
               )
               return None

     def get_company_user(self, company):
          """Get a user associated with the company"""
          # Try to get company admin
          admins = company.admins
          
          if not admins:
               return None
          
          return admins.first()

     def extract_filename_from_url(self, url, file_type):
          """Extract filename from URL or generate a default name"""
          try:
               parsed_url = urlparse(url)
               filename = parsed_url.path.split('/')[-1]
               
               if filename and '.' in filename:
                    return filename
               else:
                    # Generate default filename
                    return f'migrated_{file_type}_{uuid.uuid4().hex[:8]}'
                    
          except Exception:
               return f'migrated_{file_type}_{uuid.uuid4().hex[:8]}'

     def display_migration_summary(self):
          """Display migration statistics"""
          self.stdout.write('\n' + '=' * 60)
          self.stdout.write(self.style.SUCCESS('📊 MIGRATION SUMMARY'))
          self.stdout.write('=' * 60)
          
          total_processed = 0
          total_migrated = 0
          total_skipped = 0
          total_errors = 0
          
          for model_name, stats in self.stats.items():
               if stats['processed'] > 0:
                    self.stdout.write(f'\n📋 {model_name.replace("_", " ").title()}:')
                    self.stdout.write(f'   Processed: {stats["processed"]}')
                    self.stdout.write(f'   Migrated:  {stats["migrated"]}')
                    self.stdout.write(f'   Skipped:   {stats["skipped"]}')
                    self.stdout.write(f'   Errors:    {stats["errors"]}')
                    
                    total_processed += stats['processed']
                    total_migrated += stats['migrated']
                    total_skipped += stats['skipped']
                    total_errors += stats['errors']
          
          self.stdout.write(f'\n🎯 OVERALL TOTALS:')
          self.stdout.write(f'   Total Processed: {total_processed}')
          self.stdout.write(f'   Total Migrated:  {total_migrated}')
          self.stdout.write(f'   Total Skipped:   {total_skipped}')
          self.stdout.write(f'   Total Errors:    {total_errors}')
          
          if total_errors == 0:
               self.stdout.write(self.style.SUCCESS('\n✅ Migration completed successfully!'))
          else:
               self.stdout.write(self.style.WARNING(f'\n⚠️  Migration completed with {total_errors} errors'))
          
          if self.dry_run:
               self.stdout.write(self.style.WARNING('\n🔍 This was a dry run - no changes were made'))