
from django.test import Client
import json

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
