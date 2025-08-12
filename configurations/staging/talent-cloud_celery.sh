#!/bin/bash

DJANGO_WSGI_MODULE="talent-cloud"      
DJANGO_SETTINGS_MODULE=talent-cloud.staging  
DIR=home/ubuntu/talentcloud_networks/talent-cloud   # Directory where project is located

cd $DIR
source /home/ubuntu/venv/bin/activate  #Activate the virtual environment
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DIR:$PYTHONPATH

#Command to run the progam under supervisord
exec /home/ubuntu/venv/bin/celery -A ${DJANGO_WSGI_MODULE} \
worker \
--pool=prefork \
--concurrency=2 \
--loglevel=info