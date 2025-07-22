from datetime import timedelta
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from rest_framework.exceptions import PermissionDenied
from apps.users.models import TalentCloudUser
from apps.authentication.models import UserInvitation
from backend.apps.authentication.serializers import InvitationSerializer
from services.notification.notification_service import NotificationService
from utils.notification.types import NotificationType, NotificationChannel

import logging

logger = logging.getLogger(__name__)

class InvitationService:
     """Service for handling user invitations"""
     
     @staticmethod
     def create_ni_admin_invitation(email, invited_by: TalentCloudUser, **kwargs):
          """
          Create invitation for NI admin user
          """
          try: 
               # Check if pending invitation already exists
               existing_invitation = UserInvitation.objects.filter(
                    email=email,
                    invitation_type=UserInvitation.InvitationType.NI_ADMIN,
                    invitation_status=UserInvitation.InvitationStatus.PENDING
               ).first()
               
               with transaction.atomic():
                    if existing_invitation:
                         if existing_invitation.is_valid():
                              raise ValueError(f"Valid invitation already exists for {email}")
                         else:
                              # Mark expired invitation as expired
                              existing_invitation.mark_as_expired()
                    
                    # Create new invitation
                    invitation = UserInvitation.objects.create(
                         email=email,
                         invitation_type=UserInvitation.InvitationType.NI_ADMIN,
                         token=UserInvitation.generate_token(),
                         invited_by=invited_by,
                         target_company=invited_by.company,
                         expires_at=UserInvitation.get_default_expiry()
                    )
               
               try:
                    # Send invitation email
                    InvitationService._send_invitation_email(invitation)
               except Exception as e:     
                    logger.error(f"Invitation created but email failed for {email}: {str(e)}")
                    # Don't rollback the invitation creation if email fails
               
               # Log the invitation
               logger.info(f"NI admin invitation created for {email} by {invited_by.email}")
               
               return {
                    'message': 'Admin invitation email has sent to the user.',
                    'data': InvitationSerializer(invitation).data
               }
          except Exception as e:
               logger.error(f"Failed to create NI admin invitation for {email}: {str(e)}")
               raise
     
     @staticmethod
     def create_company_admin_invitation(email, invited_by: TalentCloudUser, **kwargs):
          """
          Create invitation for company admin user
          """
          try:
               # Check if pending invitation already exists
               existing_invitation = UserInvitation.objects.filter(
                    email=email,
                    invitation_type=UserInvitation.InvitationType.COMPANY_ADMIN,
                    target_company=invited_by.company,
                    invitation_status=UserInvitation.InvitationStatus.PENDING
               ).first()
               
               with transaction.atomic():
                    if existing_invitation:
                         if existing_invitation.is_valid():
                              raise ValueError(f"Valid company admin invitation already exists for {email}")
                         else:
                              existing_invitation.mark_as_expired()
                    
                    # Create new invitation
                    invitation = UserInvitation.objects.create(
                         email=email,
                         invitation_type=UserInvitation.InvitationType.COMPANY_ADMIN,
                         token=UserInvitation.generate_token(),
                         invited_by=invited_by,
                         target_company=invited_by.company,
                         expires_at=UserInvitation.get_default_expiry()
                    )
               
               try:
                    # Send invitation email
                    InvitationService._send_invitation_email(invitation)
               except Exception as e:     
                    logger.error(f"Invitation created but email failed for {email}: {str(e)}")
                    # Don't rollback the invitation creation if email fail               
               
               # Log the invitation
               logger.info(f"Company admin invitation created for {email} at {invited_by.company.name} by {invited_by.email}")
               
               return {
                    'message': 'Company admin invitation email has sent to the user.',
                    'data': InvitationSerializer(invitation).data
               }
               
          except Exception as e:
               logger.error(f"Failed to create company admin invitation for {email}: {str(e)}")
               raise
     
     @staticmethod
     def validate_invitation_token(token):
          """
          Validate invitation token and return invitation if valid
          """
          try:
               invitation = UserInvitation.objects.get(token=token)
               
               if not invitation.is_valid():
                    if invitation.is_expired():
                         invitation.mark_as_expired()
                         raise ValueError("Invitation has expired")
                    else:
                         raise ValueError("Invitation is no longer valid")
               
               return invitation
               
          except UserInvitation.DoesNotExist:
               raise ValueError("Invalid invitation token")
     
     @staticmethod
     def register_user_from_invitation(token, user_data):
          """
          Register user using invitation token
          """
          # Validate invitation
          invitation = InvitationService.validate_invitation_token(token)
          
          try:
               # Create user based on invitation type
               if invitation.invitation_type == UserInvitation.InvitationType.NI_ADMIN:
                    user = InvitationService._create_ni_admin_user(invitation, user_data)
               elif invitation.invitation_type == UserInvitation.InvitationType.COMPANY_ADMIN:
                    user = InvitationService._create_company_admin_user(invitation, user_data)
               else:
                    raise ValueError("Invalid invitation type")
               
               # Mark invitation as accepted
               invitation.mark_as_accepted(user)
               
               # Send welcome notification
               InvitationService._send_welcome_notification(user, invitation)
               
               logger.info(f"User {user.email} registered successfully from invitation")
               
               return user
               
          except Exception as e:
               logger.error(f"Failed to register user from invitation {token}: {str(e)}")
               raise
     
     @staticmethod
     def _create_ni_admin_user(invitation, user_data):
          """Create NI admin user from invitation"""
          from apps.users.models import TalentCloudUser
          
          user = TalentCloudUser.objects.create_superuser(
               email=invitation.email,
               password=user_data['password'],
               username=user_data.get['username'],
               is_verified=True,
          )
          
          return user
     
     @staticmethod
     def _create_company_admin_user(invitation, user_data):
          """Create company admin user from invitation"""
          from apps.users.models import TalentCloudUser
          
          user = TalentCloudUser.objects.create_admin_user(
               email=invitation.email,
               password=user_data['password'],
               company=invitation.target_company,
               is_verified=True,
               username=user_data['username']
          )
          
          return user
     
     @staticmethod
     def _send_invitation_email(invitation):
          """Send invitation email"""
          try:
               subject = f"Invitation to join TalentCloud as {invitation.get_invitation_type_display()}"
               
               context = {
                    'invitation': invitation,
                    'registration_url': invitation.get_registration_url(),
                    'company_name': invitation.target_company.name if invitation.target_company else 'Next Innovations',
                    'expires_at': invitation.expires_at,
                    'invited_by': invitation.invited_by.email
               }
               
               # Render email templates
               html_message = render_to_string('emails/invitation.html', context)
               text_message = render_to_string('emails/invitation.txt', context)
               
               # Send email
               send_mail(
                    subject=subject,
                    message=text_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[invitation.email],
                    fail_silently=False
               )
               
               logger.info(f"Invitation email sent to {invitation.email}")
               
          except Exception as e:
               logger.error(f"Failed to send invitation email to {invitation.email}: {str(e)}")
               raise
     
     @staticmethod
     def _send_welcome_notification(user, invitation):
          """Send welcome notification to new user"""
          try:
               NotificationService.send_notification(
                    target_users=[user],
                    notification_type=NotificationType.ACCOUNT_CREATED,
                    channel=NotificationChannel.BOTH,
                    title="Welcome to TalentCloud!",
                    message=f"Your {invitation.get_invitation_type_display()} account has been created successfully.",
               )
          except Exception as e:
               logger.error(f"Failed to send welcome notification to {user.email}: {str(e)}")
               # Don't raise exception for notification failures
     
     @staticmethod
     def get_pending_invitations(user):
          """Get pending invitations sent by user"""
          return UserInvitation.objects.filter(
               invited_by=user,
               invitation_status=UserInvitation.InvitationStatus.PENDING
          ).select_related('target_company')
     
     @staticmethod
     def revoke_invitation(invitation_id, user):
          """Revoke an invitation"""
          invitation = UserInvitation.objects.get(
               id=invitation_id,
               invitation_status=UserInvitation.InvitationStatus.PENDING
          )
          
          if not InvitationService._can_manage_invitation(user, invitation):
            raise PermissionDenied("You don't have permission to revoke this invitation")
       
          invitation.revoke()
          
          logger.info(f"Invitation {invitation_id} revoked by {user.email}")
          
          return invitation
     
     @staticmethod
     def cleanup_expired_invitations():
          """Cleanup expired invitations (for cron job)"""
          expired_invitations = UserInvitation.objects.filter(
               invitation_status=UserInvitation.InvitationStatus.PENDING,
               expires_at__lte=timezone.now()
          )
          
          count = expired_invitations.count()
          expired_invitations.update(invitation_status=UserInvitation.InvitationStatus.EXPIRED)
          
          logger.info(f"Marked {count} invitations as expired")
          return count
     
     
     @staticmethod
     def get_invitation_statistics(user):
          """
          Get statistics about invitations sent by current user
          """
          try:
               # Get base queryset based on user permissions
               invitations = UserInvitation.objects.filter(invited_by=user)
               
               # Calculate statistics
               stats = {
                    'total_invitations': invitations.count(),
                    'pending_invitations': invitations.filter(
                         invitation_status=UserInvitation.InvitationStatus.PENDING
                    ).count(),
                    'accepted_invitations': invitations.filter(
                         invitation_status=UserInvitation.InvitationStatus.ACCEPTED
                    ).count(),
                    'expired_invitations': invitations.filter(
                         invitation_status=UserInvitation.InvitationStatus.EXPIRED
                    ).count(),
                    'revoked_invitations': invitations.filter(
                         invitation_status=UserInvitation.InvitationStatus.REVOKED
                    ).count(),
               }
               
               # Recent activity (last 30 days)
               thirty_days_ago = timezone.now() - timedelta(days=30)
               stats['recent_invitations'] = invitations.filter(
                    created_at__gte=thirty_days_ago
               ).count()
               stats['recent_accepted'] = invitations.filter(
                    invitation_status=UserInvitation.InvitationStatus.ACCEPTED,
                    accepted_at__gte=thirty_days_ago
               ).count()
               
               # Valid invitations (pending and not expired)
               stats['valid_invitations'] = invitations.filter(
                    invitation_status=UserInvitation.InvitationStatus.PENDING,
                    expires_at__gt=timezone.now()
               ).count()
               
               logger.info(f"Statistics retrieved for user {user.email}")
               
               return {
                    'message': 'Invitation statistics retrieved successfully',
                    'data': stats
               }
               
          except Exception as e:
               logger.error(f"Failed to get invitation statistics for {user.email}: {str(e)}")
               raise
     
     @staticmethod
     def _can_manage_invitation(user: TalentCloudUser, invitation: UserInvitation):
          """Check if user can manage this invitation"""
          # User can manage their own invitations
          if invitation.invited_by == user:
               return True
          
          return user.company == invitation.invited_by.company