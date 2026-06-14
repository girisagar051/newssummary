# KhabarPati — Deployment Guide

## 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) → **New Project**
2. Name it `khabarpati`, choose a region close to Nepal (e.g. Singapore)
3. After creation, go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Run the Database Schema

In Supabase → **SQL Editor**, paste and run:
```
supabase/migrations/001_init.sql
```
Then run the seed data:
```
supabase/seed.sql
```

## 3. Enable Phone Auth (OTP)

In Supabase → **Authentication → Providers → Phone**:
- Enable **Phone** provider
- Choose **Twilio** (recommended) or Twilio Verify
- Add your Twilio credentials:
  - Account SID
  - Auth Token
  - Message Service SID (or From number)
- Set OTP expiry to **600 seconds** (10 min)

> **Note:** Twilio has a free trial. For Nepal (+977), SMS delivery works with standard Twilio accounts.

## 4. Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
cd khabarpati
vercel
```

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `khabarpati`
4. Add Environment Variables (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (e.g. `https://khabarpati.vercel.app`) |

5. Click **Deploy**

## 5. Set Supabase Auth Redirect URL

In Supabase → **Authentication → URL Configuration**:
- Site URL: `https://khabarpati.vercel.app`
- Redirect URLs: `https://khabarpati.vercel.app/**`

## 6. Run the Crawler

```bash
cd crawler
pip install -r requirements.txt

# Set env vars
export CRAWLER_SUPABASE_URL="https://your-project.supabase.co"
export CRAWLER_SUPABASE_KEY="your-service-role-key"

# Test (dry run — no DB write)
python crawler.py --dry-run

# Run once
python crawler.py --once

# Run every 30 minutes (keep terminal open)
python crawler.py
```

### Schedule with cron (Linux/Mac)
```bash
crontab -e
# Add:
*/30 * * * * cd /path/to/khabarpati/crawler && python crawler.py --once >> /tmp/crawler.log 2>&1
```

## 7. Local Development

```bash
cp .env.example .env.local
# Fill in your Supabase values in .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture Overview

```
Vercel (Next.js 14)
  ├── app/          → Pages (App Router)
  ├── components/   → UI components
  ├── context/      → AuthContext (Supabase phone OTP)
  ├── lib/
  │   ├── supabase/ → client.ts + server.ts
  │   ├── newsApi.ts → Supabase queries + mock fallback
  │   └── mockData.ts → Fallback data
  └── middleware.ts → Session refresh

Supabase
  ├── Auth          → Phone OTP via Twilio
  ├── profiles      → User data
  ├── news_items    → Aggregated articles
  ├── ads           → Ad content
  └── breaking_tickers → Ticker messages

Crawler (Python, run separately)
  └── Fetches 7 RSS feeds → upserts to news_items every 30 min
```
