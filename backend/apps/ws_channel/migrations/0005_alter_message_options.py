# Generated by Django 5.1.1 on 2025-06-10 08:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ws_channel', '0004_rename_timestamp_message_created_at_chat_status_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-created_at']},
        ),
    ]
