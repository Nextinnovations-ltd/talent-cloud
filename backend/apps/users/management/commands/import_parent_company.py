from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from core.constants.constants import PARENT_COMPANY
from services.company.company_service import get_or_create_parent_company, update_parent_company
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
     help = 'Import parent company: create if not exists, update if changes detected, do nothing if up to date'
     
     def add_arguments(self, parser):
          parser.add_argument(
               '--dry-run',
               action='store_true',
               help='Show what would be done without making changes',
          )
     
     def handle(self, *args, **options):
          """
          Import parent company with smart logic:
          - Create if not exists
          - Update if changes detected  
          - Do nothing if up to date
          """
          dry_run = options.get('dry_run', False)
          
          if dry_run:
               self.stdout.write(
                    self.style.WARNING("🔍 DRY RUN MODE - No changes will be made")
               )
          
          self.stdout.write("🏢 Starting parent company import process...")
          
          try:
               self._validate_constants()
               
               result = self._import_parent_company(dry_run)
               
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
          
          self.stdout.write(f"✅ Constants validated for: {PARENT_COMPANY.name}")
     
     def _import_parent_company(self, dry_run):
          """
          Core import logic following the same pattern as update_parent_company service
          
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
                         return {'action': 'would_update', 'company': company}
                    
                    updated_company = update_parent_company()
                    self.stdout.write("✅ Parent company updated successfully!")
                    
                    return {'action': 'updated', 'company': updated_company}
               else:
                    self.stdout.write("✅ Company is already up to date - no action needed")
                    return {'action': 'no_change', 'company': company}
                    
          except Company.DoesNotExist:
               self.stdout.write(f"📦 Parent company '{PARENT_COMPANY.name}' not found - creating new")
               
               if dry_run:
                    return {'action': 'would_create', 'company': None}
               
               company = get_or_create_parent_company(PARENT_COMPANY.name)
               self.stdout.write("✅ Parent company created successfully!")
               
               return {'action': 'created', 'company': company}
     
     def _needs_update(self, company):
          """
          Check if company needs update (simplified version of your internal logic)
          """
          try:
               if (company.description != PARENT_COMPANY.description or
                    company.contact_email != PARENT_COMPANY.contact_email or
                    company.website != getattr(PARENT_COMPANY, 'website', None)):
                    return True
               
               # Check industry
               if not company.industry or company.industry.name != PARENT_COMPANY.industry:
                    return True
               
               # Check verification status
               if not company.is_verified:
                    return True
                    
               return False
               
          except Exception as e:
               logger.warning(f"Error checking update needs: {str(e)}")
               return True
     
     def _display_result(self, result):
          """Display the final result"""
          action = result['action']
          company = result.get('company')
          
          self.stdout.write("=" * 50)
          
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
               self.stdout.write(f"📊 Company: {company.name} (ID: {company.id})")
               self.stdout.write(f"🏭 Industry: {company.industry.name if company.industry else 'N/A'}")
               self.stdout.write(f"✅ Verified: {company.is_verified}")
          
          self.stdout.write("=" * 50)