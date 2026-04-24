# DIR (Diamond in the Rough) — Claude Code Context

## What This Is

A sports card box analytics web app. Users look up any box set and see the full checklist, card values, pull rates, expected value, ROI, and market trends. Built around the box, not individual cards. No other tool does this.

Final name: Ripper. Domain: hobbyripper.com. Working name 'DIR' is still present throughout the codebase and docs — a dedicated rename pass is scheduled before Pro code audit #1, not sooner. Do NOT do find-and-replace of DIR → Ripper while building features. Keep development name-agnostic until the rename pass.

## Key Files

- `project-brief.md` — Full project brief (read this for detailed context on features, data strategy, business context)
- `CONTEXT.md` — Current status, what's done, what's next
- `PRE-BETA-CHECKLIST.md` — Every deferred item that must be addressed before beta launch. Read when work gets deferred OR when preparing for beta.
- `REFERENCES.md` — Design and competitor references
- `SCALING-REFERENCE.md` — Infrastructure scaling roadmap (scheduled for expansion during the scale audit session)
- `requirements.md` — Hard platform and architectural requirements (iOS app model, payment, access rules)
- `dir_database_schema.sql` — PostgreSQL schema with 13 tables, views, seed data

## Tech Stack

- Frontend: React + Vite, deployed on Vercel (live URL: dir-app-weld.vercel.app)
- Backend: TBD (Python or Node.js), deployed on Railway or Render
- Database: Supabase (managed PostgreSQL — free tier now, Pro planned when full seeding begins)
- Auth: Supabase Auth COMPLETE — Sign Up, Sign In, CheckEmailPage, AuthContext, ProtectedRoute, Sign Out, and password reset flow (ForgotPasswordPage + ResetPasswordPage) all wired, branded, and tested. Email verification permanently ON. Custom SMTP via Resend live.
- Email delivery: Custom SMTP via Resend is LIVE. Sender is noreply@hobbyripper.com. All 6 Supabase auth email templates branded with RIPPER. wordmark. Tested under burst load.
- Payments: Stripe (web only — all billing handled on final domain, never in the iOS app; not wired until post-beta)
- AI: Claude API for photo scan (box identification) and trend summaries (post-launch)

## Folder Structure

```
src/
├── components/    # Reusable UI pieces (buttons, cards, charts, nav)
├── pages/         # Full page views (BoxProfilePage, SignInPage, SignUpPage, CheckEmailPage, etc.)
├── hooks/         # Data fetching logic
├── utils/         # Helper functions (calculations, formatting)
├── api/           # Backend communication (supabaseClient.js lives here)
```

## Codebase Rules — Follow These Always

**Build this like a professional developer would.** The codebase should be clean enough that Zach can maintain and extend it indefinitely — and if a professional developer ever joins, they should be able to understand the structure in 10 minutes and build on top of it. The bar is professional-grade code, not "good enough for now."

1. Name everything descriptively — BoxProfilePage.jsx not Page2.jsx
2. One job per file — components render UI, hooks fetch data, utils calculate/format
3. Never put data fetching logic in components — use hooks
4. Never put calculations in components — use utils
5. No hacky workarounds — find the right solution, not a clever shortcut
6. Comment non-obvious code — explain what it does and why
7. Keep dependencies minimal — don't install packages for things that can be done simply
8. Use CSS variables for ALL colors — no hardcoded hex values anywhere in components or CSS files
9. Never commit secrets — API keys, passwords, Supabase service keys all go in `.env.local` (local) and Vercel env vars (production). `.env.local` is gitignored by the `*.local` rule.
10. Every new feature and third-party integration gets a scale-stress walkthrough as part of its audit — ask what breaks at 100, 10k, 100k concurrent users before shipping.

## Color Scheme

Dark mode. All colors defined as CSS variables in index.css — never hardcode hex values.

- Background: `--color-background-primary` (#111214)
- Surfaces: `--color-background-secondary` (#1e1f24)
- Hero sections: `--color-background-tertiary` (#18191d)
- Borders: `--color-border` (#2a2a2e)
- Primary text: `--color-text-primary` (#f0f0f0)
- Secondary text: `--color-text-secondary` (#777777)
- Accent: `--color-accent` (#7c6fff)
- Accent background: `--color-accent-bg` (#2a2560)
- Accent text: `--color-accent-text` (#a89fff)
- Positive financial indicators: `--color-positive` (#16a34a) — intentionally green, do not change to accent purple
- Error text: `--color-red`
- Error background tint: `--color-red-bg`
- Error border: `--color-red-border`

## About the Developer

Zach Seabolt has no formal coding background. He builds through iterative conversations with Claude. Always explain what code does and why. Never assume prior knowledge. Explain terminal commands before asking him to run them.

## Git Workflow

```
git add .
git commit -m "description of what changed"
git push
```

## Revenue Model

Fully paid box profiles. Free browsing experience on web only (homepage, browse page, search, filtering, scrolling through box sets). Paywall triggers when user clicks into a box profile page. Auth system must enforce this gating. All payment via Stripe on the web.

iOS app is auth-only — no in-app purchases, no signup flow, no free tier. See requirements.md.

## Beta Access Model

Auth is required from day one. All beta signups get `plan = 'beta'` with full premium access. No Stripe during beta. Paywall logic must accept `plan IN ('beta', 'paid')`. Post-beta, new signups default to `'free'` and must upgrade to `'paid'` via Stripe. See CONTEXT.md for full detail.

Email verification is permanently ON. Custom SMTP via Resend is live, so the 2/hour Supabase default limit no longer applies.

## Auth Setup (current state)

- Supabase project created. Keys live in `.env.local` locally and Vercel env vars for production.
- Supabase client lives at `src/api/supabaseClient.js`. Import from there anywhere you need Supabase: `import { supabase } from '../api/supabaseClient'`.
- Env var names: `VITE_SUPABASE_URL` (bare URL, no `/rest/v1/`), `VITE_SUPABASE_ANON_KEY` (the "Publishable key" in Supabase).
- Supabase Site URL and Redirect URLs are configured for dir-app-weld.vercel.app + localhost:5173. Update when production URL changes.
- Sign Up page is wired: email/password signup with validation, `display_name` + `email_opt_in` passed as user metadata, inline error messages styled with `--color-red` family variables, redirects to `/check-email` on success.
- Sign In page is wired: email/password sign-in, validation, error display, redirects to `/` on success.
- CheckEmailPage at `/check-email`: post-signup destination, displays user's email (via route state), resend confirmation button, graceful fallback when URL hit directly. Styled to match SignIn/SignUp split-panel layout.
- `users` profile table does NOT exist yet. During Sign Up, user metadata (`display_name`, `email_opt_in`) is stored in `auth.users.raw_user_meta_data`. When the users profile table is created in the database phase, it links to Supabase's `auth.users` via the auth user ID — no passwords stored on our side.
- Google OAuth buttons on Sign Up and Sign In are placeholder only. Deferred decision: wire it up or remove. See PRE-BETA-CHECKLIST.md #3.1.
- Password reset flow: COMPLETE. Forgot password link on SignInPage routes to /forgot-password. Full flow: /forgot-password (email input) → branded reset email → /reset-password (new password) → /signin with success banner. ResetPasswordPage handles invalid/expired session state with CTA back to /forgot-password.
- Supabase auth emails route through Resend SMTP. All 6 templates branded with RIPPER. wordmark in the Supabase dashboard. Light-mode only (color-scheme meta tags applied) — renders correctly on iOS Mail without auto-invert. Templates authored in Supabase dashboard only, not in codebase.

## Data Coverage

- **Full profiles (2018-present):** Checklist, card-level pricing, pull rates, EV, ROI, top chases, grails, market trends.
- **Legacy profiles (1995-2017):** Checklist, card-level pricing, top chases, grails, pull rates where available. NO EV or ROI. Box profile page must gracefully handle missing EV/ROI sections for legacy boxes (hide or show "not available" message).
- **Sports at launch:** Baseball, Football, Basketball, Hockey, Soccer.

## Box Profile Page — Features

### Section Order (locked)
Hero (format switcher + stats + Buy Now) → Top Chases / Grails → Pull Rates → Price Trends → Card Value Trends → Full Checklist

### Buy Now
Placed directly below the hero stats row (Market Price, MSRP, EV, ROI). Full-width button on mobile, ~220px on desktop. UI placeholder only — wired to `distributor_listings` table during database phase. Falls back to eBay affiliate link when no distributor carries the box. See TODO comment in BoxProfilePage.jsx.

### Format Switcher
Tab row at the top of the box profile page. Switches between available formats (Hobby, Jumbo, Blaster, Mega, Retail). Only shows formats that exist for the current set. Switching format updates MSRP, pull rates, EV, and ROI. Checklist cards stay the same — only odds and pricing change. URL updates via query parameter: `/box/slug?format=hobby`. Requires `parent_set_id` on `box_sets` table (database phase). Built with dummy data — wire to real data during database phase. No horizontal scroll on mobile — tabs use `flex: 1` to distribute evenly across full width.

### Top Chases vs. Grails
Two separate tabs for high-value cards:
- **Top Chases** — cards with `print_run` > 10 or no print run. Realistically pullable. Drive all EV/ROI calculations.
- **Grails** — cards with `print_run` ≤ 10 (including all 1/1s and Superfractors). The /10 cutoff is a hard product decision. Excluded from EV and ROI math entirely. Display `circulation_status` badge: `Unknown`, `In Circulation`, or `Pulled/Sold`. Status defaults to `Unknown` at data entry.

### Pull Rates
Grid layout — 4 columns on desktop, 2 columns on mobile. Categories displayed: Base, Refractor, Rookie Refractor, Numbered, Base Auto, Refractor Auto, Patch Auto, Case Hit, Auto Relic, Relic. Boxes sized to fit cleanly at all screen widths without overflow.

### Price Trend Charts
Two charts:
1. **Sealed box price trend** — in the hero section. Market price of the sealed box over time. Powers the "is now a good time to buy?" question.
2. **Card Value Trend by tier** — below the Pull Rates section. Average sale price of the top 10 eBay sold listings per tier per time period. Toggle tabs above the chart: Base, Rookies, Autos, Patch Autos. Data sourced from `price_history` table filtered by tier and `source = 'ebay'`. Powers the "are the hits in this set appreciating or tanking?" question.
Both charts use `--color-positive` (#16a34a) for the trend line. Built with dummy data — wire to real data via `price_history` and `box_price_history` tables during database phase.

### Checklist Expand/Collapse
Tiers are collapsed by default — no cards visible until the tier header is clicked. Clicking the tier header toggles it open or closed (accordion pattern). When open: search bar appears at top, first 5 cards are shown, "Show more" button appears at the bottom if the tier has more than 5 cards. "Show more" reveals the complete remaining card list — no secondary limit. Tiers display in descending value order: Premium Hits first, Base last. Sort handled by `sortTiersByValue` in `checklistUtils.js`. Search resets when a tier is collapsed.

### Card Search Within Tiers
Each expanded tier has a lightweight search input at the top. Filters cards in real time as the user types. Searches player name and card number. Only visible when the tier is expanded. Scoped to the current box only. Works on both web and mobile.

## Routing Architecture

React Router handles all navigation. Routes defined in App.jsx:
- `/` — Homepage
- `/browse` — Browse page (filter sidebar + results grid)
- `/box/:slug` — Box profile page (slug from box_sets table)
- `/about`, `/news`, `/contact`, `/help` — Landing pages
- `/signin`, `/signup` — Auth pages
- `/check-email` — Post-signup confirmation destination (not in header nav — it's a flow state)

Browse page filter system:
- Dedicated page at `/browse` with StockX-style layout
- Left sidebar: filter sections in order — Sport → Manufacturer → Year → Format
- Right side: results grid of BoxSetCard components, each links to `/box/:slug`
- Filters passed as URL query parameters: `/browse?sport=baseball&manufacturer=topps&year=2024&format=hobby`
- Header nav links route to `/browse` with query params (e.g. clicking "Baseball" → `/browse?sport=baseball`)
- Filters are data-driven (from database), not hardcoded
- Cascading logic: selecting a filter narrows downstream filter options (no dead-end combinations)

## Schema Notes

Current schema has 13 tables and 2 views. All pending amendments are tracked in PRE-BETA-CHECKLIST.md section #4. Do not apply piecemeal — handle all together when the database phase begins.

Buy Now system: price comparison with multiple distributors. Fallback to "Find on eBay" affiliate link when no distributor carries a box.

## Current Status

- Auth phase COMPLETE. AuthContext, ProtectedRoute, conditional header nav (AppNav + HamburgerMenu), Sign Out all built and audited.
- Name + domain locked: Ripper / hobbyripper.com (via Cloudflare).
- Email Infrastructure phase COMPLETE. Custom SMTP via Resend live, all 6 email templates branded, password reset built/tested, email verification permanently ON, vercel.json added for SPA routing. POC phase is now current.
- All colors are CSS variables — no hardcoded hex values in codebase (Recharts SVG exception documented in TierPriceTrendChart.jsx and PriceTrendChart.jsx)
- End every page/feature session with a code audit before committing
- See CONTEXT.md for full task list and PRE-BETA-CHECKLIST.md for all deferred items, including the new Account Management phase (section #10)

## Known Refactor Tasks (database phase)

- `DUMMY_TIER_TREND_DATA` is consumed inline in `BoxProfilePage.jsx`, bypassing the hook. At database phase this data must move into `useBoxProfile` — this is a refactor task, not just a data swap.
- `DUMMY_FORMAT_DATA` drives `formatData` in `BoxProfilePage.jsx` — needs to come from `useBoxProfile` once `parent_set_id` is live on `box_sets`.
- `useBoxProfile` hook has orphaned `MOCK_PULL_RATES` data — at database phase, pull rates must return from the hook keyed by format slug so the format switcher can request per-format odds.
- Tier numbering in `dir_database_schema.sql` needs to be flipped so Tier 1 = Premium Hits and Tier 5 = Base/Rookies. Once done, update `sortTiersByValue` in `checklistUtils.js` to sort ascending instead of descending.
- Sign Up and Sign In pages currently call `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` directly from page handlers. When the auth context is built, consider refactoring these into a dedicated auth hook for consistency with the codebase rule that data-fetching lives in hooks, not components.

## Documentation Update Workflow

When updates are needed across multiple MD files (project-brief.md, CLAUDE.md, CONTEXT.md, PRE-BETA-CHECKLIST.md, SCALING-REFERENCE.md, REFERENCES.md, requirements.md) at the end of a planning session:

- DO NOT have the planning chat rewrite full file contents for manual copy-paste. That burns the planning chat's output tokens on content that's mostly duplicating existing file content.
- DO have the planning chat produce a single Claude Code prompt listing targeted str_replace edits by file and section. Claude Code reads the files from its own context and applies surgical edits.
- This keeps planning-chat token usage low, minimizes risk of accidentally dropping content during rewrites, and keeps files in sync with the repo without manual download/replace cycles.
- The planning chat's job is to decide WHAT needs to change. Claude Code's job is to MAKE the changes.
