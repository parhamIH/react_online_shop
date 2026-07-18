# React Shop — Dockerized Full-Stack E-Commerce

[English](#english) | [فارسی](#فارسی)

---

## English

### Overview

React Shop is a full-stack e-commerce project with:

- **Backend:** Django 6 + Django REST Framework (JSON API)
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Infrastructure:** Docker Compose, Nginx reverse proxy, PostgreSQL
- **Payment:** ZarinPal payment gateway integration
- **Features:**
  - Multi-step checkout (address, shipping, payment)
  - Coupon code application
  - User profile with orders and addresses
  - Support tickets system
  - Cart management

Frontend and backend communicate via **HTTP Content Negotiation** (`Accept: application/json`, `Content-Type: application/json`).

### Project Structure

```
react-shop/
├── backend/                 # Django API
│   ├── Dockerfile           # Production image (Gunicorn)
│   ├── Dockerfile.dev       # Development image (runserver)
│   ├── entrypoint.sh        # Migrations + collectstatic
│   ├── core/                # Django settings & URLs
│   └── shop/                # Apps (products, cart, auth, ...)
├── frontend/                # React SPA
│   ├── Dockerfile           # Production build + Nginx
│   ├── Dockerfile.dev       # Vite dev server
│   ├── nginx.conf           # SPA static server
│   └── src/
│       ├── api/             # HTTP client (content negotiation)
│       └── services/        # Data layer (API or mock)
├── docker/
│   └── nginx/
│       └── default.conf     # Reverse proxy (API + SPA)
├── docker-compose.yml       # Production stack
├── docker-compose.dev.yml   # Development stack (hot reload)
├── .env.example             # Environment template
└── README.md
```

### Docker Network

All services run on a dedicated bridge network:

| Compose File | Network Name |
|---|---|
| Production | `react-shop-net` |
| Development | `react-shop-dev-net` |

| Service | Internal Host | Port (host) |
|---|---|---|
| Nginx (prod) | `nginx` | 80 |
| Backend | `backend` | 8000 (dev only) |
| Frontend | `frontend` | 5173 (dev only) |
| PostgreSQL | `db` | 5432 (dev only) |

In production, Nginx routes:

- `/` → React frontend
- `/api/` → Django REST API
- `/admin/` → Django admin
- `/static/`, `/media/` → shared volumes

### Quick Start — Production

```bash
cp .env.example .env
docker compose up -d --build
```

Open: **http://localhost**

Create admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

### Quick Start — Development (Hot Reload)

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
```

| URL | Service |
|---|---|
| http://localhost:5173 | React (Vite) |
| http://localhost:8000 | Django API |
| http://localhost:8000/admin | Django Admin |

### Content Negotiation

**Backend (DRF):**

- Default renderer: `JSONRenderer`
- Default parsers: `JSONParser`, `FormParser`, `MultiPartParser`
- Browsable API enabled only when `DEBUG=True`

**Frontend (`src/api/client.js`):**

```javascript
headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}
```

Set `VITE_USE_API=true` to connect frontend to backend. Set `VITE_USE_API=false` to use local mock data.

### Environment Variables

See `.env.example` for all options. Key variables:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API prefix (default: `/api`) |
| `VITE_USE_API` | `true` = backend API, `false` = mock data |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `POSTGRES_*` | Database credentials |

### Local Development (Without Docker)

**Backend:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Git Tags

| Tag | Description |
|---|---|
| `v1.0.0-docker` | Initial Docker + DevOps setup |

---

## فارسی

### معرفی

React Shop یک پروژه فروشگاهی فول‌استک است شامل:

- **بک‌اند:** Django 6 + Django REST Framework (API با فرمت JSON)
- **فرانت‌اند:** React 19 + Vite + Tailwind CSS
- **زیرساخت:** Docker Compose، Nginx، PostgreSQL
- **پرداخت:** یکپارچه‌سازی درگاه پرداخت زرین‌پال
- **ویژگی‌ها:**
  - چک‌آوت چند مرحله‌ای (آدرس، ارسال، پرداخت)
  - اعمال کد تخفیف
  - پروفایل کاربر با سفارشات و آدرس‌ها
  - سیستم تیکت پشتیبانی
  - مدیریت سبد خرید

ارتباط فرانت‌اند و بک‌اند با **Content Negotiation** انجام می‌شود (`Accept: application/json`).

### ساختار پروژه

```
react-shop/
├── backend/                 # API جنگو
├── frontend/                # React SPA
├── docker/nginx/            # تنظیمات Nginx
├── docker-compose.yml       # محیط Production
├── docker-compose.dev.yml   # محیط Development
└── .env.example             # نمونه متغیرهای محیطی
```

### شبکه Docker

تمام سرویس‌ها روی شبکه bridge اختصاصی اجرا می‌شوند:

| فایل Compose | نام شبکه |
|---|---|
| Production | `react-shop-net` |
| Development | `react-shop-dev-net` |

| سرویس | آدرس داخلی | پورت (میزبان) |
|---|---|---|
| Nginx | `nginx` | 80 |
| Backend | `backend` | 8000 (فقط dev) |
| Frontend | `frontend` | 5173 (فقط dev) |
| PostgreSQL | `db` | 5432 (فقط dev) |

در Production، Nginx مسیرها را این‌طور هدایت می‌کند:

- `/` → فرانت‌اند React
- `/api/` → API جنگو
- `/admin/` → پنل ادمین
- `/static/` و `/media/` → فایل‌های استاتیک

### راه‌اندازی سریع — Production

```bash
cp .env.example .env
docker compose up -d --build
```

مرورگر: **http://localhost**

ساخت کاربر ادمین:

```bash
docker compose exec backend python manage.py createsuperuser
```

### راه‌اندازی سریع — Development

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
```

| آدرس | سرویس |
|---|---|
| http://localhost:5173 | React |
| http://localhost:8000 | API |
| http://localhost:8000/admin | ادمین |

### Content Negotiation

**بک‌اند:** پاسخ پیش‌فرض JSON است. Browsable API فقط در حالت `DEBUG=True` فعال است.

**فرانت‌اند:** کلاینت HTTP در `src/api/client.js` هدرهای `Accept` و `Content-Type` را روی `application/json` تنظیم می‌کند.

برای اتصال به API: `VITE_USE_API=true`  
برای داده Mock: `VITE_USE_API=false`

### تگ Git

| تگ | توضیح |
|---|---|
| `v1.0.0-docker` | نسخه اولیه Docker + DevOps |

---

## License

MIT
