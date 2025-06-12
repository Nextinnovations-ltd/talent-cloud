import boto3
from botocore.exceptions import ClientError
from django.conf import settings

class S3Service:
     @staticmethod
     def initialize_s3_client():
          s3_client = boto3.client("s3", aws_access_key_id=settings.AWS_ACCESS_KEY, aws_secret_access_key=settings.AWS_SECRET_KEY)

          return s3_client

     @staticmethod
     def generate_presigned_url(file_path, client_method = "put_object", expires_in = 60):
          try:
               s3_client = S3Service.initialize_s3_client()
              
               method_parameters = S3Service.generate_method_parameters(file_path)
               
               url = s3_client.generate_presigned_url(
                    ClientMethod=client_method, Params=method_parameters, ExpiresIn=expires_in
               )
               
               print("Presigned URL: %s", url)
               
               return url
          except ClientError:
               print("Couldn't get a presigned URL for client method '%s'.", client_method)
               raise

     #sample usage
     # method_parameters = {
     #             "Bucket": settings.S3_ASSETS_BUCKET_NAME,
     #             "Key": f"orders/dlfjd.jpeg",
     #             'ContentType': 'image/jpeg' (optional)
     #         }
     # client_method = "put_object" or "get_object"
     
     @staticmethod
     def generate_method_parameters(file_path):
          method_parameters = {
               "Bucket": settings.S3_ASSETS_BUCKET_NAME,
               "Key": file_path
          }
          
          return method_parameters