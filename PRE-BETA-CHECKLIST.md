# Pre-Beta Launch Checklist

**Purpose:** A single, living checklist of every loose end that's been deferred during development and MUST be addressed before public beta launch. Every time something gets deferred, it lands here. Before flipping the switch on beta, this list gets walked end-to-end. Nothing ships with open items on this list.

**How to use this:** Check items off as they're completed. Add new items the moment they're deferred — do not rely on memory. Each item includes what it is, why it was deferred, and what "done" looks like.

---

## 1. Name & Domain

### 1.1 Lock the product name
- **Status:** Open — "DIR" is the working name, not locked
- **Why deferred:** Name change is a high-stakes decision and dirapp.com is in a $3,600 premium tier, which makes the current name costly to commit to
- **Done when:** Final name chosen and committed to across all documentation, UI copy, and marketing plans
- **Dependencies:** Nothing — this is a product decision
- **Blocks:** Domain purchase, custom SMTP, branded email templates, logo design

### 1.2 Buy the domain
- **Status:** Not owned
- **Why deferred:** Waiting on final name decision
- **Done when:** Domain purchased, DNS control confirmed, registered to an account both partners can access
- **Dependencies:** Name lock (#1.1)
- **Blocks:** Custom SMTP setup, production URL for marketing, branded auth emails

### 1.3 Update all references to the final name
- **Status:** "DIR" scattered through docs, CLAUDE.md, project-brief.md, CONTEXT.md, Vercel project name, Supabase project name, UI copy, page titles, wordmark components
- **Why deferred:** Waiting on name lock
- **Done when:** Find-and-replace completed across codebase and docs, visual wordmarks updated, Vercel/Supabase project names renamed (or confirmed acceptable to keep as internal identifiers)
- **Dependencies:** Name lock (#1.1)

---

## 2. Email Infrastructure

### 2.1 Decide on email verification policy
- **Status:** Currently ON but untenable on Supabase's default email service (2/hour rate limit hit during testing)
- **Why deferred:** Requires custom SMTP to scale past the default limits, and custom SMTP requires owning a domain
- **Beta decision:** TEMPORARILY turning email verification OFF during development to unblock testing. Revisit when custom SMTP is live.
- **Done when:** Final policy decided (on or off) and enforced in Supabase settings. If ON, custom SMTP must be wired and tested at scale.
- **Dependencies:** Domain purchase (#1.2), Resend setup (#2.2)

### 2.2 Set up custom SMTP via Resend
- **Status:** Not configured — Supabase is using its built-in email service (limited to 2 emails/hour on free tier, a dev-only service)
- **Why deferred:** Requires owning a domain and was originally scheduled for pre-launch polish
- **Critical context:** This is NOT optional polish. Supabase's default SMTP is 2 emails/hour. A flash crowd during Cam's network launch (10k+ impressions/hour potential) would hit this wall immediately and block signups. Every beta tester after the first two in any given hour would fail to receive their verification/reset email. This is a scaling ceiling, not a cosmetic issue.
- **Done when:**
  - Resend account created
  - Domain verified via DNS (SPF, DKIM records)
  - Supabase Auth configured to use Resend SMTP credentials
  - Test signup flow confirms emails land from the custom sender address
  - Load test: simulate burst of 20+ signups in one minute and confirm all receive emails without rate-limit errors
- **Dependencies:** Domain purchase (#1.2)
- **Scale note:** Resend's free tier is 3,000 emails/month with per-second rate limits in the thousands. Paid tier scales to 100,000+/month. Covers all realistic beta and early launch traffic.

### 2.3 Customize Supabase auth email templates
- **Status:** Using Supabase's default generic template (plain styling, `noreply@supabase.co` sender)
- **Why deferred:** Branding doesn't matter for internal testing and requires final name/domain
- **Done when:** All six auth email templates customized in Supabase dashboard with final branding, logo, copy in the product voice:
  - Confirm signup
  - Magic link
  - Password reset (change/invite)
  - Email change confirmation
  - Reauthentication
  - Invite user
- **Dependencies:** Name lock (#1.1), Resend setup (#2.2)

---

## 3. Auth Flow Polish

### 3.1 Google OAuth
- **Status:** Placeholder buttons exist on Sign In and Sign Up pages; not wired
- **Why deferred:** Requires Google Cloud OAuth project setup and wasn't critical for beta-model email/password flow
- **Decision required:** Include Google sign-in at all, or remove the placeholder buttons
- **Done when:** Either (a) Google Cloud project created, OAuth credentials configured in Supabase, buttons wired and tested on all three auth pages; or (b) placeholder buttons removed from SignInPage.jsx and SignUpPage.jsx
- **Dependencies:** None

### 3.2 Post-login redirect improvement
- **Status:** Both Sign In and Sign Up currently redirect to `/` (homepage) on success; Sign Up redirects to `/check-email`
- **Why deferred:** Simpler is better for beta; fancier redirect logic requires the protected-routes system to be fully built first
- **Done when:** After a user is redirected to `/signin` from a protected page, signing in sends them back to the original page rather than the homepage. Implemented via route state or a stored "return to" URL.
- **Dependencies:** Protected routes must be built first

### 3.3 Password reset flow
- **Status:** "Forgot password?" link on Sign In page is a dead link; no reset page exists
- **Why deferred:** Dedicated auth phase step — not skipped, just hasn't been reached yet in the roadmap
- **Done when:** Full password reset flow built: request page, email with reset link, reset-password page, Supabase wiring, tested end-to-end
- **Dependencies:** Resend setup (#2.2) for reliable email delivery

---

## 4. Database Schema Amendments

These amendments were decided on during UI development but deferred until the database phase. All should be applied before beta.

### 4.1 Add `circulation_status` to `cards` table
- **Status:** Documented in CLAUDE.md and CONTEXT.md; not applied
- **Details:** `VARCHAR(20) DEFAULT 'unknown'`, values: `unknown`, `in_circulation`, `pulled_sold`. Powers the Grails tab circulation badge. Only meaningful for cards with `print_run` ≤ 10.

### 4.2 Add `parent_set_id` to `box_sets` table
- **Status:** Documented; not applied
- **Details:** `INT REFERENCES box_sets(id) NULL`. Groups all formats of the same set together. Powers the format switcher.

### 4.3 Add `distributors` table
- **Status:** Documented; not applied
- **Details:** For the Buy Now affiliate system. Columns: distributor name, website, logo, affiliate URL pattern.

### 4.4 Add `distributor_listings` table
- **Status:** Documented; not applied
- **Details:** Which distributor has which box, at what price, with what affiliate link.

### 4.5 Add `email_opt_in` to `users` table
- **Status:** Currently stored in Supabase's `auth.users.raw_user_meta_data`
- **Details:** `BOOLEAN DEFAULT FALSE`. Captured from signup form. Moves to users profile table when it's created.

### 4.6 Remove `password_hash` from `users` table
- **Status:** Still in schema file
- **Details:** Supabase Auth manages passwords in its own `auth.users` table. Our `users` table becomes a profile table linked to Supabase auth users by ID.

### 4.7 Flip tier numbering in schema and `checklistUtils.js`
- **Status:** Currently inverted (Tier 1 = Base, Tier 5 = Premium Hits). `sortTiersByValue` sorts descending as a workaround.
- **Details:** Flip schema so Tier 1 = Premium Hits, Tier 5 = Base/Rookies. Update `sortTiersByValue` to sort ascending.

### 4.8 Update `plan` column on `users` to accept `'beta'`
- **Status:** Schema currently accepts `'free'` and `'paid'`; needs `'beta'` added
- **Details:** Required by the locked beta access model. Paywall check is `plan IN ('beta', 'paid')`.

---

## 5. Data Seeding

### 5.1 End-to-end pipeline test with 2024 Topps Chrome Baseball
- **Status:** Pipeline designed, not yet tested
- **Details:** Run all five steps (source doc, spreadsheet populate, slug-bridge, CSV import, eBay API pricing) against one box set. Confirm EV, ROI, checklist, format switcher, and price charts all work with real data.
- **Done when:** The 2024 Topps Chrome Baseball box set is fully populated in Supabase with real pull rates, real eBay prices, real images — and the box profile page renders correctly.

### 5.2 Full seed — all five sports
- **Status:** Blocked on #5.1 passing
- **Details:** Baseball, Football, Basketball, Hockey, Soccer. 2018-present full profiles. 1995-2017 legacy profiles. No EV/ROI for legacy. Use the five-step seeding pipeline.

### 5.3 Image sourcing automated
- **Status:** All `image_url` fields currently blank
- **Details:** eBay API integration provides images as a byproduct of price scraping, same pattern Waxstat uses for their 27k+ box library. Distributor product feeds are the primary source, eBay API is the fallback.

---

## 6. eBay Integration

### 6.1 eBay API proof of concept script
- **Status:** Not started
- **Details:** Small targeted test — script takes a card name, hits eBay sold listings endpoint, returns last 10 sales with average price. Validates the API works before building the full pipeline.

### 6.2 eBay Partner Network signup
- **Status:** Not applied — waiting on real data to be live
- **Details:** Free to join, 1-4% commission (collectibles 3-4%), 24-hour cookie, $550 USD cap per qualifying purchase. Do not apply with dummy data — risks rejection.
- **Done when:** Accepted into EPN, affiliate link pattern configured in the `distributors` table as the eBay fallback.

### 6.3 Full eBay API pipeline
- **Status:** Not started, blocked on #6.1
- **Details:** Automated card pricing, box pricing, image scraping, and scheduled refresh. Powers the entire data layer.

---

## 7. Infrastructure Scaling

### 7.1 Supabase Pro upgrade
- **Status:** On free tier (500MB storage)
- **Why deferred:** Free tier is fine for current usage; upgrade is planned for when full seeding begins
- **Done when:** Upgraded to Pro ($25/mo, 8GB storage) in the Supabase dashboard. One-click change, no migration, no downtime.
- **Trigger:** When card/price_history data approaches 400MB, or before full seed begins

### 7.2 Scaling audit — full session
- **Status:** Discussed but not scheduled
- **Why deferred:** Wants to happen after auth phase closes
- **Done when:** Complete scale audit session conducted. Every feature, every third-party service, every database table evaluated at 100/1,000/10,000/100,000 concurrent user ceilings. Findings documented in SCALING-REFERENCE.md. Specific risk items added to this checklist.

---

## 8. Pre-Launch Quality Gates

### 8.1 Pro code audit #1 (senior React dev — auth foundation)
- **Status:** Scheduled in roadmap
- **Details:** ~3-5 hours at $50-150/hr = $150-750. Reviews frontend structure, auth wiring, protected routes, general code quality before database phase begins.

### 8.2 Pro code audit #2 (full-stack dev — complete app)
- **Status:** Scheduled in roadmap
- **Details:** ~8-15 hours at $50-150/hr = $400-2,250. Reviews complete app (frontend, backend, database, API integrations) before beta launch.

### 8.3 Pro code audit #3 (specialist — performance/security)
- **Status:** Scheduled in roadmap
- **Details:** ~5-10 hours at $75-200/hr = $375-2,000. Reviews whatever breaks under real-world load during beta.

### 8.4 Total audit budget
- **Status:** $5k max across all three audits
- **Details:** Tracked against the $5k cap. If audit #1 comes in low, budget flex is available for #2 and #3.

---

## 9. Partnership & Legal

### 9.1 Sign the partnership agreement
- **Status:** Drafted, ready for signatures
- **Why deferred:** Both partners aligned on terms, signatures just haven't been coordinated
- **Done when:** Both signatures, both dates, stored in a shared location

### 9.2 LLC formation
- **Status:** Deferred until demand is validated
- **Why deferred:** No revenue yet, no assets to protect, not worth the paperwork
- **Trigger:** Revenue flowing or investors interested

---

## How this list gets maintained

- **Add to it immediately when anything is deferred.** Do not trust memory.
- **Each item must include:** status, why deferred, what "done" looks like, dependencies.
- **Before beta launch:** walk the entire list. Nothing open ships.
- **If a "done" definition is fuzzy:** tighten it. Ambiguity here creates forgotten bugs later.
- **Review this list monthly** during active development, weekly as beta approaches.
