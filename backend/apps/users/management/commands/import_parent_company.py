from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from core.constants.s3.constants import FILE_TYPES
from core.constants.constants import PARENT_COMPANY
from services.company.company_service import get_or_create_parent_company, update_parent_company
from apps.authentication.models import FileUpload
from apps.users.models import TalentCloudUser
import logging
import uuid

logger = logging.getLogger(__name__)

class Command(BaseCommand):
     help = 'Import parent company: create if not exists, update if changes detected, create FileUpload records for images'
     
     def add_arguments(self, parser):
          parser.add_argument(
               '--dry-run',
               action='store_true',
               help='Show what would be done without making changes',
          )
          parser.add_argument(
               '--force-file-upload',
               action='store_true',
               help='Force creation of FileUpload records even if they exist',
          )
          parser.add_argument(
               '--verbose',
               action='store_true',
               help='Enable verbose logging',
          )
     
     def handle(self, *args, **options):
          """
          Import parent company with smart logic:
          - Create if not exists
          - Update if changes detected (including FileUploads)
          - Create FileUpload records for company images
          - Do nothing if up to date
          """
          dry_run = options.get('dry_run', False)
          force_file_upload = options.get('force_file_upload', False)
          self.verbose = options.get('verbose', False)
          
          if dry_run:
               self.stdout.write(
                    self.style.WARNING("🔍 DRY RUN MODE - No changes will be made")
               )
          
          if force_file_upload:
               self.stdout.write(
                    self.style.WARNING("⚡ FORCE FILE UPLOAD MODE - Will recreate FileUpload records")
               )
          
          self.stdout.write("🏢 Starting parent company import process...")
          
          try:
               self._validate_constants()
               
               with transaction.atomic():
                    result = self._import_parent_company(dry_run, force_file_upload)
                    
                    if not dry_run and result.get('company'):
                         file_upload_results = self._handle_file_uploads(
                         result['company'], 
                         dry_run, 
                         force_file_upload
                         )
                         result['file_uploads'] = file_upload_results
               
               self._display_result(result)
               
          except ValidationError as e:
               self.stdout.write(
                    self.style.ERROR(f"❌ Import failed: {str(e)}")
               )
               logger.error(f"Parent company import failed: {str(e)}")
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f"❌ Unexpected error: {str(e)}")
               )
               logger.error(f"Unexpected error in parent company import: {str(e)}")
     
     def _validate_constants(self):
          """Validate PARENT_COMPANY constants are properly configured"""
          if not hasattr(PARENT_COMPANY, 'name') or not PARENT_COMPANY.name:
               raise ValidationError("PARENT_COMPANY.name is not configured")
          
          required_fields = ['industry', 'description', 'contact_email']
          missing = [f for f in required_fields if not hasattr(PARENT_COMPANY, f) or not getattr(PARENT_COMPANY, f)]
          
          if missing:
               raise ValidationError(f"Missing PARENT_COMPANY constants: {', '.join(missing)}")
          
          # Validate image URL fields for FileUpload creation
          image_fields = ['image_url', 'cover_image_url', 'company_image_urls']
          for field in image_fields:
               if hasattr(PARENT_COMPANY, field):
                    value = getattr(PARENT_COMPANY, field)
                    if field == 'company_image_urls':
                         if not isinstance(value, (list, tuple)):
                              raise ValidationError(f"PARENT_COMPANY.{field} must be a list")
                         
                         # Remove duplicates while preserving order
                         unique_urls = []
                         seen = set()
                         for url in value:
                              if url not in seen:
                                   unique_urls.append(url)
                                   seen.add(url)
                                   
                         if len(unique_urls) != len(value):
                              self.stdout.write(
                                   self.style.WARNING(f"⚠️  Removed {len(value) - len(unique_urls)} duplicate URLs from company_image_urls")
                              )
          
          self.stdout.write(f"✅ Constants validated for: {PARENT_COMPANY.name}")
     
     def _import_parent_company(self, dry_run, force_file_upload):
          """
          Core import logic with enhanced FileUpload checking
          
          Returns:
               dict: Result with action taken and company info
          """
          from apps.companies.models import Company
          
          try:
               company = Company.objects.get(name=PARENT_COMPANY.name)
               
               self.stdout.write(f"📦 Found existing parent company: '{company.name}' (ID: {company.id})")
               
               if self._needs_update(company):
                    self.stdout.write("🔄 Company data differs from constants - update needed")
                    
                    if dry_run:
                         self._show_update_preview(company)
                         return {'action': 'would_update', 'company': company}
                    
                    updated_company = self._update_parent_company_with_images(company)
                    self.stdout.write("✅ Parent company updated successfully!")
                    
                    return {'action': 'updated', 'company': updated_company}
               else:
                    self.stdout.write("✅ Company is already up to date - no action needed")
                    return {'action': 'no_change', 'company': company}
                    
          except Company.DoesNotExist:
               self.stdout.write(f"📦 Parent company '{PARENT_COMPANY.name}' not found - creating new")
               
               if dry_run:
                    return {'action': 'would_create', 'company': None}
               
               company = self._create_parent_company_with_images()
               self.stdout.write("✅ Parent company created successfully!")
               
               return {'action': 'created', 'company': company}
     
     def _needs_update(self, company):
          """
          Check if company needs update including FileUpload references
          """
          try:
               # Check basic fields
               if (company.description != PARENT_COMPANY.description or
                    company.contact_email != PARENT_COMPANY.contact_email or
                    company.website != getattr(PARENT_COMPANY, 'website', None)):
                    if self.verbose:
                         self.stdout.write("🔍 Basic fields need update")
                    return True
               
               # Check industry
               if not company.industry or company.industry.name != PARENT_COMPANY.industry:
                    if self.verbose:
                         self.stdout.write("🔍 Industry needs update")
                    return True
               
               # Check verification status
               if not company.is_verified:
                    if self.verbose:
                         self.stdout.write("🔍 Verification status needs update")
                    return True
               
               # Check FileUpload references instead of URL fields
               if self._file_uploads_need_update(company):
                    if self.verbose:
                         self.stdout.write("🔍 FileUpload references need update")
                    return True
                    
               return False
               
          except Exception as e:
               logger.warning(f"Error checking update needs: {str(e)}")
               return True
     
     def _file_uploads_need_update(self, company):
          """Check if FileUpload references need updating"""
          # Check if logo FileUpload needs to be created/updated
          expected_logo_path = getattr(PARENT_COMPANY, 'image_url', None)
          if expected_logo_path:
               if not company.image_file or company.image_file.file_path != expected_logo_path:
                    return True
          
          # Check if cover image FileUpload needs to be created/updated
          expected_cover_path = getattr(PARENT_COMPANY, 'cover_image_url', None)
          if expected_cover_path:
               if not company.cover_image_file or company.cover_image_file.file_path != expected_cover_path:
                    return True
          
          # Check company image URLs (stored in JSONField)
          expected_images = getattr(PARENT_COMPANY, 'company_image_urls', [])
          current_images = company.company_image_urls or []
          
          # Remove duplicates from expected images
          unique_expected = []
          seen = set()
          for url in expected_images:
               if url not in seen:
                    unique_expected.append(url)
                    seen.add(url)
          
          if set(current_images) != set(unique_expected):
               return True
          
          return False
     
     def _show_update_preview(self, company):
          """Show what would be updated in dry run mode"""
          self.stdout.write("📋 Update Preview:")
          
          # Basic fields
          if company.description != PARENT_COMPANY.description:
               self.stdout.write(f"   Description: '{company.description}' → '{PARENT_COMPANY.description}'")
          
          if company.contact_email != PARENT_COMPANY.contact_email:
               self.stdout.write(f"   Contact Email: '{company.contact_email}' → '{PARENT_COMPANY.contact_email}'")
          
          # FileUpload references
          expected_logo = getattr(PARENT_COMPANY, 'image_url', None)
          current_logo_path = company.image_file.file_path if company.image_file else None
          if expected_logo and current_logo_path != expected_logo:
               self.stdout.write(f"   Logo FileUpload: '{current_logo_path}' → '{expected_logo}'")
          
          expected_cover = getattr(PARENT_COMPANY, 'cover_image_url', None)
          current_cover_path = company.cover_image_file.file_path if company.cover_image_file else None
          if expected_cover and current_cover_path != expected_cover:
               self.stdout.write(f"   Cover Image FileUpload: '{current_cover_path}' → '{expected_cover}'")
          
          expected_images = getattr(PARENT_COMPANY, 'company_image_urls', [])
          current_images = company.company_image_urls or []
          if set(current_images) != set(expected_images):
               self.stdout.write(f"   Company Images: {len(current_images)} → {len(expected_images)} images")
     
     def _create_parent_company_with_images(self):
          """Create parent company with FileUpload references"""
          company = get_or_create_parent_company(PARENT_COMPANY.name)
          
          # Update with company image URLs JSONField
          return self._update_company_images(company)
     
     def _update_parent_company_with_images(self, company):
          """Update existing parent company including FileUpload references"""
          # Use existing service for basic updates
          updated_company = update_parent_company()
          
          # Update company images JSONField
          return self._update_company_images(updated_company)
     
     def _update_company_images(self, company):
          """Update company with image URLs in JSONField (removed direct URL field updates)"""
          updated = False
          
          # Note: We don't directly set image_url and cover_image_url anymore
          # These are now properties that get values from FileUpload foreign keys
          # We only update the company_image_urls JSONField
          
          # Update company image URLs JSONField (remove duplicates)
          if hasattr(PARENT_COMPANY, 'company_image_urls'):
               unique_images = []
               seen = set()
               for url in PARENT_COMPANY.company_image_urls:
                    if url not in seen:
                         unique_images.append(url)
                         seen.add(url)
               
               if company.company_image_urls != unique_images:
                    company.company_image_urls = unique_images
                    updated = True
          
          if updated:
               company.save()
               if self.verbose:
                    self.stdout.write("🖼️  Updated company image URLs JSONField")
          
          return company
     
     def _handle_file_uploads(self, company, dry_run, force_file_upload):
          """Handle FileUpload record creation for company images"""
          self.stdout.write("\n📁 Processing FileUpload records for company images...")
          
          results = {
               'logo': None,
               'cover_image': None,
               'company_images': [],
               'created_count': 0,
               'existing_count': 0,
               'errors': 0
          }
          
          # Get or create admin user for file uploads
          admin_user = self._get_admin_user()
          if not admin_user:
               self.stdout.write(
                    self.style.WARNING("⚠️  No admin user found - skipping FileUpload creation")
               )
               return results
          
          # Process logo FileUpload (using constants, not company.image_url property)
          expected_logo_path = getattr(PARENT_COMPANY, 'image_url', None)
          if expected_logo_path:
               result = self._create_or_get_file_upload(
                    user=admin_user,
                    file_path=expected_logo_path,
                    file_type=FILE_TYPES.COMPANY_IMAGE,
                    original_filename=self._extract_filename(expected_logo_path, 'logo'),
                    dry_run=dry_run,
                    force=force_file_upload
               )
               results['logo'] = result
               if result['action'] == 'created':
                    results['created_count'] += 1
                    # Update company foreign key
                    if not dry_run:
                         company.image_file = result['file_upload']
               elif result['action'] == 'existing':
                    results['existing_count'] += 1
                    # Ensure foreign key is set even if FileUpload exists
                    if not dry_run and not company.image_file:
                         company.image_file = result['file_upload']
               elif result['action'] == 'error':
                    results['errors'] += 1
          
          # Process cover image FileUpload (using constants, not company.cover_image_url property)
          expected_cover_path = getattr(PARENT_COMPANY, 'cover_image_url', None)
          if expected_cover_path:
               result = self._create_or_get_file_upload(
                    user=admin_user,
                    file_path=expected_cover_path,
                    file_type=FILE_TYPES.COMPANY_IMAGE,
                    original_filename=self._extract_filename(expected_cover_path, 'cover'),
                    dry_run=dry_run,
                    force=force_file_upload
               )
               results['cover_image'] = result
               if result['action'] == 'created':
                    results['created_count'] += 1
                    # Update company foreign key
                    if not dry_run:
                         company.cover_image_file = result['file_upload']
               elif result['action'] == 'existing':
                    results['existing_count'] += 1
                    # Ensure foreign key is set even if FileUpload exists
                    if not dry_run and not company.cover_image_file:
                         company.cover_image_file = result['file_upload']
               elif result['action'] == 'error':
                    results['errors'] += 1
          
          # Process company images
          if company.company_image_urls:
               for i, image_url in enumerate(company.company_image_urls):
                    result = self._create_or_get_file_upload(
                         user=admin_user,
                         file_path=image_url,
                         file_type=FILE_TYPES.COMPANY_IMAGE,
                         original_filename=self._extract_filename(image_url, f'company_image_{i+1}'),
                         dry_run=dry_run,
                         force=force_file_upload
                    )
                    results['company_images'].append(result)
                    if result['action'] == 'created':
                         results['created_count'] += 1
                    elif result['action'] == 'existing':
                         results['existing_count'] += 1
                    elif result['action'] == 'error':
                         results['errors'] += 1
          
          # Save company with updated foreign keys
          if not dry_run and (results['created_count'] > 0 or force_file_upload):
               company.save()
          
          return results
     
     def _create_or_get_file_upload(self, user, file_path, file_type, original_filename, dry_run, force):
          """Create or get FileUpload record"""
          try:
               # Check if FileUpload already exists
               existing = FileUpload.objects.filter(
                    file_path=file_path,
                    user=user,
                    file_type=file_type
               ).first()
               
               if existing and not force:
                    if self.verbose:
                         self.stdout.write(f"📎 Found existing FileUpload for {file_path}")
                    return {'action': 'existing', 'file_upload': existing}
               
               if dry_run:
                    action = 'would_create' if not existing else 'would_recreate'
                    self.stdout.write(f"🔍 {action.replace('_', ' ').title()} FileUpload for: {file_path}")
                    return {'action': action, 'file_upload': None}
               
               # Delete existing if force mode
               if existing and force:
                    existing.delete()
                    if self.verbose:
                         self.stdout.write(f"🗑️  Deleted existing FileUpload for: {file_path}")
               
               # Create new FileUpload
               file_upload = FileUpload.objects.create(
                    id=uuid.uuid4(),
                    user=user,
                    file_type=file_type,
                    original_filename=original_filename,
                    file_path=file_path,
                    file_size=0,
                    upload_status='uploaded',
                    uploaded_at=timezone.now(),
                    reference_count=1,
                    is_protected=True,  # Protect parent company files
                    created_at=timezone.now(),
               )
               
               action = 'created' if not existing else 'recreated'
               if self.verbose:
                    self.stdout.write(f"✅ {action.title()} FileUpload for: {file_path}")
               
               return {'action': 'created', 'file_upload': file_upload}
               
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f"❌ Error creating FileUpload for {file_path}: {str(e)}")
               )
               return {'action': 'error', 'file_upload': None, 'error': str(e)}
     
     def _get_admin_user(self):
          """Get admin user for file uploads"""
          try:
               # Get primary super admin user
               admin_user = TalentCloudUser.objects.filter(
                    email='sa@tc.io'
               ).first()
               
               if not admin_user:
                    # Fallback to any admin user
                    admin_user = TalentCloudUser.objects.filter(
                         role__name='super_admin'
                    ).first()
               
               if admin_user and self.verbose:
                    self.stdout.write(f"👤 Using admin user: {admin_user.email}")
               
               return admin_user
               
          except Exception as e:
               logger.error(f"Error getting admin user: {str(e)}")
               return None
     
     def _extract_filename(self, file_path, prefix):
          """Extract filename from path or generate default"""
          try:
               if '/' in file_path:
                    filename = file_path.split('/')[-1]
                    if filename and '.' in filename:
                         return filename
               
               # Generate default filename
               return f"{prefix}_{uuid.uuid4().hex[:8]}.jpg"
               
          except Exception:
               return f"{prefix}_{uuid.uuid4().hex[:8]}.jpg"
     
     def _display_result(self, result):
          """Display the final result with FileUpload information"""
          action = result['action']
          company = result.get('company')
          file_uploads = result.get('file_uploads', {})
          
          self.stdout.write("\n" + "=" * 60)
          
          if action == 'created':
               self.stdout.write(self.style.SUCCESS("🎉 RESULT: Parent company created"))
          elif action == 'updated':
               self.stdout.write(self.style.SUCCESS("🔄 RESULT: Parent company updated"))
          elif action == 'no_change':
               self.stdout.write(self.style.SUCCESS("✅ RESULT: No changes needed"))
          elif action == 'would_create':
               self.stdout.write(self.style.HTTP_INFO("🔍 RESULT: Would create parent company"))
          elif action == 'would_update':
               self.stdout.write(self.style.HTTP_INFO("🔍 RESULT: Would update parent company"))
          
          if company:
               self.stdout.write(f"\n📊 Company Details:")
               self.stdout.write(f"   Name: {company.name} (ID: {company.id})")
               self.stdout.write(f"   Industry: {company.industry.name if company.industry else 'N/A'}")
               self.stdout.write(f"   Verified: {company.is_verified}")
               # Use properties to show URLs (these get values from FileUpload foreign keys)
               self.stdout.write(f"   Logo URL (via property): {company.image_url or 'N/A'}")
               self.stdout.write(f"   Cover Image URL (via property): {company.cover_image_url or 'N/A'}")
               # Also show FileUpload paths for debugging
               self.stdout.write(f"   Logo FileUpload: {company.image_file.file_path if company.image_file else 'N/A'}")
               self.stdout.write(f"   Cover FileUpload: {company.cover_image_file.file_path if company.cover_image_file else 'N/A'}")
               self.stdout.write(f"   Company Images: {len(company.company_image_urls or [])}")
          
          if file_uploads:
               self.stdout.write(f"\n📁 FileUpload Results:")
               self.stdout.write(f"   Created: {file_uploads.get('created_count', 0)}")
               self.stdout.write(f"   Existing: {file_uploads.get('existing_count', 0)}")
               self.stdout.write(f"   Errors: {file_uploads.get('errors', 0)}")
          
          self.stdout.write("=" * 60)