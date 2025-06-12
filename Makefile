PYTHON = python3
PIP = pip
VENV_DIR = venv
DB_NAME = talentcloud
DB_USER = talentclouduser
DB_PASSWORD = default
PORT = 8000

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

before-all:
	@echo "\033[0;33mEnvironment: \033[1;33m$(ENV)\033[0m"
	@echo "\033[0;33mSetting: \033[1;33m$(SETTINGS)\033[0m"

.PHONY: all
all: before-all

## Environment Setup
create-venv:
	@echo "Creating virtual environment..."
	@python3 -m venv $(VENV_DIR)

install-dev:
	@echo "Install dependencies in the virtual environment..."
	
	@echo "Upgrade PIP if Available..."
	$(VENV_DIR)/bin/pip install --upgrade pip

	@echo "Installing dependencies..."
	@$(VENV_DIR)/bin/pip install -r requirements.txt

	@echo "Development Dependencies installed."

install-prod: create-venv
	@echo "Installing production dependencies..."
	@$(VENV_DIR)/bin/pip install --upgrade pip
	@$(VENV_DIR)/bin/pip install -r requirements.txt
	@echo "Production dependencies installed."

clean-venv:
	@echo "Removing virtual environment..."
	rm -rf $(VENV_DIR)
	@echo "Virtual environment removed."

## Database Management
create-db:
	@echo "Creating database and user..."
	@psql -U postgres -c "CREATE DATABASE $(DB_NAME);" || true
	@psql -U postgres -c "CREATE USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)';" || true
	@psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER);" || true
	@psql -U postgres -c "ALTER DATABASE $(DB_NAME) OWNER TO $(DB_USER);" || true
	@echo "Database setup complete."

reset-db:
	@echo "Resetting database..."
	@psql -U postgres -c "DROP DATABASE IF EXISTS $(DB_NAME);"
	@psql -U postgres -c "CREATE DATABASE $(DB_NAME);"
	@psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $(DB_NAME) TO $(DB_USER);"
	@psql -U postgres -c "ALTER DATABASE $(DB_NAME) OWNER TO $(DB_USER);" || true
	@echo "Database reset complete."

migrations: all
	@echo "\n\033[1;34m=== Creating Migrations ===\033[0m"
	@echo "\033[0;33mDatabase: \033[1;33m$(DB_NAME)\033[0m\n"
	@$(VENV_DIR)/bin/python manage.py makemigrations --settings=$(SETTINGS)
	@echo "\n\033[1;32m✓ Migrations created\033[0m"
	@echo "\033[0;36mRun 'make migrate' to apply these migrations\033[0m\n"

migrate: all
	@echo "\n\033[1;34m=== Applying Migrations ===\033[0m"
	@echo "\033[0;33mDatabase: \033[1;33m$(DB_NAME)\033[0m\n"
	@$(VENV_DIR)/bin/python manage.py migrate --settings=$(SETTINGS)
	@echo "\n\033[1;32m✓ Migrations applied successfully\033[0m\n"

## User Management
createsuperuser: all
	@echo "\n\033[1;34m=== Creating Superuser ===\033[0m"
	@echo "\033[0;33mDatabase: \033[1;33m$(DB_NAME)\033[0m"
	@echo "\033[0;36mFollow the prompts below to create your admin user\033[0m\n"
	@$(VENV_DIR)/bin/python manage.py create_superuser --settings=$(SETTINGS)
	@echo "\n\033[1;32m✓ Superuser created\033[0m\n"

createjobseekeruser: all
	@echo "\n\033[1;34m=== Creating Job Seeker User ===\033[0m"
	@echo "\033[0;33mDatabase: \033[1;33m$(DB_NAME)\033[0m\n"
	@$(VENV_DIR)/bin/python manage.py create_job_seeker_user --settings=$(SETTINGS)
	@echo "\n\033[1;32m✓ Job seeker user created\033[0m\n"

## Development server
runserver: all
	@echo "\n\033[1;34m=== Starting Development Server ===\033[0m"
	@echo "\033[0;33mRunning on: \033[1;33mhttp://0.0.0.0:$(PORT)\033[0m"
	@echo "\033[0;36mPress Ctrl+C to stop the server\033[0m\n"
	@$(VENV_DIR)/bin/python manage.py runserver 0.0.0.0:$(PORT) --settings=$(SETTINGS)

run-daphne: all
	@echo "\n\033[1;34m=== Starting Daphne Server ===\033[0m"
	@echo "\033[0;33mRunning on: \033[1;33mhttp://0.0.0.0:$(PORT)\033[0m"
	@$(VENV_DIR)/bin/daphne -b 0.0.0.0 -p $(PORT) main.config.asgi:application

run-celery: all
	@echo "Starting Celery worker..."
	@$(VENV_DIR)/bin/celery -A main worker -l info

run-celery-beat: all
	@echo "Starting Celery beat..."
	@$(VENV_DIR)/bin/celery -A main beat -l info

## Deployment
collectstatic: all
	@echo "Collecting static files..."
	python manage.py collectstatic --noinput

## Run Tests
test: all
	@echo "\n\033[1;34m=== Running Tests ===\033[0m"
	@DJANGO_SETTINGS_MODULE=$(SETTINGS) $(VENV_DIR)/bin/pytest --tb=short -v
	@echo "\n\033[1;32m✓ Tests completed\033[0m\n"

## Maintainance
clean: all
	@echo "Cleaning up..."
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__" -exec rm -rf {} \;
	@echo "Cleanup complete."

help:
	@echo "\n\033[1;34mTalentCloud Project Management\033[0m"
	@echo "\033[0;36mUsage: make [target]\033[0m\n"
	
	@echo "\033[1;33mEnvironment Setup:\033[0m"
	@echo "  \033[1;32mcreate-venv\033[0m       - Create Python virtual environment"
	@echo "  \033[1;32minstall-dev\033[0m       - Install development dependencies"
	@echo "  \033[1;32minstall-prod\033[0m      - Install production dependencies"
	@echo "  \033[1;32mclean-venv\033[0m        - Remove virtual environment\n"
	
	@echo "\033[1;33mDatabase Management:\033[0m"
	@echo "  \033[1;32mcreate-db\033[0m         - Create database and user"
	@echo "  \033[1;32mreset-db\033[0m          - Reset database (drop & recreate)"
	@echo "  \033[1;32mmigrations\033[0m        - Generate database migrations"
	@echo "  \033[1;32mmigrate\033[0m           - Apply database migrations\n"
	
	@echo "\033[1;33mUser Management:\033[0m"
	@echo "  \033[1;32mcreatesuperuser\033[0m   - Create admin superuser"
	@echo "  \033[1;32mcreatejobseekeruser\033[0m - Create job seeker user\n"
	
	@echo "\033[1;33mDevelopment:\033[0m"
	@echo "  \033[1;32mrunserver\033[0m         - Start Django dev server (port $(PORT))"
	@echo "  \033[1;32mrun-daphne\033[0m        - Start Daphne ASGI server (port $(PORT))"
	@echo "  \033[1;32mrun-celery\033[0m        - Start Celery worker"
	@echo "  \033[1;32mrun-celery-beat\033[0m   - Start Celery beat scheduler\n"
	
	@echo "\033[1;33mDeployment:\033[0m"
	@echo "  \033[1;32mcollectstatic\033[0m     - Collect static files for production\n"
	
	@echo "\033[1;33mTests:\033[0m"
	@echo "  \033[1;32mUnit Test\033[0m         - Perform tests for all features\n"

	@echo "\033[1;33mMaintenance:\033[0m"
	@echo "  \033[1;32mclean\033[0m             - Clean Python cache files"
	@echo "  \033[1;32mhelp\033[0m              - Show this help message\n"
	
	@echo "\033[0;36mNote: Set ENV=prod for production commands (e.g. ENV=prod make migrate)\033[0m"
	@echo "\033[0;36mCurrent default environment: \033[1;36m$(SETTINGS)\033[0m\n"