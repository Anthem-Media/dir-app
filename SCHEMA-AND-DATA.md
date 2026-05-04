# SCHEMA-AND-DATA.md

**Purpose:** Single source of truth for every schema and data decision in Ripper (working name DIR). Captures what's been locked in, what we've observed from real data, and what's still open. This file grows as we work through the database phase. When a decision moves from OPEN to DECIDED, the reasoning is captured here so future-you, Cam, or a future developer can understand *why* the schema looks the way it does — not just *what* it looks like.

**How to use this:**
- Read top to bottom before any schema change
- Move items from OPEN QUESTIONS to DECIDED as conversations close
- Add to OBSERVED whenever real data teaches us something new
- Never delete reasoning — supersede it. Keep the history of why decisions changed.

**Companion document:** EBAY-STRATEGY.md is the canonical source for eBay-specific strategy, License Agreement analysis, and the Five Paths framework. This file (SCHEMA-AND-DATA.md) captures schema and data decisions that flow from those strategic decisions. When eBay strategy changes, schema implications get captured here. Read EBAY-STRATEGY.md first when working through pricing-related schema decisions.

**Last updated:** May 1, 2026 (eBay strategy session — Path E+, License Agreement constraints)

---

## Guiding Principles

### Rebuild-proof data collection
Raw collected data should survive a schema rebuild. The spreadsheets and source documents we generate during seeding should capture the underlying *facts* about each box and card in a format that doesn't depend on the current schema's structure. If we change `parent_set_id`, flip tiers, or restructure how prices are stored, the collected data should re-import into the new schema without going back to TCDB, Cardboard Connection, or eBay all over again.

This is a separate design layer from the schema itself. The schema is *one possible representation* of the data. The collected data is the source of truth.

### Pricing accuracy is the product
Ripper is a pricing analytics tool. If the prices are wrong, every downstream feature (EV, ROI, top chases, charts) is wrong. Schema decisions that affect pricing are the highest-stakes decisions in the system. They get the most thinking, the most caution, and the most careful design.

### 80% accurate is the POC bar
For the proof-of-concept (2024 Topps Chrome Baseball), the goal is "credible enough for expert reviewers to react to," not "perfect." The remaining 20% accuracy gets dialed in based on what Cam's network identifies as wrong or missing. Don't over-engineer before learning.

### Schema flexibility for future features
Some features (like the Grading ROI calculator) aren't in scope for beta but should be enabled by the schema design. Storing per-grade prices in the database now — even if only the raw price is displayed — means future features become UI builds, not data rebuilds.

---

## DECIDED

Items here have been explicitly locked in through partner discussion or project documentation. Each item includes the reasoning so it can be revisited if circumstances change.

### Grails are excluded from EV/ROI calculations
- **What:** Cards with `print_run ≤ 10` are classified as Grails and excluded from all EV and ROI math.
- **Why:** Their pull probability is effectively zero for any individual buyer. Including them inflates EV misleadingly and undermines product credibility.
- **Source:** requirements.md, locked product decision.
- **Schema implication:** EV calculation logic must filter `WHERE print_run > 10 OR print_run IS NULL`.

### EV coverage is displayed transparently
- **What:** Box profile pages show "Based on X of Y cards priced" using `ev_cards_priced` and `ev_cards_total` columns on `box_sets`.
- **Why:** Honesty about data coverage builds credibility. Turns thin data on new releases into a "data is filling in" feature instead of a gap.
- **Source:** CONTEXT.md, locked.
- **Schema implication:** Both columns must exist on `box_sets` before full seeding begins (PRE-BETA-CHECKLIST.md #4.10).

### Manufacturer pull rates and eBay sold listings are the only valid data sources
- **What:** No user-submitted data, no YouTube break scraping, no AI-generated estimates.
- **Why:** Data integrity. Survivorship bias makes break data unreliable. User-submitted data is unverifiable.
- **Source:** requirements.md.
- **Schema implication:** No table or column should exist for user-contributed pricing or pull rate data.

### Sets without published manufacturer odds skip EV
- **What:** If pull rates aren't manufacturer-published, the box gets flagged "Unavailable" for EV. Checklist and card pricing still display.
- **Why:** EV math without real odds is a guess. Better to skip it than fake it.
- **Source:** requirements.md.
- **Schema implication:** `box_sets.expected_value` must allow `NULL`. UI must gracefully hide or message missing EV.

### Mavin.io is not a viable data source
- **What:** Mavin shut down operations. Site posted a public shutdown notice; accounts being wiped. Pricing pipeline is fully owned by Ripper — no third-party aggregator dependency.
- **Why:** Beyond the shutdown itself, Reddit research surfaced that Mavin failed because users lost trust in their pricing accuracy (manipulated outliers, shipping-cost inflation, suspected money-laundering pollution). This is a direct lesson for Ripper's pipeline design.
- **Source:** Web research April 2026.
- **Schema implication:** No need to design `price_history` for multi-vendor data ingestion at launch. `source` column kept for future flexibility (other aggregators may emerge), but eBay is the only source for now.

### Beta launches with 4 sports, not 5
- **What:** Soccer dropped from beta scope. Beta launches with Baseball, Football, Basketball, Hockey. Soccer becomes a "Coming Soon" link in the navigation.
- **Why:** Reduces seeding scope without abandoning the future expansion. Soccer was always a smaller market than the four core sports for the U.S. card collector audience.
- **Source:** Planning session April 29, 2026.
- **Schema implication:** None — schema already supports all sports. UI implication: nav tab for Soccer routes to a "Coming Soon" page rather than a filtered browse view.

### Path E+ tier-aware pricing — schema implications
- **What:** Card-level pricing in `cards.current_value` comes from two different data sources depending on card tier: bulk cards (base, common parallels, common autos of star players) get prices derived from eBay Browse API active listings with mitigation tactics applied. Top Chases and Grails get prices from a paid sold-data source (Path A: Marketplace Insights, or Path B: licensed aggregator like Card Hedge / PriceCharting).
- **Why:** May 1, 2026 active-vs-sold research showed asking-vs-sold gap is small at high volume (where bulk cards live) and unreliable at low volume (where Top Chases and Grails live). Concentrating paid-data spend on the 50-200 highest-value cards per box (rather than every card in the checklist) makes Path B economically tractable in a way "price every card via paid data" never was. Full reasoning in EBAY-STRATEGY.md.
- **Source:** EBAY-STRATEGY.md DECIDED section "Concentrate accuracy spend where users care most" + active-vs-sold research session May 1, 2026.
- **Schema implication:** `cards.current_value` does not need to bifurcate by data source — same column, populated from different pipelines depending on tier. However, we likely need a new `value_source` column or similar to track which pipeline produced each value. This affects confidence display, refresh cadence, and License Agreement compliance (eBay-sourced data must follow the 6-hour minimum refresh, paid aggregator data follows their terms). See OPEN QUESTIONS for the column-design decision.
- **Coverage display implication:** The existing `ev_cards_priced` and `ev_cards_total` columns on `box_sets` should likely become more granular: separate counts for "bulk priced via Browse API mitigation" vs. "top chases priced via paid sold-data" so the box profile page can communicate the data confidence model honestly. This is a question to settle, not a decision yet.

---

### Users table uses UUID matching `auth.users(id)` (locked May 2026)
- **What:** The `users` table primary key is `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`, replacing the previous `SERIAL` integer ID. Every foreign key referencing `user_id` (saved_boxes, price_alerts, user_collection, user_wishlist) becomes UUID accordingly.
- **Why:** Supabase Row Level Security policies use `auth.uid()`, which always returns a UUID. With UUID matching, RLS policies are direct: `WHERE user_id = auth.uid()`. With SERIAL, every policy would require a subquery: `WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())`. RLS gets used heavily for paywall logic and per-user data access — clean policies pay back forever. The standard Supabase pattern is also UUID matching, which makes the codebase recognizable to future devs (Pro audit reviewers, potential acquirer engineers).
- **Why now and not later:** Migration cost is roughly the same as any other Stage 1 schema amendment if done now (essentially no real users, just test accounts). The migration would be 10× harder after seeding or beta.
- **Implementation:** A trigger on `auth.users` insert auto-creates a matching row in our `users` profile table (standard Supabase boilerplate). All `user_id` foreign keys throughout the schema migrate to UUID in the same batch.
- **Tradeoff accepted:** UUIDs are 16 bytes vs. 4 bytes for INT. Irrelevant at our scale.
- **Source:** Stage 0a planning session, May 2026. Tracked as PRE-BETA-CHECKLIST.md #4 schema amendment.

### `parent_set_id` is NULL for single-format sets (locked May 2026)
- **What:** When a `box_sets` row has only one format (e.g., a Mega-only release, a Breaker-only product), its `parent_set_id` is NULL. When a set has multiple formats, all sibling rows share a non-NULL `parent_set_id` pointing to the parent row's `id`.
- **Why:** NULL is the honest representation of "no parent concept exists." Self-referencing would force the database to fabricate a relationship that isn't real, and would complicate format-switcher logic (would need a special case to detect "self-only" sets). NULL also makes the format-switcher query natural: `SELECT * FROM box_sets WHERE parent_set_id = $current_parent_id` returns 0 rows when parent is NULL, which is exactly the right signal to hide the switcher UI entirely.
- **Format switcher rule:** When 0 or 1 sibling formats exist for a set, the format switcher hides itself entirely. No "single tab" UI that exists only to be useless.
- **Tradeoff accepted:** Cowork data entry must remember to leave `parent_set_id` blank for single-format sets. One documented rule.
- **Source:** Stage 0a planning session, May 2026.

### `parent_set_id` parent identity rule: Hobby > Jumbo > Mega > Breaker > Blaster (locked May 2026)
- **What:** When a set has multiple formats, the parent row is determined by walking the priority chain Hobby > Jumbo > Mega > Breaker > Blaster and selecting the first format that exists for that set. The parent row gets seeded first; its `id` becomes the shared `parent_set_id` value that all sibling format rows point to.
- **Why Hobby first:** Hobby is the canonical product type in the hobby. When a collector says "2024 Topps Chrome Baseball" without specifying format, they almost always mean Hobby. URL slugs match user expectation. Pull-rate documentation also leads with Hobby — manufacturer odds, Cardboard Connection, Beckett — meaning the most-complete row anchors each set when Hobby is parent.
- **Why this fallback order:** Jumbo is essentially "Hobby with bigger packs" — same depth of pull-rate documentation, premium positioning. Mega is typically a Target/retail-channel product with reasonable documentation. Breaker is a niche distributor format, less canonical. Blaster is the most retail-end and least likely to be the "primary" representation of a set.
- **Display order is separate:** Display order in the format switcher tabs is Breaker, Jumbo, Hobby, Mega, Blaster (left to right) — this is independent of parent priority. Two ordering rules exist; they should not be conflated.
- **EV/ROI defaulting:** When a user lands on a box profile with no format query param, the parent format renders by default. Hobby being the canonical default makes this useful for the typical collector evaluation case.
- **Tradeoff accepted:** Some sets without Hobby will have a non-Hobby parent, creating slight inconsistency. The alternative — making one fixed format parent across the board — would create more inconsistency because most users associate sets with Hobby.
- **Source:** Stage 0a planning session, May 2026.

### `value_source` column on `cards` tracks pricing pipeline (locked May 2026)
- **What:** A single `value_source VARCHAR(40)` column on `cards`, with a CHECK constraint listing valid source values, and an index on the column. Tracks which pricing pipeline wrote each `current_value`.
- **CHECK values:** `'ebay_browse_mitigation'`, `'ebay_marketplace_insights'`, `'card_hedge'`, `'price_charting'`, `'manual'`, `'placeholder'` (or NULL for unpriced cards).
- **Index rationale:** License Agreement Section 16.3 cleanup queries filter by source and must run fast under deletion deadline pressure.
- **Why a single column instead of paired source+timestamp columns:** The schema already has `value_last_updated TIMESTAMP` on `cards`. Adding a redundant timestamp column would duplicate existing state. One source column + the existing timestamp = full story.
- **Why VARCHAR + CHECK instead of Postgres ENUM:** CHECK constraints are easier to extend later (just update the constraint). ENUMs require a migration to add new values. Given that we may need to add Plan B sources or pivot away from eBay entirely, the more flexible option wins.
- **eBay-first framing:** Best case is a full eBay pipeline (Browse API for bulk + Marketplace Insights for top chases/grails) as the sole source. The other source values exist for Plan B fallback resilience (Card Hedge, PriceCharting) but are not expected to populate in the happy path. This is future-proofing the schema, not committing to multi-source pricing as a goal.
- **Schema-pivot expectation:** If the pricing strategy pivots significantly — e.g., pushed away from eBay entirely toward different aggregators — the CHECK constraint will need to be updated to add new source values. That's a small migration, not a schema rebuild. This expectation is accepted, not surprising.
- **Pipeline contract:** Every pipeline that writes `current_value` MUST also write `value_source` and update `value_last_updated`. Wrap in a function (e.g., `update_card_value(card_id, new_value, source)`) so individual pipelines can't forget.
- **Companion table symmetry:** The `price_history` table already tracks `source` for individual sale rows. Adding `value_source` to `cards` makes the design symmetric — same concept in both related tables.
- **Source:** Stage 0a planning session, May 2026. Tracked as PRE-BETA-CHECKLIST.md #4.11 schema amendment.

### Two-layer data model: atomic facts → schema-shaped spreadsheet (locked May 2026)
- **What:** Source data is collected first as free-form atomic facts documents (.md files, one per box set, stored in /data/facts/). Schema-shaped spreadsheets are derived from those atomic docs via AI shaping (Cowork). The atomic layer is the true source of truth.
- **Why:** Atomic facts documents don't reference the schema — they capture player names, card numbers, print runs, pull odds, MSRP, and release dates in plain language. If the schema changes (tier numbering flip, new columns, restructured tables), the collected data survives intact. Re-import is a reshape task, not a re-collection task. Schema-shaped spreadsheets are derived artifacts, not originals.
- **Source:** Stage 1 Step 4 planning session, May 2026.
- **Schema implication:** None to the schema itself. Implication for data entry workflow: /data/facts/ directory must be created and maintained. Atomic docs come before any Cowork shaping run.

### Path A pricing rows: per-printing model, no format duplication (locked May 2026)
- **What:** The `cards` table has one row per (card subject × parallel). The format dimension (Hobby / Jumbo / Blaster / Breaker / Mega) lives exclusively in `pull_rates` and is never duplicated in `cards`. A single "Adley Rutschman Magenta Refractor /399" row prices the card once; its pull odds differ per format row in `pull_rates`.
- **Why:** Card identity is format-agnostic. A Magenta /399 is the same card whether it was pulled from a Hobby or a Blaster. Duplicating a card row per format would balloon the `cards` table (×5 for every parallel) and produce contradictory `current_value` fields with no clean way to reconcile them. EV math joins `cards` to `pull_rates` at query time — format specificity lives there.
- **Row count estimate:** ~10,500 rows per modern Topps Chrome box at full per-printing accuracy (all subjects × all parallels).
- **Source:** Stage 1 Step 4 planning session, May 2026.
- **Schema implication:** No change needed — current schema already reflects this. Confirmed as intentional design, not an oversight.

### Subject-level batching for eBay calls (locked May 2026)
- **What:** eBay Browse API and Marketplace Insights calls are issued at the card-subject level, not the card-printing level. A single query like "Adley Rutschman 2023 Topps Chrome" returns up to 200 listings covering all parallels of that subject in one API call. Parallels are disambiguated after retrieval by matching listing titles against the known parallel names and print runs in the `cards` table.
- **Why:** A naive per-printing approach (one call per parallel) would require ~10,500 calls per box. Subject-level batching collapses that to ~300–500 calls per box (~10–30× reduction), staying within practical rate limits and making weekly refresh economically viable without Marketplace Insights elevated access.
- **Tradeoff:** Disambiguation happens post-call in our pipeline, not at the eBay query layer. Some listings will be ambiguous (no parallel name in title, no card number). Those get confidence-scored and flagged for review rather than discarded.
- **Source:** Stage 1 Step 4 planning session, May 2026.
- **Schema implication:** None to the current schema. Pipeline design implication: the eBay integration script must group cards by subject before issuing calls, then fan results back out to individual card rows.

### Guaranteed pulls — schema amendment required (locked May 2026)
- **What:** Each box format has manufacturer-stated guaranteed pulls — deterministic floors that are always present in a box regardless of probability (e.g., Hobby = 1 autograph guaranteed, Jumbo = 3 autos guaranteed, Blaster = 2 Sepia Refractors + 2 Pink Refractors guaranteed). These are not odds — they are certainties that must be treated as `pull_probability = 1.0` in EV math, as a separate additive term.
- **Why:** Omitting guaranteed pulls understates EV. Including them as regular `pull_rates` rows is wrong because they'd be weighted by their odds (which are irrelevant — they always hit). EV math must handle guaranteed pulls as a distinct, additive component.
- **Data sources:** Cardboard Connection, Baseballcardpedia, manufacturer product sheets — the same sources already used for pull rates.
- **Source:** Stage 1 Step 4 planning session, May 2026.
- **Schema implication:** Schema amendment required. Exact structure (JSON column on `box_sets` vs. separate `guaranteed_pulls` table) is an open question — see OPEN QUESTIONS section. Amendment must be in place before any guaranteed-pull data is imported.

---

## OBSERVED

Real-world observations that should inform schema and pricing decisions. These aren't decisions yet — they're inputs to upcoming decisions.

### April 2026 — eBay sold listings, initial 10-minute observation

**Volume:** Tons of sold listings available for modern cards. Volume isn't the problem.

**Card identification in listings:**
- Roughly 50% of listings include the card number in the title.
- The other 50% rely on player name, year, and set name only.
- **Implication:** A naive "match by card number" query loses half the data. Matching strategy needs multiple passes — card number first when available, fallback to name+year+set+parallel-name combinations otherwise. Each match needs a confidence score.

**Raw vs. graded:**
- Most listings are raw. Raw is the default state for modern cards being sold.
- Almost no raw listings explicitly say "raw."
- ~80% of graded listings include "PSA," "BGS," "SGC," or "CGC" in the title.
- Most graded sales are PSA 9 or PSA 10 — graded cards in lower grades are less commonly sold.
- **Implication:** Keyword filtering on listing titles can roughly split raw from graded with ~85–90% accuracy. Good enough for POC, refine before full seed.

**Price-grade correlation:**
- High-priced cards skew heavily graded. Low-priced cards skew heavily raw.
- A meaningful price threshold likely exists below which "treat as raw" is roughly safe.
- **Implication:** Tier-level rules might apply. Base cards almost always raw. Autos and high-end parallels much more likely to be graded — needs more careful filtering.

### April 2026 — eBay graded filter discovery

eBay's web UI exposes a "Graded: Yes / No / Not Specified" filter. The API likely has the same parameter. **This dramatically simplifies raw-vs-graded handling.** Instead of relying on title keyword matching as the primary mechanism, we can ask eBay directly. Keyword detection becomes a backup verification layer.

**Important caveat:** This needs to be confirmed with actual eBay API testing before we design around it. See OPEN QUESTIONS — eBay API verification.

### April 2026 — Targeted query observations on 2023 Topps Chrome

Searches run with negative keyword filters in eBay's web UI:

- **Star base cards (Ohtani, Soto):** High volume (500–3300 sales over 90 days). Reliable price clusters.
- **Rookie base cards:** Variable. Carroll had 336 sales over 90 days; some current-year rookies showed near-zero results, possibly due to query matching issues rather than real volume gaps.
- **Numbered refractors:** Moderate volume (~215 sales over 90 days). Reliable for averaging.
- **Base autos:** Moderate (~235 sales over 90 days).
- **Numbered autos (/99, /50):** Lower volume but still usable, with significant pollution from non-Topps-Chrome products.
- **Old vs. new comparison:** 2018 Soto had 781 sales, 2024 Soto had 817 sales. Volume holds up over years for star players. **This is good news for legacy era (2018–2023) viability.**

**Pollution sources identified (Topps Chrome specifically):**
- Topps Chrome Update
- Topps Chrome Platinum
- Topps Chrome Black
- Topps Chrome Sapphire
- Topps Chrome Cosmic
- Topps Chrome Heritage
- Topps Chrome Logofractors
- Bowman Chrome (different product entirely)
- "Lot" listings
- "You pick" / "your choice" listings
- Different parallels appearing in base searches

**Key insight:** The pollution is *named* and finite. Each product line has an identifiable list of polluting siblings. Once mapped, exclusion rules can be encoded per product line in a query template that runs forever.

**Web search has fuzzy matching:** Negative keyword filters work imperfectly in the eBay web UI. The eBay API likely uses exact filtering, so pipeline results should be cleaner than manual web searches suggest.

### April 2026 — Mavin failure-mode analysis (Reddit research)

Mavin shut down with a public notice, but the underlying cause was loss of user trust over pricing accuracy. Reddit threads identified the failure modes:

- **Outlier manipulation:** Users reported a $99,999 Pokemon Pikachu sale showing up as a "real" comp on Mavin. Suspected sock-puppet behavior — one account selling to another at an absurd price to inflate perceived value. Mavin had no detection for this.
- **Shipping cost inflation:** Mavin included shipping in sale prices, inflating low-value cards (where shipping is a meaningful percentage of the total).
- **Money laundering theory:** Community theorized some absurd-price sales were deliberate movement of money via card transactions. Whether or not this is literally true, the pattern (impossible single sales) needs to be designed against.
- **User exodus:** Users moved to raw eBay sold listings or TCGFish (mentioned multiple times as a cleaner alternative).

**Implications for Ripper's pricing pipeline:**

1. **Outlier detection at the individual-sale level.** Single sales 30%+ outside the recent cluster get flagged and excluded from `current_value`. The $99,999 sale never makes it into our headline price.
2. **Shipping cost handling.** Either subtract shipping from sale total before averaging, or store both `total_sale_price` and `card_only_price` separately so we always know which version is in play.
3. **Pattern detection for sock-puppet activity.** Multiple sales between the same buyer/seller, sudden volume spikes on previously-quiet cards — these are flag candidates.
4. **Transparent confidence display.** Sales count, recency, cluster tightness — if any are weak, surface that to the user. Don't hide bad data behind a confident-looking number.

**TCGFish flagged for evaluation:** Mentioned multiple times as a cleaner Mavin alternative. Out of TCG scope but worth examining as a reference for how clean eBay aggregation can be done well. Not a data source dependency — a benchmark.

### May 1, 2026 — Active-vs-sold research validates tier-aware pricing approach

Hands-on research session comparing eBay active listings to sold listings across 5 cards spanning the value/volume spectrum from 2024 Topps Chrome Baseball. Full findings captured in EBAY-STRATEGY.md OBSERVED section.

**Schema-relevant takeaways:**
- Asking-vs-sold gap is small at high volume (Soto base, Soto refractor, Chourio base auto on average): mitigation tactics on Browse API data produce useful `current_value` for bulk cards.
- Asking-vs-sold gap is large at low volume (Chourio /99 numbered refractor): mitigation does not save it. These cards need real sold data.
- Older / vintage cards have thin data on both sides (2018 Soto base): reinforces existing decision to skip EV/ROI for legacy product.
- Active listings outnumber sold listings significantly across all cards — supply side has more inventory than demand side absorbs at posted prices. Implication: any active-listing-derived price is statistically biased upward and needs explicit mitigation.

**Implication for schema:** `cards.current_value` is single-column but multi-source. The pipeline that populates it must know which mitigation logic to apply based on card tier. New tracking column (`value_source` or similar) lets the application know which data pipeline owned each price write — affects refresh cadence enforcement (6-hour minimum for eBay-sourced under License Agreement), confidence scoring, and audit/debugging.

### April 2026 — Grading-as-a-feature opportunity

Identified during eBay observation: if graded listings are easy to identify, we can store per-grade prices separately and surface them as a future feature.

**Future product opportunity:** Show raw, PSA 9, PSA 10 prices side-by-side with grading ROI calculation. No competing tool does this in one place.

**Implication:** Schema should support per-grade pricing now, even if only raw is displayed in POC. Captured in project-brief.md as Post-MVP Roadmap item.

### Box format coverage varies by set
- Not every set has Hobby + Jumbo + Blaster + Mega + Retail.
- Some sets are Hobby-only. Some are Hobby + Retail. A few are Retail-only (blaster exclusives).
- Format combinations change year-over-year for the same product line.
- **Implication:** `parent_set_id` model needs to handle 1-format sets, partial formats, and year-over-year format drift. Edge cases worth seeding before locking the pattern.

### Card price history needs to span at least 6 months
- Card value trend chart on box profile page should show at least 6 months of history.
- **Implication:** `price_history` retention policy needs to be defined. eBay API initial pull needs to go back at least 6 months on first seed.

### May 2026 — eBay call volume math for Path A scope

Estimated call volume for Path A integration modeled during Stage 1 Step 4 planning session:

- **Subject-level batching:** ~300–500 eBay calls per box set (one query per card subject, disambiguating parallels post-call). This is ~10–30× fewer calls than a naive per-printing approach.
- **Weekly refresh at full beta scale:** ~600 box sets in scope × ~150–170 subjects per box ÷ batching efficiency factor ≈ **65,000–90,000 daily Browse API calls** at weekly refresh cadence.
- **Important caveat:** These numbers are derived from the integration model, not measured against real eBay API traffic. Actual call volume will be confirmed during the eBay API capability verification session (OPEN QUESTIONS #0) and the Browse API integration POC.
- **Rate limit context:** Default Browse API tier is 5,000 calls/day — far below production needs. Production access requires Application Growth Check approval (PRE-BETA-CHECKLIST.md #6.3). The combined application will include a Browse API limit-increase ask.

---

## OPEN QUESTIONS

Decisions that haven't been made yet. Each question includes the framing and what answering it depends on. Items here become DECIDED entries when conversations close.

### eBay API verification (must be answered before pricing data model decisions)

**0. What does the eBay API actually expose?**
We've been assuming several things about eBay API capabilities based on web UI behavior. Before locking pricing pipeline decisions, we need a hands-on verification session to confirm:
- Confirmed access tier and daily quota
- Whether Marketplace Insights API (sold listings) access is approved
- Whether the graded filter exists at the API level
- Whether shipping cost is returned as a separate field
- Whether item specifics (structured product data) include card number when the title doesn't
- Search syntax for queries with card numbers + exclusion keywords
- Rate limit behavior under realistic refresh patterns

**This is a hands-on session, not a thinking session.** Confirm before designing around assumptions.

### The Pricing Data Model

**1. What does `current_value` on a card mean, statistically? (Now scoped per-tier under Path E+)**
- For bulk cards (base, common parallels, common autos of star players): derived from eBay Browse API active listings with mitigation tactics — outlier trimming (top 25% / bottom 10%), recency weighting (last 7 days higher), auction-format favoring, sample size minimum (5+ listings), confidence labeling.
- For Top Chases and Grails: derived from paid sold-data source (Marketplace Insights or licensed aggregator) — likely median of recent sold listings with outlier rejection. Need to lock specific algorithm once Path A vs. Path B is decided.
- Median is more resistant to outliers (Mavin's $99,999 lesson) and likely the right base statistic for both tiers. Recent-weighted variants reflect current market better but react to noise.
- Depends on: which Path is approved (A vs. B) — paid sold-data sources may have their own pre-computed statistics that we use directly rather than re-deriving.
- Affects: every EV/ROI calculation, every checklist price, every chart, the confidence display on box profile pages.

**2. How do we handle cards with no eBay sales?**
- Options: NULL, last-known-price-with-a-stale-flag, peer-card estimate, omit from EV.
- "Omit from EV" pairs naturally with the EV coverage display ("X of Y priced").
- Depends on: how `ev_cards_priced` is calculated (#4 below).
- Affects: EV accuracy, coverage display, what appears on the checklist.

**3. How do we handle raw vs. graded?**
- For POC: filter to raw-only sales using API graded filter (if confirmed) plus keyword exclusion as backup?
- For future: store per-grade tiers separately so the Grading ROI feature works.
- Depends on: eBay API verification confirming graded filter exists.
- Affects: schema (single price column vs. multiple), accuracy, future feature enablement.

**4. What counts as "priced" for the `ev_cards_priced` count?**
- A card has any `current_value`? At least one recent sale? At least N sales within X days?
- Stricter definition = more honest coverage display, fewer cards count as priced.
- Depends on: how we define `current_value` (#1).
- Affects: the headline coverage number on every box profile page.

**5. How do we measure pricing confidence?**
- Confidence factors: sales count, recency of most recent sale, standard deviation of recent sales, condition mix in sales, presence of suspected manipulated sales.
- Could be a single confidence score (high/medium/low) or multiple stored signals.
- Depends on: how the review dashboard wants to surface flags.
- Affects: schema (confidence columns on `cards`), review workflow, what gets flagged.

**6. What does the data review dashboard flag?**
- Likely candidates: large week-over-week price changes (>30%?), low sales count (<3?), high standard deviation, suspected mismatched cards, suspected condition pollution, suspected sock-puppet sales (Mavin lesson).
- Threshold values are guesses until real data is reviewed.
- Depends on: real eBay data flowing in to set sensible thresholds.
- Affects: ongoing data quality maintenance, weekly review time investment.

**7a. Per-parallel pull rates not yet supported by schema**
- **What:** Current `pull_rates` table is keyed by `(box_set_id, category_id)`. All Numbered Refractors within a category share one pull rate. In reality each parallel has its own printed odds — a Red /5 Refractor has very different odds from a Magenta /399 Refractor, but both fall under "Numbered Refractor."
- **Example (2024 Topps Chrome Hobby):** Magenta /399 representative rate is ~1:96 packs. Red /5 is ~1:7,680 packs. Using the category-level rate for both would significantly over-count the EV contribution of ultra-low-print parallels.
- **Current state:** EV math is approximate because it uses a single representative rate per category. Acceptable for POC; not acceptable for production accuracy.
- **Options:** (a) Add a `parallel_name` or `print_run` column to `pull_rates` to key per-printing; (b) restructure `pull_rates` to reference `cards.id` directly (one rate per card row); (c) accept category-level rates with a documented accuracy caveat.
- **Depends on:** Pull rate data availability — manufacturers publish category-level odds, not per-parallel odds. Per-parallel rates require inference from print run and box configuration math.
- **Affects:** EV calculation accuracy, `ev_cards_total` coverage logic, schema amendment scope.

### Structural schema decisions

**10. Card categories review**
- Schema has 15 categories tied to baseball-style sets. Football, basketball, and hockey have slightly different card structures.
- Depends on: real data inspection across all four sports during seeding.
- Affects: `card_categories` table, tier flip (#4.7), checklist rendering.

### Data retention and refresh

**11. `price_history` retention policy — now constrained by License Agreement**
- Keep all sales forever? Prune older than 2 years? Roll up older data into monthly averages?
- Depends on: chart needs (6+ months minimum) and storage budget.
- **License Agreement constraint (if Path A approved):** Section 16.3 of the eBay API License Agreement requires destruction of all eBay-sourced data within 10 days of contract termination. Historical price archive sourced from Marketplace Insights is conditionally ours — we keep it as long as we're under contract, must delete within 10 days if the contract ends.
- **Schema implication:** `price_history` rows sourced from eBay must be identifiable for cleanup. The existing `source` column handles this (`source = 'ebay'`), but the cleanup tooling does not exist yet. Pre-beta build item: admin tooling to bulk-delete eBay-sourced rows on demand. See PRE-BETA-CHECKLIST.md section 6.8.
- **Schema implication for Path B data:** Paid aggregator data has its own retention terms per their contract. Same `source` column handles identification (`source = 'card_hedge'` or similar), different deletion rules.
- Affects: storage growth rate, chart query performance, License Agreement compliance, paid aggregator contract compliance.

**12. eBay API refresh cadence per card**
- Daily? Weekly? Tiered by card value (high-value cards refreshed more often)?
- Depends on: eBay API rate limits, price volatility tolerance, scaling reference.
- Affects: data freshness, API quota usage, infrastructure cost.

### Source-of-truth data format

**13. How do we structure raw collected data so it survives a schema rebuild?**
**— ANSWERED May 2026 Step 4. Two-layer model adopted. See DECIDED: "Two-layer data model: atomic facts → schema-shaped spreadsheet."**
- **Answer:** Atomic facts documents (.md files, one per box set, stored in /data/facts/) are the source of truth. They capture raw facts in plain language without referencing the schema. Schema-shaped spreadsheets are derived from atomic docs via AI shaping (Cowork) and are treated as artifacts, not originals. A schema rebuild requires reshaping atomic docs into the new structure — not re-collecting source data from TCDB, Cardboard Connection, or eBay all over again.
- **Affects:** Data entry workflow — /data/facts/ directory must exist and be maintained from the first data entry session onward.

### Guaranteed pulls schema design

**14. How should guaranteed pulls be stored in the schema?**
- **Context:** Each box format has manufacturer-stated guaranteed pulls — deterministic floors that are always present regardless of probability (e.g., Hobby = 1 autograph, Jumbo = 3 autos, Blaster = 2 Sepia + 2 Pink Refractors). These are certainties in EV math, not probabilities, and must be stored separately from `pull_rates`. Schema amendment is required before any guaranteed-pull data is imported.
- **Option A — JSON column on `box_sets`:** Add `guaranteed_pulls JSONB` column holding `{ "autographs": 1, "specific_parallels": ["Sepia Refractor", "Pink Refractor"] }`. Simpler to implement, no new table, easy to read at query time.
- **Option B — Separate `guaranteed_pulls` table:** New table keyed by `(box_set_id, category_id_or_parallel_name)` with a `quantity` column. Cleaner for complex querying, consistent with how `pull_rates` is structured, easier to JOIN in EV calculations.
- **Tradeoff:** JSON is faster to implement and queries cleanly for the simple "sum the guaranteed auto value" use case. Separate table is more queryable if guaranteed pull data ever needs filtering or aggregation beyond a simple sum.
- **Depends on:** How EV calculation logic will consume this data — simple sum vs. complex query shapes the table-vs-JSON choice.
- **Affects:** Schema amendment scope, EV calculation logic, data entry pipeline.

---

## Schema Decisions Log

Running list of every schema choice with date and reasoning. Append-only — when a decision changes, add a new entry referencing the old one. Don't delete history.

### May 2026 — Stage 1 Step 3: schema applied to Supabase
First production schema apply. Wrote a fresh dir_database_schema.sql against an empty Supabase public schema, incorporating all 11 amendments from PRE-BETA-CHECKLIST.md section #4 plus all four Stage 0a schema decisions (logged below). Previous schema file preserved as **OLD**dir_database_schema**OLD**.sql. Apply was a single SQL Editor run — no migration needed because no prior tables existed in public. End-to-end signup test on hobbyripper.com confirmed the on_auth_user_created trigger fires correctly and populates public.users with email, display_name (from auth metadata), email_opt_in (from auth metadata), and plan='free'. Schema applied with RLS disabled per Supabase's warning — RLS enable + policy writing is tracked as a pre-beta task in PRE-BETA-CHECKLIST.md #4.13.
Notable follow-up tasks created by this apply:

src/utils/checklistUtils.js — sortTiersByValue still sorts descending. Now that the database tier numbering is flipped (Tier 1 = Premium Hits, Tier 5 = Base), the codebase needs a corresponding flip to ascending sort. Sonnet task.
View v_top_cards_by_set does not yet expose value_source. Add when the box profile page wants to display pricing-confidence indicators.
RLS policies (PRE-BETA-CHECKLIST.md #4.13) — schema is wide open until policies are written.

### May 2026 — Stage 0a planning session: four schema decisions locked
Four OPEN QUESTIONS moved to DECIDED status. Full reasoning captured in the DECIDED section above. Brief log:

1. **Users table identity strategy (was OPEN #7).** Locked: `users.id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`. Replaces SERIAL. Reason: clean RLS policies via direct `auth.uid()` match. Standard Supabase pattern. Migration cost is low now, painful later. All user-related FKs migrate to UUID in the same batch (PRE-BETA-CHECKLIST.md #4).

2. **`parent_set_id` for single-format sets (was OPEN #8).** Locked: NULL when only one format exists. Reason: honest representation of "no parent concept," cleanest format-switcher logic, switcher UI hides itself when 0 or 1 sibling formats exist.

3. **`parent_set_id` parent identity rule (was OPEN #9).** Locked: priority chain Hobby > Jumbo > Mega > Breaker > Blaster. First format in the chain that exists for a given set is parent. Reason: Hobby is canonical user expectation, deepest pull-rate documentation, EV/ROI defaults make sense. Display order in the switcher is separate (Breaker, Jumbo, Hobby, Mega, Blaster left to right).

4. **`value_source` column on `cards` (was OPEN #12a).** Locked: single `VARCHAR(40)` column with CHECK constraint and index. Tracks which pricing pipeline wrote each `current_value`. Values: `'ebay_browse_mitigation'`, `'ebay_marketplace_insights'`, `'card_hedge'`, `'price_charting'`, `'manual'`, `'placeholder'`. eBay-first framing — best case is full eBay pipeline as sole source; other values exist for Plan B fallback resilience. CHECK constraint chosen over ENUM for easier future extension. Tracked as PRE-BETA-CHECKLIST.md #4.11.

**Format list note (related, not strictly schema):** Beta format scope locked at Breaker, Jumbo, Hobby, Mega, Blaster (display order, left to right). Retail dropped from beta scope, deferred as a post-beta addition (PRE-BETA-CHECKLIST.md #13.1). Schema-compatible — `box_format` is VARCHAR — no migration needed when Retail is added back.

### May 2026 — Stage 1 Step 4: pricing data model locked

Four data model and pipeline decisions locked in this session. Full reasoning in the DECIDED section above. No schema changes were made in this step — decisions are pipeline-level. Schema amendments for guaranteed pulls and per-parallel pull rates are queued for a future session.

1. **Two-layer data model.** Atomic facts docs (.md, /data/facts/) are the source of truth. Schema-shaped spreadsheets are derived artifacts. Survives any schema rebuild. Answers OPEN QUESTIONS #13 (marked ANSWERED above).

2. **Path A pricing rows: per-printing, no format duplication.** `cards` table has one row per (subject × parallel). Format dimension lives only in `pull_rates`. ~10,500 rows per modern Topps Chrome at full per-printing accuracy.

3. **Subject-level batching for eBay calls.** One query per card subject (e.g., "Adley Rutschman 2023 Topps Chrome") covers all parallels in one call. ~10–30× call volume reduction vs. naive per-printing approach. Estimated ~65,000–90,000 daily Browse API calls at weekly refresh for ~600 boxes — to be confirmed during eBay API capability verification session (OPEN QUESTIONS #0).

4. **Guaranteed pulls require schema amendment.** Manufacturer-stated deterministic floors (e.g., Hobby = 1 auto guaranteed) must be handled separately from probabilistic `pull_rates`. Schema amendment structure (JSON column vs. separate table) is an open question — see OPEN QUESTIONS #14.

---

## Things We Learned From Real Data

Specific moments where reality changed our thinking. Each entry includes what we expected, what we actually saw, and what changed as a result.

### April 2026 — eBay listing observation
- **Expected:** Card numbers and grade status would be reliably present in listing titles.
- **Saw:** Card numbers in ~50% of titles, raw status almost never explicit, graded status in ~80% of graded listings.
- **Changed:** Matching strategy needs multi-pass logic with confidence scoring. Keyword-based grade detection is viable for POC but isn't perfect. Future feature opportunity (Grading ROI calculator) identified.

### April 2026 — eBay graded filter discovery
- **Expected:** Raw vs. graded would have to be inferred from listing titles entirely.
- **Saw:** eBay's web UI exposes a structured graded filter, suggesting the API likely does too.
- **Changed:** Raw-vs-graded strategy becomes "use API filter primarily, keyword detection as backup." Pending API verification.

### April 2026 — Mavin shutdown and failure-mode analysis
- **Expected:** Mavin was a possible third-party data source we'd evaluate.
- **Saw:** Mavin shut down. Reddit research revealed they died because users lost trust in their pricing accuracy (outlier manipulation, shipping inflation, sock-puppet sales).
- **Changed:** No third-party dependency for data — pipeline is fully Ripper's. Mavin's failure modes become Ripper's design requirements: outlier detection, shipping handling, pattern detection for manipulation.

### May 2026 — Active-vs-sold gap is volume-dependent, not constant
- **Expected:** Asking-prices on eBay would be inflated by some roughly-fixed percentage vs. sold prices, allowing a single mitigation strategy to bridge the gap across all cards.
- **Saw:** The gap is volume-dependent. High-volume cards (star base, common refractors, common autos of marquee players) have small gaps that close well after standard mitigation (outlier trimming, recency weighting, sample size minimums). Low-volume cards (numbered parallels with small print runs, vintage equivalents) have large gaps that mitigation cannot close — supply outweighs demand at the asked prices indefinitely.
- **Changed:** Path E+ design becomes tier-aware. Bulk cards use Browse API + mitigation. Top Chases and Grails require sold-data accuracy from a paid source (Marketplace Insights or licensed aggregator). `current_value` schema design must accommodate multi-source pipelines via a `value_source` tracking column or equivalent. Validates the "concentrate accuracy where users care" product principle and bounds paid-data costs by scope rather than checklist size.

---

## Maintenance

- **Add to OPEN QUESTIONS the moment a question surfaces.** Don't trust memory.
- **Move items to DECIDED only when reasoning is fully captured.** A decision without a "why" is a future bug.
- **Add to OBSERVED any time real data teaches us something.** Don't just absorb the lesson — write it down.
- **Update Schema Decisions Log on every schema change.** Schema changes without logged reasoning create archaeology for future-you.
- **Review this file at the start of every schema or pricing conversation.** It exists to prevent re-deciding things that are already decided.
