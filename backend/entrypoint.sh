#!/bin/sh
set -e

echo "Waiting for database..."
until python - <<'PY'
import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
from django.db import connection
connection.ensure_connection()
PY
do
  echo "Database unavailable - sleeping"
  sleep 2
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

exec "$@"
