import secrets, uuid
from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.conf import settings
from apps.users.models import TalentCloudUser
from core.constants.constants import ROLES
from services.models import TimeStampModel

class UserInvitation(TimeStampModel):
     """
     Model to handle invitation-based user registration
     Used for NI admins and company admins
     """
     
     class InvitationType(models.TextChoices):
          NI_ADMIN = ROLES.SUPERADMIN, 'NI Admin'
          COMPANY_ADMIN = ROLES.ADMIN, 'Company Admin'
     
     class InvitationStatus(models.TextChoices):
          PENDING = 'pending', 'Pending'
          ACCEPTED = 'accepted', 'Accepted'
          EXPIRED = 'expired', 'Expired'
          REVOKED = 'revoked', 'Revoked'
     
     # Basic invitation info
     email = models.EmailField(
          help_text="Email address to send invitation"
     )
     invitation_type = models.CharField(
          max_length=20,
          choices=InvitationType.choices,
          help_text="Type of invitation"
     )
     token = models.CharField(
          max_length=64,
          unique=True,
          help_text="Unique invitation token"
     )
     
     invited_by = models.ForeignKey(
          'users.TalentCloudUser',
          on_delete=models.CASCADE,
          related_name='sent_invitations',
          help_text="User who sent the invitation"
     )
     # invited_role = models.ForeignKey(
     #      'Role',
     #      on_delete=models.CASCADE,
     #      help_text="Role to assign to invited user"
     # )
     
     target_company = models.ForeignKey(
          'companies.Company',
          on_delete=models.CASCADE,
          null=True,
          blank=True,
          help_text="Company for company admin invitations"
     )
     
     # Status and timing
     invitation_status = models.CharField(
          max_length=20,
          choices=InvitationStatus.choices,
          default=InvitationStatus.PENDING
     )
     expires_at = models.DateTimeField(
          help_text="When invitation expires"
     )
     accepted_at = models.DateTimeField(
          null=True,
          blank=True,
          help_text="When invitation was accepted"
     )
     accepted_by = models.ForeignKey(
          'users.TalentCloudUser',
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='accepted_invitations',
          help_text="User who accepted the invitation"
     )

     class Meta:
          indexes = [
               models.Index(fields=['token']),
               models.Index(fields=['email', 'invitation_status']),
               models.Index(fields=['expires_at']),
          ]
          constraints = [
               models.UniqueConstraint(
                    fields=['email', 'invitation_type', 'invitation_status'],
                    condition=models.Q(invitation_status='pending'),
                    name='unique_pending_invitation_per_email_type'
               )
          ]
     
     def __str__(self):
          return f"{self.invitation_type} invitation for {self.email}"
     
     @classmethod
     def generate_token(cls):
          """Generate a unique secure token"""
          return secrets.token_urlsafe(32)
     
     @classmethod
     def get_default_expiry(cls):
          """Get default expiry time (7 days from now)"""
          return timezone.now() + timedelta(days=7)
     
     def is_valid(self):
          """Check if invitation is still valid"""
          return (
               self.invitation_status == self.InvitationStatus.PENDING and
               self.expires_at > timezone.now()
          )
     
     def is_expired(self):
          """Check if invitation has expired"""
          return self.expires_at <= timezone.now()
     
     def mark_as_accepted(self, user):
          """Mark invitation as accepted"""
          self.invitation_status = self.InvitationStatus.ACCEPTED
          self.accepted_at = timezone.now()
          self.accepted_by = user
          self.save()
     
     def mark_as_expired(self):
          """Mark invitation as expired"""
          self.invitation_status = self.InvitationStatus.EXPIRED
          self.save()
     
     def revoke(self):
          """Revoke the invitation"""
          self.invitation_status = self.InvitationStatus.REVOKED
          self.save()
     
     def get_registration_url(self, base_url=f"{settings.FRONTEND_BASE_URL}"):
          """Generate registration URL with token"""
          return f"{base_url}/register/admin?token={self.token}"
class FileUpload(models.Model):
     FILE_TYPES = [
          ('resume', 'Resume'),
          ('profile_image', 'profile_image'),
          ('cover_letter', 'Cover Letter'),
          ('company_logo', 'Company Logo'),
          ('job_attachment', 'Job Attachment'),
          ('document', 'Document'),
     ]
     
     UPLOAD_STATUS = [
          ('pending', 'Pending'),
          ('uploaded', 'Uploaded'),
          ('failed', 'Failed'),
          ('deleted', 'Deleted'),
     ]
     
     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
     user = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE)
     file_type = models.CharField(max_length=20, choices=FILE_TYPES)
     original_filename = models.CharField(max_length=255)
     file_path = models.CharField(max_length=500)
     file_size = models.BigIntegerField(null=True, blank=True)
     content_type = models.CharField(max_length=100, null=True, blank=True)
     upload_status = models.CharField(max_length=20, choices=UPLOAD_STATUS, default='pending')
     upload_url_expires_at = models.DateTimeField()
     uploaded_at = models.DateTimeField(null=True, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     
     class Meta:
          db_table = 'file_uploads'
          ordering = ['-created_at']
     
     def __str__(self):
          return f"{self.user.username} - {self.file_type} - {self.original_filename}"