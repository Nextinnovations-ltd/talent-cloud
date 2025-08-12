"""
Management command to send system maintenance notifications
Usage: python manage.py send_maintenance_notification --message "System will be down for maintenance" --start "2025-07-15 02:00" --end "2025-07-15 04:00"
"""

from django.core.management.base import BaseCommand, CommandError
from django.utils.dateparse import parse_datetime
from services.notification.notification_service import NotificationHelpers
from utils.notification.types import NotificationChannel
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Send system maintenance notifications to all users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--message',
            type=str,
            required=True,
            help='Maintenance message to send to users'
        )
        parser.add_argument(
            '--start',
            type=str,
            required=True,
            help='Maintenance start time (YYYY-MM-DD HH:MM format)'
        )
        parser.add_argument(
            '--end',
            type=str,
            required=True,
            help='Maintenance end time (YYYY-MM-DD HH:MM format)'
        )
        parser.add_argument(
            '--urgent',
            action='store_true',
            help='Mark this as an urgent maintenance notification'
        )
        parser.add_argument(
            '--email-only',
            action='store_true',
            help='Send only email notifications (no in-app notifications)'
        )
        parser.add_argument(
            '--websocket-only',
            action='store_true',
            help='Send only in-app notifications (no email notifications)'
        )

    def handle(self, *args, **options):
        message = options['message']
        start_time_str = options['start']
        end_time_str = options['end']
        is_urgent = options['urgent']
        email_only = options['email_only']
        websocket_only = options['websocket_only']

        # Determine notification channel
        if email_only and websocket_only:
            raise CommandError('Cannot specify both --email-only and --websocket-only')
        
        if email_only:
            channel = NotificationChannel.EMAIL
        elif websocket_only:
            channel = NotificationChannel.WEBSOCKET
        else:
            channel = NotificationChannel.BOTH

        # Parse datetime strings
        try:
            start_time = parse_datetime(start_time_str)
            end_time = parse_datetime(end_time_str)
            
            if not start_time or not end_time:
                raise ValueError("Invalid datetime format")
                
            if start_time >= end_time:
                raise ValueError("Start time must be before end time")
                
        except ValueError as e:
            raise CommandError(f'Invalid datetime format: {e}. Use YYYY-MM-DD HH:MM format')

        try:
            # Send maintenance notification
            title = "System Maintenance Notification"
            formatted_message = f"{message}. Scheduled for {start_time.strftime('%B %d, %Y at %I:%M %p')}"
            if end_time:
                formatted_message += f" until {end_time.strftime('%B %d, %Y at %I:%M %p')}"
            
            NotificationHelpers.notify_system_maintenance(
                title=title,
                message=formatted_message,
                is_urgent=is_urgent
            )
            
            channel_description = {
                NotificationChannel.EMAIL: "email",
                NotificationChannel.WEBSOCKET: "in-app",
                NotificationChannel.BOTH: "email and in-app"
            }
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully sent maintenance notification via {channel_description[channel]}\n'
                    f'Message: {message}\n'
                    f'Start: {start_time}\n'
                    f'End: {end_time}\n'
                    f'Urgent: {is_urgent}'
                )
            )
            
        except Exception as e:
            logger.error(f"Failed to send maintenance notification: {str(e)}")
            raise CommandError(f'Failed to send maintenance notification: {str(e)}')
