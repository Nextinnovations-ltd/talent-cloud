import jwt, datetime, string, random
from decouple import config
from rest_framework import exceptions
from django.core.exceptions import ValidationError
from core.constants.constants import ROLES

class TokenUtil:
     @staticmethod
     def generate_random_string(length=255):
          return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

     @staticmethod
     def generate_verification_code(length=6):
          return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

     @staticmethod
     def generate_expiration_time(seconds=60):
          return datetime.datetime.now(datetime.UTC) + datetime.timedelta(seconds=seconds)

     @staticmethod
     def is_expired(expired_at):
          return expired_at < datetime.datetime.now(datetime.timezone.utc)
     
     @staticmethod
     def generate_access_token(id, role, minutes = 60):
          return jwt.encode({
               'user_id': id,
               'role': role,
               'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=minutes),
               'iat': datetime.datetime.now(datetime.UTC),
          }, config('ACCESS_SECRET', default='access_secret'), algorithm=config('ENCRYPTION_ALGORITHM', default='HS256'))

     
     @staticmethod# Decode the access token to payload
     def decode_access_token(token):
          try:
               payload = jwt.decode(token, config('ACCESS_SECRET', default='access_secret'), algorithms=config('ENCRYPTION_ALGORITHM', default='HS256'))
               return {
                    'user_id': payload['user_id'],
                    'role': payload['role']
               }
          except jwt.ExpiredSignatureError:
               raise exceptions.PermissionDenied("Access token is expired.")
          except jwt.InvalidTokenError:
               raise exceptions.PermissionDenied("Access token is invalid.")

     
     @staticmethod# Generate refresh token using the specific algorithm and secret key
     def generate_refresh_token(id, role = ROLES.USER):
          return jwt.encode({
               'user_id': id,
               # 'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=7),
               'role': role,
               'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=300),
               'iat': datetime.datetime.now(datetime.UTC),
          }, config('REFRESH_SECRET', default='refresh_secret'), algorithm=config('ENCRYPTION_ALGORITHM', default='HS256'))

     
     @staticmethod# Decode the refresh token to payload
     def decode_refresh_token(token):
          try:
               payload = jwt.decode(token, config('REFRESH_SECREt', default='refresh_secret'), algorithms=config('ENCRYPTION_ALGORITHM', default='HS256'))
               # return payload['user_id']
               return payload
          except jwt.ExpiredSignatureError:
               raise exceptions.PermissionDenied("Your session is expired. Please Login again.")
          except jwt.InvalidTokenError:
               raise exceptions.PermissionDenied("Refresh token is invalid.")

     @staticmethod     
     def generate_encoded_token(value):
          return jwt.encode({
               'value': value,
               'iat': datetime.datetime.now(datetime.UTC),
          }, config('ACCESS_SECRET', default='access_secret'), algorithm=config('ENCRYPTION_ALGORITHM', default='HS256'))

     @staticmethod
     def decode_user_token(token):
          try:
               payload = jwt.decode(
                    token,
                    config('ACCESS_SECRET', default='access_secret'),
                    algorithms=config('ENCRYPTION_ALGORITHM', default='HS256'),
                    options={"verify_exp": False}  # Ignore expiration validation
               )
               
               return payload['value']
          except jwt.InvalidTokenError as e:
               raise ValidationError(f"Invalid token! {str(e)}")
          except Exception as e:
               raise ValidationError(f"An unexpected error occurred! {str(e)}")

     @staticmethod     
     def decode_oauth_access_token(id_token):
          try:
               # Decode the ID token without verifying the signature
               decoded_token = jwt.decode(id_token, options={"verify_signature": False})
               
               return decoded_token
          except jwt.ExpiredSignatureError:
               raise exceptions.PermissionDenied("Token is expired.")
          except jwt.InvalidTokenError:
               raise exceptions.PermissionDenied("Token is invalid.")