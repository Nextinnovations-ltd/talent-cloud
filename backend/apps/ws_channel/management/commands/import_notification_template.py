"""
Management command to populate notification templates with default values
"""

from django.core.management.base import BaseCommand
from apps.ws_channel.models import NotificationTemplate
from utils.notification.types import NotificationType, NotificationChannel

class Command(BaseCommand):
    help = 'Populate notification templates with default values'

    def handle(self, *args, **options):
        """Create default notification templates"""
        
        # Default templates for different notification types
        default_templates = {
            NotificationType.GENERIC: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'TalentCloud Notification',
                    'email_template_name': 'emails/generic_notification.html',
                    'title_template': 'General Notification',
                    'message_template': 'You have a new notification from TalentCloud.',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'General Notification',
                    'message_template': 'You have a new notification from TalentCloud.',
                }
            },
            
            NotificationType.JOB_POSTED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'New Job Posted: {job_title}',
                    'email_template_name': 'emails/jobs/job_posted.html',
                    'title_template': 'New Job Posted',
                    'message_template': 'A new job {job_title} has been posted by {company_name}.',
                    'destination_url_template': '/jobs/{job_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'New Job Posted',
                    'message_template': 'A new job {job_title} has been posted by {company_name}.',
                    'destination_url_template': '/jobs/{job_id}',
                }
            },
            
            NotificationType.ADMIN_JOB_POSTING: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'New Job Posted: {job_title}',
                    'email_template_name': 'emails/jobs/job_posted.html',
                    'title_template': 'New Job Posted',
                    'message_template': 'A new job {job_title} has been posted by {company_name}.',
                    'destination_url_template': '/alljobs/{job_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'New Job Posted',
                    'message_template': 'A new job {job_title} has been posted by {company_name}.',
                    'destination_url_template': '/alljobs/{job_id}',
                }
            },
            
            NotificationType.JOB_APPLIED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'New Application for {job_title}',
                    'email_template_name': 'emails/application/application_received.html',
                    'title_template': 'New Job Application',
                    'message_template': '{applicant_name} has applied for the position: {job_title}.',
                    'destination_url_template': '/company/applications/{job_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'New Job Application',
                    'message_template': '{applicant_name} has applied for the position: {job_title}.',
                    'destination_url_template': '/company/applications/{job_id}',
                }
            },
            
            NotificationType.APPLICATION_STATUS_UPDATE: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Application Status Update for {job_title}',
                    'email_template_name': 'emails/application_status_update.html',
                    'title_template': 'Application Status Update',
                    'message_template': 'Your application for "{job_title}" has been updated to: {status}.',
                    'destination_url_template': '/my-applications/{application_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Application Status Update',
                    'message_template': 'Your application for "{job_title}" has been updated to: {status}.',
                    'destination_url_template': '/my-applications/{application_id}',
                }
            },
            
            NotificationType.APPLICATION_STATUS_CHANGED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Application Status Update for {job_title}',
                    'email_template_name': 'emails/application_status_update.html',
                    'title_template': 'Application Status Update',
                    'message_template': 'Your application for "{job_title}" has been updated to: {application_status}.',
                    'destination_url_template': '/my-applications/{application_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Application Status Update',
                    'message_template': 'Your application for "{job_title}" has been updated to: {application_status}.',
                    'destination_url_template': '/my-applications/{application_id}',
                }
            },
            
            NotificationType.APPLICATION_SUBMITTED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Application Update for {job_title} Position',
                    'email_template_name': 'emails/application/application_submitted.html',
                    'title_template': 'Application Submitted',
                    'message_template': 'Your application for {job_title} at {company_name} has been submitted.',
                    'destination_url_template': '/my-applications/{application_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Application Submitted',
                    'message_template': 'Your application for {job_title} at {company_name} has been submitted.',
                    'destination_url_template': '/my-applications/{application_id}',
                }
            },
            
            NotificationType.APPLICATION_SHORTLISTED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Application Update for {job_title} Position',
                    'email_template_name': 'emails/application/shortlisted.html',
                    'title_template': 'Application Update',
                    'message_template': 'Your application for {job_title} at {company_name} has been shortlisted.',
                    'destination_url_template': '/my-applications/{application_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Application Update',
                    'message_template': 'Your application for {job_title} at {company_name} has been shortlisted.',
                    'destination_url_template': '/my-applications/{application_id}',
                }
            },
            
            NotificationType.APPLICATION_REJECTED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Application Update for {job_title} Position',
                    'email_template_name': 'emails/application/rejected.html',
                    'title_template': 'Application Update',
                    'message_template': 'Your application for {job_title} at {company_name} has been rejected.',
                    'destination_url_template': '/my-applications/{application_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Application Update',
                    'message_template': 'Your application for {job_title} at {company_name} has been rejected.',
                    'destination_url_template': '/my-applications/{application_id}',
                }
            },
            
            NotificationType.COMPANY_APPROVED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Company Registration Approved',
                    'email_template_name': 'emails/company_approval.html',
                    'title_template': 'Company Registration Approved',
                    'message_template': 'Congratulations! Your company "{company_name}" has been approved.',
                    'destination_url_template': '/company/dashboard',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Company Registration Approved',
                    'message_template': 'Congratulations! Your company "{company_name}" has been approved.',
                    'destination_url_template': '/company/dashboard',
                }
            },
            
            NotificationType.COMPANY_REJECTED: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'Company Registration Update',
                    'email_template_name': 'emails/company_rejection.html',
                    'title_template': 'Company Registration Update',
                    'message_template': 'Your company "{company_name}" registration has been rejected. {reason}',
                    'destination_url_template': '/company/dashboard',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'Company Registration Update',
                    'message_template': 'Your company "{company_name}" registration has been rejected. {reason}',
                    'destination_url_template': '/company/dashboard',
                }
            },
            
            NotificationType.ADMIN_COMPANY_REGISTRATION: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'New Company Registration: {company_name}',
                    'email_template_name': 'emails/company_registration_to_admin.html',
                    'title_template': 'New Company Registration',
                    'message_template': 'A new company "{company_name}" has registered and is pending approval.',
                    'destination_url_template': '/admin/companies/{company_id}',
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'New Company Registration',
                    'message_template': 'A new company "{company_name}" has registered and is pending approval.',
                    'destination_url_template': '/admin/companies/{company_id}',
                }
            },
            
            NotificationType.ADMIN_MAINTENANCE: {
                NotificationChannel.EMAIL: {
                    'subject_template': 'System Maintenance Notification',
                    'email_template_name': 'emails/system_maintenance.html',
                    'title_template': 'System Maintenance',
                    'message_template': 'Scheduled system maintenance: {maintenance_info}',
                    'is_urgent_by_default': True,
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'System Maintenance',
                    'message_template': 'Scheduled system maintenance: {maintenance_info}',
                    'is_urgent_by_default': True,
                }
            },
            
            NotificationType.ADMIN_SYSTEM_ALERT: {
                NotificationChannel.EMAIL: {
                    'subject_template': '[URGENT] System Alert',
                    'email_template_name': 'emails/generic_notification.html',
                    'title_template': 'System Alert',
                    'message_template': 'System alert: {alert_message}',
                    'is_urgent_by_default': True,
                },
                NotificationChannel.WEBSOCKET: {
                    'title_template': 'System Alert',
                    'message_template': 'System alert: {alert_message}',
                    'is_urgent_by_default': True,
                }
            },
        }
        
        created_count = 0
        updated_count = 0
        
        for notification_type, channels in default_templates.items():
            for channel, template_data in channels.items():
                # Add available variables documentation
                available_variables = self.get_available_variables(notification_type)
                template_data['available_variables'] = available_variables
                
                template, created = NotificationTemplate.objects.get_or_create(
                    type=notification_type.value,
                    channel=channel.value,
                    defaults=template_data
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Created template: {notification_type.name} - {channel.name}'
                        )
                    )
                else:
                    # Update existing template if needed
                    updated = False
                    for field, value in template_data.items():
                        if getattr(template, field) != value:
                            setattr(template, field, value)
                            updated = True
                    
                    if updated:
                        template.save()
                        updated_count += 1
                        self.stdout.write(
                            self.style.WARNING(
                                f'Updated template: {notification_type.name} - {channel.name}'
                            )
                        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Notification template population complete! '
                f'Created: {created_count}, Updated: {updated_count}'
            )
        )
    
    def get_available_variables(self, notification_type):
        """Get available variables for each notification type"""
        common_vars = {
            'user_name': 'Name of the user receiving the notification',
            'user_email': 'Email of the user receiving the notification',
            'platform_name': 'Name of the platform (TalentCloud)',
            'frontend_url': 'Base URL of the frontend application',
            'support_email': 'Support email address',
        }
        
        type_specific_vars = {
            NotificationType.JOB_POSTED: {
                'job_title': 'Title of the job',
                'job_id': 'ID of the job posting',
                'company_name': 'Name of the company',
                'job_description': 'Job description'
            },
            NotificationType.JOB_APPLIED: {
                'job_title': 'Title of the job',
                'job_id': 'ID of the job posting',
                'applicant_name': 'Name of the applicant',
                'applicant_email': 'Email of the applicant'
            },
            NotificationType.APPLICATION_STATUS_UPDATE: {
                'job_title': 'Title of the job',
                'application_id': 'ID of the application',
                'status': 'New application status',
                'old_status': 'Previous application status'
            },
            NotificationType.COMPANY_APPROVED: {
                'company_name': 'Name of the company',
                'company_id': 'ID of the company'
            },
            NotificationType.COMPANY_REJECTED: {
                'company_name': 'Name of the company',
                'company_id': 'ID of the company',
                'reason': 'Reason for rejection'
            },
            NotificationType.ADMIN_COMPANY_REGISTRATION: {
                'company_name': 'Name of the company',
                'company_id': 'ID of the company'
            },
            NotificationType.ADMIN_MAINTENANCE: {
                'maintenance_info': 'Maintenance information',
                'start_time': 'Maintenance start time',
                'end_time': 'Maintenance end time'
            },
            NotificationType.ADMIN_SYSTEM_ALERT: {
                'alert_message': 'Alert message content'
            }
        }
        
        return {
            **common_vars,
            **type_specific_vars.get(notification_type, {})
        }
