#!/bin/bash
NAME="talent-cloud"
DIR=home/ubuntu/talentcloud_networks/talent-cloud   # Directory where project is located
USER=ubuntu   #User to run this script as
GROUP=ubuntu  #Group to run this script as
DJANGO_WSGI_MODULE=talent-cloud         
DJANGO_WSGI_MODULE=talent-cloud         
DJANGO_SETTINGS_MODULE=talent-cloud.staging   #Which Django setting file should use

cd $DIR
source /home/ubuntu/venv/bin/activate #Activate the virtual environment
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DIR:$PYTHONPATH

#Command to run the progam under supervisord
exec /home/ubuntu/venv/bin/celery -A ${DJANGO_WSGI_MODULE} \
beat \
--loglevel=info