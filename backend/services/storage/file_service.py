from services.storage.s3_service import S3Service

class FileUrlService:
     """Service specifically for handling file URL generation"""
     @staticmethod
     def get_public_url_in_bulks(file_path_list):
          """Get public URL List for this files"""
          if not file_path_list:
               return None
          
          from services.storage.s3_service import S3Service
          file_url_list = []
          
          for file_path in file_path_list:
               if file_path:
                    file_url_list.append(S3Service.get_public_url(file_path))
          
          return file_url_list

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