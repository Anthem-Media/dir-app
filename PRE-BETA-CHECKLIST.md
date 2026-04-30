# Pre-Beta Launch Checklist

**Purpose:** A single, living checklist of every loose end that's been deferred during development and MUST be addressed before public beta launch. Every time something gets deferred, it lands here. Before flipping the switch on beta, this list gets walked end-to-end. Nothing ships with open items on this list.

**How to use this:** Check items off as they're completed. Add new items the moment they're deferred — do not rely on memory. Each item includes what it is, why it was deferred, and what "done" looks like.

---

## 1. Name & Domain

### 1.1 Lock the product name
- **Status:** ✅ CLOSED — Final name is "Ripper". Codebase rename to Ripper is scheduled right before Pro code audit #1 (not urgent).
- **Why deferred:** Name change is a high-stakes decision and dirapp.com is in a $3,600 premium tier, which makes the current name costly to commit to
- **Done when:** Final name chosen and committed to across all documentation, UI copy, and marketing plans
- **Dependencies:** Nothing — this is a product decision
- **Blocks:** Domain purchase, custom SMTP, branded email templates, logo design

### 1.2 Buy the domain
- **Status:** ✅ CLOSED — hobbyripper.com purchased through Cloudflare. DNS control confirmed. Cloudflare account registered.
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
- **Status:** ✅ CLOSED — Verification is permanently ON. Custom SMTP via Resend is live, 2/hour rate limit no longer applies. CheckEmailPage is legitimate and staying as-is.
- **Why deferred:** Requires custom SMTP to scale past the default limits, and custom SMTP requires owning a domain
- **Beta decision:** TEMPORARILY turning email verification OFF during development to unblock testing. Revisit when custom SMTP is live.
- ⚠️ Known UX quirk during the off-state: SignUpPage still redirects to /check-email, which tells the user to click a verification link that doesn't exist. User is already signed in at that point. Cosmetic confusion for beta testers only. Resolves automatically when verification flips back on after SMTP is wired, OR decide during email infrastructure phase whether to remove CheckEmailPage entirely.
- **Done when:** Final policy decided (on or off) and enforced in Supabase settings. If ON, custom SMTP must be wired and tested at scale.
- **Dependencies:** Domain purchase (#1.2), Resend setup (#2.2)

### 2.2 Set up custom SMTP via Resend
- **Status:** ✅ CLOSED — Resend live. hobbyripper.com DNS verified (SPF, DKIM). SMTP wired into Supabase. Sender is noreply@hobbyripper.com. Burst test passed (17/17 delivered through Resend under burst conditions).
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
- **Status:** ✅ CLOSED — All 6 templates branded with RIPPER. wordmark, purple accent, split-panel light-mode design. Subject lines branded. iOS dark-mode auto-invert fixed via color-scheme meta tags. Templates authored in Supabase dashboard only.
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
- **Status:** ✅ CLOSED — ForgotPasswordPage and ResetPasswordPage built, wired, branded, tested end-to-end. Supabase redirect URLs configured. vercel.json added to handle client-side route resolution on direct URL loads.
- **Why deferred:** Dedicated auth phase step — not skipped, just hasn't been reached yet in the roadmap
- **Done when:** Full password reset flow built: request page, email with reset link, reset-password page, Supabase wiring, tested end-to-end
- **Dependencies:** Resend setup (#2.2) for reliable email delivery

### 3.5 Post-password-reset UX decision
- **Status:** Flagged during Email Infrastructure phase close
- **Current behavior:** After successful password reset, user is redirected to /signin with a success banner, must sign in with new password manually.
- **Alternative:** Auto-sign-in and redirect to homepage (smoother, less friction). Many modern apps do this (Gmail, GitHub, Linear). Current behavior matches banks/healthcare portals.
- **Decision timing:** Leave current behavior. Revisit after beta users provide feedback. Real user reactions will inform whether to change.
- **Done when:** Either behavior is confirmed as correct by real-world feedback, or code is updated to auto-sign-in on reset.

### 3.4 Harden AuthContext against getSession() rejection
- **Status:** Flagged during final auth audit — defensive improvement, not urgent
- **Why deferred:** Supabase SDK surfaces errors through the { data, error } response rather than throwing, so the promise rejection path is rare. Worth fixing before beta but fine to batch with Pro audit #1.
- **Details:** `supabase.auth.getSession().then()` in AuthContext.jsx has no `.catch()`. If the promise rejects (network failure, SDK exception), `loading` never flips to false and the app hangs silently — ProtectedRoute renders null forever, header auth slot stays blank.
- **Fix:** Add `.catch(() => { setUser(null); setLoading(false); })` to the promise chain in AuthContext.jsx.
- **Done when:** Fix applied and tested (disconnect network before load, confirm app renders signed-out state cleanly).

### 3.6 Stale comment cleanup in SignInPage.jsx
- **Status:** Flagged during password reset audit
- **Details:** SignInPage.jsx lines 11-13 still has a comment: "The 'Forgot password?' link is a placeholder pending the password reset flow (built in a later auth phase step)." This is now false — reset flow is built and wired. Minor cleanup.
- **Done when:** Comment removed or updated. Batch with Pro audit #1.

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

### 4.9 Add `is_featured` to `box_sets` table
- **Status:** Not applied
- **Details:** `BOOLEAN DEFAULT FALSE`. Powers homepage featured box curation — set to `TRUE` for boxes displayed in featured homepage sections. Manually managed in the Supabase table editor during beta. No admin UI needed for this field until a proper admin panel is built.

### 4.10 Add `ev_cards_priced` and `ev_cards_total` to `box_sets` table
- **Status:** Not applied
- **Details:** `ev_cards_priced SMALLINT` and `ev_cards_total SMALLINT`. Written at the same time EV is calculated and cached. Powers the EV coverage display ("X of Y cards priced") on the box profile page. Grails (print_run ≤ 10) are excluded from both counts — same exclusion rule as EV itself.
- **⚠️ Must be applied before full database seeding begins.** These columns get written during EV calculation. If seeding runs before they exist, all EV writes will fail or require retrofitting.
- **Timing:** Database phase, after POC, before full seed. Apply alongside all other schema amendments in section 4.

---

## 5. Data Seeding

### 5.1 End-to-end pipeline test with 2024 Topps Chrome Baseball
- **Status:** Pipeline designed, not yet tested
- **Details:** Run all five steps (source doc, spreadsheet populate, slug-bridge, CSV import, eBay API pricing) against one box set. Confirm EV, ROI, checklist, format switcher, and price charts all work with real data.
- **Done when:** The 2024 Topps Chrome Baseball box set is fully populated in Supabase with real pull rates, real eBay prices, real images — and the box profile page renders correctly.

### 5.2 Full seed — all four launch sports
- **Status:** Blocked on #5.1 passing
- **Details:** Baseball, Football, Basketball, Hockey. 2018-present full profiles. 1995-2017 legacy profiles. No EV/ROI for legacy. Use the five-step seeding pipeline. Soccer seeding handled separately post-beta — see Section 12.

### 5.3 Image sourcing automated
- **Status:** All `image_url` fields currently blank
- **Details:** eBay API integration provides images as a byproduct of price scraping, same pattern Waxstat uses for their 27k+ box library. Distributor product feeds are the primary source, eBay API is the fallback.

---

## 6. eBay Integration

### 6.0 eBay API capability verification
- **Status:** Not started — must be done before pricing pipeline design is locked
- **Why:** We've been making assumptions about eBay API capabilities based on the web UI. Designing pricing logic around unverified assumptions risks rework. Verification session is hands-on, not theoretical.
- **What needs to be confirmed:**
  - Approved access tier and daily call quota
  - Marketplace Insights API access (for sold listings)
  - Whether the graded filter exists at the API level
  - Whether shipping cost is returned as a separate field per sale
  - Whether item specifics (structured product data) include card number when the title doesn't
  - Search syntax for queries combining card numbers and exclusion keywords
  - Rate limit behavior under realistic refresh patterns
- **Done when:** A verification session has been completed, real test calls have been made for at least three specific cards, raw API responses have been examined, and findings have been logged in SCHEMA-AND-DATA.md under OBSERVED.
- **Dependencies:** eBay Developer account approval (already in progress)
- **Blocks:** All decisions in SCHEMA-AND-DATA.md OPEN QUESTIONS pricing data model section.

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

### 7.0 Update Supabase redirect URLs when hobbyripper.com goes live
- **Status:** Pending POC phase
- **Details:** Current Supabase redirect URLs are for dir-app-weld.vercel.app + localhost. When hobbyripper.com is wired to Vercel during POC phase, add https://hobbyripper.com and https://hobbyripper.com/reset-password to Supabase dashboard → Authentication → URL Configuration → Redirect URLs.
- **Done when:** Both hobbyripper.com URLs added and saved in Supabase redirect URL allow-list. Confirmed by testing signup + password reset flow on the final domain.

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

## 10. Account Management Phase

### 10.1 Account management feature set — DEFERRED to dedicated phase
- **Status:** Not started — scoped but deliberately deferred
- **Why deferred:** Most pieces are blocked on systems that don't exist yet (users profile table, Stripe, custom SMTP). Building a partial shell now would require returning multiple times to finish it, each return risking refactor of the last round. Cleaner to do it as one coherent phase after the database phase lands.
- **Scope (what a normal app's account section includes):**
  - Profile basics: view/edit display name, view email, change email, change password, delete account
  - Notification preferences: email opt-in toggle, price alert settings (when alerts exist)
  - Billing: current plan, payment method, update card, invoices, cancel subscription
  - App data: saved boxes, collection, wishlist (separate post-launch features)
- **Dependencies:**
  - Editing display name / email_opt_in → requires users profile table (database phase)
  - Change email + change password → requires custom SMTP (email infrastructure phase)
  - All billing UI → requires Stripe (post-beta)
- **Platform coverage:** Web, mobile web, and native iOS. iOS account page is minimal — view profile + sign out + link to web for billing changes (Apple allows this when not using IAP).
- **Done when:** /account page exists on web with full profile editing, notification settings, and billing management (post-Stripe). iOS app has a minimal account view. Mobile UI polish pass runs concurrently with this phase since header/nav changes when account section is added.

---

## 11. Image Pipeline

### 11.1 Build semi-automated image review tool
- **Status:** Not started
- **Details:** Local Node.js script + lightweight browser UI. For each box set with a blank `image_url`, the tool queries Google Custom Search API or scrapes distributor product pages (Dave & Adam's, Blowout Cards, Steel City) for candidate box images. A browser UI displays candidates one at a time — reviewer clicks to accept, skip, or flag. Accepted images upload directly to Supabase Storage and the URL is written to the `image_url` column on `box_sets`.
- **Done when:** Script runs locally, surfaces image candidates per box set, reviewer can accept and upload in a single click, `image_url` populates in Supabase.
- **When to build:** After the POC phase. Full database seeding depends on this tool for image coverage at scale.

### 11.2 Populate manual images for POC phase
- **Status:** Not started — POC-phase-only one-time effort
- **Details:** ~84 homepage box images (featured sections on the homepage) and the 2024 Topps Chrome Baseball box image for the POC profile page. This is a manual pass for the POC only. After POC, the semi-automated tool (#11.1) handles all future image sourcing — no manual image work at scale.
- **Done when:** Homepage displays real box images. 2024 Topps Chrome Baseball box profile page displays a real box image.
- **Dependencies:** None for the manual pass. #11.1 must exist before moving to full seeding.

---

## 12. Soccer "Coming Soon" treatment

### 12.1 Soccer nav tab routes to Coming Soon page
- **Status:** Not started
- **Details:** Soccer was removed from the beta launch scope. The navigation needs a Soccer tab that does NOT route to a filtered Browse page (that would show zero results and look broken). Instead, it routes to a simple "Coming Soon" page or modal explaining that Soccer ships post-beta.
- **Done when:** Soccer is visible in the nav, clicking it surfaces a Coming Soon experience (page or modal — designer's call), and post-beta soccer rollout is added to the post-launch roadmap.
- **Dependencies:** None.

---

## How this list gets maintained

- **Add to it immediately when anything is deferred.** Do not trust memory.
- **Each item must include:** status, why deferred, what "done" looks like, dependencies.
- **Before beta launch:** walk the entire list. Nothing open ships.
- **If a "done" definition is fuzzy:** tighten it. Ambiguity here creates forgotten bugs later.
- **Review this list monthly** during active development, weekly as beta approaches.
