
import os
import sys
import django
from django.test import Client
import json

# Set up Django
sys.path.insert(0, '/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

client = Client()

print("=== /api/home/ ===")
response = client.get("/api/home/")
print("Status Code:", response.status_code)
print(json.dumps(response.json(), indent=2))

print("\n=== /api/categories/ ===")
response = client.get("/api/categories/")
print("Status Code:", response.status_code)
print(json.dumps(response.json(), indent=2))

print("\n=== /api/products/new/ ===")
response = client.get("/api/products/new/")
print("Status Code:", response.status_code)
print(json.dumps(response.json(), indent=2))
