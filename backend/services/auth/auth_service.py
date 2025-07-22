from django.contrib.auth.hashers import check_password
from apps.users.models import TalentCloudUser, VerifyLoggedInUser, VerifyRegisteredUser, PasswordReset
from apps.companies.models import Company
from core.constants.constants import ROLES
from services.user.password_service import PasswordService
from utils.token.jwt import TokenUtil
from utils.user.user import check_auto_generated_username
from rest_framework.exceptions import ValidationError
from django.db import transaction
from services.user.email_service import AuthEmailService

class AuthenticationService:
     @staticmethod
     def is_authenticated(email, password, role_name=ROLES.USER):
          try:
               user = TalentCloudUser.objects.get(email=email)
          except TalentCloudUser.DoesNotExist:
               raise ValidationError("Invalid email or password")
          
          if user.role.name != role_name:
               raise ValidationError("Invalid User!")
          
          if not check_password(password, user.password):
               raise ValidationError("Invalid email or password!")
          
          if not user.is_active:
               raise ValidationError("This user is not existed anymore!")
          
          if not user.is_verified:
               raise ValidationError("User is not verified yet!")

          return user
     
     @staticmethod
     def register_user_with_role(email, password, role, **kwargs):
          with transaction.atomic():
               user = TalentCloudUser.objects.create_user_with_role(email=email, password=password, role_name = role, **kwargs)

               # Create verification code, token, and send mail to verify the user as active user
               verify_token = AuthEmailService.verify_user_registration(user.email)

               return verify_token
          
          return None
     
     @staticmethod
     def register_ni_super_user(username, email, password):
          with transaction.atomic():
               user = TalentCloudUser.objects.create_superuser(username=username, email=email, password=password)

               # Create verification code, token, and send mail to verify the user as active user
               verify_token = AuthEmailService.verify_user_registration(user.email)

               return verify_token
          
          return None
     
     @staticmethod
     def register_company_admin_user(email, password, role, company_slug):
          with transaction.atomic():
               company = None
               
               if company_slug:
                    try:
                         company = Company.objects.get(slug=company_slug)
                    except Company.DoesNotExist:
                         raise ValidationError("Company with the provided slug does not exist.")
               
               user = TalentCloudUser.objects.create_admin_user(email=email, password=password, company = company)

               # Create verification code, token, and send mail to verify the user as active user
               verify_token = AuthEmailService.verify_user_registration(user.email)

               return verify_token
          
          return None
     
     @staticmethod
     def verify_registered_user(token, verification_code):
          verify_request = VerifyRegisteredUser.objects.active().filter(token=token).first()

          if not verify_request:
               raise ValueError("Token is invalid.")
          elif TokenUtil.is_expired(verify_request.expired_at):
               raise ValueError("Token is expired.")

          if verify_request.verification_code == verification_code:
               user = TalentCloudUser.objects.get(email=verify_request.email)
               user.is_verified = True
               user.save()
               print("User is verified.")

               # soft delete the verify request
               verify_request.status = False
               verify_request.save()
               return user
          else:
               raise ValueError("Verification code is invalid.")
     
     @staticmethod
     def verify_logged_in_user(token, verification_code):
          verify_request = VerifyLoggedInUser.objects.active().filter(token=token).first()

          if not verify_request:
               raise ValidationError("Token is invalid or expired.")
          elif TokenUtil.is_expired(verify_request.expired_at):
               raise ValidationError("Token is expired.")

          if verify_request.verification_code == verification_code:
               verify_request.status = False
               verify_request.save()
               return True
          else:
               raise ValidationError("Verification code is invalid.")
          
     @staticmethod
     def create_password_reset_request(email):
          # Check if the email already exists in the database
          if not TalentCloudUser.objects.filter(email=email).exists():
               raise ValueError("Talent cloud user with this email does not exist.")

          reset_request = PasswordReset.objects.active().filter(email=email).first()
          is_expired_reset_request = False

          if reset_request:
               is_expired_reset_request = TokenUtil.is_expired(reset_request.expired_at)

          # Create 
          if (reset_request and is_expired_reset_request) or not reset_request:
               with transaction.atomic():
                    if reset_request:
                         reset_token = PasswordService.regenerate_password_reset(email, reset_request)
                    else:
                         reset_token = PasswordService.create_password_reset(email)

                    AuthEmailService.send_password_reset_email(email, reset_token)
                    
                    return reset_token
          elif reset_request and not is_expired_reset_request:
               raise ValueError("Password reset request already sent.")
          
          raise ValueError("Password reset creation failed.")
   
     @staticmethod
     def perform_reset_password(password, token):
          # Decode email from token
          email = TokenUtil.decode_user_token(token)
          
          with transaction.atomic():
               reset_request = PasswordReset.objects.active().filter(email=email, token=token).first()
               is_expired_reset_request = False

               if reset_request:
                    is_expired_reset_request = TokenUtil.is_expired(reset_request.expired_at)
               else:
                    raise ValueError("Password reset request is expired or invalid.")
                    
               if reset_request and not is_expired_reset_request:
                    try:
                         user = TalentCloudUser.objects.get(email=email)
                    except TalentCloudUser.DoesNotExist:
                         raise ValueError("User with the provided email does not exist.")
                    
                    user.set_password(password)
                    user.save()
                    
                    print("Password reset successful.")

                    AuthEmailService.send_password_reset_success_email(email)
                    
                    # soft delete the password reset request
                    reset_request.status = False
                    reset_request.save()
                    
                    # It use in nowhere just to avoid the code continuing
                    return token

               print("Password reset request is expired.")
               raise ValueError("Password reset request is expired or invalid.")

     @staticmethod
     def check_token_validity(token, action='registration'):
          if action == 'registration':
               record = VerifyRegisteredUser.objects.active().filter(token=token).first()
          else:
               record = PasswordReset.objects.filter(token=token).first()            

          if not record:
               raise ValidationError('Token is invalid.')
          elif TokenUtil.is_expired(record.expired_at):
               raise ValidationError('Token is expired.')
          
          return True

     @staticmethod
     def resend_activation_token(token):
          verify_request = VerifyRegisteredUser.objects.active().filter(token=token).first()
          
          if not verify_request:
               raise ValidationError('Token is invalid.')
          
          if TokenUtil.is_expired(verify_request.expired_at):
               with transaction.atomic():
                    email = TokenUtil.decode_user_token(token)
                    verify_request.expired_at = TokenUtil.generate_expiration_time(60)
                    verify_request.verification_code = TokenUtil.generate_verification_code()
                    verify_request.save()
                    
                    from utils.user.custom_mail_types import send_verification_email
                    send_verification_email(email, token, verify_request.verification_code)
               return 'Verification code is sent back to user.'
          else:
               return 'Token is still valid.'

     @staticmethod
     def generate_login_success_response(user):
          access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 180)
          refresh_token = TokenUtil.generate_refresh_token(user.pk, user.role.name)
          
          return {
               'access_token': access_token,
               'refresh_token': refresh_token,
               'is_generated_username': check_auto_generated_username(user.username)
          }
