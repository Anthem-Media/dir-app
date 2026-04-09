# DIR (Diamond in the Rough) — Project Brief

**Working Name:** DIR (Diamond in the Rough)
**Tagline:** "Think inside the box."
**Last Updated:** April 9, 2026

---

## What We're Building

A web app that provides box-level analytics for sports card collectors and investors. Users can look up any box set and see the full checklist, card values, pull rates, expected value, ROI probability, and market trends — answering the core question: "What is the best box for me to buy for my budget and my goals?"

No other tool does this. Existing apps (Market Movers, Card Ladder, CollX) are built around individual cards. DIR is built around the box.

---

## Who It's For

- Age 13+ (minimum age for account creation)
- Casual collectors through serious investors
- People who currently rely on card shop employees, manufacturer marketing, or gut instinct to decide what box to buy
- Baseball collectors first, expanding to other sports and categories later

---

## MVP Feature Set (Priority Order)

### Priority 5 — Core (must have for beta)
- Box profile page with full checklist, pull rates, EV calculator, ROI score
- Card value rankings within a set by tier
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

### Priority 1 — Future
- Community/social features (comments, forums, card showcase)
- Claude API generated plain English trend summaries

---

## Hard No List for V1

- Marketplace / buying functionality (year two exploration at earliest)
- Community features / forums / comments
- User-submitted pull rate data (permanent kill — data integrity risk)
- AI price predictions / future valuations
- Entertainment / TCG categories (Pokemon, Magic, Yu-Gi-Oh, Disney, etc.)
- Box break data aggregation from external sources

---

## Data Strategy

### Data Sources
- **Card checklists:** Cardboard Connection and Sports Cards Pro (sportscardspro.com) as references, manual data entry into own database. Sports Cards Pro is especially useful for historical sets and complete card-level data (which cards are in which set, card numbers, player names). Do not scrape verbatim — build own dataset from factual information.
- **Card pricing:** eBay sold listings (primary source). eBay API for programmatic access.
- **Pull rates:** Manufacturer-published odds from packaging and official sites (Topps, Panini, Upper Deck).
- **Box pricing:** eBay sold listings for sealed box market prices.
- **Images:** Box set images (required) and individual card images (required) — source from manufacturer promo materials and official sites. Legal considerations around card image usage TBD — document but don't block development on this.

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
- Beta launch: Manually seed 100-200 of the most popular current baseball box sets (last 2-3 years)
- 40-60 new baseball box set products per year from Topps and Panini
- Each set has multiple formats (Hobby, Jumbo, Blaster, Mega, Retail) — each is a separate database entry

### Data Entry
- Build an admin panel (form-based interface) so data entry never requires raw SQL
- Semi-manual process for beta: reference Cardboard Connection, enter data through admin forms
- Automated pipeline is a post-validation hire (data engineer on Upwork)
- Claude can build ~70-75% of the pipeline; remaining 25-30% needs a specialist

### Data Entry Maintenance
- During beta: 5-10 hours/week between partners
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
- **AI Vision:** Claude API (photo → structured JSON → box match)
- **AI Summaries:** Claude API (price data → plain English trend summary) — post-launch feature

---

## Business Context

- **Working name:** DIR (Diamond in the Rough)
- **Founders:** Zach Seabolt (technical, 50%) and Cam Gibson (business, 50%)
- **Partnership agreement:** Drafted and ready for signatures
- **Strategy:** Build-to-sell OR long-term operation — TBD based on traction
- **Potential acquirers:** Fanatics, Topps, Panini
- **Revenue model:** TBD — likely free with ads or freemium with pro tier. Free vs. paid decision MUST be made before auth system is built.
- **Price range if subscription:** $4.99-$9.99/mo range
- **Affiliate opportunity:** eBay partner network (implement from day one — free revenue). Distributor partnerships with Buy Now button on box profile pages. Out-of-print boxes fall back to "Find on eBay" affiliate link. Schema changes needed to support distributor links — TBD pending Cam's distributor conversations.
- **Email list:** All user emails are owned and stored in the database. Sign-up form includes email opt-in checkbox. A verified, opt-in email list of active sports card collectors is a valuable asset for marketing and for acquisition value.
- **Legal structure:** LLC deferred until demand is validated
- **Competitive advantage:** First and only box-level analytics tool for sports cards
- **Distribution:** Cam has direct access to the target audience through hobby network
- **Target timeline:** Fully functional app within 6 months, launch/acquisition decision at 1 year

---

## Sport Expansion Roadmap

Beta: Baseball data only (building the formula and automation pipeline)
Launch: Baseball, Football, Basketball, Hockey
Phase 2: UFC, Soccer, F1
Phase 3 (if ever): Entertainment/TCG (Disney, Marvel, Pokemon, Magic, Yu-Gi-Oh, etc.)

The database schema supports all sports from day one. The UI supports all sports from day one. Adding a new sport is a data entry task, not a rebuild.

---

## Future Features (Post-MVP Roadmap)

In rough priority order:
1. User accounts with saved/watchlisted boxes
2. Personal collection tracker and wishlist
3. Price alerts and notifications
4. Plain English AI trend summaries
5. Portfolio value tracking over time (graph your collection's total value)
6. "Cards I need" auto-generated from checklist minus owned cards
7. Community / social features
8. Marketplace exploration (StockX-style for cards — year two at earliest)
9. AI price predictions (only if historical data is deep enough to be credible)

---

## Design Direction

- **Aesthetic:** Clean and minimal, inspired by StockX
- **Color scheme (working):** White and green (easily changeable — CSS variables)
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
- **Claude tools:** Claude Pro subscription, Claude Code, Cowork

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
- Homepage template built with dummy data
- BoxProfilePage built with all sections (hero, top chases, pull rates, price trend, checklist)
- Header with cascading navigation system built
- Codebase audited and cleaned (CSS variables centralized, calculations moved to utils)
- Routing and filtering system built and audited (React Router, BrowsePage, FilterSidebar, BoxSetCard)
- All landing pages built (About, News, Help, Contact, Sign In, Sign Up) with dummy content
- Sign Up button added to header nav next to Sign In
- Deployed to Vercel (live URL available)
- Next: UI audit with Cam, UI polish pass, code audit of new pages, then auth system
- See CONTEXT.md for full task list and detailed progress tracking

---

## Database Schema

See pinned file: `dir_database_schema.sql`

The schema is complete with 13 tables, indexes, views, seed data, and example data. Do not rebuild from scratch — modify the existing schema.
