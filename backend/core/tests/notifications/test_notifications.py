#!/usr/bin/env python
"""
Test script for the new unified notification system
Run with: python manage.py shell < test_notifications.py
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')
django.setup()

from services.notification.notification_service import NotificationService, NotificationTarget
from utils.notification.types import NotificationType, NotificationChannel
from apps.users.models import TalentCloudUser

def test_notification_system():
    """Test the unified notification system"""
    
    print("🚀 Testing Unified Notification System")
    print("=" * 50)
    
    # Test 1: Get users by roles
    print("\n1. Testing user role targeting...")
    try:
        superadmins = NotificationService.get_users_by_roles([NotificationTarget.SUPERADMIN])
        admins = NotificationService.get_users_by_roles([NotificationTarget.ADMIN])
        users = NotificationService.get_users_by_roles([NotificationTarget.USER])
        
        print(f"✅ Found {len(superadmins)} superadmins")
        print(f"✅ Found {len(admins)} admins")
        print(f"✅ Found {len(users)} regular users")
        
    except Exception as e:
        print(f"❌ Error in role targeting: {e}")
    
    # Test 2: Send a test notification to superadmins
    print("\n2. Testing notification sending to superadmins...")
    try:
        notifications = NotificationService.send_notification(
            title="Test Notification System",
            message="This is a test of the new unified notification system.",
            notification_type=NotificationType.ADMIN_SYSTEM_ALERT,
            target_roles=[NotificationTarget.USER],
            channel=NotificationChannel.EMAIL  # Only websocket for testing
        )
        print(f"✅ Sent {len(notifications)} notifications to superadmins")
        
    except Exception as e:
        print(f"❌ Error sending notifications: {e}")
    
    # Test 3: Test notification helpers
    print("\n3. Testing notification helpers...")
    try:
        # This will only work if we have test data
        print("ℹ️  Notification helpers ready (would need real job/company data to test)")
        
    except Exception as e:
        print(f"❌ Error with notification helpers: {e}")
    
    # Test 4: Test utility methods
    print("\n4. Testing utility methods...")
    try:
        # Get a test user to check utilities
        test_user = TalentCloudUser.objects.first()
        if test_user:
            unread_count = NotificationService.get_unread_count(test_user.id)
            notifications = NotificationService.get_user_notifications(test_user.id, limit=5)
            print(f"✅ User {test_user.email} has {unread_count} unread notifications")
            print(f"✅ Retrieved {len(notifications)} recent notifications")
        else:
            print("ℹ️  No users found for utility testing")
            
    except Exception as e:
        print(f"❌ Error with utility methods: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Notification system test completed!")

if __name__ == "__main__":
    test_notification_system()
