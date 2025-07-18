#!/usr/bin/env python
"""
Test script for the new notification template system
Run with: python manage.py shell < test_notification_templates.py
"""

import os, sys
import django

backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, backend_dir)


# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')
django.setup()

from services.notification.notification_service import NotificationService, NotificationHelpers
from apps.ws_channel.models import NotificationTemplate
from utils.notification.types import NotificationType, NotificationChannel
from apps.users.models import TalentCloudUser

def test_notification_templates():
     """Test the notification template system"""
     
     print("🚀 Testing Notification Template System")
     print("=" * 60)
     
     print("\n1. Testing template availability...")
     try:
          template_count = NotificationTemplate.objects.count()
          print(f"✅ Found {template_count} notification templates in database")
          
          for template in NotificationTemplate.objects.all():
               print(f"   - {template.type} | {template.channel} | Active: {template.is_active}")
               
     except Exception as e:
          print(f"❌ Error checking templates: {e}")
     
     print("\n2. Testing template rendering...")
     try:
          # Get a maintenance template
          template = NotificationTemplate.get_template(
               NotificationType.ADMIN_MAINTENANCE, 
               NotificationChannel.EMAIL
          )
          
          if template:
               context = {
                    'user_name': 'John Doe',
                    'maintenance_info': 'System will be down for 2 hours',
                    'platform_name': 'TalentCloud'
               }
               
               subject = template.render_subject(context)
               title = template.render_title(context)
               message = template.render_message(context)
               
               print(f"✅ Template rendering successful:")
               print(f"   Subject: {subject}")
               print(f"   Title: {title}")
               print(f"   Message: {message}")
          else:
               print("⚠️  No maintenance template found, creating one...")
               from apps.ws_channel.management.commands.populate_notification_templates import Command
               cmd = Command()
               cmd.handle()
               
     except Exception as e:
          print(f"❌ Error testing template rendering: {e}")
     
     print("\n3. Testing templated notification sending...")
     try:
          notifications = NotificationHelpers.notify_system_maintenance(
               title="Scheduled Maintenance", 
               message="System will be down tonight from 2 AM to 4 AM for maintenance.",
               is_urgent=True
          )
          print(f"✅ Sent {len(notifications)} templated maintenance notifications")
          
     except Exception as e:
          print(f"❌ Error sending templated notifications: {e}")
     
     print("\n4. Testing direct template-based sending...")
     try:
          # Get first user for testing
          test_user = TalentCloudUser.objects.get(id=3)
          
          if test_user:
               notifications = NotificationService.send_notification_with_template(
                    notification_type=NotificationType.GENERIC,
                    target_users=[test_user],
                    channel=NotificationChannel.WEBSOCKET,  # Only websocket for testing
                    template_context={
                         'user_name': test_user.get_full_name() or test_user.email,
                         'platform_name': 'TalentCloud'
                    }
               )
               print(f"✅ Sent {len(notifications)} direct templated notifications to {test_user.email}")
          else:
               print("ℹ️  No users found for direct template testing")
               
     except Exception as e:
          print(f"❌ Error with direct templated notifications: {e}")
     
     print("\n" + "=" * 60)
     print("🎉 Notification template system test completed!")

if __name__ == "__main__":
    test_notification_templates()
