from django.core.management.base import BaseCommand
from services.user.invitation_service import InvitationService

class Command(BaseCommand):
    help = 'Cleanup expired invitations'
    
    def handle(self, *args, **options):
        count = InvitationService.cleanup_expired_invitations()
        self.stdout.write(
            self.style.SUCCESS(f'Successfully marked {count} invitations as expired')
        )