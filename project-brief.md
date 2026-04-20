# DIR (Diamond in the Rough) — Project Brief

**Working Name:** DIR (Diamond in the Rough)
**Tagline:** "Think inside the box."
**Last Updated:** April 20, 2026

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

---

## Data Strategy

### Data Coverage
- **Full profiles (2018-present):** Checklist, card-level pricing, pull rates, EV, ROI, top chases, grails, market trends. This is the core product.
- **Legacy profiles (1995-2017):** Checklist, card-level pricing, top chases, grails, pull rates where available. NO EV or ROI — the math doesn't apply to older product. Box profile page hides or gracefully handles missing EV/ROI sections for legacy boxes.

### Data Sources
- **Card checklists:** Varies by sport (see Data Entry Sources below). Manual data entry into own database using AI-assisted workflow. Do not scrape verbatim — build own dataset from factual information.
- **Card pricing:** eBay sold listings (primary source). eBay API for programmatic access. Card-level pricing is required for every card — not just top chases.
- **Pull rates:** Manufacturer-published odds from packaging and official sites (Topps, Panini, Upper Deck). Cross-reference Beckett, Cardboard Connection, Chasing Majors, and Checklist Insider. TCDB does not publish pull rates. Chasing Majors and Checklist Insider provide format-level odds (Hobby vs Jumbo vs Blaster etc.) — required for the format switcher feature.
- **Box pricing:** eBay sold listings for sealed box market prices.
- **Images:** Don't let images block data entry. Enter data first, leave image_url blank. Primary image source is distributor product feeds (Dave & Adam's, Blowout Cards, Steel City, etc.) — clean, standardized, high-res box art pulled automatically as a byproduct of price scraping, same method Waxstat uses for their 27k+ box library. eBay API (Phase 13) is the fallback for boxes no distributor carries. Manufacturer sites are a tertiary source. Placeholder images acceptable for beta. Images are never manually sourced.

### Data Entry Sources by Sport
- **Baseball:** Beckett, Cardboard Connection, Topps, Baseballcardpedia
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

### Refresh Cadence
- Beta: Weekly refresh is acceptable
- Post-beta: Daily refresh target
- Long-term: Real-time or near-real-time (engineering hire needed)

### Scale
- Beta launch: All five sports (Baseball, Football, Basketball, Hockey, Soccer) populated with full profiles for 2018-present, legacy profiles for 1995-2017
- Estimated box count for full profiles (2018-present): ~1,200-2,000 boxes across all sports
- 40-60 new box set products per year per sport from major manufacturers
- Each set has multiple formats (Hobby, Jumbo, Blaster, Mega, Retail) — each is a separate database entry linked by `parent_set_id`

### Data Entry Workflow
- **Who:** Zach handles all data entry during beta. No data engineer hire until revenue or investors.
- **Pipeline:** AI-assisted workflow — paste raw data from sources (TCDB, Cardboard Connection, Beckett, etc.) into Claude or Cowork for structuring. Output to spreadsheets matching database schema. Bulk import when database is live.
- **Spreadsheet templates:** Draft templates created for box_sets, cards (checklist), and pull_rates. Will be finalized when real box data is used to cross-reference against the database schema.
- **Cowork pipeline:** Test with one box set first before committing to full data pull. Set up repeatable workflow: drop raw data into folder → Cowork processes into structured spreadsheet → output to designated folder.
- **Target speed:** 100+ boxes per day once pipeline is dialed in.
- **Admin panel:** Form-based interface (Phase 11) so data entry never requires raw SQL after initial seeding.
- **Post-automation:** Data engineer hire on Upwork ($15-25/hr, ~10hrs/week) once revenue justifies it. Until then, eBay API pipeline needs to be founder-operable.

### Data Entry Maintenance
- During beta: 5-10 hours/week (Zach only)
- Post-automation: 2-3 hours/week monitoring
- At scale: Part-time data contractor (~$15-25/hr, ~10hrs/week)

---

## Card Categories (Updated)

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

- **Frontend:** React, deployed on Vercel (shareable beta URL from day one)
- **Backend:** Python or Node.js, deployed on Railway or Render (free tier to start)
- **Database:** Supabase (managed PostgreSQL — scales from free tier to enterprise, see SCALING-REFERENCE.md)
- **Auth:** Supabase Auth (handles sign up, sign in, sessions, password reset)
- **Payments:** Stripe (web only — all subscription management and billing handled on DIRapp.com)
- **AI Vision:** Claude API (photo → structured JSON → box match)
- **AI Summaries:** Claude API (price data → plain English trend summary) — post-launch feature

---

## Business Context

- **Working name:** DIR (Diamond in the Rough)
- **Founders:** Zach Seabolt (technical, 50%) and Cam Gibson (business, 50%)
- **Partnership agreement:** Drafted and ready for signatures
- **Strategy:** Leaning build-to-run (long-term operation). Not finalized but mindset has shifted from original build-to-sell framing.
- **Potential acquirers (if strategy changes):** Fanatics, Topps, Panini
- **Revenue model — LOCKED:** Fully paid box profiles. Free browsing on web only (homepage, browse, search, filtering). Paywall on box profile page (checklist, pull rates, EV, ROI, price trends). Conversion funnel: visit → browse → click box → paywall → pay. All payment via Stripe on the web. iOS app is auth-only — no in-app purchases ever.
- **Price range if subscription:** $4.99-$9.99/mo range
- **Buy Now / affiliate system:** Price comparison with multiple distributors on box profile pages. Starts with 1-2 distributors, grows over time. Boxes without distributor listings fall back to "Find on eBay" affiliate link. Every box profile has a monetization path. System built but launches empty — populated when Cam has distributor partnerships (during beta). New database tables needed: `distributors` and `distributor_listings`.
- **eBay Partner Network:** Free to join, 1-4% commission (collectibles 3-4%), 24-hour cookie. Sign up when real data is live (Phase 10-12). Don't apply with dummy data.
- **Distributor outreach:** No conversations until app is ready for launch or in beta. Cam handles all distributor relationships.
- **Email list:** All user emails are owned and stored in the database. Sign-up form includes email opt-in checkbox. A verified, opt-in email list of active sports card collectors is a valuable asset for marketing and for acquisition value.
- **Legal structure:** LLC deferred until demand is validated
- **Competitive advantage:** First and only box-level analytics tool for sports cards. Waxstat does box price comparison but NOT analytics/EV/ROI.
- **Distribution:** Starts with local card stores. Cam has direct access to the target audience through hobby network. Scales from local to broader during/after beta.
- **Budget:** $5k max for professional code audits. No data engineer until revenue or investors.
- **Timeline:** No hard launch date. Working diligently but not rushing. No corners cut.

---

## iOS App — Hard Architectural Requirements

The DIR iOS app is authentication only. There is no free tier, no in-app signup flow, and no in-app purchase system. All user acquisition and payment happens exclusively on the web at DIRapp.com through Stripe.

The app opens to a login screen with a single line directing users without credentials to the website. Once authenticated, users have full premium access. Without credentials the app has no usable functionality.

This is an intentional architectural decision to avoid Apple's in-app purchase requirements and their associated revenue cut. It is not to be changed without a deliberate architectural review.

The only free-facing feature in the entire product is the ability to browse card boxes by year — this exists on the web only, not in the app.

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

## Future Features (Post-MVP Roadmap)

In rough priority order:
1. User accounts with saved/watchlisted boxes
2. Personal collection tracker and wishlist
3. Price alerts and notifications
4. Coming Soon / upcoming releases section with countdown timers
5. Plain English AI trend summaries
6. Light/dark mode toggle in user settings
7. Portfolio value tracking over time (graph your collection's total value)
8. "Cards I need" auto-generated from checklist minus owned cards
9. Community / social features
10. Legacy Boxes marketplace tab (filtered list of pre-2018 boxes for sale through affiliate partners — only if validated and distributor partnerships exist)
11. Marketplace exploration (StockX-style for cards — year two at earliest)
12. AI price predictions (only if historical data is deep enough to be credible)

---

## Design Direction

- **Aesthetic:** Clean and minimal, inspired by StockX
- **Color scheme:** Dark mode — background #111214, accent #7c6fff (purple), positive financial indicators #16a34a (green). All colors are CSS variables in index.css. May evolve post-beta based on user feedback — CSS variables make this a one-file change.
- **Logo:** TBD — will be designed
- **UI approach:** Layered complexity — casual users see top-level info (top chases, ROI score), serious investors can drill into full data (checklist, price history, pull rate math)
- **Browse experience:** Dedicated browse page at `/browse` with StockX-style layout — filter sidebar on the left (Sport → Manufacturer → Year → Format), results grid on the right. Filters use URL query parameters so every combination is shareable. Header nav links route to the browse page with filters pre-applied.
- **Routing:** React Router. All routes: `/` (home), `/browse` (browse/filter), `/box/:slug` (box profile), `/about`, `/news`, `/contact`, `/help`, `/signin`, `/signup`.

---

## Codebase Organization Rules — ENFORCE FROM DAY ONE

**Core principle: Build this like a professional developer would.** Zach is building the full product with Claude. The codebase should be clean enough that Zach can maintain and extend it indefinitely — and if a professional developer ever joins (as a hire, contractor, or through an acquisition), they should be able to open the repo, understand the structure in 10 minutes, and build on top of it without ripping anything apart. Think of it like handing a mix session to another engineer: labeled tracks, clean routing, no mystery buses. The bar is professional-grade code, not "good enough for now."

1. **Name everything descriptively** — BoxProfilePage.jsx not Page2.jsx
2. **Established folder structure:**
   - /components — reusable UI pieces
   - /pages — full page views
   - /hooks — data fetching logic
   - /utils — helper functions (calculations, formatting)
   - /api — backend communication
3. **Start every Claude session by loading project context** (handled by Project pinned files)
4. **One job per file** — components render UI, hooks fetch data, utils calculate/format
5. **Maintain this project-brief.md** — update it as decisions are made
6. **Ask Claude to audit and refactor periodically** — every handful of features
7. **Commit to GitHub frequently** with descriptive commit messages
8. **Step by step guidance required** — Zach is not a developer, explain everything from first principles
9. **No hacky workarounds** — if something needs a shortcut to work, flag it and find the right solution. A future developer shouldn't have to untangle clever hacks.
10. **Comment non-obvious code** — if a piece of logic isn't self-explanatory, add a brief comment explaining what it does and why
11. **Keep dependencies minimal** — don't install packages for things that can be done simply. Every dependency is something a future dev has to understand and maintain.
12. **Use CSS variables for ALL colors** — no hardcoded hex values in any component or CSS file. All color values live in index.css only.

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
- **Claude tools:** Claude Pro subscription, Claude Code (Sonnet for UI/mechanical tasks, Opus for auth/database/backend), Cowork

### Project Folder Structure (established)
```
dir-app/
├── src/
│   ├── components/    # Reusable UI pieces (buttons, cards, charts, nav)
│   ├── pages/         # Full page views (BoxProfilePage, SearchPage, etc.)
│   ├── hooks/         # Data fetching logic
│   ├── utils/         # Helper functions (calculations, formatting)
│   ├── api/           # Backend communication
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
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
- Dark mode color scheme implemented and deployed
- All colors are CSS variables — no hardcoded hex in codebase
- UI polish pass starting now — new box profile features first, then page-by-page polish
- See CONTEXT.md for full task list and detailed progress tracking

---

## Database Schema

See pinned file: `dir_database_schema.sql`

The schema is complete with 13 tables, indexes, views, seed data, and example data. Do not rebuild from scratch — modify the existing schema.

**Pending schema amendments (apply during database phase):**
- Add `circulation_status VARCHAR(20) DEFAULT 'unknown'` to the `cards` table. Values: `unknown`, `in_circulation`, `pulled_sold`. Powers the Grails tab circulation status badge. Only meaningful for cards with `print_run` ≤ 10.
- Add `parent_set_id INT REFERENCES box_sets(id) NULL` to the `box_sets` table. Groups all formats of the same set together (Hobby, Jumbo, Blaster, Mega, Retail). Powers the format switcher on the box profile page. NULL means no related formats exist.
- Add `distributors` table for the Buy Now affiliate system.
- Add `distributor_listings` table for the Buy Now affiliate system.
