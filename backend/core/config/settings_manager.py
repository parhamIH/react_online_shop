import json
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")


def _parse_list(value, default):
    if not value:
        return default
    value = value.strip()
    if value.startswith("["):
        return json.loads(value)
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    def __init__(self):
        self.db_engine = os.getenv("DB_ENGINE", "django.db.backends.sqlite3")
        self.db_name = os.getenv("DB_NAME", str(BASE_DIR / "db.sqlite3"))
        self.db_user = os.getenv("DB_USER", "")
        self.db_password = os.getenv("DB_PASSWORD", "")
        self.db_host = os.getenv("DB_HOST", "")
        self.db_port = os.getenv("DB_PORT", "")

        self.zarinpal_merchant_id = os.getenv("ZARINPAL_MERCHANT_ID", "")
        self.zarinpal_sandbox = os.getenv("ZARINPAL_SANDBOX", "True").lower() == "true"

        self.secret_key = os.getenv("SECRET_KEY")
        self.debug = os.getenv("DEBUG", "True").lower() == "true"
        self.allowed_hosts = _parse_list(
            os.getenv("ALLOWED_HOSTS"),
            ["localhost", "127.0.0.1"],
        )
        self.cors_allowed_origins = _parse_list(
            os.getenv(
                "CORS_ALLOWED_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173,http://localhost,http://127.0.0.1",
            ),
            [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost",
                "http://127.0.0.1",
            ],
        )


settings_instance = Settings()
