# Generated by Django 5.1.1 on 2025-01-21 04:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_seekers', '0016_jobseekeroccupation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobseekerskill',
            name='user',
        ),
        migrations.AddField(
            model_name='jobseekeroccupation',
            name='skills',
            field=models.ManyToManyField(blank=True, to='job_seekers.jobseekerskill'),
        ),
    ]
