FROM python:3.12-slim

WORKDIR /app

# Copy everything into container
COPY backend/ .

# Install dependencies (after copying the full app)
RUN pip install --no-cache-dir -r requirements.txt 

# Expose port
EXPOSE 8000

# Run ASGI server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "main.config.asgi:application"]