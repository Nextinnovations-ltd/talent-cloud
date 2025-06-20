# Generated by Django 5.1.1 on 2025-03-11 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_seekers', '0021_spokenlanguage_jobseekerlanguageproficiency'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobseekerlanguageproficiency',
            name='proficiency_level',
            field=models.CharField(choices=[('none', 'None'), ('basic', 'Basic Level'), ('intermediate', 'Intermediate Level'), ('business', 'Business Level'), ('native', 'Native Level')], default='basic', max_length=255),
        ),
    ]
