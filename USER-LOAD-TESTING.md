# Ripper — User Load Testing Playbook

**Created:** May 6, 2026
**Last Updated:** May 6, 2026
**Purpose:** Operational playbook for simulating user load against Ripper before public beta. Defines what to test, how to test it, what to measure, and how to interpret results. This is the *how* of load testing — the *when* and *why* live in SCALING-REFERENCE.md.

**Companion documents:**
- **SCALING-REFERENCE.md** — source of truth for infrastructure tier ceilings, third-party rate limits, launch-day scenarios, and the migration path. This file does not restate any of that content.
- **EBAY-STRATEGY.md** — eBay refresh pipeline testing (pipeline-driven, not user-driven) lives there. Out of scope here.
- **PRE-BETA-CHECKLIST.md** — any blocking items surfaced during load testing get logged there as pre-beta blockers.

**How this file is used:**
- Read top to bottom before the Full Scale Audit Session (scheduled post-auth-phase per SCALING-REFERENCE.md)
- Use as the operational checklist for that session
- Update with new findings — per-bottleneck patterns observed in real testing should be added to the "Bottleneck Patterns" section over time
- Re-run the methodology after every major architecture change (caching layer added, hot path refactored, new heavy feature shipped)

---

## Glossary (Read This First)

A few terms used throughout this doc, since Zach has no dev background and Cam may read this too:

- **Concurrent users** — number of users hitting the app at the same instant, not over a day. 100 concurrent users is far heavier than 10,000 daily users spread across 24 hours.
- **p95 latency** — the response time that 95% of requests are faster than. Better than "average" because it catches the slow tail that average response time hides.
- **Connection pool** — Supabase reuses database connections instead of opening a new one per request. Pool exhaustion = no free connections, requests start timing out.
- **Cold start** — when Vercel spins up a brand-new serverless function instance, the first request takes longer because the function has to load. Normal under burst traffic.
- **Egress** — data leaving the database. Supabase tier limits cap monthly egress, so big payloads chew through it fast.
- **Cache hit rate** — percentage of requests served from cache instead of recomputing. Higher is better. Caching is what gets Ripper past the Tier 2 wall (see SCALING-REFERENCE.md).

---

## Why Load Testing Happens Before Launch

Bugs at scale don't all surface at the same user count. Some show up at 100 concurrent users, some at 10,000, some only when a specific query gets enough rows to stop using its index. Real users surface them at the worst possible moment — when Cam posts and a thousand people hit the app inside an hour.

Load testing surfaces them on a Tuesday afternoon when there's time to fix.

The goal is to find Ripper's ceiling, fix the bottleneck, raise the ceiling, and repeat — until the headroom comfortably exceeds anything Cam's distribution network can throw at us on launch day.

---

## When to Run These Tests

- **Primary execution:** as the operational core of the Full Scale Audit Session scheduled in SCALING-REFERENCE.md ("post-auth-phase, before beta")
- **After every major architecture change:** caching layer added, hot path refactored, new heavy feature shipped
- **Twice during the audit:** once *before* caching is implemented (find raw bottlenecks), once *after* (confirm caching actually moved the ceiling)
- **Not during regular development:** load testing is expensive in time and attention. Don't run it casually.

---

## Critical User Paths to Test

Listed in priority order — most likely to break first / highest user impact at the top. These are Ripper-specific paths, not generic web app paths.

1. **Box profile page load** — biggest payload in the app. Top chases + pull rates + price trend chart + full checklist (can be 400+ cards on a Topps Chrome flagship). Highest risk for slow SQL, large response payloads, and Vercel function response-size limits.
2. **Browse page filter cascading** — Sport → Manufacturer → Year → Format. Multiple sequential queries on the `box_sets` table. Filter combinations multiply quickly.
3. **Home page load** — first thing every visitor hits. Has to be fast cold-cache.
4. **Sign up flow** — Supabase Auth + Resend email + database write. Three external services touched in one user action.
5. **Sign in flow** — auth lookup + redirect. Less heavy than signup but hit far more often.
6. **Search across the card catalog** — full-text search across what will eventually be hundreds of thousands of card rows.

**Skipped during beta load testing:**
- Stripe payment paths — not integrated yet. Add when payments go live.
- eBay refresh pipeline — not user-driven. See EBAY-STRATEGY.md.

---

## Staged Ramp Methodology

Run every test through the same ramp:

- 1 user (baseline — establish a clean "fast" number)
- 10 users
- 25 users
- 50 users
- 100 users
- 250 users
- Then keep increasing until something breaks

The break point is the deliverable, not a failure. The goal is to find Ripper's ceiling before users do. Once a bottleneck is identified, fix it, then rerun the same ramp to confirm the ceiling moved up.

If a path holds clean through 250 concurrent users, that's enough confidence for beta. Cam's biggest projected launch-day spike (per SCALING-REFERENCE.md Scenario A) is 500 signups in an hour — well below 250 *concurrent*.

---

## What to Measure

Per ramp stage, capture:

- **p95 response time** for the page or API call under test
- **Error rate** — anything non-2xx counts
- **Supabase query time** on the hot tables (`box_sets`, `cards`, eventually `price_history`)
- **Active database connections** during the spike
- **Cache hit rate** — once caching is implemented
- **Vercel function cold-start frequency** — expected to spike early, should level off
- **Memory usage on serverless functions** — close to ceiling = risk

If a metric jumps sharply between two stages, the lower of the two stages is the ceiling. Investigate before raising the ramp.

---

## Tools

For Ripper's stack and team size, the recommended toolchain is small on purpose:

- **k6** — primary load testing tool. Lightweight, JavaScript-style scripts, runs from a laptop or CI job. This is what Supabase uses for its own published benchmarks, so the patterns translate directly.
- **Supabase dashboard** — query monitoring, slow query log, connection count. Always open during a test.
- **Vercel observability** — function logs, traces, cold-start counts. Always open during a test.

Other tools considered and parked: Artillery (simpler YAML, less flexible), Locust (Python — fine if a contractor prefers it), JMeter (heavy, mature, overkill for current scale), Gatling (high-performance but advanced setup).

**Default to k6 unless a contractor brings strong experience with another tool.** Don't pick a tool because it sounds powerful — pick the one with the lowest setup overhead so the testing actually happens.

---

## Test Environment

Run all load tests against:

- A **Vercel preview deployment** (not production)
- Connected to a **dedicated Supabase staging project** (not the production project)

Why this matters: production load testing risks exposing real users to artificial slowdowns, inflates Supabase metrics that drive billing decisions, and pollutes the analytics that signal real traffic patterns. The staging project is a separate Supabase project under the same org. Free tier is fine for staging.

The staging environment should be seeded with a realistic data volume — at minimum the full beta box catalog so query plans behave like production. Empty databases lie about query performance.

---

## Auth Load Testing Without Burning Resend Volume

Signup load tests can blow through Resend's monthly cap in a single test run. Two ways to avoid this:

1. **Use Supabase's auth admin API to bulk-create test users.** This bypasses email send entirely. Pre-create N test users before the load test, then have the test script log them in. This isolates database-side auth behavior from SMTP behavior.
2. **Use a disposable email domain configured to drop messages.** Register a domain that doesn't deliver, or use a staging email service.

**Option 1 is the recommended approach for Ripper.** It tests the database side of auth without touching the email side. Resend deliverability under load is a separate concern (the 2/hour wall was already solved in PRE-BETA-CHECKLIST.md #2.1) and doesn't need re-testing as part of user load testing.

If signup-flow-with-email needs to be specifically tested, do it as a small isolated run (10–25 users), not as part of the main ramp.

---

## Bottleneck Patterns and How to Read Them

This is the most useful section to grow over time. Each pattern below pairs a symptom with the most common cause, so the test results have a starting interpretation instead of a guessing game.

- **Response time climbs roughly linearly with user count** → usually slow SQL or a missing index. Check Supabase slow query log first.
- **Response time stays flat then spikes hard at a specific user count** → usually connection pool exhaustion. Check active connections in Supabase dashboard at the spike point.
- **Error rate jumps with no latency change** → usually a serverless function timeout or memory ceiling. Check Vercel function logs for the failing requests.
- **Latency fine, but Supabase egress climbs disproportionately fast** → payload too large. The box profile page checklist response is the prime suspect — paginate, trim fields, or split into multiple endpoints.
- **Cold-start spikes appear early then disappear as the ramp continues** → Vercel scaling up new function instances. Not a bug; expected behavior under burst load. Worth noting but not fixing.
- **Cache hit rate drops as user count grows** → cache key collisions or insufficient cache size. Worth a refactor session, not a quick fix.

---

## Mitigation Patterns

Operational responses, not architecture changes. Architecture-level decisions (tier upgrades, caching commitments, migration paths) live in SCALING-REFERENCE.md.

- **Slow query** → add an index on the column being filtered, sorted, or joined on. Don't index everything — every index slows writes and uses storage.
- **Connection pool exhaustion** → use Supabase's connection pooler. Already available; just needs to be configured in the client.
- **Repeated expensive analytics** → cache. See SCALING-REFERENCE.md Tier 2 for the caching commitment timeline.
- **Large payloads** → paginate, trim returned fields, or split one endpoint into two.
- **Serverless burst hitting limits** → tier upgrade. See SCALING-REFERENCE.md Vercel section.

---

## Done Criteria for the Pre-Beta Audit

The Full Scale Audit Session is complete when all of the following are checked:

- [ ] All six critical user paths tested through the staged ramp
- [ ] Each path's bottleneck identified, and either fixed or logged in PRE-BETA-CHECKLIST.md as a known limit or blocker
- [ ] Caching implemented for the box profile page (highest-payload, highest-frequency path)
- [ ] All paths re-tested *after* caching to confirm the ceiling moved up
- [ ] Findings documented in SCALING-REFERENCE.md per-feature bottleneck section (currently scheduled to be expanded as part of the same audit session)
- [ ] Any high-risk items added to PRE-BETA-CHECKLIST.md as blocking
- [ ] Staging environment shut down or paused if unused, to avoid accidental Supabase tier inflation

---

## Reminder for Future Zach

**Sample k6 scripts are intentionally not included in this doc.** Scripts go stale fast — they reference page paths, query parameters, auth tokens, and component structures that change as the app evolves. A script written today against the current codebase would be partially wrong by the time the audit session runs.

When the Full Scale Audit Session is ready to run:
1. Open this doc and re-read the methodology.
2. Ask Claude Code to generate the k6 scripts against the live codebase at that moment, one critical path at a time.
3. Have Claude Code wire them into a runner script that ramps through the stages defined in "Staged Ramp Methodology" above.

Fresh scripts beat stale scripts every time.

---

## Open Items (Setup Before Audit Session)

- [ ] Create a dedicated Supabase staging project — separate from production
- [ ] Wire a Vercel preview deployment to point at the staging Supabase project
- [ ] Seed staging with a realistic data volume (at minimum the full beta box catalog)
- [ ] Confirm Vercel preview deployment behavior matches production behavior closely enough for load testing to be meaningful (cold-start behavior in particular can differ between Hobby preview and Pro production)
- [ ] Pre-create the test user pool via Supabase auth admin API before running signup-adjacent tests
- [ ] Decide whether to run k6 from a laptop or from a CI job (laptop is fine for Tier 1; CI becomes useful when tests need to run on every deploy)
