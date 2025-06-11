# Dockerfile
FROM python:3.12-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python deps
COPY requirements/ ./requirements/
RUN pip install --upgrade pip \
 && pip install -r requirements/development.txt

# Copy backend code
COPY . .

# Build static files
RUN python manage.py collectstatic --noinput

# --- React Build ---
FROM node:18-slim AS frontend
WORKDIR /frontend
COPY client/ .
RUN npm install && npm run build

# --- Final stage ---
FROM python:3.12-slim

WORKDIR /app

# Copy from backend
COPY --from=backend /app /app

# Copy React build output into Django staticfiles dir
COPY --from=frontend /frontend/build /app/staticfiles

# Expose port and run Daphne
EXPOSE 8000
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "main.config.asgi:application"]
