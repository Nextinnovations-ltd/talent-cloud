#!/bin/bash

NAME="talent-cloud" # Django application name
DIR=home/ubuntu/talentcloud_networks/talent-cloud   # Directory where project is located
USER=ubuntu   # User to run this script as
GROUP=ubuntu  # Group to run this script as
SOCKFILE=/home/ubuntu/talentcloud_networks/configurations/staging/daphne.sock  # Unix socket for Daphne communication
DJANGO_SETTINGS_MODULE=main.config.settings.staging  # Django settings module
DJANGO_ASGI_MODULE=main.config.asgi  # Daphne uses ASGI application
LOG_LEVEL=debug

source /home/ubuntu/venv/bin/activate  # Activate the virtual environment
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DIR:$PYTHONPATH

# Command to run the program under supervisord
exec /home/ubuntu/venv/bin/daphne -u $SOCKFILE \
--bind 0.0.0.0 \
--port 8000 \
-v 2 $DJANGO_ASGI_MODULE:application