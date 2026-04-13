# DIR (Diamond in the Rough) — Claude Code Context

## What This Is

A sports card box analytics web app. Users look up any box set and see the full checklist, card values, pull rates, expected value, ROI, and market trends. Built around the box, not individual cards. No other tool does this.

## Key Files

- `project-brief.md` — Full project brief (read this for detailed context on features, data strategy, business context)
- `CONTEXT.md` — Current status, what's done, what's next
- `REFERENCES.md` — Design and competitor references
- `SCALING-REFERENCE.md` — Infrastructure scaling roadmap
- `dir_database_schema.sql` — PostgreSQL schema with 13 tables, views, seed data

## Tech Stack

- Frontend: React + Vite, deployed on Vercel
- Backend: TBD (Python or Node.js), deployed on Railway or Render
- Database: Supabase (managed PostgreSQL)
- Auth: Supabase Auth (planned)
- AI: Claude API for photo scan (box identification) and trend summaries (post-launch)

## Folder Structure

```
src/
├── components/    # Reusable UI pieces (buttons, cards, charts, nav)
├── pages/         # Full page views (BoxProfilePage, SearchPage, etc.)
├── hooks/         # Data fetching logic
├── utils/         # Helper functions (calculations, formatting)
├── api/           # Backend communication
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

## About the Developer

Zach Seabolt has no formal coding background. He builds through iterative conversations with Claude. Always explain what code does and why. Never assume prior knowledge. Explain terminal commands before asking him to run them.

## Git Workflow

```
git add .
git commit -m "description of what changed"
git push
```

## Revenue Model

Fully paid box profiles. Free browsing experience (homepage, browse page, search, filtering, scrolling through box sets). Paywall triggers when user clicks into a box profile page. Auth system must enforce this gating.

## Data Coverage

- **Full profiles (2018-present):** Checklist, card-level pricing, pull rates, EV, ROI, top chases, market trends.
- **Legacy profiles (1995-2017):** Checklist, card-level pricing, top chases, pull rates where available. NO EV or ROI. Box profile page must gracefully handle missing EV/ROI sections for legacy boxes (hide or show "not available" message).
- **Sports at launch:** Baseball, Football, Basketball, Hockey, Soccer.

## Routing Architecture

React Router handles all navigation. Routes defined in App.jsx:
- `/` — Homepage
- `/browse` — Browse page (filter sidebar + results grid)
- `/box/:slug` — Box profile page (slug from box_sets table)
- `/about`, `/news`, `/contact`, `/help`, `/signin`, `/signup` — Landing pages

Browse page filter system:
- Dedicated page at `/browse` with StockX-style layout
- Left sidebar: filter sections in order — Sport → Manufacturer → Year → Format
- Right side: results grid of BoxSetCard components, each links to `/box/:slug`
- Filters passed as URL query parameters: `/browse?sport=baseball&manufacturer=topps&year=2024&format=hobby`
- Header nav links route to `/browse` with query params (e.g. clicking "Baseball" → `/browse?sport=baseball`)
- Filters are data-driven (from database), not hardcoded
- Cascading logic: selecting a filter narrows downstream filter options (no dead-end combinations)

Key files for routing/filtering:
- `src/pages/BrowsePage.jsx` — Browse page with sidebar + results grid
- `src/components/FilterSidebar.jsx` — Filter panel component
- `src/components/BoxSetCard.jsx` — Card thumbnail for results grid

## Schema Notes

Current schema has 13 tables and 2 views. Two new tables needed (add during database phases):
- `distributors` — distributor name, website, logo, affiliate URL pattern
- `distributor_listings` — which distributor has which box, at what price, with what affiliate link

Buy Now system: price comparison with multiple distributors. Fallback to "Find on eBay" affiliate link when no distributor carries a box.

## Current Status

- Homepage template built with dummy data
- BoxProfilePage built with all sections (hero, top chases, pull rates, price trend, checklist)
- Header with cascading navigation system built
- Codebase audited — CSS variables centralized, calculations moved to utils
- Routing and filtering system built and audited
- All landing pages built (About, News, Help, Contact, Sign In, Sign Up)
- Sign Up button added to header nav next to Sign In
- Deployed to Vercel (live URL available)
- Next: Complete UI audit (desktop), UI polish pass one page at a time, then auth system
- Color scheme changing — not using anything competitors use
- Soccer needs to be added to UI navigation
- See CONTEXT.md for full task list and detailed status
