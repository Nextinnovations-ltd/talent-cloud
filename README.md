# Talent Cloud Backend

For Development

1. You need to run Backend Server through "python manage.py runserver"
2. Run celery through "celery -A main worker --loglevel=info"
3. Run celery beat through "celery -A main beat -l info"