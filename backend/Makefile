 # Default to development
ENV ?= development

# Settings File Mapping
SETTINGS.production = main.config.settings.production
SETTINGS.staging = main.config.settings.staging
SETTINGS.development = main.config.settings.development

# Dynamic settings selection
SETTINGS = $(SETTINGS.$(ENV))

# Validation
VALID_ENVS := production staging development

ifeq ($(filter $(ENV),$(VALID_ENVS)),)
$(error ✗ Invalid ENV value '$(ENV)'. Must be one of: $(VALID_ENVS))
endif

## Database Management
reset-db:
	@echo "Resetting database..."
	@python manage.py flush --no-input --settings=$(SETTINGS)

migrations:
	@python manage.py makemigrations --settings=$(SETTINGS)

migrate:
	@python manage.py migrate --settings=$(SETTINGS)

import-talent-cloud-data:
	@python manage.py import_initial_data --settings=$(SETTINGS)

## User Management
createsuperuser:
	@python manage.py createsuperuser --settings=$(SETTINGS)

createjobseekeruser:
	@python manage.py create_job_seeker_user --settings=$(SETTINGS)

## Development server
runserver:
	@python manage.py runserver 0.0.0.0:$(PORT) --settings=$(SETTINGS)

run-daphne:
	@daphne -b 0.0.0.0 -p $(PORT) main.config.asgi:application

run-celery:
	@celery -A celery_app worker -l info

run-celery-beat:
	@celery -A celery_app beat -l info

run-celery-flower:
	@celery -A celery_app flower --port=5555

celery-status:
	@celery -A celery_app status

# Import Data
import-location-data:
	@python manage.py import_location_data --settings=$(SETTINGS)

## Deployment
collectstatic:
	@python manage.py collectstatic --noinput --settings=$(SETTINGS)

## Run Tests
test:
	@pytest --tb=short --s --settings=$(SETTINGS) --cov=main --cov-report=html:coverage_html

## Maintainance
clean: all
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__" -exec rm -rf {} \;
	@echo "Cleanup complete."
