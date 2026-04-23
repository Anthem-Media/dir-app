# Context

## Current State
Auth phase in progress (roadmap item #7). Sign Up and Sign In flows wired to Supabase Auth and tested locally. Post-signup CheckEmailPage built with resend flow. Several blockers surfaced this session that are deferred to the PRE-BETA-CHECKLIST.md (email rate limits, name/domain, color variable naming cleanup). Auth context (Step 8) is next, but blocked on unblocking email testing first.

## What's Been Decided and Locked
- **Scope:** Baseball, Football, Basketball, Hockey, Soccer at launch. All sports need full database population for beta — not just baseball. No TCG categories.
- **Data coverage:** Full profiles (checklist, pull rates, EV, ROI, card pricing) for boxes 2018-present. Legacy boxes (1995-2017) get box profiles without EV/ROI but keep checklist, card pricing, top chases, and pull rates where available.
- **Card-level pricing required:** Every card in a checklist needs a current market value. This is what makes EV and ROI calculations work. Not just top chases — the full checklist priced out.
- **EV and ROI confirmed:** Stays in the product. This is the core differentiator vs. Waxstat and everyone else.
- **Core value prop:** "When I buy a box, what cards can I get, how much are they worth, and what's the best box for my budget and goals?"
- **Tagline:** "Think inside the box."
- **Product name — NOT YET LOCKED:** Working name is DIR (Diamond in the Rough). Name may change before beta. dirapp.com is in a $3,600 premium tier. Name lock deferred — development continues name-agnostic. See PRE-BETA-CHECKLIST.md item #1.
- **Revenue model — LOCKED:** Fully paid box profiles. Free browsing experience (homepage, browse page, search, filtering, scrolling through box sets) on web only. Paywall triggers when user clicks into a box profile page. Conversion funnel: visit site → scroll and look up boxes → click on box profile → hit paywall → pay for deeper analysis.
- **Beta access model — LOCKED:** Auth is required from day one. All beta signups get `plan = 'beta'` with full premium access to every feature (box profiles, EV, ROI, pull rates, charts). No Stripe or payment processing during beta. Paywall logic on box profile pages accepts any user with `plan` of `'beta'` OR `'paid'`. When beta ends, new signups default to `'free'` (no box profile access) and must upgrade to `'paid'` via Stripe. Existing beta users will be migrated or grandfathered — decision deferred until end of beta. Email opt-in checkbox captures beta tester emails from day one. iOS app works during beta because it's auth-only by design — every beta signup becomes a valid iOS user.
- **Email verification — TEMPORARILY OFF:** Supabase's default email service is rate-limited to 2 emails/hour (dev tier only). Custom SMTP via Resend requires owning a domain (blocked on name lock). Until custom SMTP is live, email verification is turned OFF in Supabase Auth settings so development and beta testing aren't blocked. Turn back on when custom SMTP is wired. See PRE-BETA-CHECKLIST.md items #2.1–#2.3.
- **Data sources:** Manufacturer pull rates + eBay sold listings only.
- **Tech stack:** React + Vite frontend on Vercel, PostgreSQL on Supabase, Python or Node.js backend, Claude API for photo scan and trend summary features.
- **Database schema:** 13 tables, 2 views. Complete and finalized — do not rebuild. All pending amendments tracked in PRE-BETA-CHECKLIST.md section #4.
- **Business structure:** 50/50 split with Cam Gibson. Zach handles all technical work. Cam handles business development, distribution, and capital.
- **Strategy:** Leaning build-to-run (shift from original build-to-sell framing). Not finalized but mindset is long-term operation.
- **Distribution:** Starts with local card stores, scales from there. Specifics TBD during beta when Cam begins outreach.
- **Native app (iOS) — HARD REQUIREMENT:** The iOS app is authentication only. There is no free tier, no in-app signup flow, and no in-app purchase system. All user acquisition and payment happens exclusively on the web through Stripe. The app opens to a login screen with a single line directing users without credentials to the website. Once authenticated, users have full premium access. Without credentials the app has no usable functionality. This is an intentional architectural decision to avoid Apple's in-app purchase requirements and their associated revenue cut. It is not to be changed without a deliberate architectural review. The only free-facing feature in the entire product is the ability to browse card boxes by year — this exists on the web only, not in the app.
- **React Native:** React Native build needed for pitch demos. Build web app first, port to native once features are solid. PWA as a possible interim step — pending partner discussion.
- **Filtering system:** Filters are data-driven (populated from database), not hardcoded. Changing filter options later is a data task, not a code rebuild. Filter combinations cascade — sport + manufacturer + year + format all work together.
- **Routing:** React Router. All routes defined in App.jsx. Routes: `/` (homepage), `/browse` (browse page with filters), `/box/:slug` (box profile), `/about`, `/news`, `/contact`, `/help`, `/signin`, `/signup`, `/check-email`.
- **Browse page architecture:** Dedicated browse page at `/browse` with StockX-style layout. Left sidebar has filter sections (Sport → Manufacturer → Year → Format, in that order). Right side shows results grid of BoxSetCard components. Clicking any card routes to `/box/:slug`.
- **Filter URL structure:** Filters are passed as URL query parameters. Example: `/browse?sport=baseball&manufacturer=topps&year=2024&format=hobby`. Header nav links route to `/browse` with appropriate query params applied. Every filter combination produces a unique, shareable URL.
- **Cascading filter logic:** Selecting a filter narrows the options in downstream filters. Example: selecting "Baseball" limits manufacturers to only those with baseball products. Prevents dead-end filter combinations with zero results.
- **Landing pages:** About, News, Contact, Help, Sign In, Sign Up. Dummy content for now. These do NOT need to be locked down before database/backend work — they're independent static pages that can be updated any time.
- **Auth — IN PROGRESS:** Supabase Auth. Sign Up page wired and tested locally — redirects to /check-email on success. Sign In page wired and tested locally — redirects to / on success. CheckEmailPage built and wired with email verification messaging + resend confirmation button. All three auth pages share consistent error-state styling. Supabase Auth manages passwords and sessions in its own `auth.users` table. Our `users` table (to be created during database phase) becomes a profile table (display_name, plan, email_opt_in) linked by Supabase user ID. Email opt-in on sign-up form is UNCHECKED by default — user must actively opt in. Display name and email_opt_in are captured as user metadata on signup and live in Supabase's auth.users.raw_user_meta_data until the profile table exists.
- **Auth context, header nav updates, protected routes, sign out, password reset — STILL TO DO:** Remaining auth phase steps. Blocked on email testing being unblocked first.
- **Google OAuth — DEFERRED:** Placeholder buttons on Sign Up and Sign In. Decision and wiring (or removal) tracked in PRE-BETA-CHECKLIST.md #3.1.
- **Buy Now / affiliate system — LOCKED:** Price comparison with multiple distributors on box profile pages. Starts with 1-2 distributors, grows over time. Boxes without distributor listings fall back to "Find on eBay" affiliate link. System gets designed and built but launches empty — populated when Cam has distributor partnerships (during beta). No distributor outreach until app is ready. New database tables needed: `distributors` and `distributor_listings`. Buy Now button is built as a UI placeholder on the box profile page — wired to distributor_listings table during database phase.
- **eBay Partner Network:** Free to join, 1-4% commission (collectibles on the higher end at 3-4%), 24-hour cookie window. Sign up when real data is live on the site (Phase 10-12 timeframe) — signing up with dummy data risks rejection.
- **Data entry — LOCKED:** Zach handles all data entry during beta (5-10 hrs/week). No data engineer hire until revenue or investors. Pipeline is AI-assisted and runs in five steps — see Data Seeding Pipeline section below and full detail in project-brief.md.
- **Data entry sources by sport:**
  - Baseball: Cardboard Connection, Beckett, Baseballcardpedia, TCDB (release date / MSRP fallback)
  - Football: TCDB (tcdb.com) — Panini exclusive until 2025, Topps post-2025
  - Basketball: TCDB — Panini exclusive license
  - Hockey: TCDB — Upper Deck exclusive license
  - Soccer: TCDB — Panini and Topps
  - Pull rates (all sports): Cross-reference Beckett, Cardboard Connection, Chasing Majors, and Checklist Insider. TCDB does not publish pull rates. Chasing Majors and Checklist Insider provide format-level odds (Hobby vs Jumbo vs Blaster etc).
- **Data seeding pipeline — LOCKED:** Five-step AI-assisted workflow that compresses months of manual research into weeks. Full detail in project-brief.md under "Data Entry Workflow." Summary:
  1. Give Cowork a list of box set names → Cowork generates source document with all URLs pre-populated (Cardboard Connection, Beckett, Baseballcardpedia, TCDB)
  2. Feed source document back to Cowork → Cowork extracts checklist, card numbers, pull rates, box config, release dates, MSRP → outputs one Excel file with tabs matching schema tables (`box_sets`, `cards`, `pull_rates`). `current_value` and `image_url` left blank. Missing data flagged, not blocked.
  3. Run Claude Code slug-bridge script → looks up each box slug in Supabase, fills in `box_set_id` on `cards` and `pull_rates` tabs before import
  4. Export tabs as CSVs → import to Supabase in order: `box_sets` first, then `cards` and `pull_rates`
  5. eBay API fills `current_value` on cards and `current_market_price` on boxes → EV and ROI calculate automatically
- **Spreadsheet format:** One Excel file, one tab per schema table. Sport and year are columns within the `box_sets` tab — not separate files. Each format (Hobby, Jumbo, Blaster, Mega, Retail) is a separate row in `box_sets`, linked by `parent_set_id`.
- **Supabase import method:** CSV per table, imported via Supabase table editor's CSV import button. No raw SQL required for seeding. Import order matters: `box_sets` before `cards` and `pull_rates`.
- **TCDB role:** Not a pull rate source. Used as fallback for release date and MSRP when those fields aren't found on Cardboard Connection, Beckett, or Baseballcardpedia. Each box set name in the source document links directly to its TCDB page.
- **Missing data policy:** If data doesn't exist across all primary sources, it genuinely doesn't exist. Mark as NULL in the spreadsheet. Display as N/A or "Unavailable" in the app. Never fabricate or estimate.
- **Legacy boxes idea (on the shelf):** Separate "Legacy Boxes" header tab showing a filtered list of pre-2018 boxes available for purchase through affiliate partners. Only populated when distributor partnerships exist. May or may not be built — not on the roadmap, just documented as a future idea.
- **Budget:** $5k max for professional code audits (covers all three planned audits). No data engineer hire until revenue.
- **Timeline:** No hard launch date. Working diligently but not rushing. No corners cut.
- **Images strategy — LOCKED:** Don't let images block data entry. Enter checklist/pricing/pull rate data first, leave image_url blank. Primary image source is distributor product feeds (Dave & Adam's, Blowout Cards, Steel City, etc.) — clean, standardized, high-res box art pulled automatically as a byproduct of price scraping, same method Waxstat uses for their 27k+ box library. eBay API (Phase 15) is the fallback for boxes no distributor carries. Manufacturer sites are a tertiary source. Placeholder images acceptable for beta. Images are never manually sourced.
- **Grails tab — LOCKED:** Box profile page has two separate tabs for high-value cards. Top Chases shows cards with `print_run` > 10 or no print run (base autos, standard parallels, refractors — realistically pullable cards that drive EV/ROI math). Grails tab shows cards with `print_run` ≤ 10, including all 1/1s and Superfractors. The /10 cutoff is a hard product decision, not a preference. Grails are excluded from EV and ROI calculations entirely — their pull probability is effectively zero for any individual buyer and including them would inflate EV misleadingly. Grails display a `circulation_status` badge: `Unknown`, `In Circulation`, or `Pulled/Sold`. Status defaults to `Unknown` at data entry and is updated when reliable data exists. The `cards` table requires a `circulation_status` column (values: `unknown`, `in_circulation`, `pulled_sold` — default `unknown`).
- **Color scheme — LOCKED:** Dark mode. Background #111214, surfaces #1e1f24, hero sections #18191d, borders #2a2a2e, primary text #f0f0f0, secondary text #777777, accent #7c6fff, accent background #2a2560, accent text #a89fff. Positive financial indicators (ROI, positive price movement) use `--color-positive` (#16a34a, green) — intentional, must not be changed to purple. Price trend chart line is #16a34a. Error states use `--color-red`, `--color-red-bg`, and `--color-red-border` (already defined in index.css). All colors are CSS variables in index.css. May change post-beta based on user feedback — CSS variables make this a one-file change.
- **Format switcher — LOCKED:** Box profile page has a tab row at the top to switch between available formats (Hobby, Jumbo, Blaster, Mega, Retail). Switching format updates MSRP, pull rates, EV, and ROI. Checklist cards are the same across formats — only odds and pricing change. URL updates via query parameter (e.g. `/box/2024-topps-chrome-baseball?format=hobby`). Only formats that actually exist for a set are shown. Requires `parent_set_id INT REFERENCES box_sets(id)` on `box_sets` table to group formats together. Data sources for format-level odds: Cardboard Connection, Chasing Majors, Checklist Insider. Built with dummy data during UI polish pass — wire to real data during database phase.
- **Price trend charts — LOCKED:** Two charts on box profile page. (1) Sealed box price trend in hero section — market price of the sealed box over time. (2) Card Value Trend by tier — average sale price of the top 10 eBay sold listings per tier per time period, with toggle tabs: Base, Rookies, Autos, Patch Autos. Data sourced from `price_history` table filtered by tier and `source = 'ebay'`. Both charts use `--color-positive` (green #16a34a) for the trend line. Built with dummy data during UI polish pass — wire to real data during database phase.
- **Checklist expand/collapse — LOCKED:** Tiers are collapsed by default — no cards visible until the tier header is clicked. Clicking the tier header toggles it open or closed (accordion pattern). When open: search bar appears at top, first 5 cards are shown, "Show more" button appears at the bottom if the tier has more than 5 cards. "Show more" reveals the complete remaining card list — no secondary limit. Tiers display in descending value order: Premium Hits first, Base last. Sort handled by `sortTiersByValue` in `checklistUtils.js`. Search resets when a tier is collapsed.
- **Card search within checklist tiers — LOCKED:** Each expanded tier has a lightweight search input at the top that filters cards in real time as the user types. Searches player name and card number. Search input only appears when the tier is expanded. Scoped to the current box only — global card search is a separate post-launch feature. Works on both web and mobile.
- **Pull rates display — LOCKED:** Pull rate categories shown on box profile page: Base, Refractor, Rookie Refractor, Numbered, Base Auto, Refractor Auto, Patch Auto, Case Hit, Auto Relic, Relic. Grid displays 4 columns on desktop, 2 columns on mobile. Boxes sized to fit cleanly at all screen widths.
- **Box profile page section order — LOCKED:** Hero (format switcher + stats + Buy Now) → Top Chases / Grails → Pull Rates → Price Trends → Card Value Trends → Full Checklist.
- **Checklist tier display order — LOCKED:** Tiers display in descending value order: Premium Hits first, Base & Rookies last. Current order: (1) Premium Hits, (2) Autographs, (3) Refractors, (4) Inserts & Short Prints, (5) Base & Rookies. Controlled by `sortTiersByValue` in `checklistUtils.js` which sorts descending by tier number. NOTE: This is a workaround — the database schema currently numbers tiers with 1 = Base and 5 = Premium Hits (inverted). During database phase the schema tier numbers will be flipped and `sortTiersByValue` updated to sort ascending. See PRE-BETA-CHECKLIST.md #4.7.
- **Coming soon / upcoming releases — POST-LAUNCH:** A "Coming Soon" section on the homepage showing upcoming box releases with countdown timers. No new schema needed — uses existing `release_date` and `is_active` columns on `box_sets`. Unreleased boxes entered with `is_active = FALSE` and a future `release_date`. On release day `is_active` flips to `TRUE` automatically. Zach will build a personal notification tool to alert him when new boxes are announced. Post-launch only — not in beta scope.

## Hard No List (v1)
- Marketplace
- Community features
- User-submitted data
- AI price predictions
- TCG categories
- In-app purchases on iOS (hard architectural decision — see iOS app requirement above)
- Free tier on iOS app (web only)

## Existing Deliverables
- project-brief.md — comprehensive project plan
- CLAUDE.md — Claude Code context file (lives in repo root)
- CONTEXT.md — this file, current status and decisions
- PRE-BETA-CHECKLIST.md — single compiled list of every deferred item that must be addressed before beta launch
- REFERENCES.md — design and competitor references
- SCALING-REFERENCE.md — infrastructure scaling roadmap (scheduled for expansion during scale audit session)
- requirements.md — hard platform and architectural requirements
- Database schema (13 tables, 2 views)
- Partnership agreement (drafted, ready for signatures)
- Data entry spreadsheet templates (drafts — need review before use)
- Supabase project created (free tier; upgrade to Pro planned when eBay API pipeline goes live)
- Supabase client configured at `src/api/supabaseClient.js`
- `@supabase/supabase-js` installed as dependency
- `.env.local` (gitignored) + Vercel env vars set up with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

## What's Done
1. ✅ Project scaffolded with Vite + React
2. ✅ Folder structure established (components, pages, hooks, utils, api)
3. ✅ Git initialized, GitHub repo connected (github.com/Anthem-Media/dir-app)
4. ✅ CLAUDE.md created for Claude Code sessions
5. ✅ Dev environment confirmed (Mac M1 Pro, Node v24.14.1, Git v2.39.5, Homebrew v5.1.3, GitHub CLI v2.89.0)
6. ✅ BoxProfilePage built with all sections (hero, top chases, pull rates, price trend, checklist)
7. ✅ Codebase audited and cleaned (CSS variables centralized, calculations moved to utils)
8. ✅ Homepage template built
9. ✅ Header with cascading navigation system built
10. ✅ Routing and filtering system built (React Router, BrowsePage, FilterSidebar, BoxSetCard, all routes wired)
11. ✅ Second codebase audit — navigation fixed, dead code removed, CSS consolidated, filter clear bug fixed
12. ✅ Landing pages built (AboutPage, NewsPage, HelpPage, ContactPage, SignInPage, SignUpPage)
13. ✅ Sign Up button added to header nav next to Sign In
14. ✅ Deployed to Vercel (live URL: dir-app-weld.vercel.app)
15. ✅ All major business decisions locked with Cam (revenue model, data strategy, affiliate approach, sport scope, timeline)
16. ✅ Dark mode color scheme implemented and deployed
17. ✅ Soccer added to navigation
18. ✅ Box Profile features built and audited (format switcher, tier price trend chart, checklist expand/collapse, card search within tiers, Grails tab, tier display order)
19. ✅ UI polish pass complete across all pages (Header/Nav, Homepage, Browse, Box Profile, About, News, Help, Contact, Sign In, Sign Up)
20. ✅ Beta access model locked — auth required from day one, all beta signups get plan='beta' with full premium access, no Stripe during beta, email opt-in from day one
21. ✅ Data seeding pipeline designed and locked — five-step Cowork + Claude Code workflow
22. ✅ Supabase project created (free tier, GitHub auth)
23. ✅ Supabase client library installed (`@supabase/supabase-js`)
24. ✅ Environment variables configured (`.env.local` gitignored locally + Vercel production/preview)
25. ✅ `src/api/supabaseClient.js` created — single source for the configured Supabase client, throws clear errors on missing env vars
26. ✅ Sign Up page wired to Supabase Auth — email/password signup, client-side validation (email required, password ≥ 6 chars, passwords must match), display_name + email_opt_in captured as user metadata, loading state on submit, inline error messages, redirect on success, email opt-in unchecked by default
27. ✅ Sign Up error state styled (red-tinted, matches dark mode) — uses `--color-red`, `--color-red-bg`, `--color-red-border` variables already in index.css
28. ✅ Sign Up flow tested end-to-end in production on Vercel
29. ✅ Sign In page wired to Supabase Auth — email/password sign-in, client-side validation (email required, password required; no length check on sign-in), loading state on submit, inline error messages, redirect to homepage on success
30. ✅ Sign In error state styled to match Sign Up error style
31. ✅ CheckEmailPage built at /check-email — post-signup destination with user's email displayed, resend confirmation button wired to supabase.auth.resend(), graceful fallback when no email in route state (direct URL access), styled to match Sign In/Sign Up split-panel layout
32. ✅ SignUpPage redirected to /check-email on success (was redirecting to homepage)
33. ✅ CheckEmailPage route added to App.jsx
34. ✅ PRE-BETA-CHECKLIST.md created — single compiled document of every deferred item to address before beta launch

## Full Roadmap
1. ~~Codebase audit~~ ✅
2. ~~Routing and filtering system~~ ✅
3. ~~Landing pages~~ ✅
4. ~~Deploy to Vercel~~ ✅
5. ~~Dark mode color scheme~~ ✅
6. ~~UI polish pass~~ ✅
7. Auth system (Supabase) ← CURRENT
   - ~~Create Supabase project (free tier)~~ ✅
   - ~~Install Supabase client library in React app~~ ✅
   - ~~Set up environment variables (.env.local + Vercel env vars)~~ ✅
   - ~~Create src/api/supabaseClient.js~~ ✅
   - ~~Wire Sign Up page to Supabase Auth~~ ✅
   - ~~Wire Sign In page to Supabase Auth~~ ✅
   - ~~Build CheckEmailPage with resend flow~~ ✅
   - Turn off email verification in Supabase Auth settings (temporary — unblocks testing) ← NEXT
   - Commit uncommitted changes + delete broken test accounts
   - Build auth context (React context provider for logged-in state)
   - Update header nav (conditional Sign In / Sign Out / user display)
   - Protect box profile page (redirect to sign in if not authenticated)
   - Sign out flow
   - Password reset flow (deferred — depends on custom SMTP for reliable reset emails, see PRE-BETA-CHECKLIST.md)
   - Code audit before committing
8. Scale audit session — full walk of every feature, third-party service, rate limit, and bottleneck at 100/1k/10k/100k concurrent user ceilings. Findings documented in SCALING-REFERENCE.md and high-risk items added to PRE-BETA-CHECKLIST.md.
9. Pro audit #1 (senior React dev — is the frontend and auth foundation solid? ~3-5 hours at $50-150/hr = $150-750)
10. Database setup and backend API (apply all pending schema amendments from PRE-BETA-CHECKLIST.md #4)
11. Connect frontend to real data
12. Admin panel for data entry
13. eBay API proof of concept — small targeted test after admin panel is live
14. Pull rate scraper test — target Cardboard Connection for 2024 Topps Chrome Baseball
15. Seed one test box set end to end (2024 Topps Chrome Baseball)
16. eBay API full integration (card pricing + box pricing + images from distributor feeds + eBay fallback)
17. Seed database with all sports (Baseball, Football, Basketball, Hockey, Soccer)
18. Claude API integration for photo scan feature
19. Buy Now / affiliate link system (UI built, populated when Cam has distributor partnerships)
20. Price alerts and notifications
21. User features (saved boxes, collection tracker, wishlist)
22. Search functionality
23. Pro audit #2 (full-stack dev — is the complete app ready for real users? ~8-15 hours at $50-150/hr = $400-2,250)
24. Pre-launch polish: walk PRE-BETA-CHECKLIST.md end-to-end. Includes name lock, domain purchase, Resend SMTP setup, custom email templates, Google OAuth decision, password reset flow, all remaining schema amendments.
25. Beta launch (all signups default to plan='beta' with full access — no Stripe yet)
26. Pro audit #3 (specialist based on what breaks — performance, security, or both. ~5-10 hours at $75-200/hr = $375-2,000)
27. Post-beta: Stripe integration, migrate beta users (grandfather or prompt to upgrade), flip paywall to require plan='paid' for new signups
28. Post-launch: Coming Soon / release calendar, AI trend summaries, portfolio tracking, light/dark mode toggle in settings, Legacy Boxes marketplace tab (if validated)

## Reminders & Flags
- ⚠️ Switch Claude Code to Opus for auth system, database connection layer, and backend API work. Sonnet for UI, color, and mechanical tasks.
- ⚠️ Beta access model is LOCKED: auth required from day one, all signups get plan='beta', no Stripe until after beta. Paywall check must accept plan IN ('beta', 'paid'). Do not build any free-tier box profile access during beta.
- ⚠️ Email verification temporarily OFF in Supabase Auth settings. Turn back ON after custom SMTP via Resend is configured (requires owning a domain). Do not forget — see PRE-BETA-CHECKLIST.md #2.1.
- ⚠️ Supabase's default email service is 2 emails/hour — development tier only. Never ship to beta on default SMTP. Custom SMTP via Resend is a hard requirement for beta launch. See PRE-BETA-CHECKLIST.md #2.2.
- ⚠️ Scale audit is now a scheduled roadmap item (#8). Every new feature and third-party integration gets a scale-stress walkthrough during its audit checklist from here forward. Ask "what breaks at 100 concurrent users? 10,000? 100,000?" before shipping.
- ⚠️ Every new third-party service gets a pre-integration scale-check: rate limits, pricing tiers, upgrade paths. Documented in SCALING-REFERENCE.md before the service is added to the stack.
- ⚠️ Error state CSS variables are `--color-red`, `--color-red-bg`, `--color-red-border` (already in index.css) — not `--color-error`. Previous docs referenced a variable name that doesn't exist. Use the real names.
- ⚠️ Product name "DIR" is a working name, not locked. dirapp.com is $3,600 (premium tier). Name lock is deferred until a final decision is made. Development continues name-agnostic.
- ⚠️ Google OAuth is placeholder only on Sign Up and Sign In. Decision + wiring (or removal) tracked in PRE-BETA-CHECKLIST.md #3.1.
- ⚠️ Password reset flow is deferred within the auth phase. Depends on reliable email delivery (custom SMTP). Will be built alongside SMTP setup during pre-launch polish.
- ⚠️ All database schema amendments deferred to the database phase. Full list in PRE-BETA-CHECKLIST.md section #4. Do not apply piecemeal — handle all together when database phase begins.
- ⚠️ Supabase free tier is 500MB of database storage. Current usage is tiny. Plan to upgrade to Supabase Pro ($25/mo, 8GB) when the full eBay API pipeline goes live and full seeding begins. See PRE-BETA-CHECKLIST.md #7.1.
- ⚠️ DUMMY_TIER_TREND_DATA bypasses the hook and is consumed inline in BoxProfilePage.jsx — at database phase this needs to move into useBoxProfile, not just be replaced with real data. This is a refactor task, not just a data swap.
- ⚠️ DUMMY_FORMAT_DATA drives formatData in BoxProfilePage.jsx — needs to come from useBoxProfile once parent_set_id is live on box_sets. Refactor task, not just a data swap.
- ⚠️ useBoxProfile hook has orphaned MOCK_PULL_RATES data — at database phase, pull rates must return from the hook keyed by format slug so the format switcher can request per-format odds.
- ⚠️ Database phase: flip tier numbering in dir_database_schema.sql and seed data so Tier 1 = Premium Hits and Tier 5 = Base/Rookies. Update sortTiersByValue in checklistUtils.js to sort ascending once schema is corrected. Currently sorts descending as a workaround.
- ⚠️ Use CSS variables for ALL colors — no hardcoded hex values in any new code. Only known exception: CHART_COLORS objects in TierPriceTrendChart.jsx and PriceTrendChart.jsx use hex constants because Recharts passes values directly to SVG attributes where CSS var() doesn't work. Each value has a comment mapping it to its CSS variable.
- ⚠️ Positive financial indicators must stay green (#16a34a via --color-positive) — do not change to purple accent.
- ⚠️ Format switcher requires parent_set_id on box_sets — built with dummy data, wire to real data during database phase.
- ⚠️ End every feature/page session with a code audit before committing.
- ⚠️ Do not manually enter card prices. Ever. Card pricing comes from the eBay API proof of concept script and the full eBay API pipeline. Manual eBay lookup card-by-card is not viable at any scale.
- ⚠️ Pull rate sourcing strategy: try scraper first (targeting Cardboard Connection), fall back to hybrid paste-into-Claude workflow if scraper hits walls. Do not copy-paste and manually organize pull rate tables.
- ⚠️ Do not begin full database seeding until the end-to-end pipeline test with one box set (2024 Topps Chrome Baseball) passes completely.
- ⚠️ Data accuracy before beta does not matter — only Zach and Cam will see the app until the eBay API is live and pricing is automated. Focus on pipeline correctness, not data completeness, during the database build phase.
- ⚠️ Seeding pipeline uses slug-as-bridge for table linking — each box_sets row has a slug, Claude Code script resolves slugs to Supabase IDs and fills box_set_id on cards and pull_rates before CSV import. Do not manually assign numeric IDs in spreadsheets.
- ⚠️ Spreadsheet structure: one Excel file, one tab per schema table (box_sets, cards, pull_rates). Export each tab as a separate CSV for Supabase import. Import box_sets first, then cards and pull_rates.
- ⚠️ iOS app is auth-only — no in-app purchases, no signup flow, no free tier. All acquisition and payment through web/Stripe. Do not deviate without architectural review.
- ⚠️ Payment processor is Stripe (web only). Do not design any iOS purchase flow. No Stripe until after beta.
- ⚠️ Supabase Auth manages user passwords in its own auth.users table — do not store passwords in the users table. Our users table is a profile table linked to Supabase auth user IDs. Until the users profile table is created (database phase), display_name and email_opt_in live only in auth.users.raw_user_meta_data.
- ⚠️ Never paste Supabase keys, database passwords, or any secrets into chat. Secrets go in .env.local (local) and Vercel env vars (production) only. .env.local must be in .gitignore.
- ⚠️ Vercel env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for Production and Preview only (Development checkbox was locked — uses .env.local locally instead). Correct setup.
- ⚠️ Supabase "Secret key" is the service role key — NEVER use it in the React app or commit it anywhere. It has full admin access to the database. The "Publishable key" (a.k.a. anon key) is the one used by VITE_SUPABASE_ANON_KEY.
- ⚠️ VITE_SUPABASE_URL is the bare project URL (https://[project-id].supabase.co) — do NOT include /rest/v1/ at the end. The Supabase client appends the path internally.
- ⚠️ Supabase Site URL and Redirect URLs are configured for the live Vercel URL (dir-app-weld.vercel.app) + localhost. Update whenever the production URL changes (domain purchase, Vercel project rename, etc.).

## Development Guidelines
- Use this Project chat for planning, strategy, and decisions
- Use Claude Code for hands-on coding and file creation
- Use Cowork for the data seeding pipeline (Step 1 source document generation + Step 2 spreadsheet population)
- Consistent naming conventions throughout the codebase
- One job per file — components render UI, hooks fetch data, utils calculate
- Start each session by reviewing this file, project-brief.md, and PRE-BETA-CHECKLIST.md
- Maintain project-brief.md as the living source of truth
- Maintain PRE-BETA-CHECKLIST.md — add items to it the moment something is deferred, do not rely on memory
- Periodic refactoring to keep things clean
- Frequent GitHub commits with descriptive messages
- If a feature idea comes up that isn't on the plan, flag it — don't build it
- Zach has no dev background — explain everything step by step
- Every new feature and third-party integration gets a scale-stress walkthrough as part of its audit
