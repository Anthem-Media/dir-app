# Context

## Current State
Homepage and BoxProfilePage templates are built with dummy data. Header includes a cascading navigation system. Codebase has been audited and cleaned — CSS variables centralized, calculations moved to utils. Ready to build routing/filtering system and landing pages.

## What's Been Decided and Locked
- **Scope:** All sports at launch (Baseball, Football, Basketball, Hockey). Baseball data first for beta. No TCG categories.
- **Core value prop:** "When I buy a box, what cards can I get, how much are they worth, and what's the best box for my budget and goals?"
- **Tagline:** "Think inside the box."
- **Data sources:** Manufacturer pull rates + eBay sold listings only.
- **Tech stack:** React + Vite frontend on Vercel, PostgreSQL on Railway, Python or Node.js backend, Claude API for photo scan and trend summary features.
- **Database schema:** 13 tables, 2 views. Complete and finalized — do not rebuild.
- **Business structure:** 50/50 split with Cam Gibson. Zach handles all technical work. Cam handles business development, distribution, and capital.
- **Strategy:** Build-to-sell OR long-term operation — TBD based on traction. Target acquirers: Fanatics, Topps, Panini.
- **Native app:** React Native build needed for pitch demos. Build web app first, port to native once features are solid. PWA as a possible interim step — pending partner discussion.
- **Filtering system:** Filters are data-driven (populated from database), not hardcoded. Changing filter options later is a data task, not a code rebuild. Filter combinations cascade — sport + manufacturer + year + format all work together.
- **Routing:** React Router. All routes defined in App.jsx. Routes: `/` (homepage), `/browse` (browse page with filters), `/box/:slug` (box profile), `/about`, `/news`, `/contact`, `/help`, `/signin`, `/signup`.
- **Browse page architecture:** Dedicated browse page at `/browse` with StockX-style layout. Left sidebar has filter sections (Sport → Manufacturer → Year → Format, in that order). Right side shows results grid of BoxSetCard components. Clicking any card routes to `/box/:slug`.
- **Filter URL structure:** Filters are passed as URL query parameters. Example: `/browse?sport=baseball&manufacturer=topps&year=2024&format=hobby`. Header nav links route to `/browse` with appropriate query params applied. Every filter combination produces a unique, shareable URL.
- **Cascading filter logic:** Selecting a filter narrows the options in downstream filters. Example: selecting "Baseball" limits manufacturers to only those with baseball products. Prevents dead-end filter combinations with zero results.
- **Landing pages:** About, News, Contact, Help, Sign In, FAQ. Dummy content for now. Same color system as main app but with more visual personality — backgrounds, images, less rigid layouts. Elegant but attention-grabbing.
- **Auth:** Supabase Auth (planned). Sign In and Sign Up pages are built as visual templates. Will be wired to Supabase when auth is implemented. Users table in schema includes email, display_name, password_hash, plan columns. Email opt-in checkbox on sign-up form (add `email_opt_in` boolean to users table during auth implementation).
- **Revenue model:** TBD — pending discussion with Cam. Options: fully paid, free with ads, or freemium. Affiliate revenue from distributor partnerships and eBay Partner Network planned from day one. Free vs. paid decision MUST be made before auth is implemented.
- **Affiliate strategy (in progress):** Buy Now button on BoxProfilePage linking to distributor affiliate pages. May support multiple distributors with price comparison. Out-of-print boxes fall back to "Find on eBay" link (also affiliate). Schema changes needed to support distributor links. Details pending Cam's distributor conversations.
- **Data entry strategy:** Admin panel (Phase 11) for form-based data entry. AI-assisted workflow: paste checklist into Claude for structuring, bulk import into database. Launch with manufacturer-published data (checklists, pull rates, MSRP) + eBay pricing for top chase cards. Full variation-level data layers in over time.

## Hard No List (v1)
- Marketplace
- Community features
- User-submitted data
- AI price predictions
- TCG categories

## Existing Deliverables
- project-brief.md — comprehensive project plan
- CLAUDE.md — Claude Code context file (lives in repo root)
- REFERENCES.md — design and competitor references
- SCALING-REFERENCE.md — infrastructure scaling roadmap
- Database schema (13 tables, 2 views)
- Partnership agreement (drafted, ready for signatures)

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
11. ✅ Second codebase audit — navigation fixed (Links instead of fake buttons), dead code removed, CSS consolidated, filter clear bug fixed
12. ✅ Landing pages built (AboutPage, NewsPage, HelpPage, ContactPage, SignInPage, SignUpPage)
13. ✅ Sign Up button added to header nav next to Sign In
14. ✅ Deployed to Vercel (live URL available)

## Full Roadmap
1. ~~Codebase audit~~ ✅
2. ~~Routing and filtering system~~ ✅
3. ~~Landing pages~~ ✅
4. ~~Deploy to Vercel~~ ✅
5. UI audit with Cam
6. UI polish pass + code audit of all new pages (one at a time: About → News → Help → Contact → Sign In → Sign Up → homepage changes)
7. Auth system (Supabase) + free vs. paid decision — MUST decide before building auth
8. Pro audit #1 (senior React dev — is the frontend and auth foundation solid? ~3-5 hours at $50-150/hr = $150-750)
9. Database setup and backend API
10. Connect frontend to real data
11. Admin panel for data entry
12. Seed database with 100-200 popular baseball box sets
13. eBay API integration (card pricing + box pricing)
14. Claude API integration for photo scan feature
15. Buy Now / affiliate link system + schema changes for distributors
16. Price alerts and notifications
17. User features (saved boxes, collection tracker, wishlist)
18. Search functionality
19. Pro audit #2 (full-stack dev or React dev + backend/database dev — is the complete app ready for real users? ~8-15 hours at $50-150/hr = $400-2,250)
20. Beta launch
21. Pro audit #3 (specialist based on what breaks — performance, security, or both. ~5-10 hours at $75-200/hr = $375-2,000)
22. Post-launch: AI trend summaries, portfolio tracking, additional sports data

## Development Guidelines
- Use this Project chat for planning, strategy, and decisions
- Use Claude Code for hands-on coding and file creation
- Consistent naming conventions throughout the codebase
- One job per file — components render UI, hooks fetch data, utils calculate
- Start each session by reviewing this file and project-brief.md
- Maintain project-brief.md as the living source of truth
- Periodic refactoring to keep things clean
- Frequent GitHub commits with descriptive messages
- If a feature idea comes up that isn't on the plan, flag it — don't build it
- Zach has no dev background — explain everything step by step
