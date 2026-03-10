# MEMORY.md — Jarvis VPS Long-Term Memory

Last updated: 2026-03-10

---

## ⛔ CRITICAL RULES — NEVER BREAK

### 1. NEVER use `prisma db push --force-reset` on production
**Incident date: 2026-03-10 ~03:43 UTC**
- Ran `npx prisma db push --force-reset` trying to add a new table (UserPoints)
- This **WIPED THE ENTIRE DATABASE** — all users, plans, practices, analyses gone
- 25 users were affected, including 2 paying trial customers
- Recovery: restored users from Supabase Auth (which was unaffected), restored Stripe trial links manually
- **Permanently lost**: Practice history, WritingAnalysis, QuizAttempt, UserOnboarding data
- One trial customer (paulobohm@live.ca) couldn't access Pro content for ~30 min because expiresAt was set to 2025 instead of 2026

**Correct procedure for schema changes:**
1. `pg_dump -U celpip -h localhost celpip > /tmp/backup-$(date +%Y%m%d-%H%M).sql`
2. `npx prisma db push` (WITHOUT --force-reset)
3. If "already in sync" → table already exists, done
4. NEVER use --force-reset in production. EVER.

### 2. Always backup before ANY database operation
`PGPASSWORD=celpip_secure_2024 pg_dump -U celpip -h localhost celpip > /tmp/backup-$(date +%Y%m%d-%H%M).sql`

---

## Project: CELPIP AI Coach
- **URL**: https://celpipaicoach.com
- **Stack**: Next.js (App Router) + Prisma + Supabase + TypeScript
- **Path**: /var/www/CELPIP
- **DB**: PostgreSQL localhost:5432, database `celpip`, user `celpip`, pass `celpip_secure_2024`
- **PM2 process**: `celpip`
- **GitHub**: https://github.com/malaccoy/CELPIP.git

## User: Calaim
- **Email**: camargosx94@gmail.com
- **userId**: 0083ad97-421d-4611-bac3-f096fd0f2b1d (Supabase UUID)
- **Plan**: Pro (permanent, expires 2099)
- **Telegram**: 886662847
- **Timezone**: likely BRT (UTC-3)

## Pre-Generated Libraries (all complete)
- **Listening**: 180 exercises (30×6 parts), ~240 audio files
- **Reading**: 78 exercises (20+20+20+18 across 4 parts)
- **Writing**: 60 prompts (30×2 tasks)
- **Speaking**: 240 prompts (30×8 tasks)
- **Total**: 558 pre-generated exercises/prompts

## Pricing (as of 2026-03-10)
- Weekly: CA$9.99 (`price_1T9H4S4pcwFlRc7XoJdwdogA`)
- Monthly: CA$29.99 (`price_1T9H4e4pcwFlRc7Xz4ynBIEJ`)
- Quarterly: CA$59.99/3mo (`price_1T9H4Y4pcwFlRc7Xr7Jrpc9B`)
- Annual: CA$99/yr (`price_1T6ZRu4pcwFlRc7X3MDVposN`)
- Competitor (celtestpip.com): Weekly $19.99, Monthly $49.99, Quarterly $99.99, Yearly $249.99

## Active Promo
- Launch Week: 50% OFF monthly, code LAUNCH50, runs 2026-03-08 to 2026-03-15

## Users (as of 2026-03-10)
- 25 registered users total
- 2 active trials: paulobohm@live.ca, trader.caio94@gmail.com
- 6 more Stripe customers who started checkout but didn't complete
- 0 paid subscribers yet (all $0.00 total spend)

## Features Implemented
- Mock Exam (Quick ~74min + Full ~176min) — zero AI during exam, single AI eval at end
- Leaderboard/Rankings at /rankings — ActivityLog model, points per question/submission
- AI scoring hardened (strict bands, gibberish=1-3, <30 words=max 4)
- Event banner with countdown timer
- Support page with Telegram notifications
- Referral source tracking on signup
- Blog system with 20+ SEO articles
- Onboarding/assessment disabled

## Lessons Learned
- EventBanner dismiss bug: early `return` in useEffect before `setEvent()` prevented banner from ever showing, even after removing dismiss check
- React setState batching: explicitly clear opposite mode's state
- Safari needs `.m4a` extension for audio
- GPT-4o-mini sometimes ignores speaker labels — need validation/retry
- Long poll calls block the gateway — use background exec
- `next-auth v5` uses `auth()` not `getServerSession()`
