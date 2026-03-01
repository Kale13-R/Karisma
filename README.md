# KARISMA

Drop-based streetwear e-commerce. Exclusive releases. Limited access.

## Stack

- **Frontend** — Next.js 15, TypeScript, App Router
- **Backend** — FastAPI, Python 3.11
- **Auth** — JWT via httpOnly session cookie
- **Infra** — Docker Compose

## Drop Flow

1. Before drop time → countdown timer
2. After drop time → password entry gate
3. Correct password → session cookie set → storefront unlocked
4. Invalid/missing session → redirected back to gate

## Running with Docker

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env — set at minimum: GATE_PASSWORD, SESSION_SECRET, ADMIN_SECRET

# 2. Start everything (from repo root)
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

> **Note:** `NEXT_PUBLIC_API_URL` is set to `http://backend:8000` inside Docker. This resolves for server-side requests but browser-side fetch calls will fail. Override to `http://localhost:8000` for local Docker dev if you hit API errors.

## Local Development

**Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test -- --watchAll=false
```

## Environment Variables

### frontend/.env.local

| Variable | Description |
|---|---|
| NEXT_PUBLIC_DROP_TIMESTAMP | ISO 8601 drop datetime, e.g. 2026-03-01T00:00:00Z |
| NEXT_PUBLIC_API_URL | Backend base URL, e.g. http://localhost:8000 |

### backend/.env

| Variable | Description |
|---|---|
| GATE_PASSWORD | Password users must enter to access the store |
| SESSION_SECRET | Secret key for signing JWTs |
| SESSION_EXPIRE_HOURS | Session duration in hours (default: 24) |
| ALLOWED_ORIGINS | CORS allowed origins (default: http://localhost:3000) |
| ADMIN_SECRET | Key for X-Admin-Key header — must be set or admin routes return 403 |
| STRIPE_SECRET_KEY | Stripe secret key (required for checkout) |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret |
| RESEND_API_KEY | Resend API key (required for order confirmation emails) |
| ENVIRONMENT | `development` or `production` — controls secure cookie flag (default: development) |
