# DIR — Infrastructure & Scaling Reference

**Created:** April 8, 2026
**Purpose:** Reference document for infrastructure decisions as DIR grows. Revisit at each major growth milestone.

---

## Current Stack

- **Frontend hosting:** Vercel (React + Vite app deployed to global CDN)
- **Database:** Supabase (managed PostgreSQL)
- **Auth:** Supabase Auth (planned)
- **Domain/DNS:** TBD

---

## Scaling Tiers

### Tier 1: Beta to 10,000 Users
- **Infrastructure:** Vercel free/Pro + Supabase Pro ($25/mo)
- **Estimated monthly cost:** Under $50
- **What handles the load:** Vercel's CDN serves the frontend automatically at any scale. Supabase Pro provides a dedicated PostgreSQL database that handles tens of thousands of users comfortably.
- **Team needed:** Just Zach and Cam. 5-10 hours/week of manual data entry.
- **Action items:** None. Current architecture handles this without changes.

### Tier 2: 10,000 to 100,000 Users
- **Infrastructure:** Same stack, add caching layer
- **Estimated monthly cost:** $200-500
- **What changes:** Database queries start to need optimization. Add caching (so common requests like popular box profiles are served from memory instead of hitting the database every time). Index the most-queried database columns. May need to optimize slow queries.
- **Team needed:** Part-time data engineer on Upwork ($15-25/hr, ~10hrs/week) to automate the eBay price scraping pipeline. Possibly a part-time backend contractor for performance optimization.
- **Action items:** Hire data engineer. Implement caching. Review and optimize database queries.

### Tier 3: 100,000 to 1,000,000+ Users
- **Infrastructure:** Likely migrating specific bottlenecks to more powerful solutions
- **Estimated monthly cost:** Scales with revenue — this is a real company at this point
- **What changes:** May need to move from Supabase's managed hosting to a dedicated PostgreSQL cluster (AWS RDS, Google Cloud SQL, or similar). Add a dedicated search engine (Elasticsearch or Algolia) for fast product search. Add a queue system for background jobs like price updates. CDN/frontend hosting (Vercel) still handles itself.
- **Team needed:** Dedicated infrastructure engineer or senior backend developer. This is a real hire, not a contractor.
- **Action items:** Hire infrastructure/backend engineer. Evaluate database hosting migration. Implement dedicated search. Build background job processing.

---

## What the Pros Use (StockX-Scale Reference)

Companies at massive scale typically use a combination of:
- **CDN for frontend:** Cloudflare, Vercel, or AWS CloudFront
- **Managed database cluster:** AWS RDS, Google Cloud SQL, or self-managed PostgreSQL
- **Caching layer:** Redis (sits between the app and database, serves common requests from memory)
- **Search engine:** Elasticsearch or Algolia for fast product search
- **Queue system:** For background jobs like price updates
- **Infrastructure budget:** Six to seven figures annually with dedicated engineering teams

---

## Key Principles

1. **Don't overbuild.** Every one of those big companies started on simple infrastructure and migrated as they grew. Build for the current stage, not for a million users on day one.

2. **The architecture is right.** React frontend + PostgreSQL database + clean API layer is the same foundation that scales to millions. Nothing needs to be rebuilt — just moved to more powerful hosting as needed.

3. **Clean code scales better than expensive infrastructure.** A well-organized codebase with proper database indexing on affordable hosting outperforms messy code on enterprise hardware. This is why we enforce codebase rules from day one.

4. **Revenue funds scaling.** The first real infrastructure hire happens around 100,000 users. By then, revenue justifies the cost.

5. **Identify bottlenecks, don't guess.** When performance issues appear, diagnose the specific bottleneck (slow queries, database connections, search speed) and solve that — don't overhaul everything.

6. **PostgreSQL is the constant.** Supabase runs PostgreSQL. AWS RDS runs PostgreSQL. Migrating between hosts means moving where the database lives, not rebuilding the database itself.

---

## Migration Path Summary

```
Supabase (managed, affordable)
  → Supabase Pro (dedicated, more headroom)
    → AWS RDS or Google Cloud SQL (enterprise-grade PostgreSQL)
      → Self-managed cluster with dedicated engineering team
```

Each step is incremental. No rebuild required at any stage.
