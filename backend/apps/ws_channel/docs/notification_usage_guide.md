# 🔔 TalentCloud Notification System - Complete Usage Guide

## 📍 All Notification Trigger Points in the Platform

### 1. **Company Registration & Management**

#### **Company Registration (New Company Signup)**
**Location**: `apps/companies/views.py` - `UnauthenticatedCompanyCreateAPIView.post()`
**Trigger**: When a new company registers through the public registration endpoint
**Code**:
```python
# Send notification to superadmins about new company registration
NotificationHelpers.notify_company_registration(company)
```

#### **Company Approval/Rejection (Admin Action)**
**Location**: `apps/companies/views.py` - `CompanyDetailAPIView.put()`
**Trigger**: When superadmin approves or rejects a company
**Code**:
```python
# Company Approved
NotificationService.send_notification(
    title="Company Registration Approved",
    message=f"Congratulations! Your company '{updated_company.name}' has been approved and is now active on TalentCloud.",
    notification_type=NotificationType.COMPANY_APPROVED,
    target_users=list(company_users),
    destination_url="/company/dashboard",
    channel=NotificationChannel.BOTH,
    email_context={'company': updated_company}
)

# Company Rejected/Status Updated
NotificationService.send_notification(
    title="Company Registration Status Updated",
    message=f"Your company '{updated_company.name}' verification status has been updated." + (f" Reason: {reason}" if reason else ""),
    notification_type=NotificationType.COMPANY_APPROVED,
    target_users=list(company_users),
    destination_url="/company/dashboard",
    channel=NotificationChannel.BOTH,
    email_context={'company': updated_company, 'reason': reason}
)
```

#### **Company Approval/Rejection (Admin Panel)**
**Location**: `apps/ws_channel/admin_views.py` - `AdminCompanyApprovalView.post()`
**Trigger**: When admin approves/rejects companies from admin panel
**Code**:
```python
# Approval
NotificationService.send_notification(
    title="Company Registration Approved",
    message=f"Congratulations! Your company '{company.name}' has been approved and is now active on TalentCloud.",
    notification_type=NotificationType.COMPANY_APPROVED,
    target_users=list(company_users),
    destination_url="/company/dashboard",
    channel=channel,
    email_context={'company': company}
)

# Rejection
NotificationService.send_notification(
    title="Company Registration Rejected",
    message=f"Your company '{company.name}' registration has been rejected." + (f" Reason: {reason}" if reason else ""),
    notification_type=NotificationType.COMPANY_APPROVED,
    target_users=list(company_users),
    destination_url="/company/dashboard",
    channel=channel,
    email_context={'company': company, 'reason': reason}
)
```

### 2. **Job Posting & Applications**

#### **Job Posted (New Job Creation)**
**Location**: `services/job_posting/job_service.py` - `JobService.create_job()`
**Trigger**: When a company posts a new job
**Code**:
```python
# Notify admins about new job posting
NotificationHelpers.notify_job_posted(
    job_post, 
    user.company if hasattr(user, 'company') else None
)
```

#### **Job Application Received**
**Location**: `apps/job_posting/views.py` - `JobApplicationCreateAPIView.perform_create()`
**Trigger**: When a job seeker applies for a job
**Code**:
```python
# Notify company admins about new application
NotificationHelpers.notify_job_application(
    job_post, 
    self.request.user,
    job_post.posted_by.company if hasattr(job_post.posted_by, 'company') else None
)
```

#### **Application Status Update**
**Location**: `apps/job_posting/views.py` - `JobApplicationUpdateAPIView.perform_update()`
**Trigger**: When company admin updates application status (approved, rejected, etc.)
**Code**:
```python
# Notify job seeker about status change
NotificationService.send_notification(
    title="Application Status Update",
    message=f"Your application for '{application.job_post.title}' has been updated to: {new_status}",
    notification_type=NotificationType.JOB_APPLIED,
    target_users=[application.job_seeker.user],
    destination_url=f"/my-applications/{application.id}",
    channel=NotificationChannel.BOTH,
    email_context={
        'application': application,
        'old_status': old_status,
        'new_status': new_status
    }
)
```

### 3. **System Administration**

#### **Custom Admin Notifications**
**Location**: `apps/ws_channel/admin_views.py` - `AdminNotificationView.post()`
**Trigger**: When admin sends custom notifications to users
**Code**:
```python
# Send custom notification
NotificationService.send_notification(
    title=subject,
    message=message,
    notification_type=NotificationType.ADMIN_SYSTEM_ALERT if is_urgent else NotificationType.GENERIC,
    target_users=target_users,
    channel=NotificationChannel.EMAIL,
    is_urgent=is_urgent
)
```

#### **System Maintenance Notifications**
**Location**: `apps/ws_channel/admin_views.py` - `AdminMaintenanceNotificationView.post()`
**Trigger**: When admin schedules system maintenance
**Code**:
```python
# System maintenance notification
NotificationService.send_notification(
    title="System Maintenance Notification",
    message=maintenance_message,
    notification_type=NotificationType.ADMIN_MAINTENANCE,
    target_roles=[NotificationTarget.ALL_ROLES],
    channel=channel,
    is_urgent=is_urgent,
    email_context={
        'maintenance_type': "Scheduled",
        'start_time': start_time,
        'end_time': end_time
    }
)
```

#### **System Maintenance (Command Line)**
**Location**: `apps/ws_channel/management/commands/send_maintenance_notification.py`
**Trigger**: Manual execution via Django management command
**Code**:
```python
# Send maintenance notification via command
NotificationHelpers.notify_system_maintenance(
    title=title,
    message=formatted_message,
    is_urgent=is_urgent
)
```

## 🛠️ How to Use the Notification System

### **Basic Notification Sending**

#### **Method 1: Using NotificationService.send_notification() (Main Method)**
```python
from services.notification.notification_service import NotificationService, NotificationTarget
from utils.notification.types import NotificationType, NotificationChannel

# Send to specific roles
NotificationService.send_notification(
    title="Your notification title",
    message="Your notification message",
    notification_type=NotificationType.ADMIN_SYSTEM_ALERT,
    target_roles=[NotificationTarget.SUPERADMIN, NotificationTarget.ADMIN],
    company_id=123,  # Optional: for company-specific admin targeting
    destination_url="/admin/some-page",  # Optional: where to redirect when clicked
    channel=NotificationChannel.BOTH,  # EMAIL, WEBSOCKET, BOTH, or PUSH
    email_template="emails/custom_template.html",  # Optional: custom email template
    email_context={'custom_data': 'value'},  # Optional: extra context for email
    is_urgent=False  # Optional: marks as urgent ([URGENT] prefix in emails)
)

# Send to specific users
NotificationService.send_notification(
    title="Personal Notification",
    message="This is for you specifically",
    notification_type=NotificationType.GENERIC,
    target_users=[user1, user2, user3],
    channel=NotificationChannel.EMAIL
)

# Send to specific emails (even if users don't exist yet)
NotificationService.send_notification(
    title="Invitation",
    message="You're invited to join TalentCloud",
    notification_type=NotificationType.GENERIC,
    target_emails=['newuser@example.com', 'another@example.com'],
    channel=NotificationChannel.EMAIL
)
```

#### **Method 2: Using NotificationHelpers (For Common Scenarios)**
```python
from services.notification.notification_service import NotificationHelpers

# Company registration notification
NotificationHelpers.notify_company_registration(company_object)

# Job posted notification
NotificationHelpers.notify_job_posted(job_object, company_object)

# Job application notification
NotificationHelpers.notify_job_application(job_object, applicant_user, company_object)

# Company approved notification
NotificationHelpers.notify_company_approved(company_object, list_of_admin_users)

# System maintenance notification
NotificationHelpers.notify_system_maintenance(
    title="Scheduled Maintenance",
    message="System will be down for maintenance from 2 AM to 4 AM",
    affected_users=None,  # None = all users, or pass specific user list
    is_urgent=True
)
```

### **Available Notification Types**
```python
from utils.notification.types import NotificationType

# User-facing notifications
NotificationType.GENERIC                   # General notifications
NotificationType.JOB_POSTED               # New job posted
NotificationType.JOB_APPLIED              # Job application received
NotificationType.APPLICATION_STATUS_UPDATE # Application status changed
NotificationType.COMPANY_APPROVED         # Company registration approved
NotificationType.COMPANY_REJECTED         # Company registration rejected

# Admin notifications
NotificationType.ADMIN_COMPANY_REGISTRATION # New company registered
NotificationType.ADMIN_USER_REGISTRATION   # New user registered
NotificationType.ADMIN_JOB_POSTING         # New job posted (admin view)
NotificationType.ADMIN_SYSTEM_ALERT        # System alerts
NotificationType.ADMIN_PLATFORM_ACTIVITY   # Platform activity summaries
NotificationType.ADMIN_REPORT_GENERATED    # Reports generated
NotificationType.ADMIN_COMPANY_VERIFICATION # Company verification needed
NotificationType.ADMIN_CONTENT_MODERATION  # Content needs moderation
NotificationType.ADMIN_VIOLATION_REPORT    # User violation reports
NotificationType.ADMIN_MAINTENANCE         # Maintenance notifications
```

### **Available Channels**
```python
from utils.notification.types import NotificationChannel

NotificationChannel.EMAIL      # Send via email only
NotificationChannel.WEBSOCKET  # Send via real-time WebSocket only
NotificationChannel.BOTH       # Send via both email and WebSocket
NotificationChannel.PUSH       # Mobile push notifications (future)
```

### **Available Targets**
```python
from services.notification.notification_service import NotificationTarget

NotificationTarget.SUPERADMIN  # Platform superadmins
NotificationTarget.ADMIN       # Company admins (can be filtered by company_id)
NotificationTarget.USER        # Regular users (job seekers)
NotificationTarget.ALL_ROLES   # Everyone on the platform
```

### **Utility Methods**
```python
from services.notification.notification_service import NotificationService

# Mark notification as read
NotificationService.mark_as_read(notification_id, user_id)

# Mark all notifications as read for a user
NotificationService.mark_all_as_read(user_id)

# Get unread count for a user
unread_count = NotificationService.get_unread_count(user_id)

# Get user notifications with pagination
notifications = NotificationService.get_user_notifications(
    user_id=123,
    limit=20,
    offset=0,
    unread_only=False
)

# Delete a notification
NotificationService.delete_notification(notification_id, user_id)
```

## 🎯 Common Use Cases & Examples

### **1. Send Welcome Email to New User**
```python
NotificationService.send_notification(
    title="Welcome to TalentCloud!",
    message="Thank you for joining our platform. Start exploring job opportunities today!",
    notification_type=NotificationType.GENERIC,
    target_emails=[new_user.email],
    channel=NotificationChannel.EMAIL,
    email_context={'user': new_user}
)
```

### **2. Notify All Admins About Platform Issue**
```python
NotificationService.send_notification(
    title="Platform Alert",
    message="High traffic detected. Please monitor system performance.",
    notification_type=NotificationType.ADMIN_SYSTEM_ALERT,
    target_roles=[NotificationTarget.ADMIN, NotificationTarget.SUPERADMIN],
    channel=NotificationChannel.BOTH,
    is_urgent=True
)
```

### **3. Notify Specific Company Admins**
```python
NotificationService.send_notification(
    title="New Feature Available",
    message="Company dashboard has been updated with new analytics features.",
    notification_type=NotificationType.GENERIC,
    target_roles=[NotificationTarget.ADMIN],
    company_id=specific_company.id,  # Only admins of this company
    destination_url="/company/dashboard",
    channel=NotificationChannel.BOTH
)
```

### **4. Send Newsletter to All Users**
```python
NotificationService.send_notification(
    title="TalentCloud Monthly Newsletter",
    message="Check out this month's featured jobs and success stories!",
    notification_type=NotificationType.GENERIC,
    target_roles=[NotificationTarget.ALL_ROLES],
    channel=NotificationChannel.EMAIL,
    email_template="emails/newsletter.html",
    email_context={'month': 'January', 'featured_jobs': job_list}
)
```

## 🔧 Advanced Features

### **Custom Email Templates**
Create custom email templates in `/backend/templates/emails/` and use them:
```python
NotificationService.send_notification(
    title="Custom Notification",
    message="Your message",
    notification_type=NotificationType.GENERIC,
    target_users=[user],
    channel=NotificationChannel.EMAIL,
    email_template="emails/custom_template.html",
    email_context={
        'custom_variable': 'value',
        'user_data': user_data,
        'action_url': 'https://example.com/action'
    }
)
```

### **Error Handling**
```python
try:
    notifications = NotificationService.send_notification(
        title="Test",
        message="Test message",
        notification_type=NotificationType.GENERIC,
        target_roles=[NotificationTarget.USER]
    )
    logger.info(f"Sent {len(notifications)} notifications successfully")
except Exception as e:
    logger.error(f"Failed to send notifications: {str(e)}")
    # Notification failures should not break main functionality
```

This comprehensive guide covers all notification trigger points and usage patterns in the TalentCloud platform. The unified system makes it easy to send notifications across multiple channels while maintaining consistency and reliability.
