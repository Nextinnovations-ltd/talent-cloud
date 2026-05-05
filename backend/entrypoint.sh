#!/bin/sh

if [ "$DJANGO_ENV" = "main.config.settings.development" ]; then
    echo "Waiting for postgres..."

    while ! nc -z db 5432; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py migrate
python manage.py compilemessages
python manage.py collectstatic --noinput --clear
# https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact
exec "$@"
