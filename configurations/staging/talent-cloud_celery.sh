#!/bin/bash

DJANGO_CELERY_APP=celery_app
DJANGO_SETTINGS_MODULE=main.config.settings.staging

DIR=home/ubuntu/talentcloud-networks/talent-cloud/backend    # Directory where project is located

cd $DIR
source /home/ubuntu/venv/bin/activate  #Activate the virtual environment
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DIR:$PYTHONPATH

#Command to run the progam under supervisord
exec /home/ubuntu/venv/bin/celery -A ${DJANGO_CELERY_APP} \
worker \
--pool=prefork \
--concurrency=2 \
--loglevel=info