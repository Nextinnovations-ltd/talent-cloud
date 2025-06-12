from apps.companies.models import Company
from core.constants.constants import PARENT_COMPANY


def get_or_create_parent_company(name):
     try:
          company = Company.objects.get(
               name=PARENT_COMPANY.name
          )
          
          print("Parent Company already exists!")
     except Company.DoesNotExist:
          print("Creating Company - Next Innovaion...")
          
          company_data = {
               'name': PARENT_COMPANY.name,
               'description': PARENT_COMPANY.description,
               'image_url': PARENT_COMPANY.image_url,
               'website': PARENT_COMPANY.website,
               'industry': PARENT_COMPANY.industry,
               'size': PARENT_COMPANY.size,
               'tagline': PARENT_COMPANY.tagline,
               'address': PARENT_COMPANY.address,
               'contact_email': PARENT_COMPANY.contact_email,
               'contact_phone': PARENT_COMPANY.contact_phone,
               'founded_date': PARENT_COMPANY.founded_date,
               'is_verified': True,
          }
          
          company = Company.objects.create(**company_data)

     return company