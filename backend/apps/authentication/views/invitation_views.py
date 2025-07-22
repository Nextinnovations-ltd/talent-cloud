from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudAdminPermission, TalentCloudSuperAdminPermission, TalentCloudUserPermission
import logging
from apps.authentication.models import UserInvitation
from apps.users.models import ROLES
from apps.companies.models import Company
from services.user.invitation_service import InvitationService
from utils.response import CustomResponse

logger = logging.getLogger(__name__)

@extend_schema(tags=["Admin Invitations"])
class SendNIAdminInvitationAPIView(APIView):
     """Send invitation to register as NI admin user (SuperAdmin only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def post(self, request):
          """Send invitation for NI admin registration"""          
          try:
               email = request.data.get('email')
               
               # Validate email
               if not email:
                    return Response(
                         CustomResponse.error("Email is required"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               try:
                    validate_email(email)
               except DjangoValidationError:
                    return Response(
                         CustomResponse.error("Invalid email format"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Create invitation
               invitation = InvitationService.create_ni_admin_invitation(
                    email=email,
                    invited_by=request.user
               )
               
               return Response(
                    CustomResponse.success(
                    "NI admin invitation sent successfully",
                         {
                              'invitation_id': invitation.id,
                              'email': invitation.email,
                              'expires_at': invitation.expires_at,
                              'registration_url': invitation.get_registration_url()
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
               
          except ValueError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error sending NI admin invitation: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to send invitation"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Admin Invitations"])
class SendCompanyAdminInvitationAPIView(APIView):
     """Send invitation to register as company admin user"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudAdminPermission]
     
     def post(self, request):
          """Send invitation for company admin registration"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          try:
               email = request.data.get('email')
               company_id = request.data.get('company_id')
               role_name = request.data.get('role', ROLES.ADMIN)
               additional_data = request.data.get('additional_data', {})
               
               # Validate required fields
               if not email or not company_id:
                    return Response(
                         CustomResponse.error("Email and company_id are required"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate email
               try:
                    validate_email(email)
               except DjangoValidationError:
                    return Response(
                         CustomResponse.error("Invalid email format"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Get company
               company = get_object_or_404(Company, id=company_id)
               
               # Permission check
               if not request.user.is_superuser:
                    # Company admin can only invite for their own company
                    if not hasattr(request.user, 'company') or request.user.company != company:
                         return Response(
                         CustomResponse.error("You can only send invitations for your company"),
                         status=status.HTTP_403_FORBIDDEN
                         )
               
               # Create invitation
               invitation = InvitationService.create_company_admin_invitation(
                    email=email,
                    invited_by=request.user
               )
               
               return Response(
                    CustomResponse.success(
                         "Company admin invitation sent successfully",
                         {
                              'invitation_id': invitation.id,
                              'email': invitation.email,
                              'company': company.name,
                              'expires_at': invitation.expires_at,
                              'registration_url': invitation.get_registration_url()
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
               
          except ValueError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error sending company admin invitation: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to send invitation"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Admin Invitations"])
class ValidateInvitationTokenAPIView(APIView):
     """Validate invitation token and get invitation details"""
     # No authentication required - public endpoint
     
     def get(self, request, token):
          """Validate invitation token and return invitation details"""
          try:
               invitation = InvitationService.validate_invitation_token(token)
               
               return Response(
                    CustomResponse.success(
                         "Invitation token is valid",
                         {
                              'email': invitation.email,
                              'invitation_type': invitation.invitation_type,
                              'company': invitation.target_company.name if invitation.target_company else None,
                              'expires_at': invitation.expires_at,
                              'invited_by': invitation.invited_by.get_full_name() or invitation.invited_by.email
                         }
                    )
               )
               
          except ValueError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error validating invitation token {token}: {str(e)}")
               return Response(
                    CustomResponse.error("Invalid invitation token"),
                    status=status.HTTP_400_BAD_REQUEST
               )

@extend_schema(tags=["Admin Invitations"])
class RegisterAdminUserAPIView(APIView):
     """Register admin user using invitation token"""
     # No authentication required - public endpoint
     
     def post(self, request):
          """Register admin user using invitation token"""
          try:
               token = request.data.get('token')
               user_data = {
                    'email': request.data.get('email'),
                    'password': request.data.get('password'),
                    'username': request.data.get('username', '')
               }
               
               # Validate required fields
               if not token or not user_data['email'] or not user_data['password']:
                    return Response(
                         CustomResponse.error("Token, email, and password are required"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate email format
               try:
                    validate_email(user_data['email'])
               except DjangoValidationError:
                    return Response(
                         CustomResponse.error("Invalid email format"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Validate password strength
               if len(user_data['password']) < 8:
                    return Response(
                         CustomResponse.error("Password must be at least 8 characters long"),
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               # Register user
               user = InvitationService.register_user_from_invitation(token, user_data)
               
               return Response(
                    CustomResponse.success(
                         "Admin user registered successfully",
                         {
                              'user_id': user.id,
                              'email': user.email,
                              'company': user.company.name if user.company else None
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
               
          except ValueError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error registering admin user: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to register user"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Admin Invitations"])
class MyInvitationsAPIView(APIView):
     """List invitations sent by current user"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def get(self, request):
          """List invitations sent by current user with filtering and pagination"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          try: 
               invitations = InvitationService.get_pending_invitations(
                    user=request.user
               )
               
               invitation_data = []
       
               for invitation in invitations:
                    invitation_data.append({
                         'id': invitation.id,
                         'email': invitation.email,
                         'invitation_type': invitation.invitation_type,
                         'company': invitation.target_company.name if invitation.target_company else None,
                         'invitation_status': invitation.invitation_status,
                         'created_at': invitation.created_at,
                         'expires_at': invitation.expires_at,
                         'is_valid': invitation.is_valid()
                    })
               
               return Response(
                    CustomResponse.success(
                         "Invitations retrieved successfully",
                         {'invitations': invitation_data}
                    )
               )
               
          except Exception as e:
               logger.error(f"Error listing invitations: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to retrieve invitations"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

# @extend_schema(tags=["Admin Invitations"])
# class InvitationDetailAPIView(APIView):
#      """Get detailed information about a specific invitation"""
#      authentication_classes = [TokenAuthentication]
#      permission_classes = [TalentCloudUserPermission]
     
#      def get(self, request, invitation_id):
#           """Get detailed information about a specific invitation"""
#           if not request.user or not request.user.is_authenticated:
#                raise ValidationError("User not authenticated")
          
#           try:
#                response = InvitationService.get_invitation_details(invitation_id, request.user)

#                return Response(
#                     CustomResponse.success(response['message'], response['data']),
#                     status=status.HTTP_200_OK
#                )
               
#           except Exception as e:
#                logger.error(f"Error getting invitation details {invitation_id}: {str(e)}")
#                return Response(
#                     CustomResponse.error("Failed to retrieve invitation details"),
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                )

@extend_schema(tags=["Admin Invitations"])
class RevokeInvitationAPIView(APIView):
     """Revoke a pending invitation"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]
     
     def delete(self, request, invitation_id):
          """Revoke a pending invitation"""
          try:
               invitation = InvitationService.revoke_invitation(invitation_id, request.user)

               return Response(
                    CustomResponse.success(
                         "Invitation revoked successfully",
                         {
                              'invitation_id': invitation.id,
                              'email': invitation.email,
                              'status': invitation.status
                         }
                    )
               )
               
          except UserInvitation.DoesNotExist:
               return Response(
                    CustomResponse.error("Invitation not found or you don't have permission to revoke it"),
                    status=status.HTTP_404_NOT_FOUND
               )
          except Exception as e:
               logger.error(f"Error revoking invitation {invitation_id}: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to revoke invitation"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Admin Invitations"])
class ResendInvitationAPIView(APIView):
     """Resend an existing invitation"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def post(self, request, invitation_id):
          """Resend an existing invitation (creates new token with extended expiry)"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          try:
               response = InvitationService.resend_invitation(invitation_id, request.user)
               
               return Response(
                    CustomResponse.success(response['message'], response['data']),
                    status=status.HTTP_200_OK
               )
               
          except ValueError as e:
               return Response(
                    CustomResponse.error(str(e)),
                    status=status.HTTP_400_BAD_REQUEST
               )
          except Exception as e:
               logger.error(f"Error resending invitation {invitation_id}: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to resend invitation"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Admin Invitations"])
class InvitationStatisticsAPIView(APIView):
     """Get statistics about invitations sent by current user"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudUserPermission]
     
     def get(self, request):
          """Get statistics about invitations sent by current user"""
          if not request.user or not request.user.is_authenticated:
               raise ValidationError("User not authenticated")
          
          try:
               response = InvitationService.get_invitation_statistics(request.user)
               
               return Response(
                    CustomResponse.success(response['message'], response['data']),
                    status=status.HTTP_200_OK
               )
               
          except Exception as e:
               logger.error(f"Error getting invitation statistics: {str(e)}")
               return Response(
                    CustomResponse.error("Failed to retrieve statistics"),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
               )