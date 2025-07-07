# Admin Notification Integration Examples

This document shows how to integrate admin notifications into your existing Django views and services.

## 1. Company Registration Example

### In your company registration view:
```python
from services.notification.notification_service import AdminNotificationService

class CompanyRegistrationAPIView(APIView):
    def post(self, request):
        # ... existing company creation logic ...
        
        if company:
            # Notify admins about new company registration
            AdminNotificationService.notify_new_company_registration(
                company=company,
                admin_level='both'  # 'admin', 'superadmin', or 'both'
            )
        
        return Response(...)
```

## 2. User Registration Example

### In your user registration view:
```python
from services.notification.notification_service import AdminNotificationService

class UserRegistrationAPIView(APIView):
    def post(self, request):
        # ... existing user creation logic ...
        
        if user:
            # Notify admins about new user registration
            AdminNotificationService.notify_new_user_registration(
                user=user,
                admin_level='both'
            )
        
        return Response(...)
```

## 3. Job Posting Monitoring

### In your job posting creation view:
```python
from services.notification.notification_service import AdminNotificationService
from django.utils import timezone
from datetime import timedelta

class JobPostCreateAPIView(APIView):
    def post(self, request):
        # ... existing job post creation logic ...
        
        # Check for high-volume posting (optional monitoring)
        if job_post:
            company = job_post.posted_by.company
            yesterday = timezone.now() - timedelta(days=1)
            recent_posts = JobPost.objects.filter(
                posted_by__company=company,
                created_at__gte=yesterday
            ).count()
            
            # Alert admins if company posts more than 10 jobs in 24h
            if recent_posts > 10:
                AdminNotificationService.notify_high_volume_job_posting(
                    company=company,
                    job_count=recent_posts,
                    admin_level='both'
                )
        
        return Response(...)
```

## 4. Company Verification

### In your company verification view:
```python
from services.notification.notification_service import AdminNotificationService

class CompanyVerificationAPIView(APIView):
    def post(self, request, company_id):
        # When company submits verification documents
        company = get_object_or_404(Company, id=company_id)
        
        # ... save verification documents ...
        
        # Notify admins that verification is needed
        AdminNotificationService.notify_company_verification_required(
            company=company,
            admin_level='superadmin'  # Only superadmins handle verification
        )
        
        return Response(...)
```

## 5. System Alerts

### For system monitoring:
```python
from services.notification.notification_service import AdminNotificationService

def check_system_health():
    """Function to check system health and send alerts"""
    
    # Example: Database connection check
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        AdminNotificationService.notify_system_alert(
            title="Database Connection Error",
            message=f"Database connection failed: {str(e)}",
            admin_level='superadmin',
            destination_url="/admin/system/health"
        )
    
    # Example: High error rate alert
    error_count = ErrorLog.objects.filter(
        created_at__gte=timezone.now() - timedelta(hours=1)
    ).count()
    
    if error_count > 100:
        AdminNotificationService.notify_system_alert(
            title="High Error Rate Alert",
            message=f"System has logged {error_count} errors in the last hour",
            admin_level='both'
        )
```

## 6. Celery Task for Daily Reports

### Create a Celery task for daily activity reports:
```python
from celery import shared_task
from services.notification.notification_service import AdminNotificationService

@shared_task
def send_daily_activity_report():
    """Send daily platform activity summary to admins"""
    from django.utils import timezone
    from datetime import timedelta
    
    yesterday = timezone.now() - timedelta(days=1)
    
    # Gather metrics
    metrics = {
        'new_users': User.objects.filter(created_at__gte=yesterday).count(),
        'new_companies': Company.objects.filter(created_at__gte=yesterday).count(),
        'new_jobs': JobPost.objects.filter(created_at__gte=yesterday).count(),
        'new_applications': JobApplication.objects.filter(created_at__gte=yesterday).count()
    }
    
    AdminNotificationService.notify_platform_activity_summary(
        metrics=metrics,
        admin_level='both'
    )
```

## 7. Content Moderation Integration

### In your content reporting view:
```python
from services.notification.notification_service import AdminNotificationService

class ReportContentAPIView(APIView):
    def post(self, request):
        content_type = request.data.get('content_type')  # 'job_post', 'profile', etc.
        content_id = request.data.get('content_id')
        reason = request.data.get('reason')
        
        # ... save report logic ...
        
        # Notify admins about content that needs moderation
        AdminNotificationService.notify_content_moderation(
            content_type=content_type,
            content_id=content_id,
            reason=reason,
            admin_level='admin'  # Content moderation handled by admins
        )
        
        return Response(...)
```

## 8. User Violation Reports

### In your user violation reporting view:
```python
from services.notification.notification_service import AdminNotificationService

class ReportUserViolationAPIView(APIView):
    def post(self, request):
        reported_user_id = request.data.get('reported_user_id')
        violation_type = request.data.get('violation_type')
        
        reported_user = get_object_or_404(User, id=reported_user_id)
        
        # ... save violation report ...
        
        AdminNotificationService.notify_violation_report(
            reported_user=reported_user,
            reporter=request.user,
            violation_type=violation_type,
            admin_level='both'
        )
        
        return Response(...)
```

## 9. Admin Login Security Alert

### In your authentication middleware or view:
```python
from services.notification.notification_service import AdminNotificationService

class AdminLoginView(APIView):
    def post(self, request):
        # ... authentication logic ...
        
        if user.is_authenticated and user.role.name in ['admin', 'superadmin']:
            # Get client IP
            ip_address = request.META.get('HTTP_X_FORWARDED_FOR', 
                                        request.META.get('REMOTE_ADDR'))
            
            # Optional: Get location from IP (using external service)
            # location = get_location_from_ip(ip_address)
            
            # Send security alert to other admins
            AdminNotificationService.notify_admin_login_alert(
                admin_user=user,
                ip_address=ip_address,
                # location=location
            )
        
        return Response(...)
```

## 10. Scheduled Maintenance Notifications

### In your maintenance scheduling view:
```python
from services.notification.notification_service import AdminNotificationService

class ScheduleMaintenanceAPIView(APIView):
    def post(self, request):
        maintenance_type = request.data.get('type')
        scheduled_time = request.data.get('scheduled_time')
        
        # ... save maintenance schedule ...
        
        AdminNotificationService.notify_maintenance_schedule(
            maintenance_type=maintenance_type,
            scheduled_time=scheduled_time,
            admin_level='both'
        )
        
        return Response(...)
```

## 11. API Endpoint for Admin Notifications

### Create dedicated admin notification endpoints:
```python
# In your admin views
from services.notification.notification_service import AdminNotificationService

@extend_schema(tags=["Admin Notifications"])
class AdminBroadcastNotificationAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [TalentCloudSuperAdminPermission]
    
    def post(self, request):
        """Broadcast notification to all admins"""
        title = request.data.get('title')
        message = request.data.get('message')
        admin_level = request.data.get('admin_level', 'both')
        destination_url = request.data.get('destination_url')
        
        AdminNotificationService.notify_system_alert(
            title=title,
            message=message,
            admin_level=admin_level,
            destination_url=destination_url
        )
        
        return Response(
            CustomResponse.success("Notification sent to admins successfully."),
            status=status.HTTP_200_OK
        )
```

## 12. Usage in Django Signals

### Automatically notify admins using Django signals:
```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from services.notification.notification_service import AdminNotificationService

@receiver(post_save, sender=Company)
def notify_admin_new_company(sender, instance, created, **kwargs):
    if created:
        AdminNotificationService.notify_new_company_registration(
            company=instance,
            admin_level='both'
        )

@receiver(post_save, sender=User)
def notify_admin_new_user(sender, instance, created, **kwargs):
    if created and instance.role.name == 'user':
        AdminNotificationService.notify_new_user_registration(
            user=instance,
            admin_level='admin'
        )
```

This integration guide shows how to seamlessly add admin notifications throughout your application for comprehensive monitoring and management.
