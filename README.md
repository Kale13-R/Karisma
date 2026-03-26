# KARISMA

Drop-based streetwear web app

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

PROD:Karismaworldwide.store

