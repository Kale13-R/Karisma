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
# Edit backend/.env — set GATE_PASSWORD and SESSION_SECRET

# 2. Start everything
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

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
