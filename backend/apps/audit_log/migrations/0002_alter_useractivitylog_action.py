# Generated by Django 5.1.1 on 2025-03-11 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('audit_log', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useractivitylog',
            name='action',
            field=models.CharField(choices=[('LOGIN', 'User Logged In'), ('LOGOUT', 'User Logged Out'), ('REGISTER', 'User Registered'), ('APPLY_JOB', 'Applied for Job'), ('UPDATE_PROFILE', 'Updated Profile')], max_length=255),
        ),
    ]
