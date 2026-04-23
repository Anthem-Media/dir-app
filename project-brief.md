# DIR (Diamond in the Rough) — Project Brief

**Working Name:** DIR (Diamond in the Rough) — NOT YET LOCKED. May change before beta.
**Tagline:** "Think inside the box."
**Last Updated:** April 23, 2026

---

## What We're Building

A web app that provides box-level analytics for sports card collectors and investors. Users can look up any box set and see the full checklist, card values, pull rates, expected value, ROI probability, and market trends — answering the core question: "What is the best box for me to buy for my budget and my goals?"

No other tool does this. Existing apps (Market Movers, Card Ladder, CollX) are built around individual cards. DIR is built around the box.

---

## Who It's For

- Age 13+ (minimum age for account creation)
- Casual collectors through serious investors
- People who currently rely on card shop employees, manufacturer marketing, or gut instinct to decide what box to buy
- Distribution starts with local card stores, scales from there

---

## MVP Feature Set (Priority Order)

### Priority 5 — Core (must have for beta)
- Box profile page with full checklist, pull rates, EV calculator, ROI score
- Card-level pricing for every card in the checklist (required for EV/ROI math)
- Card value rankings within a set by tier
- Top Chases tab — cards with print run > 10 or no print run; drives EV/ROI math
- Grails tab — cards with print run ≤ 10 (including 1/1s and Superfractors); excluded from EV/ROI; shows circulation status badge
- Format switcher — tab row at top of box profile page to switch between Hobby, Jumbo, Blaster, Mega, Retail; updates MSRP, pull rates, EV, ROI
- Two price trend charts — (1) sealed box price in hero section, (2) card value by tier below checklist with toggle tabs
- Checklist expand/collapse — 5 cards shown per tier by default, expand inline per tier
- Card search within checklist tiers — real time filter by player name or card number, visible only when tier is expanded
- Market trend charts over time (box price and card values)
- Manufacturer-published pull rate display
- Auth system (required from day one — see Beta Access Model below)

### Priority 4 — Navigation
- AI photo scan → box identification → profile page (Claude Vision API)
- Search and filter by sport, manufacturer, year, box format

### Priority 3 — Depth
- ROI / recoup probability calculator
- Price alerts and notifications (market price changes + new box drop alerts)

### Priority 2 — Post-launch
- User accounts with saved/watchlisted boxes
- Personal collection tracker (cards owned, quantity, condition)
- Wishlist feature (cards wanted)
- Coming Soon / upcoming releases section on homepage with countdown timers

### Priority 1 — Future
- Community/social features (comments, forums, card showcase)
- Claude API generated plain English trend summaries
- Light/dark mode toggle in settings

---

## Hard No List for V1

- Marketplace / buying functionality (year two exploration at earliest)
- Community features / forums / comments
- User-submitted pull rate data (permanent kill — data integrity risk)
- AI price predictions / future valuations
- Entertainment / TCG categories (Pokemon, Magic, Yu-Gi-Oh, Disney, etc.)
- Box break data aggregation from external sources
- In-app purchases on iOS (hard architectural decision — all payment through web/Stripe)
- Free tier on iOS app (web-only free browsing experience)
- Stripe integration during beta (no payment processing until beta ends)
- Free-tier box profile access during beta (all beta users get plan='beta' with full access)

---

## Beta Access Model — LOCKED

Auth is required from day one. There is no anonymous access to box profiles at any point in the product lifecycle — not during beta, not after.

**During beta:**
- All signups default to `plan = 'beta'` in the users table
- Beta users get full premium access to every feature: box profiles, EV, ROI, pull rates, charts, everything
- No Stripe. No payment processing. No subscription selection screen
- Email opt-in checkbox on the signup form — captures beta tester emails from day one
- iOS app works because it's auth-only by design — every beta signup is a valid iOS user

**Paywall logic (write it this way from the start):**
```
Is user logged in?  →  no  →  redirect to /signin
Is user's plan IN ('beta', 'paid')?  →  no  →  redirect to /upgrade (built post-beta)
Both yes  →  show box profile
```

**After beta ends:**
- Stripe gets wired in
- New signups default to `plan = 'free'` (no box profile access)
- Paywall logic still accepts `'beta'` OR `'paid'` — existing beta users keep access
- Migration decision for beta users (grandfather vs prompt-to-upgrade) is deferred until end of beta

**Why this approach:**
- iOS app requires auth to function at all — auth-free beta would break iOS entirely
- Email list is a locked strategic asset — capturing emails from day one is non-negotiable
- The auth code written for beta is the exact code needed at launch — no rewrite at the finish line
- Identifying beta users enables targeted feedback and marketing

---

## Data Strategy

### Data Coverage
- **Full profiles (2018-present):** Checklist, card-level pricing, pull rates, EV, ROI, top chases, grails, market trends. This is the core product.
- **Legacy profiles (1995-2017):** Checklist, card-level pricing, top chases, grails, pull rates where available. NO EV or ROI — the math doesn't apply to older product. Box profile page hides or gracefully handles missing EV/ROI sections for legacy boxes.

### Data Sources
- **Card checklists:** Varies by sport (see Data Entry Sources below). AI-assisted workflow — Cowork sources and structures data from reference sites into schema-ready spreadsheets. Do not scrape verbatim — build own dataset from factual information.
- **Card pricing:** eBay sold listings (primary source). eBay API for programmatic access. Card-level pricing is required for every card — not just top chases. Never entered manually.
- **Pull rates:** Manufacturer-published odds from packaging and official sites (Topps, Panini, Upper Deck). Cross-reference Beckett, Cardboard Connection, Chasing Majors, and Checklist Insider. TCDB does not publish pull rates. Chasing Majors and Checklist Insider provide format-level odds (Hobby vs Jumbo vs Blaster etc.) — required for the format switcher feature.
- **Box pricing:** eBay sold listings for sealed box market prices.
- **Release dates / MSRP:** TCDB (tcdb.com) — each box set name links directly to its TCDB page. Use as fallback when release date or MSRP is not found on Cardboard Connection, Beckett, or Baseballcardpedia.
- **Images:** Don't let images block data entry. Enter data first, leave image_url blank. Primary image source is distributor product feeds (Dave & Adam's, Blowout Cards, Steel City, etc.) — clean, standardized, high-res box art pulled automatically as a byproduct of price scraping, same method Waxstat uses for their 27k+ box library. eBay API is the fallback for boxes no distributor carries. Manufacturer sites are a tertiary source. Placeholder images acceptable for beta. Images are never manually sourced.

### Data Entry Sources by Sport
- **Baseball:** Cardboard Connection, Beckett, Baseballcardpedia, TCDB (release date / MSRP fallback)
- **Football:** TCDB (tcdb.com) — Panini exclusive until 2025, Topps post-2025
- **Basketball:** TCDB — Panini exclusive license
- **Hockey:** TCDB — Upper Deck exclusive license
- **Soccer:** TCDB — Panini and Topps
- **Pull rates (all sports):** Cross-reference Beckett, Cardboard Connection, Chasing Majors, and Checklist Insider. TCDB does not publish pull rates. Chasing Majors and Checklist Insider provide format-level odds.

### Data Integrity Rules
- NO user-submitted data influencing the dataset. Ever.
- NO YouTube break scraping. Survivorship bias makes this unreliable.
- Published manufacturer pull rates + real sold prices = clean, verifiable data.
- Sets without published odds get flagged as "unavailable" — EV calculation is skipped for those boxes. Box profile still shows checklist and card values.
- If data doesn't exist across all primary sources, it genuinely doesn't exist — mark as NULL. Display as N/A or "Unavailable" in the app. Never fabricate or estimate.

### Refresh Cadence
- Beta: Weekly refresh is acceptable
- Post-beta: Daily refresh target
- Long-term: Real-time or near-real-time (engineering hire needed)

### Scale
- Beta launch: All five sports (Baseball, Football, Basketball, Hockey, Soccer) populated with full profiles for 2018-present, legacy profiles for 1995-2017
- Estimated box count for full profiles (2018-present): ~1,200-2,000 boxes across all sports
- 40-60 new box set products per year per sport from major manufacturers
- Each set has multiple formats (Hobby, Jumbo, Blaster, Mega, Retail) — each is a separate database entry linked by `parent_set_id`

### Data Entry Workflow — LOCKED

The full seeding pipeline runs in five steps. This workflow compresses what would be months of manual research into weeks. Do not deviate from this order.

**Step 1 — Build the source document (Cowork)**
Provide Cowork a list of box set names for a given sport and year. Cowork generates a structured source document — one row per set — with URLs pre-populated for Cardboard Connection, Beckett, Baseballcardpedia, and TCDB. The TCDB link is attached to the set name itself and is the fallback source for release date and MSRP when not found elsewhere. What takes an hour to build manually takes seconds with Cowork. Repeat per sport per year.

**Step 2 — Populate the spreadsheet (Cowork)**
Feed the source document back to Cowork. Cowork visits each URL, extracts checklist data, card numbers, pull rates, box configuration (packs per box, cards per pack), release date, MSRP, and formats everything into spreadsheet rows that match the database schema exactly. Output is one Excel file with one tab per schema table: `box_sets`, `cards`, `pull_rates`. Rules for this step:
- `current_value` and `image_url` columns are always left blank — filled later by eBay API
- `circulation_status` defaults to `unknown` for any card with `print_run ≤ 10`
- Each format (Hobby, Jumbo, Blaster, Mega, Retail) is a separate row in `box_sets`, linked by a shared slug prefix
- Pull rates differ per format — Hobby odds ≠ Blaster odds — each format gets its own rows in `pull_rates`
- Any data not found across all sources gets a "needs review" flag in a dedicated column — it does not block the row from being included
- Cowork pages with inconsistent formatting (pull rates buried in paragraph text vs. clean tables) may need a human review pass on flagged rows

**Step 3 — Link tables using slugs (Claude Code script)**
Each `box_sets` row uses a slug as its linking key (e.g. `2024-topps-chrome-baseball-hobby`). The `cards` and `pull_rates` tabs reference this slug rather than a numeric ID. Before import, run a small Claude Code-written script that looks up each slug in Supabase, retrieves its auto-assigned ID, and fills in the `box_set_id` column on `cards` and `pull_rates`. This is the slug-as-bridge approach — cleaner than manually assigning IDs and prevents collision errors on re-import. Claude Code writes this script when the database phase begins — it is not written in advance.

**Step 4 — Import to Supabase**
Export each spreadsheet tab as a CSV file. Import into Supabase using the table editor's CSV import button — no raw SQL required. Import in dependency order: `box_sets` first, then `cards` and `pull_rates` (both reference `box_set_id` and require box_sets rows to exist first). One CSV per table, not one combined file.

**Step 5 — eBay API fills pricing**
After import, the eBay API proof of concept script prices out individual cards by name. The full pipeline automates this at scale with scheduled refresh. `current_value` on `cards` and `current_market_price` on `box_sets` populate automatically. EV and ROI calculate from those values. Do not begin full seeding until the end-to-end pipeline test with 2024 Topps Chrome Baseball passes completely.

### Data Entry Maintenance
- During beta: 5-10 hours/week (Zach only)
- Post-automation: 2-3 hours/week monitoring
- At scale: Part-time data contractor (~$15-25/hr, ~10hrs/week)

### Additional Data Entry Rules
- **Card pricing — never manual:** Do not look up eBay sold listings card by card. Not viable at any scale. Pricing comes exclusively from the eBay API.
- **Pull rates — scraper first, hybrid fallback:** Primary approach is a Claude Code-written scraper targeting Cardboard Connection (and Chasing Majors for format-level odds). If the scraper hits walls or produces messy output, fall back to the hybrid method: paste raw published odds into Claude, Claude structures it to match the pull_rates schema, output to spreadsheet, bulk import. Do not manually organize pull rate tables.
- **Test before full seed:** Before seeding all sports, run a complete end-to-end pipeline test with one box set (2024 Topps Chrome Baseball — already in schema as example data). Confirm EV, ROI, checklist, format switcher, and charts all work with real data. Only proceed to full seed once this passes.
- **Data accuracy pre-beta:** Accurate numbers do not matter until the eBay API is live. Only Zach and Cam see the app during this phase. Focus on pipeline correctness, not data completeness.
- **Admin panel:** Form-based interface so data entry never requires raw SQL after initial seeding.
- **Post-automation:** Data engineer hire on Upwork ($15-25/hr, ~10hrs/week) once revenue justifies it. Until then, the pipeline must be founder-operable.

---

## Card Categories

The following categories are used in the database. "Case hit" is a boolean flag on individual cards, not a separate category.

1. Base
2. Base Rookie
3. Short Print
4. Insert
5. Refractor
6. Rookie Refractor
7. Numbered Refractor
8. Numbered Rookie Refractor
9. Base Auto
10. Refractor Auto
11. Numbered Autograph
12. Patch Auto
13. Numbered Patch Auto
14. Memorabilia / Relic
15. Superfractor

Tier system:
- Tier 1: Base, Base Rookie
- Tier 2: Short Print, Insert
- Tier 3: Refractor, Rookie Refractor, Numbered Refractor, Numbered Rookie Refractor
- Tier 4: Base Auto, Refractor Auto, Numbered Autograph
- Tier 5: Patch Auto, Numbered Patch Auto, Memorabilia / Relic, Superfractor

---

## Tech Stack

- **Frontend:** React, deployed on Vercel (live URL: dir-app-weld.vercel.app until custom domain is purchased)
- **Backend:** Python or Node.js, deployed on Railway or Render (free tier to start)
- **Database:** Supabase (managed PostgreSQL — scales from free tier to enterprise, see SCALING-REFERENCE.md). Free tier active now; upgrade to Supabase Pro ($25/mo, 8GB storage) planned for when full eBay API pipeline and data seeding begins.
- **Auth:** Supabase Auth (handles sign up, sign in, sessions, password reset, email verification). Supabase Auth manages passwords in its own `auth.users` table. Our `users` table becomes a profile table (display_name, plan, email_opt_in) linked by Supabase user ID. No passwords are stored in our `users` table. **Current state:** Supabase client configured at `src/api/supabaseClient.js`. Sign Up, Sign In, and CheckEmailPage all wired and tested locally. Auth context, protected routes, sign out, and password reset are still in progress. Google OAuth on Sign Up and Sign In is placeholder only — deferred. Email verification is temporarily OFF during development (see below).
- **Email delivery:** Supabase default SMTP is DEV-TIER ONLY (2 emails/hour, hit during testing). Custom SMTP via Resend is a hard beta requirement and is tracked in PRE-BETA-CHECKLIST.md. Requires owning a domain (blocked on name lock). Until custom SMTP is configured, email verification is turned OFF in Supabase so development and beta testing are not blocked.
- **Auth emails:** Default Supabase template in use during development. Pre-launch: customize template with branded design in Supabase dashboard, then configure custom SMTP via Resend so auth emails come from a branded sender address on the final domain.
- **Payments:** Stripe (web only — all subscription management and billing handled on the final domain). No Stripe integration during beta.
- **AI Vision:** Claude API (photo → structured JSON → box match)
- **AI Summaries:** Claude API (price data → plain English trend summary) — post-launch feature
- **Data pipeline:** Cowork (source document generation + spreadsheet structuring), Claude Code (slug-bridge import script, pull rate scraper, eBay API integration)

---

## Business Context

- **Working name:** DIR (Diamond in the Rough) — NOT YET LOCKED. Name may change before beta. dirapp.com is in a $3,600 premium tier. Development continues name-agnostic.
- **Founders:** Zach Seabolt (technical, 50%) and Cam Gibson (business, 50%)
- **Partnership agreement:** Drafted and ready for signatures
- **Strategy:** Leaning build-to-run (long-term operation). Not finalized but mindset has shifted from original build-to-sell framing.
- **Potential acquirers (if strategy changes):** Fanatics, Topps, Panini
- **Revenue model — LOCKED:** Fully paid box profiles. Free browsing on web only (homepage, browse, search, filtering). Paywall on box profile page (checklist, pull rates, EV, ROI, price trends). Conversion funnel: visit → browse → click box → paywall → pay. All payment via Stripe on the web. iOS app is auth-only — no in-app purchases ever.
- **Beta access model — LOCKED:** Auth required from day one. All beta signups get `plan = 'beta'` with full premium access. No Stripe during beta. Paywall accepts `'beta'` OR `'paid'`. See Beta Access Model section above.
- **Price range if subscription:** $4.99-$9.99/mo range
- **Buy Now / affiliate system:** Price comparison with multiple distributors on box profile pages. Starts with 1-2 distributors, grows over time. Boxes without distributor listings fall back to "Find on eBay" affiliate link. Every box profile has a monetization path. System built but launches empty — populated when Cam has distributor partnerships (during beta). New database tables needed: `distributors` and `distributor_listings`.
- **eBay Partner Network:** Free to join, 1-4% commission (collectibles 3-4%), 24-hour cookie. Sign up when real data is live. Don't apply with dummy data.
- **Distributor outreach:** No conversations until app is ready for launch or in beta. Cam handles all distributor relationships.
- **Email list:** All user emails are owned and stored in the database. Sign-up form includes email opt-in checkbox (`email_opt_in` boolean on users table). A verified, opt-in email list of active sports card collectors is a valuable asset for marketing and for acquisition value. Captured from day one during beta. (Note: email opt-in is UNCHECKED by default on the signup form — user must actively opt in.)
- **Domain:** Not yet owned. Blocked on name lock. Once final name is chosen, buy immediately — domain squatting risk on promising product names.
- **Legal structure:** LLC deferred until demand is validated
- **Competitive advantage:** First and only box-level analytics tool for sports cards. Waxstat does box price comparison but NOT analytics/EV/ROI.
- **Distribution:** Starts with local card stores. Cam has direct access to the target audience through hobby network. Scales from local to broader during/after beta.
- **Budget:** $5k max for professional code audits. No data engineer until revenue or investors.
- **Timeline:** No hard launch date. Working diligently but not rushing. No corners cut.

---

## Scaling Principles

Scale is a first-class design concern, not an afterthought. Cam's distribution network has millions of engagement impressions — a successful launch could produce thousands of users in an hour. Every feature and every third-party service must hold up under that.

**Process rules:**

1. **Every new feature gets a scale-stress walkthrough** as part of its audit. Mandatory question: "What happens at 100 concurrent users? 10,000? 100,000? Where does this specific feature break, and at what scale?"
2. **Every new third-party service gets a pre-integration scale-check.** Rate limits, pricing tiers, upgrade paths. Documented in SCALING-REFERENCE.md before the service is added to the stack, not after.
3. **A full scale audit session happens after the auth phase closes.** Every feature, every third-party service, every database table evaluated at the 100/1k/10k/100k user ceilings. Findings flow into SCALING-REFERENCE.md as a living document and into PRE-BETA-CHECKLIST.md as blocking items.
4. **Testing at scale before launch.** Burst tests simulating realistic flash crowds on signup, signin, box profile loads, and search. If it can't handle 100 concurrent users, it can't handle a real launch.

---

## iOS App — Hard Architectural Requirements

The iOS app is authentication only. There is no free tier, no in-app signup flow, and no in-app purchase system. All user acquisition and payment happens exclusively on the web at the final domain through Stripe.

The app opens to a login screen with a single line directing users without credentials to the website. Once authenticated, users have full premium access. Without credentials the app has no usable functionality.

This is an intentional architectural decision to avoid Apple's in-app purchase requirements and their associated revenue cut. It is not to be changed without a deliberate architectural review.

The only free-facing feature in the entire product is the ability to browse card boxes by year — this exists on the web only, not in the app.

During beta, the iOS app works the same way: beta users sign up on the web, then sign in on iOS with the same credentials. The iOS app does not distinguish between `plan = 'beta'` and `plan = 'paid'` — both get full access.

**Do not build any of the following into the iOS app:**
- Signup or account creation flow
- Subscription selection or pricing screen
- In-app purchase or payment processing
- Free browse mode or unauthenticated content

---

## Sport Expansion Roadmap

Beta & Launch: Baseball, Football, Basketball, Hockey, Soccer (all populated with data)
Phase 2: UFC, F1
Phase 3 (if ever): Entertainment/TCG (Disney, Marvel, Pokemon, Magic, Yu-Gi-Oh, etc.)

The database schema supports all sports from day one. The UI supports all sports from day one. Adding a new sport is a data entry task, not a rebuild.

---

## Pre-Launch Polish (before public launch)

**All deferred loose ends are tracked in `PRE-BETA-CHECKLIST.md`.** Walk that file end-to-end before flipping the switch on beta. Key areas include:

1. **Name & Domain** — lock the final name, buy the domain, update all references
2. **Email infrastructure** — decide email verification policy, set up custom SMTP via Resend (required), customize branded email templates
3. **Auth flow polish** — decide on Google OAuth, improve post-login redirect, build password reset flow
4. **Database schema amendments** — apply all pending changes documented in the checklist
5. **Data seeding** — end-to-end test with one box set, then full seed
6. **eBay integration** — proof of concept, Partner Network signup, full pipeline
7. **Infrastructure scaling** — Supabase Pro upgrade, scale audit session
8. **Pro code audits** — three scheduled audits against $5k budget

---

## Future Features (Post-MVP Roadmap)

In rough priority order:
1. Stripe integration (post-beta)
2. User accounts with saved/watchlisted boxes
3. Personal collection tracker and wishlist
4. Price alerts and notifications
5. Coming Soon / upcoming releases section with countdown timers
6. Plain English AI trend summaries
7. Light/dark mode toggle in user settings
8. Portfolio value tracking over time (graph your collection's total value)
9. "Cards I need" auto-generated from checklist minus owned cards
10. Community / social features
11. Legacy Boxes marketplace tab (filtered list of pre-2018 boxes for sale through affiliate partners — only if validated and distributor partnerships exist)
12. Marketplace exploration (StockX-style for cards — year two at earliest)
13. AI price predictions (only if historical data is deep enough to be credible)

---

## Design Direction

- **Aesthetic:** Clean and minimal, inspired by StockX
- **Color scheme:** Dark mode — background #111214, accent #7c6fff (purple), positive financial indicators #16a34a (green), error states use `--color-red` / `--color-red-bg` / `--color-red-border` (red tint). All colors are CSS variables in index.css. May evolve post-beta based on user feedback — CSS variables make this a one-file change.
- **Logo:** TBD — depends on final name lock
- **UI approach:** Layered complexity — casual users see top-level info (top chases, ROI score), serious investors can drill into full data (checklist, price history, pull rate math)
- **Browse experience:** Dedicated browse page at `/browse` with StockX-style layout — filter sidebar on the left (Sport → Manufacturer → Year → Format), results grid on the right. Filters use URL query parameters so every combination is shareable. Header nav links route to the browse page with filters pre-applied.
- **Routing:** React Router. All routes: `/` (home), `/browse` (browse/filter), `/box/:slug` (box profile), `/about`, `/news`, `/contact`, `/help`, `/signin`, `/signup`, `/check-email`.

---

## Codebase Organization Rules — ENFORCE FROM DAY ONE

**Core principle: Build this like a professional developer would.** Zach is building the full product with Claude. The codebase should be clean enough that Zach can maintain and extend it indefinitely — and if a professional developer ever joins (as a hire, contractor, or through an acquisition), they should be able to open the repo, understand the structure in 10 minutes, and build on top of it without ripping anything apart. Think of it like handing a mix session to another engineer: labeled tracks, clean routing, no mystery buses. The bar is professional-grade code, not "good enough for now."

1. **Name everything descriptively** — BoxProfilePage.jsx not Page2.jsx
2. **Established folder structure:**
   - /components — reusable UI pieces
   - /pages — full page views
   - /hooks — data fetching logic
   - /utils — helper functions (calculations, formatting)
   - /api — backend communication (Supabase client lives here)
3. **Start every Claude session by loading project context** (handled by Project pinned files)
4. **One job per file** — components render UI, hooks fetch data, utils calculate/format
5. **Maintain this project-brief.md** — update it as decisions are made
6. **Maintain PRE-BETA-CHECKLIST.md** — add items the moment something is deferred, do not rely on memory
7. **Ask Claude to audit and refactor periodically** — every handful of features
8. **Commit to GitHub frequently** with descriptive commit messages
9. **Step by step guidance required** — Zach is not a developer, explain everything from first principles
10. **No hacky workarounds** — if something needs a shortcut to work, flag it and find the right solution. A future developer shouldn't have to untangle clever hacks.
11. **Comment non-obvious code** — if a piece of logic isn't self-explanatory, add a brief comment explaining what it does and why
12. **Keep dependencies minimal** — don't install packages for things that can be done simply. Every dependency is something a future dev has to understand and maintain.
13. **Use CSS variables for ALL colors** — no hardcoded hex values in any component or CSS file. All color values live in index.css only.
14. **Never commit secrets** — API keys, database passwords, Supabase service keys, Stripe keys all go in `.env.local` (local dev) and Vercel environment variables (production). `.env.local` must be in `.gitignore`. No exceptions.
15. **Every new feature gets a scale-stress walkthrough** in its audit — what breaks at 100, 10k, 100k users? Document findings in SCALING-REFERENCE.md and add risk items to PRE-BETA-CHECKLIST.md.

---

## About the Builder

Zach Seabolt is a mix engineer based in Tennessee with no formal coding or development background. He builds software products through iterative conversations with Claude. He needs step-by-step guidance on everything technical, including GitHub workflow, terminal commands, deployment, and debugging. Never assume prior knowledge. Always explain what a command does before asking him to run it.

---

## Development Environment

- **Machine:** Mac M1 Pro (macOS Sonoma)
- **Node.js:** v24.14.1
- **Git:** v2.39.5 (Apple Git)
- **Homebrew:** v5.1.3
- **GitHub CLI (gh):** v2.89.0, authenticated
- **GitHub repo:** github.com/Anthem-Media/dir-app
- **Frontend tooling:** Vite v8.0.3 + React
- **Project location on disk:** ~/Desktop/dir-app
- **Live Vercel URL:** dir-app-weld.vercel.app (temporary — will move to final domain once purchased)
- **Claude tools:** Claude Pro subscription, Claude Code (Sonnet for UI/mechanical tasks, Opus for auth/database/backend), Cowork

### Project Folder Structure (established)
```
dir-app/
├── src/
│   ├── components/    # Reusable UI pieces (buttons, cards, charts, nav)
│   ├── pages/         # Full page views (BoxProfilePage, SignInPage, SignUpPage, CheckEmailPage, etc.)
│   ├── hooks/         # Data fetching logic
│   ├── utils/         # Helper functions (calculations, formatting)
│   ├── api/           # Backend communication (Supabase client: supabaseClient.js)
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.local         # Local-only, gitignored, holds Supabase keys
├── package.json
├── vite.config.js
└── index.html
```

### Git Workflow
Three commands to save and push changes:
1. `git add .` — stage all changes
2. `git commit -m "description of what changed"` — save snapshot locally
3. `git push` — upload to GitHub

### Current Status
- UI polish pass complete across all pages
- Auth phase in progress (roadmap item #7):
  - Supabase project, env vars, `supabaseClient.js`, and Supabase client library all set up
  - Sign Up wired and tested; Sign In wired and tested locally; CheckEmailPage built with resend flow
  - Email verification temporarily OFF in Supabase (blocked on custom SMTP / domain purchase)
  - Next: commit pending changes, build auth context, protected routes, sign out
- Dark mode color scheme implemented and deployed
- All colors are CSS variables — no hardcoded hex in codebase (except Recharts chart constants, documented in-file)
- See CONTEXT.md for full task list and PRE-BETA-CHECKLIST.md for every deferred item

---

## Database Schema

See pinned file: `dir_database_schema.sql`

The schema is complete with 13 tables, indexes, views, seed data, and example data. Do not rebuild from scratch — modify the existing schema.

**All pending schema amendments are tracked in `PRE-BETA-CHECKLIST.md` section #4.** Do not apply piecemeal — handle all together when the database phase begins.
