# SCHEMA-AND-DATA.md

**Purpose:** Single source of truth for every schema and data decision in Ripper (working name DIR). Captures what's been locked in, what we've observed from real data, and what's still open. This file grows as we work through the database phase. When a decision moves from OPEN to DECIDED, the reasoning is captured here so future-you, Cam, or a future developer can understand *why* the schema looks the way it does — not just *what* it looks like.

**How to use this:**
- Read top to bottom before any schema change
- Move items from OPEN QUESTIONS to DECIDED as conversations close
- Add to OBSERVED whenever real data teaches us something new
- Never delete reasoning — supersede it. Keep the history of why decisions changed.

**Last updated:** April 29, 2026

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

**1. What does `current_value` on a card mean, statistically?**
- Average of last N sales? Median? Most recent? Weighted by recency?
- Median is more resistant to outliers (Mavin's $99,999 lesson). Recent-weighted reflects current market better but reacts to noise.
- Depends on: nothing — this is a definitional choice.
- Affects: every EV/ROI calculation, every checklist price, every chart.

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

### Structural schema decisions

**7. Users table identity strategy: UUID matching `auth.users` or keep `SERIAL`?**
- Supabase Auth uses UUIDs in its `auth.users` table. Our `users` table currently uses `SERIAL` integer IDs.
- Hard to change later — every foreign key referencing `user_id` would need migration.
- Depends on: nothing — pure architecture choice.
- Affects: every user-related table (saved_boxes, price_alerts, user_collection, user_wishlist).

**8. `parent_set_id` design for sets with one format**
- Does a single-format set get a `parent_set_id`? Options: NULL (no parent concept), self-reference (set is its own parent), or only populate when 2+ formats exist.
- Depends on: how the format switcher UI handles "no other formats available."
- Affects: format switcher logic, query patterns, seeding spreadsheet structure.

**9. `parent_set_id` parent identity rule**
- When a set has multiple formats, which row is "the parent"? Always Hobby? Falls back to Jumbo if no Hobby? First format alphabetically?
- Depends on: nothing definitive — convention choice.
- Affects: seeding logic, slug generation, default-format display.

**10. Card categories review**
- Schema has 15 categories tied to baseball-style sets. Football, basketball, and hockey have slightly different card structures.
- Depends on: real data inspection across all four sports during seeding.
- Affects: `card_categories` table, tier flip (#4.7), checklist rendering.

### Data retention and refresh

**11. `price_history` retention policy**
- Keep all sales forever? Prune older than 2 years? Roll up older data into monthly averages?
- Depends on: chart needs (6+ months minimum) and storage budget.
- Affects: storage growth rate, chart query performance.

**12. eBay API refresh cadence per card**
- Daily? Weekly? Tiered by card value (high-value cards refreshed more often)?
- Depends on: eBay API rate limits, price volatility tolerance, scaling reference.
- Affects: data freshness, API quota usage, infrastructure cost.

### Source-of-truth data format

**13. How do we structure raw collected data so it survives a schema rebuild?**
- Spreadsheets currently mirror schema tables. If schema changes, spreadsheets become stale.
- Options: keep raw "facts" spreadsheets separate from schema-shaped import spreadsheets, with a transformation step between.
- Depends on: deciding what the "atomic facts" about a card and box actually are.
- Affects: data entry workflow, ability to rebuild from collected data without re-collecting.

---

## Schema Decisions Log

Running list of every schema choice with date and reasoning. Append-only — when a decision changes, add a new entry referencing the old one. Don't delete history.

*[empty — to be populated as decisions move from OPEN to DECIDED]*

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

---

## Maintenance

- **Add to OPEN QUESTIONS the moment a question surfaces.** Don't trust memory.
- **Move items to DECIDED only when reasoning is fully captured.** A decision without a "why" is a future bug.
- **Add to OBSERVED any time real data teaches us something.** Don't just absorb the lesson — write it down.
- **Update Schema Decisions Log on every schema change.** Schema changes without logged reasoning create archaeology for future-you.
- **Review this file at the start of every schema or pricing conversation.** It exists to prevent re-deciding things that are already decided.
