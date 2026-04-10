# TalentCloud

TalentCloud is a platform for connecting job seekers with employers in the public service sector. It provides a user-friendly interface for job seekers to search and apply for jobs, and for employers to post job openings and manage applications.

### Setup and Installation (Backend)
```
cd backend && python -m venv .venv
source .venv/bin/activate
uv add -r requirements-dev.txt

./scripts/decrypt_env.sh # To decrypt the .env files

python manage.py import_initial_data
python manage.py create_superuser
python manage.py runserver
```

### Setup and Installation (Frontend)
```
cd frontend && npm ci
npm run dev
```

### Running Tests
```
# Backend tests
uv run pytest --cov=talentcloud --cov-report=html
# Frontend tests
npm run test
```
