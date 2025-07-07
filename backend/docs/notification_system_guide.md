# Notification System Implementation Guide

This document provides step-by-step examples of how to use the notification system.

## 1. Creating Notifications

### Basic Notification
```python
from services.notification.notification_service import NotificationService
from utils.notification.types import NotificationType

# Create a simple notification for a single user
NotificationService.create_notification(
    user_id=123,
    title="Welcome!",
    message="Welcome to TalentCloud platform!",
    notification_type=NotificationType.GENERIC
)
```

### Job Application Notification
```python
from services.notification.notification_service import JobNotificationService

# When someone applies for a job
def notify_job_application(job_post, applicant):
    # Get company users who should be notified
    company_users = job_post.posted_by.company.users.filter(
        role__name__in=['ADMIN', 'SUPERADMIN']
    )
    
    JobNotificationService.notify_job_application(
        job_post=job_post,
        applicant=applicant,
        company_users=company_users
    )
```

### Company Approval Notification
```python
from services.notification.notification_service import CompanyNotificationService

# When a company gets approved
def notify_company_approval(company):
    company_users = company.users.all()
    
    CompanyNotificationService.notify_company_approved(
        company=company,
        company_users=company_users
    )
```

## 2. API Endpoints Usage

### Frontend JavaScript Examples

#### Get Notifications
```javascript
// Get user notifications with pagination
fetch('/api/notifications/?limit=10&offset=0', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => {
    console.log('Notifications:', data.data.notifications);
    console.log('Unread count:', data.data.unread_count);
});
```

#### Mark Notification as Read
```javascript
// Mark specific notification as read
fetch('/api/notifications/123/', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        is_read: true
    })
})
.then(response => response.json())
.then(data => {
    console.log('Notification marked as read');
});
```

#### Mark All as Read
```javascript
// Mark all notifications as read
fetch('/api/notifications/mark-all-read/', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => {
    console.log('All notifications marked as read');
});
```

#### Get Unread Count
```javascript
// Get only unread count (for notification badge)
fetch('/api/notifications/unread-count/', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => {
    console.log('Unread count:', data.data.unread_count);
    // Update notification badge in UI
    updateNotificationBadge(data.data.unread_count);
});
```

## 3. WebSocket Real-time Notifications

### Frontend WebSocket Connection
```javascript
class NotificationManager {
    constructor(token) {
        this.token = token;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    
    connect() {
        // Replace with your WebSocket URL
        const wsUrl = `ws://localhost:8000/ws/notifications/?token=${this.token}`;
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('Connected to notifications');
            this.reconnectAttempts = 0;
        };
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleNotification(data);
        };
        
        this.socket.onclose = () => {
            console.log('Disconnected from notifications');
            this.reconnect();
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    
    handleNotification(data) {
        if (data.type === 'notification') {
            // Show notification to user
            this.showNotification(data.notification);
            
            // Update unread count
            this.updateUnreadCount();
            
            // Play notification sound
            this.playNotificationSound();
        }
    }
    
    showNotification(notification) {
        // Create notification UI element
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification-popup';
        notificationElement.innerHTML = `
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <small>${new Date(notification.created_at).toLocaleString()}</small>
            </div>
        `;
        
        // Add to notifications container
        document.getElementById('notifications-container').appendChild(notificationElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notificationElement.remove();
        }, 5000);
    }
    
    markAsRead(notificationId) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'mark_as_read',
                notification_id: notificationId
            }));
        }
    }
    
    getUnreadCount() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'get_unread_count'
            }));
        }
    }
    
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connect();
            }, 2000 * this.reconnectAttempts);
        }
    }
    
    updateUnreadCount() {
        // Fetch latest unread count via API
        fetch('/api/notifications/unread-count/', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        })
        .then(response => response.json())
        .then(data => {
            const badge = document.getElementById('notification-badge');
            const count = data.data.unread_count;
            
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        });
    }
    
    playNotificationSound() {
        // Play notification sound
        const audio = new Audio('/static/sounds/notification.mp3');
        audio.play().catch(e => console.log('Could not play sound:', e));
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager(userToken);
notificationManager.connect();
```

## 4. Integration with Existing Features

### Job Posting Integration
```python
# In your job posting creation view
def create_job_post(request):
    # ... create job post logic ...
    
    # After job post is created, notify relevant job seekers
    if job_post.job_post_status == 'active':
        # Find job seekers with matching skills/roles
        matching_job_seekers = JobSeeker.objects.filter(
            occupation__role=job_post.role,
            is_open_to_work=True
        )[:50]  # Limit to 50 to avoid spam
        
        JobNotificationService.notify_new_job_posted(
            job_post=job_post,
            target_job_seekers=matching_job_seekers
        )
    
    return Response(...)
```

### Job Application Integration
```python
# In your job application creation view
def apply_for_job(request, job_id):
    # ... application logic ...
    
    # Notify company about new application
    company_users = job_post.posted_by.company.users.filter(
        role__name__in=['ADMIN', 'SUPERADMIN']
    )
    
    JobNotificationService.notify_job_application(
        job_post=job_post,
        applicant=request.user.jobseeker,
        company_users=company_users
    )
    
    return Response(...)
```

## 5. Notification Types and Templates

### Available Notification Types
- `GENERIC`: General notifications
- `JOB_POSTED`: New job postings
- `JOB_APPLIED`: Job applications
- `COMPANY_APPROVED`: Company approvals

### Adding New Notification Types
```python
# In utils/notification/types.py
class NotificationType(str, Enum):
    GENERIC = "generic"
    JOB_POSTED = "job_posted"
    JOB_APPLIED = "job_applied"
    COMPANY_APPROVED = "company_approved"
    PROFILE_UPDATED = "profile_updated"  # New type
    MESSAGE_RECEIVED = "message_received"  # New type
```

### Custom Notification Service
```python
class ProfileNotificationService:
    @staticmethod
    def notify_profile_completion(user):
        NotificationService.create_notification(
            user_id=user.id,
            title="Profile Completed",
            message="Congratulations! Your profile is now 100% complete.",
            destination_url="/profile",
            notification_type=NotificationType.PROFILE_UPDATED
        )
```

## 6. Testing the Notification System

### Unit Tests
```python
from django.test import TestCase
from services.notification.notification_service import NotificationService

class NotificationServiceTest(TestCase):
    def test_create_notification(self):
        user = User.objects.create_user(email='test@example.com')
        
        notifications = NotificationService.create_notification(
            user_id=user.id,
            title="Test Notification",
            message="This is a test"
        )
        
        self.assertEqual(len(notifications), 1)
        self.assertEqual(notifications[0].title, "Test Notification")
        
    def test_mark_as_read(self):
        # ... test marking notifications as read ...
```

### API Tests
```python
from rest_framework.test import APITestCase

class NotificationAPITest(APITestCase):
    def test_get_notifications(self):
        # ... test API endpoints ...
```

This completes the implementation of a comprehensive notification system with real-time WebSocket support, RESTful APIs, and easy integration with existing features.
