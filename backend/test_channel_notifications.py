#!/usr/bin/env python
"""
Test script for the new channel-aware notification system

This script tests the notification system's ability to:
1. Create separate notifications for each channel
2. Filter notifications by channel
3. Only show websocket notifications in user feeds
"""

import os
import sys
import django

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')
django.setup()

from apps.users.models import TalentCloudUser
from apps.ws_channel.models import Notification
from services.notification.notification_service import NotificationService, NotificationTarget
from utils.notification.types import NotificationType, NotificationChannel

def test_channel_notifications():
    """Test the new channel-aware notification system"""
    print("🧪 Testing Channel-Aware Notification System")
    print("=" * 50)
    
    # Get a test user
    user = TalentCloudUser.objects.filter(is_active=True).first()
    if not user:
        print("❌ No active users found. Please create a user first.")
        return
    
    print(f"📧 Testing with user: {user.email}")
    
    # Clear existing notifications for clean test
    print("\n🧹 Clearing existing notifications...")
    Notification.objects.filter(user=user).delete()
    
    # Test 1: Send notification to BOTH channels
    print("\n📨 Test 1: Sending notification to BOTH channels")
    notifications = NotificationService.send_notification(
        title="Test Notification - Both Channels",
        message="This notification should create two separate records",
        notification_type=NotificationType.GENERIC,
        target_users=[user],
        channel=NotificationChannel.BOTH
    )
    
    print(f"✅ Created {len(notifications)} notification records")
    
    # Check the created notifications
    all_notifications = Notification.objects.filter(user=user).order_by('channel')
    print(f"📊 Total notifications in database: {all_notifications.count()}")
    
    for notification in all_notifications:
        print(f"   - Channel: {notification.channel}, Title: {notification.title}")
    
    # Test 2: Send EMAIL only notification
    print("\n📨 Test 2: Sending EMAIL only notification")
    email_notifications = NotificationService.send_notification(
        title="Email Only Notification",
        message="This should only create an email notification",
        notification_type=NotificationType.GENERIC,
        target_users=[user],
        channel=NotificationChannel.EMAIL
    )
    
    print(f"✅ Created {len(email_notifications)} email notification")
    
    # Test 3: Send WEBSOCKET only notification
    print("\n📨 Test 3: Sending WEBSOCKET only notification")
    websocket_notifications = NotificationService.send_notification(
        title="In-App Only Notification",
        message="This should only create a websocket notification",
        notification_type=NotificationType.GENERIC,
        target_users=[user],
        channel=NotificationChannel.WEBSOCKET
    )
    
    print(f"✅ Created {len(websocket_notifications)} websocket notification")
    
    # Test 4: Check filtering by channel
    print("\n🔍 Test 4: Filtering notifications by channel")
    
    all_notifications = Notification.objects.filter(user=user)
    email_notifications = Notification.objects.filter(user=user, channel=NotificationChannel.EMAIL.value)
    websocket_notifications = Notification.objects.filter(user=user, channel=NotificationChannel.WEBSOCKET.value)
    
    print(f"📊 Total notifications: {all_notifications.count()}")
    print(f"📧 Email notifications: {email_notifications.count()}")
    print(f"💻 Websocket notifications: {websocket_notifications.count()}")
    
    # Test 5: Test the new service methods
    print("\n🔍 Test 5: Testing new service methods")
    
    total_unread = NotificationService.get_unread_count(user.id)
    email_unread = NotificationService.get_unread_count(user.id, NotificationChannel.EMAIL)
    websocket_unread = NotificationService.get_unread_in_app_count(user.id)
    
    print(f"📊 Total unread notifications: {total_unread}")
    print(f"📧 Email unread notifications: {email_unread}")
    print(f"💻 Websocket unread notifications: {websocket_unread}")
    
    # Test 6: Test getting in-app notifications (what the user feed should show)
    print("\n🔍 Test 6: Testing in-app notification feed")
    
    in_app_notifications = NotificationService.get_user_in_app_notifications(user.id)
    print(f"💻 In-app notifications (user feed): {len(in_app_notifications)}")
    
    for notification in in_app_notifications:
        print(f"   - {notification.title} (Channel: {notification.channel})")
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 30)
    print(f"✅ Channel separation working: {email_notifications.count() > 0 and websocket_notifications.count() > 0}")
    print(f"✅ BOTH creates multiple records: {len(NotificationService.send_notification('Test Both', 'Test', NotificationType.GENERIC, target_users=[user], channel=NotificationChannel.BOTH)) == 2}")
    print(f"✅ In-app feed filters correctly: {all([n.channel == NotificationChannel.WEBSOCKET.value for n in in_app_notifications])}")
    
    print("\n🎉 Channel-aware notification system test completed!")

def test_template_based_notifications():
    """Test template-based notifications with channels"""
    print("\n🧪 Testing Template-Based Notifications with Channels")
    print("=" * 60)
    
    # Get a test user
    user = TalentCloudUser.objects.filter(is_active=True).first()
    if not user:
        print("❌ No active users found.")
        return
    
    print(f"📧 Testing with user: {user.email}")
    
    # Clear notifications
    Notification.objects.filter(user=user, notification_type=NotificationType.JOB_POSTED.value).delete()
    
    # Test template-based notification with BOTH channels
    print("\n📨 Sending template-based notification to BOTH channels")
    
    context = {
        'job_title': 'Senior Python Developer',
        'job_id': 123,
        'company_name': 'Tech Corp',
        'job_description': 'Exciting opportunity to work with Python and Django'
    }
    
    notifications = NotificationService.send_notification_with_template(
        notification_type=NotificationType.JOB_POSTED,
        target_users=[user],
        channel=NotificationChannel.BOTH,
        template_context=context
    )
    
    print(f"✅ Created {len(notifications)} template-based notifications")
    
    # Check the results
    job_notifications = Notification.objects.filter(
        user=user, 
        notification_type=NotificationType.JOB_POSTED.value
    ).order_by('channel')
    
    print(f"📊 Job-posted notifications: {job_notifications.count()}")
    
    for notification in job_notifications:
        print(f"   - Channel: {notification.channel}")
        print(f"     Title: {notification.title}")
        print(f"     Message: {notification.message[:100]}...")
        print()

if __name__ == "__main__":
    try:
        test_channel_notifications()
        test_template_based_notifications()
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
