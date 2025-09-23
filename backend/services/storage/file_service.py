from services.storage.s3_service import S3Service

class FileUrlService:
     """Service specifically for handling file URL generation"""
     @staticmethod
     def get_resume_public_url(file_path: str) -> str:
          """Generate public URL for resume file"""
          if not file_path:
               return None
          return S3Service.get_public_url(file_path)
     
     @staticmethod
     def get_profile_image_public_url(file_path: str) -> str:
          """Generate public URL for profile image"""
          if not file_path:
               return None
          return S3Service.get_public_url(file_path)
     
     @staticmethod
     def get_cover_letter_public_url(file_path: str) -> str:
          """Generate public URL for cover letter"""
          if not file_path:
               return None
          return S3Service.get_public_url(file_path)