from typing import List, Dict, Any
from rest_framework.exceptions import ValidationError
from core.constants.constants import PARENT_COMPANY
from services.storage.s3_service import S3Service
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

def get_or_create_parent_company(name):
     from apps.companies.models import Company, Industry
     
     try:
          company = Company.objects.get(
               name=PARENT_COMPANY.name
          )
          
          print("Parent Company already exists!")
     except Company.DoesNotExist:
          from apps.users.models import Address
          
          print("Creating Company - Next Innovaion...")
          
          industry, created = Industry.objects.get_or_create(name=PARENT_COMPANY.industry)
          address = Address.objects.create(
               country_id=PARENT_COMPANY.country,
               city_id=PARENT_COMPANY.city,
               address=PARENT_COMPANY.address
          )
          
          company_data = {
               'name': PARENT_COMPANY.name,
               'description': PARENT_COMPANY.description,
               'industry': industry,
               'size': PARENT_COMPANY.size,
               'tagline': PARENT_COMPANY.tagline,
               'address': address,
               'contact_email': PARENT_COMPANY.contact_email,
               'contact_phone': PARENT_COMPANY.contact_phone,
               'founded_date': PARENT_COMPANY.founded_date,
               'is_verified': True,
               # 'image_url': PARENT_COMPANY.image_url,
               # 'cover_image_url': PARENT_COMPANY.cover_image_url,
               'company_image_urls': PARENT_COMPANY.company_image_urls,
               'website': PARENT_COMPANY.website,
               'facebook_url': PARENT_COMPANY.facebook_url,
               'linkedin_url': PARENT_COMPANY.linkedin_url,
               'instagram_url': PARENT_COMPANY.instagram_url,
          }
          
          company = Company.objects.create(**company_data)

     return company

def update_parent_company():
     """Update parent company with current constants"""
     from apps.companies.models import Company
     from apps.companies.models import Industry
     from core.constants.constants import PARENT_COMPANY
     
     try:
          company = Company.objects.get(name=PARENT_COMPANY.name)
          
          # Update basic fields only (not image URLs - they're properties now)
          company.description = PARENT_COMPANY.description
          company.contact_email = PARENT_COMPANY.contact_email
          company.website = getattr(PARENT_COMPANY, 'website', None)
          company.is_verified = True
          
          # Update industry
          if hasattr(PARENT_COMPANY, 'industry') and PARENT_COMPANY.industry:
               industry, _ = Industry.objects.get_or_create(name=PARENT_COMPANY.industry)
               company.industry = industry
          
          # Update company_image_urls JSONField only
          if hasattr(PARENT_COMPANY, 'company_image_urls'):
               # Remove duplicates
               unique_images = []
               seen = set()
               for url in PARENT_COMPANY.company_image_urls:
                    if url not in seen:
                         unique_images.append(url)
                         seen.add(url)
               company.company_image_urls = unique_images
          
          # DO NOT set image_url or cover_image_url directly - they're properties
          # These will be handled via FileUpload foreign keys in the import script
          
          company.save()
          return company
          
     except Company.DoesNotExist:
          raise ValidationError("Parent company not found for update")
     except Exception as e:
          raise ValidationError(f"Failed to update parent company: {str(e)}")

def _update_parent_company_internal(company):
     """
     Internal method to update parent company with PARENT_COMPANY constants
     
     Args:
          company: Existing Company instance
          
     Returns:
          Updated Company instance
     """
     from apps.companies.models import Industry
     from apps.users.models import Address
     
     try:
          with transaction.atomic():
               logger.info(f"Updating parent company '{company.name}' with PARENT_COMPANY constants")
               
               # Update industry if needed
               current_industry_name = company.industry.name if company.industry else None
               if current_industry_name != PARENT_COMPANY.industry:
                    logger.info(f"Updating industry from '{current_industry_name}' to '{PARENT_COMPANY.industry}'")
                    industry, created = Industry.objects.get_or_create(name=PARENT_COMPANY.industry)
                    
                    company.industry = industry
                    
                    if created:
                         logger.info(f"Created new industry: {PARENT_COMPANY.industry}")
               
               # Update address if needed
               address_updated = False
               
               if company.address:
                    address_changes = []
                    
                    if company.address.country_id != PARENT_COMPANY.country:
                         address_changes.append(f"country_id: {company.address.country_id} -> {PARENT_COMPANY.country}")
                         company.address.country_id = PARENT_COMPANY.country
                    
                    if company.address.city_id != PARENT_COMPANY.city:
                         address_changes.append(f"city_id: {company.address.city_id} -> {PARENT_COMPANY.city}")
                         company.address.city_id = PARENT_COMPANY.city
                    
                    if company.address.address != PARENT_COMPANY.address:
                         address_changes.append(f"address: '{company.address.address}' -> '{PARENT_COMPANY.address}'")
                         company.address.address = PARENT_COMPANY.address
                    
                    if address_changes:
                         company.address.save()
                         address_updated = True
                         logger.info(f"Updated address: {', '.join(address_changes)}")
               else:
                    # Create new address using constants
                    company.address = Address.objects.create(
                         country_id=PARENT_COMPANY.country,
                         city_id=PARENT_COMPANY.city,
                         address=PARENT_COMPANY.address
                    )
                    address_updated = True
                    logger.info("Created new address from PARENT_COMPANY constants")
               
               # Update company fields
               updated_fields = []
               company_updates = {
                    'name': PARENT_COMPANY.name,
                    'description': PARENT_COMPANY.description,
                    'size': PARENT_COMPANY.size,
                    'tagline': PARENT_COMPANY.tagline,
                    'contact_email': PARENT_COMPANY.contact_email,
                    'contact_phone': PARENT_COMPANY.contact_phone,
                    'founded_date': PARENT_COMPANY.founded_date,
                    # 'image_url': PARENT_COMPANY.image_url,
                    # 'cover_image_url': PARENT_COMPANY.cover_image_url,
                    'company_image_urls': PARENT_COMPANY.company_image_urls,
                    'website': PARENT_COMPANY.website,
                    'facebook_url': PARENT_COMPANY.facebook_url,
                    'linkedin_url': PARENT_COMPANY.linkedin_url,
                    'instagram_url': PARENT_COMPANY.instagram_url,
               }
               
               for field, new_value in company_updates.items():
                    current_value = getattr(company, field, None)
                    
                    if current_value != new_value:
                         logger.debug(f"Updating {field}: '{current_value}' -> '{new_value}'")
                         setattr(company, field, new_value)
                         updated_fields.append(field)
               
               # Ensure parent company is verified
               if not company.is_verified:
                    company.is_verified = True
                    updated_fields.append('is_verified')
               
               # Save company if any updates were made
               if updated_fields or address_updated:
                    company.save(update_fields=updated_fields if updated_fields else None)
                    
                    update_summary = []
                    if updated_fields:
                         update_summary.append(f"company fields: {updated_fields}")
                    if address_updated:
                         update_summary.append("address")
                    
                    logger.info(f"Successfully updated parent company: {', '.join(update_summary)}")
               else:
                    logger.info("Parent company is already up to date with PARENT_COMPANY constants")
                    
     except Exception as e:
          logger.error(f"Failed to update parent company: {str(e)}")
          raise ValidationError(f"Failed to update parent company: {str(e)}")
     
     return company

class BulkUploadService:
     """Service for handling bulk file uploads"""
     
     @staticmethod
     def initiate_bulk_upload(user, files_data: List[Dict]) -> Dict[str, Any]:
          """
          Initiate bulk upload process
          
          Args:
               user: User instance
               files_data: List of file data dictionaries
               
          Returns:
               Bulk upload initiation results
          """
          try:
               if not files_data or not isinstance(files_data, list):
                    raise ValidationError("files_data must be a non-empty list")
               
               if len(files_data) > 5:  # Limit bulk uploads
                    raise ValidationError("Maximum 5 files allowed per bulk upload")
               
               # Validate each file data
               for i, file_data in enumerate(files_data):
                    required_fields = ['filename', 'file_size', 'file_type']
                    for field in required_fields:
                         if field not in file_data:
                              raise ValidationError(f"File {i+1}: Missing required field '{field}'")
               
               # Generate presigned URLs for all files
               results = S3Service.generate_bulk_presigned_upload_urls(
                    files_data=files_data,
                    user=user
               )
               
               logger.info(f"Initiated bulk upload for user {user.id}: {results['success_count']} successful, {results['error_count']} failed")
               
               # Return only upload url and upload id
               response_data = [
                    {
                         "upload_url": record["upload_url"],
                         "upload_id": record["upload_id"],
                         "filename": record["filename"]
                    }
                    for record in results['successful_uploads']
               ] if results['successful_uploads'] else []
               
               return response_data
               
          except Exception as e:
               logger.error(f"Bulk upload initiation failed for user {user.id}: {str(e)}")
               raise ValidationError(f"Failed to initiate bulk upload: {str(e)}")
     
     @staticmethod
     def complete_bulk_upload(user, upload_ids: List[int]) -> Dict[str, Any]:
          """
          Complete bulk upload process and validate files
          
          Args:
               user: Django user instance
               upload_ids: List of upload IDs to complete
               
          Returns:
               Bulk upload completion results
          """
          try:
               if not upload_ids or not isinstance(upload_ids, list):
                    raise ValidationError("upload_ids must be a non-empty list")
               
               with transaction.atomic():
                    # Validate and update upload statuses
                    results = S3Service.validate_bulk_upload_completion(
                         upload_ids=upload_ids,
                         user=user
                    )
                    
                    if "success_records" in results:
                         from apps.users.serializers import FileUploadSerializer
                         
                         results["success_records"] = FileUploadSerializer(
                              results["success_records"], many=True
                         ).data
               
               logger.info(f"Completed bulk upload for user {user.id}: {results['success_count']} successful, {results['error_count']} failed")
               
               return {
                    'success': True,
                    'message': f"Bulk upload completed for {results['success_count']} files",
                    'data': results
               }
               
          except Exception as e:
               logger.error(f"Bulk upload completion failed for user {user.id}: {str(e)}")
               raise ValidationError(f"Failed to complete bulk upload: {str(e)}")
     
     # @staticmethod
     # def delete_bulk_files_by_user(user, file_paths: List[str]) -> Dict[str, Any]:
     #      """
     #      Delete multiple files belonging to a user
          
     #      Args:
     #           user: Django user instance
     #           file_paths: List of file paths to delete
               
     #      Returns:
     #           Bulk deletion results
     #      """
     #      try:
     #           # Verify user owns these files (security check)
     #           from apps.authentication.models import FileUpload
               
     #           user_file_paths = list(
     #                FileUpload.objects.filter(
     #                     user=user,
     #                     file_path__in=file_paths
     #                ).values_list('file_path', flat=True)
     #           )
               
     #           # Only delete files that belong to the user
     #           if len(user_file_paths) != len(file_paths):
     #                unauthorized_paths = set(file_paths) - set(user_file_paths)
     #                logger.warning(f"User {user.id} attempted to delete unauthorized files: {unauthorized_paths}")
     #                raise ValidationError("Some files do not belong to this user")
               
     #           # Perform bulk deletion
     #           results = S3Service.delete_bulk_files(file_paths)
               
     #           # Update database records
     #           if results['successful_deletions']:
     #                FileUpload.objects.filter(
     #                     user=user,
     #                     file_path__in=results['successful_deletions']
     #                ).update(upload_status='deleted')
               
     #           logger.info(f"Bulk deletion for user {user.id}: {results['success_count']} successful, {results['error_count']} failed")
               
     #           return {
     #                'success': True,
     #                'message': f"Bulk deletion completed for {results['success_count']} files",
     #                'data': results
     #           }
               
     #      except Exception as e:
     #           logger.error(f"Bulk deletion failed for user {user.id}: {str(e)}")
     #           raise ValidationError(f"Failed to delete files: {str(e)}")