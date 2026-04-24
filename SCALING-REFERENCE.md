# DIR — Infrastructure & Scaling Reference

**Created:** April 8, 2026
**Last Updated:** April 23, 2026
**Purpose:** Reference document for infrastructure and third-party service decisions as DIR grows. Revisit at each major growth milestone AND before integrating any new third-party service.

**How this file is used:**
- Before every scaling decision, check the relevant section here
- Before integrating any new third-party service, add it to the "Third-Party Service Rate Limits & Ceilings" section FIRST
- After the scale audit session (scheduled post-auth-phase), this document gets substantially expanded with per-feature bottleneck analysis
- Items that surface as scaling risks during audit get added to PRE-BETA-CHECKLIST.md as blocking items

---

## Current Stack

- **Frontend hosting:** Vercel (React + Vite app deployed to global CDN)
- **Database:** Supabase (managed PostgreSQL, free tier)
- **Auth:** Supabase Auth (in progress — Sign Up, Sign In, CheckEmailPage wired)
- **Auth emails:** Supabase default SMTP (DEV ONLY — must move to Resend before beta)
- **Payments:** Stripe (planned post-beta — not yet integrated)
- **External data:** eBay API (planned)
- **AI:** Claude API (planned for photo scan + trend summaries)
- **Domain/DNS:** Not yet owned — blocked on name lock

---

## Third-Party Service Rate Limits & Ceilings

**This is the section that didn't exist before and should have. Every service listed here has been evaluated for the scale ceilings that matter. Add any new service to this section BEFORE integrating it — not after.**

### Supabase (Database + Auth)

**Free tier (current):**
- Database storage: 500 MB
- Database egress: 5 GB/month
- Monthly active users (auth): 50,000
- Realtime concurrent connections: 200
- Edge function invocations: 500,000/month
- **CEILING WE HIT FIRST:** Likely database storage once full seeding begins

**Pro tier ($25/mo):**
- Database storage: 8 GB
- Database egress: 250 GB/month
- Monthly active users: 100,000
- Realtime concurrent connections: 500
- Edge function invocations: 2 million/month
- Point-in-time recovery, no pausing

**Team tier ($599/mo):**
- Larger compute, higher connection limits, SOC2 compliance
- Not relevant until we're well past launch

**What happens when limits hit:** Writes fail until upgraded. Reads slow down. No sudden outage — Supabase warns in advance via email and dashboard.

**Upgrade path:** One-click in dashboard, no migration, no downtime.

**Action items:**
- [ ] Upgrade to Pro BEFORE full eBay seeding begins (PRE-BETA-CHECKLIST.md #7.1)
- [ ] Monitor storage usage weekly during seeding phase

---

### Supabase Auth Email Delivery (Default SMTP)

**⚠️ THIS IS A HARD SCALING WALL — EXPERIENCED FIRSTHAND ON APRIL 23, 2026.**

**Free tier (current):**
- Rate limit: **2 emails per hour**
- Purpose per Supabase: development and prototyping only
- Not suitable for production under any circumstances

**What happens when limits hit:** Signup emails silently fail. Users don't receive verification links. Signups appear to "succeed" but users can't sign in. Password reset emails fail. Zero out-of-the-box warning to users or admins.

**Real-world implication:** A burst of 3+ signups in an hour breaks the product. For Cam's network (millions of engagement impressions), the first 2 users get confirmation emails and the next 10,000 hit the wall. No user after user #2 can complete signup in that hour.

**Mandatory migration:** Custom SMTP via Resend BEFORE beta. Tracked in PRE-BETA-CHECKLIST.md #2.2.

**Why this was missed the first time:** Supabase's default email service isn't mentioned as a scale concern during normal setup because the assumption is developers will swap it out before production. Assumption didn't hold. Now documented here so it never happens with another service.

---

### Resend (Custom SMTP Provider — LIVE)

**Free tier:**
- 3,000 emails/month
- 100 emails/day (rolling)
- 1 custom domain
- 7-day log retention

**Pro tier ($20/mo):**
- 50,000 emails/month
- Priority support
- Longer log retention
- Multiple domains

**Scale ($90/mo):**
- 100,000 emails/month

**Rate limits on all tiers:**
- 10 requests per second to the API (well above realistic signup rate)
- No per-hour caps (unlike Supabase default)

**What happens when monthly limit hit:** Sending stops until the next month or upgrade. Alerts arrive well in advance.

**Action items:**
- [x] Resend account created
- [x] hobbyripper.com DNS verified (SPF, DKIM records active in Cloudflare)
- [x] Supabase Auth SMTP config live with Resend credentials
- [x] Burst test passed: 17/17 signups delivered under burst conditions
- [ ] Monitor monthly send volume; upgrade to Pro ($20/mo) when realistic traffic exceeds 2k/month

**Scale readiness for realistic launch:** Free tier handles ~100 signups/day comfortably. Pro tier ($20/mo) handles ~1,500/day. Scale tier handles ~3,300/day. Cam's network can produce a spike beyond this on a single promo day — budget for the Scale tier during launch windows.

---

### Vercel (Frontend Hosting)

**Hobby (free, current):**
- Unlimited static bandwidth for personal projects
- Build execution: 6,000 minutes/month
- Serverless function execution: 100 GB-hours/month
- Commercial use is NOT allowed on Hobby tier

**Pro ($20/user/mo):**
- 1 TB bandwidth/month
- Build execution: 24,000 minutes
- Serverless functions: 1,000 GB-hours
- Team collaboration
- Required for any commercial use

**Action items:**
- [ ] **Upgrade Hobby to Pro BEFORE charging any users.** DIR is commercial once Stripe is live. Using Hobby tier for a commercial product violates Vercel TOS.
- [ ] For launch spike planning: Pro tier's 1 TB bandwidth comfortably handles 10M+ page views at DIR's page weight. Not a realistic launch bottleneck.

**What happens when limits hit:** Soft throttling then hard cutoff. 24-hour lead time typically.

**This is a new checklist item added today** — will copy to PRE-BETA-CHECKLIST.md.

---

### Stripe (Planned — Payments)

**No rate limits that realistically matter for DIR's scale.**
- 100 read operations per second (live mode)
- 100 write operations per second (live mode)
- Can request increases immediately if needed

**Fees (not a scale limit but cost to track):**
- 2.9% + $0.30 per successful charge
- Subscription management included

**Launch-day risk:** None from a rate-limit perspective. Stripe is built for payment bursts.

**Action items:**
- [ ] Not integrated until post-beta — no current action

---

### eBay API (Planned — Card/Box Pricing + Images)

**Rate limits (Browse API — sold listings):**
- 5,000 calls/day on default keyset
- Up to 5 million/day on approved production apps

**Why this matters for DIR:** Full seed of ~2,000 boxes × ~400 cards each = 800,000 cards needing pricing. Even refreshing every card monthly is 27,000 calls/day. Fine on approved production quota, impossible on default 5,000/day.

**Action items (all pre-seeding):**
- [ ] Register for eBay Developer Program
- [ ] Build and submit proof-of-concept (required to request production quota)
- [ ] Apply for production keyset well before full seeding begins
- [ ] Build pricing refresh pipeline to stagger requests — don't burst the quota

**What happens when limits hit:** Requests rejected with clear error code. Pipeline must retry with backoff, not silently drop prices.

**Scale risk:** Underestimating refresh frequency. If a card's price is stale by a week during a hot news cycle (new manager hired, injury, etc.), DIR shows wrong ROI. Balance refresh frequency against rate limit carefully.

---

### Claude API (Planned — Photo Scan + Trend Summaries)

**Rate limits depend on tier and model.** For the models DIR will use, realistic limits are:
- Requests per minute: in the low hundreds at launch tier, scaling to thousands at higher tiers
- Input/output tokens per minute: tier-dependent

**Why this matters for DIR:**
- Photo scan is a per-user action. Potential for bursts if the feature goes viral.
- Trend summaries are batch jobs (one per box) — cache aggressively, regenerate weekly or on meaningful price change.

**Action items (pre-integration):**
- [ ] Before wiring photo scan, verify current Anthropic rate limits for the chosen model
- [ ] Cache trend summaries — do NOT regenerate on every page load
- [ ] Plan the rate-limit response: if photo scan hits the wall, show a friendly "busy, try again in a minute" not a broken-looking error

---

### GitHub (Source Control)

**Not a runtime concern** — only affects development velocity. Free tier is fine indefinitely for DIR's repo size.

---

## Scaling Tiers

### Tier 1: Beta to 10,000 Users
- **Infrastructure:** Vercel Pro + Supabase Pro ($25/mo) + Resend free or Pro
- **Estimated monthly cost:** Under $100
- **What handles the load:** Vercel's CDN serves the frontend automatically at any scale. Supabase Pro handles tens of thousands of users comfortably. Resend covers realistic beta email volume.
- **Team needed:** Just Zach and Cam. 5-10 hours/week of manual data entry.
- **Action items before entering this tier:**
  - [ ] Vercel on Pro (required for commercial use)
  - [ ] Custom SMTP via Resend wired and load-tested
  - [ ] Supabase upgraded to Pro before full seeding
  - [ ] All services in the third-party section above have known ceilings documented

### Tier 2: 10,000 to 100,000 Users
- **Infrastructure:** Same stack, add caching layer, Resend Scale tier
- **Estimated monthly cost:** $200-500
- **What changes:** Database queries start to need optimization. Add caching (so common requests like popular box profiles are served from memory instead of hitting the database every time). Index the most-queried database columns. Resend bumps to Scale tier ($90/mo) for higher email volume. Consider Vercel Pro for the team, not just Zach.
- **Team needed:** Part-time data engineer on Upwork ($15-25/hr, ~10hrs/week) to automate the eBay price scraping pipeline. Possibly a part-time backend contractor for performance optimization.
- **Action items:** Hire data engineer. Implement caching (Redis or Supabase-native). Review and optimize database queries. Scale email tier.

### Tier 3: 100,000 to 1,000,000+ Users
- **Infrastructure:** Likely migrating specific bottlenecks to more powerful solutions
- **Estimated monthly cost:** Scales with revenue — this is a real company at this point
- **What changes:** May need to move from Supabase's managed hosting to a dedicated PostgreSQL cluster (AWS RDS, Google Cloud SQL, or similar). Add a dedicated search engine (Elasticsearch or Algolia) for fast product search. Add a queue system for background jobs like price updates. CDN/frontend hosting (Vercel) still handles itself. Email platform likely scales to a dedicated transactional provider with negotiated rates.
- **Team needed:** Dedicated infrastructure engineer or senior backend developer. This is a real hire, not a contractor.
- **Action items:** Hire infrastructure/backend engineer. Evaluate database hosting migration. Implement dedicated search. Build background job processing.

---

## Launch-Day & Flash-Crowd Scenarios

**Why this section exists:** Cam's distribution network has millions of engagement impressions. A single well-timed post could produce thousands of users in an hour. The system must hold up.

### Scenario A: Cam posts, 500 signups in 1 hour

- **Supabase Auth:** Well within MAU and concurrent connection limits.
- **Emails via Resend:** 500 emails/hour = 12,000/day projected. Under the free tier cap on any given day but over the monthly limit if sustained. Pro tier ($20/mo) handles comfortably.
- **Frontend (Vercel):** No concern.
- **Database:** No concern on Pro tier.
- **Risk:** None on the properly-configured stack.
- **Risk on current stack (April 2026):** CATASTROPHIC — Supabase default SMTP caps at 2/hour, so 498 of 500 users silently fail to receive their verification email. **This is why custom SMTP is the #1 pre-beta blocker.**

### Scenario B: Cam goes viral, 10,000 signups in 24 hours

- **Supabase Auth:** Within MAU limits on Pro. Concurrent connection spike manageable.
- **Emails via Resend:** 10,000 in a day = over Pro tier's monthly limit in a single day. Need Scale tier ($90/mo) or burst to higher tier temporarily.
- **Frontend (Vercel):** Pro tier bandwidth easily handles 10k users × 20 page views each = 200k page views. Not a concern.
- **Database:** Queries start to stress Pro tier. Caching needed BEFORE this scale — if DIR goes viral before caching is implemented, box profile page loads will slow noticeably.
- **Risk:** Database query performance. Implement caching in Tier 1 preparation, not after hitting Tier 2.

### Scenario C: Sustained 1,000 daily active users

- Entirely within Tier 1 stack capabilities across all services.
- Monthly cost under $100.
- No special action required.

---

## What the Pros Use (StockX-Scale Reference)

Companies at massive scale typically use a combination of:
- **CDN for frontend:** Cloudflare, Vercel, or AWS CloudFront
- **Managed database cluster:** AWS RDS, Google Cloud SQL, or self-managed PostgreSQL
- **Caching layer:** Redis (sits between the app and database, serves common requests from memory)
- **Search engine:** Elasticsearch or Algolia for fast product search
- **Queue system:** For background jobs like price updates
- **Dedicated transactional email:** Postmark, Customer.io, or enterprise SendGrid
- **Infrastructure budget:** Six to seven figures annually with dedicated engineering teams

---

## Pre-Integration Checklist for NEW Third-Party Services

Before adding any new third-party service to the stack, answer these questions and add the service to the "Third-Party Service Rate Limits & Ceilings" section above:

1. What does the free tier limit? (Rate limits, monthly volume, storage, users, whatever applies.)
2. What's the first paid tier, and what does it unlock?
3. What happens silently when a limit is hit? (Hard errors, degraded service, throttling, silent drops?)
4. What's the upgrade path? (One-click in dashboard, migration required, rebuild required?)
5. What's the realistic launch-day exposure to this service's limits? (If Cam posts tomorrow, where does this service break?)
6. Is there a rate limit below what a flash crowd could produce? (If yes, that's a pre-beta blocker.)

**Rule:** If any answer is "I don't know" or "it's probably fine," the integration doesn't ship. Either find the answer or don't use the service.

---

## Key Principles

1. **Don't overbuild.** Every one of those big companies started on simple infrastructure and migrated as they grew. Build for the current stage, not for a million users on day one.

2. **The architecture is right.** React frontend + PostgreSQL database + clean API layer is the same foundation that scales to millions. Nothing needs to be rebuilt — just moved to more powerful hosting as needed.

3. **Clean code scales better than expensive infrastructure.** A well-organized codebase with proper database indexing on affordable hosting outperforms messy code on enterprise hardware. This is why we enforce codebase rules from day one.

4. **Revenue funds scaling.** The first real infrastructure hire happens around 100,000 users. By then, revenue justifies the cost.

5. **Identify bottlenecks, don't guess.** When performance issues appear, diagnose the specific bottleneck (slow queries, database connections, search speed) and solve that — don't overhaul everything.

6. **PostgreSQL is the constant.** Supabase runs PostgreSQL. AWS RDS runs PostgreSQL. Migrating between hosts means moving where the database lives, not rebuilding the database itself.

7. **NEW: Third-party service rate limits are scale concerns, not features.** Every external service has a ceiling. Document it here before integrating. Test against it before shipping. "It works in development" is not the same as "it works at launch."

8. **NEW: Every feature gets a scale-stress walkthrough.** As part of every feature audit, ask: what breaks at 100, 10k, 100k concurrent users? If the answer is unclear, find out before shipping.

---

## Scheduled: Full Scale Audit Session (post-auth-phase)

After the auth phase closes out (auth context, protected routes, sign out all complete), a dedicated scale audit session will walk every feature and every database table to identify bottlenecks at the 100/1k/10k/100k user ceilings. Findings will flow into:

- This document — per-feature bottleneck analysis, expanded third-party service entries
- PRE-BETA-CHECKLIST.md — any high-risk items that surface as blocking for beta launch

Topics to cover:
- Signup flow under load (rate-limit tested, queue behavior)
- Signin flow under load
- Box profile page load speed at scale (with real data)
- Browse page filter cascading at scale
- Search queries across the full card catalog
- eBay API refresh cadence vs. freshness tradeoff
- Database query performance on the hot tables (box_sets, cards, price_history)
- Cache invalidation strategy
- Burst scenarios (Cam's network posts)
- Failure modes (what happens if Supabase goes down, if Resend goes down, if eBay API rate-limits us)

---

## Migration Path Summary

```
Supabase Free (dev/test — current)
  → Supabase Pro (dedicated, more headroom — before full seeding)
    → AWS RDS or Google Cloud SQL (enterprise-grade PostgreSQL — post-launch, 100k+ users)
      → Self-managed cluster with dedicated engineering team (real company scale)
```

```
Resend free tier (CURRENT — live, tested)
  → Resend Pro ($20/mo — early post-launch, when volume exceeds 2k/month)
    → Resend Scale ($90/mo — growth phase)
      → Dedicated transactional provider with negotiated rates (scale phase)
```

```
Vercel Hobby (dev/test — current)
  → Vercel Pro ($20/user/mo — before any commercial use / beta)
    → Vercel Enterprise (growth phase)
```

Each step is incremental. No rebuild required at any stage.
