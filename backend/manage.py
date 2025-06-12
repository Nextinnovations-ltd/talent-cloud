#!/usr/bin/env python
import os
import sys
from decouple import config

def main():
    """Run administrative tasks."""
    
    env = os.getenv('ENV', 'development')
    settings_module = f'main.config.settings.{env}'
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', config('DJANGO_SETTINGS_MODULE', default=settings_module))
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
