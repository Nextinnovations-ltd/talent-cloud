from django.contrib import admin
from .models import Notification, NotificationTemplate, Chat, Message

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__email', 'title', 'message']
    readonly_fields = ['created_at']

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['type', 'channel', 'is_active', 'is_urgent_by_default', 'created_at']
    list_filter = ['type', 'channel', 'is_active', 'is_urgent_by_default']
    search_fields = ['type', 'subject_template', 'title_template']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('type', 'channel', 'is_active', 'is_urgent_by_default')
        }),
        ('Email Templates', {
            'fields': ('subject_template', 'email_template_name'),
            'classes': ('collapse',)
        }),
        ('WebSocket/In-App Templates', {
            'fields': ('title_template', 'message_template'),
            'classes': ('collapse',)
        }),
        ('Common Settings', {
            'fields': ('destination_url_template', 'available_variables'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'created_at']
    readonly_fields = ['uuid', 'created_at']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['chat', 'sender', 'message', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['message', 'sender__email']
    readonly_fields = ['created_at']
