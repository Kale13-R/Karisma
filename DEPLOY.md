# Karisma Deployment Guide

## Prerequisites
- GitHub repo pushed and up to date
- Railway account created at railway.app
- Vercel account created at vercel.com

## Step 1 — Railway Backend Setup
1. Create new project in Railway dashboard
2. Connect your GitHub repo, select the `backend/` directory
3. Add a Postgres plugin to the project (Railway dashboard → Add Plugin → PostgreSQL)
4. Railway will auto-inject DATABASE_URL into your backend environment
5. Add these environment variables in Railway dashboard:
   - GATE_PASSWORD=your_chosen_password
   - SESSION_SECRET=long_random_string_minimum_32_chars
   - STRIPE_SECRET_KEY=sk_live_xxx
   - STRIPE_WEBHOOK_SECRET=whsec_xxx
   - RESEND_API_KEY=re_xxx
   - RESEND_FROM_EMAIL=orders@yourdomain.com
   - ADMIN_SECRET=your_admin_secret
   - ALLOWED_ORIGINS=https://your-project.vercel.app
6. Deploy — Railway will run the seed script on startup via the startup event
7. Note your Railway backend URL: https://your-project.railway.app

## Step 2 — Vercel Frontend Setup
1. Import your GitHub repo in Vercel dashboard
2. Set Root Directory to `frontend/`
3. Framework Preset: Next.js (auto-detected)
4. Add these environment variables in Vercel dashboard:
   - NEXT_PUBLIC_API_URL=https://your-project.railway.app
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   - NEXT_PUBLIC_DROP_TIMESTAMP=2026-04-01T00:00:00Z
5. Deploy

## Step 3 — Update CORS
After Vercel gives you your production URL:
1. Go to Railway dashboard → your backend service → Variables
2. Update ALLOWED_ORIGINS to include your Vercel URL:
   ALLOWED_ORIGINS=http://localhost:3000,https://your-project.vercel.app
3. Redeploy backend

## Step 4 — Stripe Webhook
1. Go to Stripe Dashboard → Webhooks → Add Endpoint
2. URL: https://your-project.railway.app/api/webhooks/stripe
3. Event: checkout.session.completed
4. Copy the webhook secret → add to Railway as STRIPE_WEBHOOK_SECRET

## Step 5 — Verify
- [ ] Gate loads with video background
- [ ] Password entry works
- [ ] Products load from Railway Postgres
- [ ] Add to cart works
- [ ] Stripe checkout completes
- [ ] Order confirmation email arrives
- [ ] Admin API responds at /api/admin/config with X-Admin-Key header
