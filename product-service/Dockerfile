FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first for better build-cache reuse.
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

EXPOSE 5000

# Use database migrations instead of create_all() for production deployments.
CMD ["sh", "-c", "flask --app run.py init-db && gunicorn --workers 2 --threads 4 --bind 0.0.0.0:5000 run:app"]
