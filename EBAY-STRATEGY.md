# EBAY-STRATEGY.md

**Purpose:** Single source of truth for every decision related to eBay API access, licensing, and partnership for Ripper (working name DIR). This file exists because eBay is the central pricing data source for the entire product, the access path is gated behind a multi-stage approval process, and the License Agreement contains constraints that materially shape what Ripper can and cannot do. When a question about eBay access, license compliance, or partnership comes up, read this first.

**How to use this:**
- Read top to bottom before any eBay-related decision
- Move items from OPEN QUESTIONS to DECIDED as conversations close
- Add to OBSERVED whenever real interaction with eBay teaches us something new
- Update Schema and Roadmap impacts when constraints surface

**Last updated:** May 1, 2026 (rate limit math + Path Z fallback)

---

## Guiding Principles

### eBay is a partnership, not a vendor relationship
We do not buy data from eBay. We are granted permission to use it, conditionally, in exchange for driving revenue back to eBay through the Partner Network. This frames every product decision: features that drive eBay traffic strengthen the partnership, features that extract data without driving traffic weaken it.

### Marketplace Insights is gated, but the path is real
Sold-listing data is restricted. Approval is selective and not automatic. But Card Ladder operates under this same agreement, which proves the path exists for analytics products. The bar is positioning, application quality, and demonstrated traffic-driving intent — not the engineering.

### License compliance is a first-class architectural concern
Several License Agreement clauses are not optional design preferences. They are hard constraints (refresh cadence, deletion rules, visual separation, AI use). Building around them retroactively would be expensive. They are captured below as Schema and Roadmap impacts.

---

## The Five Paths

Multiple companies operate successfully with eBay sold-listing data as a core product (Card Ladder, Market Movers, Card Hedge, PriceCharting, 130 Point). The data access problem is solvable. There are five realistic paths to it, not one. Ripper pursues them in priority order based on cost, stability, and legitimacy.

**Path A — Marketplace Insights API (direct from eBay).**
The application path documented elsewhere in this file. Free to apply. If approved, it's the cheapest, most stable, most license-compliant option. The Reddit thread evidence suggests new approvals are uncommon, but the cost of trying is just time. Path A goes first because it dominates if it works.

**Path B — License from a data aggregator.**
Companies like Card Hedge AI and PriceCharting/SportsCardsPro sell licensed access to aggregated card pricing data. They've solved the eBay sourcing problem (somehow) and resell the result. We pay them, we get data, eBay isn't part of our problem. Cost is unknown until we contact them — Cam-led email outreach to both is queued. Real, viable Plan B.

**Path C — Bespoke partnership with eBay.**
Some approved-access companies negotiated direct business partnerships outside the standard Application Growth Check process. This is executive-level dealmaking, not a developer application. Out of scope for Ripper at our current stage but flagged as a future option if/when we have meaningful traction.

**Path D — Scraping infrastructure (Apify, Oxylabs, ScrapingBee, or DIY).**
TOS-violating but operationally feasible. Many products in this space appear to use this route despite the risks. Last-resort fallback for Ripper. Adds legal exposure, fragility, and risk to EPN affiliate revenue. Not in active consideration.

**Path E — Hybrid (Browse API + paid aggregator for top chases/grails).**
Active-listing data from Browse API powers the bulk of any box checklist (base, common parallels, common autos of star players — high-volume cards where asking prices track sold prices well after mitigation). A paid sold-data source (Path B candidates) powers Top Chases and Grails specifically — the high-value, low-volume cards where users care most about precision and where active-listing data breaks down. Confirmed viable by hands-on May 1, 2026 research session showing asking-vs-sold gap is small at high volume but unreliable at low volume. Concentrates accuracy spend where users notice it most. Probably Ripper's primary operating mode if Path A is denied — and a reasonable design even if Path A is approved (smaller, more targeted Marketplace Insights ask).

**Path Z — eBay-only (true worst case).**
The strictest fallback if both Path A (Marketplace Insights direct) AND Path B (paid aggregator) are unavailable: denied, unaffordable, or terms-incompatible. Under Path Z, ALL pricing — bulk checklist, top chases, grails — comes from eBay active listings via Browse + Feed APIs. No sold data anywhere. Operationally workable on the rate-limit side (active-listing volume fits comfortably in default Feed v1 tier per the API Call Volume Math section above). Product-wise it forces real compromises because the May 1 active-vs-sold research showed mitigation tactics break down on low-volume cards — exactly where top chases and grails live.

**Path Z product-shape options (decision needed if Path Z becomes reality):**
- **Option A — Honest labeling:** Show asking prices throughout, label everything as "Asking" not "Value." EV becomes "Estimated Asking-Price Total" not "Expected Value." Top chases get explicit "Recent sales unavailable" notes with eBay sale-history links. Most honest, weakest headline numbers vs. competitors.
- **Option B — Drop EV/ROI entirely:** Show pull rates, checklist, per-card asking prices. No aggregated box-value calculation. Differentiation drops to "best checklist + pull rates." Closer to Waxstat positioning.
- **Option C — Confidence bands:** Show EV and ROI but with explicit per-card confidence ranges based on listing volume. "Soto base: $5 ± 10%." "Chourio /99: $200 ± 60%." Total EV becomes a range, not a point estimate. Statistically most honest, hardest to market clearly.
- **Option D — Scope reduction:** Skip EV/ROI everywhere (not just legacy). Product becomes "the hobby's best box checklist database with affiliate-driven Buy Now." Massive positioning shift, simpler product, possibly more defensible against competitor data wars.

**Path Z status:** Not chosen, but documented as a real option. If both Path A and Path B fail, this is our floor. Decision on which Option (A/B/C/D) to take is a partner-level decision, not a Claude decision. Worth talking through with Cam before it becomes urgent.

**Sequencing.** Path A goes in immediately because it's free to attempt and is the cheapest option if approved. While Path A is in review, Path B research happens in parallel — Card Hedge and PriceCharting emails capture pricing/terms/durability info regardless of Path A outcome. Path E+ (Browse + paid aggregator hybrid) is the design assumption for both Path A approved and Path A denied scenarios — even with Marketplace Insights, the hybrid is a more defensible product than full-checklist sold-data dependency. Path C is a long-term option, Path D is a last resort, Path Z is the documented worst-case fallback if everything else fails.

The framing shift this represents: the original DECIDED entry "Ripper's core EV/ROI architecture is allowed under the License Agreement" was strictly true but practically optimistic. The corrected framing is "Ripper's core architecture is achievable through multiple paths. Path E+ (hybrid) is now the design assumption. Path A reduces cost and adds precision but is no longer make-or-break. Path Z is documented so we don't have to improvise if the worst case happens."

---

## API Call Volume Math

Real default limits per API per the eBay API Call Limits documentation. These are the limits if our application is approved at default tier — accessing Buy APIs at all requires Application Growth Check approval per the asterisk in eBay's documentation.

| API | Default daily limit | Ripper's estimated daily need | Within default? |
|---|---|---|---|
| Browse API | 5,000 | ~2,000-5,000 (ad-hoc lookups, since Feed handles bulk) | Yes, with cushion |
| Feed v1 API | 75,000 | ~24 (one feed per category × 4 refresh cycles × 6 categories) | Yes, easily |
| Marketplace Insights | 5,000 | ~150,000-200,000 (top chases × box count, daily refresh) | **No — 30-40× over** |
| Notification API | 10,000 | hundreds (subscription management + admin) | Yes |

**Volume assumptions used above:**
- 2,000 boxes at scale (1,200 at beta)
- ~200 cards per modern box checklist
- ~50-200 top chases/grails per box (Marketplace Insights scope)
- 6-hour refresh on listing data (License Agreement minimum)
- 24-hour refresh on non-listing data (License Agreement minimum)

**Architectural conclusion:**
- Active-listing volume fits comfortably in default tiers via Feed v1 API. We do NOT need elevated Browse rate limits as long as Feed v1 handles bulk. This is a strong "good API citizen" signal in the application.
- Marketplace Insights is the ONLY API where we need a meaningful rate-limit increase. Estimated ask: somewhere in the 250,000-500,000 calls/day range (5-10× default) to support 2,000 boxes × top chases/grails refresh patterns with safety margin.
- Notification API default is fine. Push-driven architecture means low ongoing call volume regardless of scale.

**Application package implications:**
- Browse API: ask for default tier with modest cushion (maybe 10,000-25,000/day) for safety margin
- Feed v1 API: default fine, no elevated ask needed
- Marketplace Insights: elevated ask required (5-10× default)
- Notification API: default fine, no elevated ask needed

**Open questions before final application submission:**
- Does Marketplace Insights support batched lookups (multiple cards per call)? If yes, our ~200,000 calls/day estimate could drop significantly. Sandbox-verify before submitting.
- Does Feed v1 API for sports cards return one snapshot per top-level category, or does it require finer-grained pulls? Affects the ~24/day estimate.
- What's the actual feed file size for sports cards? Affects local cache architecture decisions, not rate limits directly.
- Both questions should be answered during sandbox testing in Phase 3 before the application goes in.

**Source:** Real default limits from https://developer.ebay.com/develop/get-started/api-call-limits, validated May 1, 2026.

---

## DECIDED

Items here have been explicitly locked in through partner discussion or document review. Each includes the reasoning so it can be revisited if circumstances change.

### Ripper's core EV/ROI architecture is allowed under the License Agreement
- **What:** Calculating EV, ROI, and card-level pricing from eBay sold-listing data is permitted IF Marketplace Insights access is granted.
- **Why:** License Agreement Section 8.5.3 explicitly carves out the right to "develop pricing tools" using Restricted APIs data, "only upon receiving eBay's express prior written consent." Marketplace Insights approval IS that consent. The general clause prohibiting "deriving average selling price for any eBay category" (Section 8.1.4) is the default rule that Marketplace Insights overrides.
- **Source:** eBay API License Agreement, fetched May 1, 2026.
- **Implication:** No need to cut EV/ROI from scope. The architecture is fine. The path is to get the approval — through Marketplace Insights direct (Path A), or through a downstream paid aggregator that already has the access (Path B), or through the hybrid Path E. See The Five Paths section. Architecture allowed != approval guaranteed; multiple realistic paths exist.

### EPN application comes before Marketplace Insights application
- **What:** eBay Partner Network membership is step 1 of the Buy API access process. Marketplace Insights cannot be applied for without EPN approval first.
- **Why:** Documented in eBay's "Get Started on a Buying Application" page. EPN approval is fast (hours to days) and the bar is "do you have a real website." Marketplace Insights approval is slow (weeks) and requires EPN status.
- **Source:** developer.ebay.com/develop/get-started/get-started-on-a-buying-application
- **Implication:** EPN gets applied for as soon as hobbyripper.com has the rename pass done, real images, and real About/Contact pages. Marketplace Insights waits until EPN is approved AND a sandbox demo is built.

### Sandbox integration is a real workstream
- **What:** Marketplace Insights production access requires a working application reviewable on the eBay sandbox. We will build the integration against eBay's sandbox environment before applying for production access.
- **Why:** eBay explicitly says "complete the Production application process and obtain approval before you invest significantly in application development and testing." They want partner conversations early. Sandbox is free, open to anyone with a developer account, and uses fake test data — it doesn't require approval to use.
- **Source:** Buy APIs Requirements doc + License Agreement Section 8.2.8.
- **Implication:** This is real development work that happens before any approval is in hand. It is not wasted — it becomes the production integration once approved. Mock package and sandbox demo are part of the application.

### Build sequence pre-Marketplace-Insights-application
The following must be true before submitting the Marketplace Insights application:
1. Rename pass complete (DIR → Ripper across codebase, docs, UI)
2. hobbyripper.com live and looking like a real product
3. Manual image pass complete (homepage + 2024 Topps Chrome Baseball profile)
4. About page rewritten with real, partner-network-aware content
5. Contact page with a real email address
6. Help page with 5-10 real FAQ entries
7. Find on eBay button rendered on the Topps Chrome profile (UI placeholder is fine)
8. EPN application submitted and approved
9. Browse API integration wired up (asking-price data, real OAuth flow)
10. Sandbox-based Marketplace Insights integration built and demoable
11. Mock package describing user flows from Ripper to eBay
12. LLC formed (see "LLC formation moves up the priority list" below)

### LLC formation moves up the priority list
- **What:** Ripper LLC must be formed BEFORE the Marketplace Insights production access agreement is signed.
- **Why:** License Agreement Section 15 contains broad indemnification language that flows through to whoever signs as the developer. Signing as individuals exposes Zach and Cam personally to legal claims arising from anything in the application. An LLC contains that exposure.
- **Source:** License Agreement Section 15 (Indemnification).
- **Implication:** PRE-BETA-CHECKLIST.md item #9.2 (LLC formation deferred until revenue) is superseded for the eBay-specific timeline. LLC formation must complete before contract signing in step 4 of the Buy API approval process. Capital cost: ~$50-300 depending on state filing fees. Cam owns this.

### eBay can audit and terminate at any time
- **What:** License Agreement Section 12.1 grants eBay audit rights over Ripper's systems and data handling. Section 16.2 grants eBay the right to terminate access for any reason, with or without notice.
- **Why:** This is standard for restricted-API partnerships, but it is real existential risk to the business.
- **Source:** License Agreement Sections 12.1 and 16.2.
- **Implication:** Ripper post-Marketplace-Insights is a business operating at eBay's discretion. A Plan B for what happens if access is yanked must be documented separately (currently in OPEN QUESTIONS below). Until Plan B is real, the partnership relationship needs to be protected actively, not assumed.

### Apify and other scraping solutions are off the table for production
- **What:** Third-party eBay scrapers (Apify, etc.) will not be used as Ripper's pricing data source.
- **Why:** Scraping violates eBay's Terms of Service. Using a scraper while applying for Marketplace Insights would likely surface during review and result in instant denial. Building Ripper on scraped data would also be a stability risk (scrapers break frequently) and a moral hazard (poisoning the legitimate path for short-term convenience).
- **Source:** Strategic decision May 1, 2026.
- **Implication:** Apify and similar tools may be used for one-off research (verifying API behavior, sanity-checking output) but not as the production pipeline.

### Single combined application for rate limit + Marketplace Insights + Feed API + Notification API
- **What:** When the Application Growth Check submission goes in, the application requests all four together as one cohesive partnership package: Browse API rate limit increase, Marketplace Insights API access, Feed API access, and Notification API subscription topics.
- **Why:** Application Growth Check is a single review process for both rate limit increases and restricted API access. Submitting two separate applications doesn't preserve negotiating leverage (eBay isn't negotiating, they approve or deny). One cohesive application telling a complete partnership story is stronger than fragmented asks.
- **Source:** eBay Application Growth Check documentation + strategic decision May 1, 2026.
- **Implication:** The application is broader than just sold-listing data. Frame as: Browse API for current state, Marketplace Insights to make analytics accurate enough to drive eBay traffic, Feed API for efficient bulk listing refresh, Notification API for price-alert features that drive user return visits. All four serve the same goal of driving more EPN-tracked traffic to eBay.

### Browse API Path E mitigation tactics for asking-price-derived analytics
- **What:** If Path E (Browse API only, no Marketplace Insights) becomes the operating mode, asking-price data can be made meaningfully more useful through specific mitigation tactics rather than displayed raw.
- **Why:** Asking prices are inflated vs. sold prices, but the inflation is bounded and patternable. Standard outlier handling, listing recency weighting, sample size minimums, and honest UI labeling can produce analytics that are degraded but still useful. Better than scraping. Simpler than third-party partnerships. Most license-compliant operating mode.
- **Source:** Strategic discussion May 1, 2026.
- **Mitigation tactics for Path E:**
  - Trim the highest 25% and lowest 10% of listings before averaging (outlier handling)
  - Filter by listing format — favor auction listings over fixed-price BIN listings (auctions price closer to market)
  - Filter by listing recency — weight listings posted in the last 7 days more heavily than older active listings (older = unsold = overpriced)
  - Require minimum sample size — if fewer than 5 active listings exist for a card, mark "not enough data" rather than display a single-listing-driven price
  - Cross-check with completed-but-not-sold listings — Browse API returns these and they signal price ceilings the market rejected
  - Honest UI labeling — "Estimated value based on active listings" with a tooltip explaining the methodology, not a "real" price label
- **Implication:** Path E is a real fallback that produces a working product, not a shell. Worth keeping in design awareness even while pursuing Path A. Schema does not need any changes to support this — same `current_value` column on `cards`, different population strategy.

### Concentrate accuracy spend where users care most
- **What:** Pricing data quality is not uniform across a box checklist. The bulk of cards (base, common parallels, common autos of star players) get Browse-derived active-listing prices with mitigation. Top Chases and Grails get paid sold-data accuracy. EV is calculated on the combined data with transparent coverage labeling.
- **Why:** May 1 research showed Browse-only mitigation works well at high volume but breaks at low volume — and low volume is exactly where Top Chases and Grails live. Users care most about precision on the cards that drive their buying decision (the headline hits), and tolerate degraded accuracy on the bulk of the checklist. Concentrating paid-data spend on the 50-200 highest-value cards per box (rather than every card in the checklist) makes the unit economics of paid data much more favorable.
- **Source:** Active-vs-sold research session May 1, 2026.
- **Implication:** Paid aggregator costs scale with cards-priced-via-paid-data, not total cards. For ~1,200-2,000 boxes × 50-200 top chases each, the paid-data call volume is bounded and predictable. Makes Path B / Path E+ economically tractable in a way "price every card via paid data" never was. Also strengthens Path A pitch — Marketplace Insights ask becomes "for precision on top chases and grails," not "for every card in our database."

---

## License Agreement — Schema and Roadmap Impacts

The License Agreement contains several clauses that translate directly into hard architectural and roadmap constraints. These must land in the schema, the data pipeline, and the product roadmap.

### Refresh cadence is mandated, not optional

License Agreement Section 8.1.3 requires:
- Listing information (active prices, availability) refreshed every **6 hours minimum**
- Other eBay content refreshed every **24 hours minimum**

If our display is older than these windows, we must disclose how much older.

**Impact:**
- Current PRE-BETA-CHECKLIST and project brief mention "weekly during beta, daily post-beta" — this is non-compliant for active listing data and needs to change.
- Card-level pricing tied to active listings: 6-hour refresh.
- Sold-price-derived analytics (EV, ROI, current_value): 24-hour refresh.
- Box pricing tied to active sealed-box listings: 6-hour refresh.
- Pull rates (manufacturer-sourced, not eBay): unaffected, refresh on whatever cadence we want.

**Action item:** Update refresh-cadence references in PRE-BETA-CHECKLIST.md and project-brief.md (deferred to next docs sync).

### Delete-when-unavailable rule

License Agreement Section 8.1.2.b.1 requires that when eBay content is no longer publicly available, it must be deleted from the application.

**Impact:**
- We need a cleanup pipeline that detects removed eBay listings and purges related rows from `price_history`.
- The eBay API verification session must include "what does the API return when an item is removed" so we know how to detect this.
- Affects SCHEMA-AND-DATA.md OPEN QUESTION #11 (price_history retention policy) — adds a hard requirement on top of our own retention preferences.

**Action item:** Add cleanup pipeline to the eBay API integration build phase.

### No mixing eBay data with non-eBay data in displays

License Agreement Section 8.1.2.b.2 requires that "eBay Content in a Public Display may not be co-mingled or combined with non-eBay Content."

**Impact:**
- The Buy Now system on box profile pages needs visual separation between distributor listings (Dave & Adam's, Blowout Cards, etc.) and the eBay fallback link. Cannot be one merged "best price across providers" comparison element.
- Likely UI: a distributor row, then a clearly separated "Find on eBay" element. Open question whether they can sit side-by-side or need to be in different sections of the page.
- We may want to confirm the exact line during the application review.

**Action item:** Update Buy Now UI design (when built) to enforce visual separation. Capture in PRE-BETA-CHECKLIST.md when Buy Now system is being built.

### No AI ingestion of Marketplace Insights data without explicit consent

License Agreement Section 8.5.2.a is the most restrictive clause for Ripper's roadmap. It prohibits ingesting or incorporating Restricted APIs data into any AI model not provided by eBay, without eBay's prior written consent.

**Impact on roadmap features:**
- **AI photo scan (image → box identification):** ALLOWED. This Claude API call doesn't ingest eBay sold-price data. Image goes in, structured box identifier comes out, no eBay data involved.
- **AI trend summaries (price data → plain English summary):** BLOCKED by default. This feature feeds Marketplace Insights data into Claude. Requires explicit additional written consent from eBay during partnership conversations. May not be granted.

**Action item:** Move AI trend summaries from "post-MVP roadmap" to "blocked, requires explicit consent" status. Mention in PRE-BETA-CHECKLIST.md.

### No bulk redistribution of Marketplace Insights data

License Agreement Section 8.5.2.b.4 prohibits electronic distribution via API of Restricted APIs data, in raw or aggregated form.

**Impact:**
- If Ripper ever offers an API for partners (not currently planned, but a possible post-launch direction), that API cannot return eBay-derived pricing data.
- Aggregations are okay to display in Ripper's own UI.
- Affects future product strategy if Ripper-as-a-data-platform ever comes up.

**Action item:** Document as a future-roadmap constraint. No immediate action.

### Eternal license to eBay over Ripper itself

License Agreement Section 8.5.3.1 grants eBay an irrevocable, royalty-free, worldwide license to "access, run, publicly display, perform, redistribute, reproduce, modify, host, translate, store and other use" Ripper itself when Ripper is built using Marketplace Insights data.

**Impact on acquisition strategy:**
- A future buyer (Fanatics, Topps, Panini) acquiring Ripper inherits this license to eBay.
- eBay can use Ripper's outputs for their own marketing and pricing tools, with no compensation to us or any future buyer.
- This materially reduces the leverage in any acquisition negotiation. Buyer is not getting exclusive use against eBay.

**Action item:** Cam should know this before any acquisition conversation. Document does not block any current decision but reframes acquisition strategy.

### 10-day data destruction on termination

License Agreement Section 16.3 requires that on termination of the agreement, all eBay-derived data must be destroyed within 10 days.

**Impact:**
- Our entire `price_history` and `box_price_history` archive is conditionally ours, not unconditionally ours.
- We can build deep historical pricing data over years, but we cannot treat it as a permanent business asset.
- If eBay terminates, we lose all of it within 10 days.

**Action item:** Reinforces the importance of a Plan B for non-eBay data sources. Captured in OPEN QUESTIONS.

---

## OBSERVED

Real-world observations from researching eBay's documents and process. These inform decisions but aren't decisions themselves.

### April–May 2026 — Marketplace Insights is "not open to new users at this time"

eBay's own Buy API Support by Marketplace page contains the phrase "The Marketplace Insights API is restricted and not open to new users at this time." A developer building a sports/Pokémon card identification app (CollectIQ) reported in December 2025 that they applied and were told access could not be granted.

**What this tells us:** The bar is high but not zero. Card Ladder has access. Other approved partners exist. Denials happen specifically to small / personal / non-business projects without a clear traffic-driving model. A strong application from a real business with EPN credentials and a coherent partnership pitch can still get through.

**Implication:** Application quality matters more than I would have assumed. Mocks, data flows, EPN status, real-business framing — all material to success.

### May 1, 2026 — Reddit r/Flipping evidence on Marketplace Insights denials

Reddit thread (r/Flipping, post ID uaz1wt) surfaced direct developer experiences applying for Marketplace Insights access. Justin Resells (ThisWeekInFlips, "This Week in Flips" creator) reported having an app in production for 2+ years with thousands of users, EPN membership, and applications submitted — no approval. Multiple other developers in the same thread reported similar denials, including a developer six months prior to the snapshot who had submitted multiple support tickets after registering an EPN-affiliated app. Justin's most recent reply (16 days before snapshot) confirmed: "They still do not provide access to sold data via the API."

**What this tells us:** New Marketplace Insights approvals appear rare regardless of application strength. Card Ladder and similar incumbents may be grandfathered from before the October 2020 restriction. The bar for new applicants in 2025–2026 is much higher than the docs suggest.

**Implication:** Path A (direct Marketplace Insights approval) should be pursued but not assumed. Plan B (paid aggregator partnership) needs parallel investigation, not reserve status. Captured in The Five Paths section above.

### April 2026 — EPN approval is fast and low-bar

Per eBay's seller center, EPN approval is "usually within just a few hours." No minimum traffic requirements. Bloggers with no audience get accepted.

**What this tells us:** EPN is not where rejection risk lives. Get this one done quickly and use the approval status in the Marketplace Insights application.

### May 1, 2026 — Multiple operators have eBay sold-listing data at scale

The card pricing aggregator landscape includes at least: Card Ladder (PSA-owned, formal API access likely grandfathered), Market Movers (Sports Card Investor company, 2.5M+ cards tracked, 7,500+ sealed products, source undisclosed), Card Hedge AI (newer, claims live data from "eBay, Fanatics, Heritage Auctions, and more," explicitly partner-friendly with API and MCP support), PriceCharting/SportsCardsPro (paid API at published rates), 130 Point (consumer app, no API, free with paid collection management feature).

**What this tells us:** The "eBay data is impossible to access at scale" framing is wrong. Multiple successful businesses operate with this data as their core product. The access path varies by company (grandfathered, partnership, scraping, licensing, or bespoke deal), but the data is available downstream of eBay through enough channels that Ripper has real options.

**Implication:** Even if Path A (Marketplace Insights direct) fails, Path B (license from Card Hedge or PriceCharting) is a real fallback with established pricing models. Worth contacting both for actual quotes during the Path A waiting period.

### May 1, 2026 — Active-vs-sold research on 5 cards from 2024 Topps Chrome Baseball

Hands-on manual research using eBay UI active listings vs. eBay sold listings filter, across 5 cards spanning the value/volume spectrum:

1. **Soto base #1 raw (high-volume star base):** Active and sold averages close after mitigation. Mitigation tactics work well at this volume tier.
2. **Chourio base auto (modern hot rookie auto):** Mixed. Some listings close to sold, others ~$100 inflated on BIN. Mostly tractable with outlier trimming.
3. **Soto refractor raw (mid-tier parallel):** Active reasonably tracks sold after averaging.
4. **Chourio numbered refractor /99 (low-volume numbered parallel):** Way off. Mitigation tactics do not save it. Asking prices significantly inflated.
5. **2018 Soto base #150 (older equivalent):** No active listings, no sold listings. No data either side.

**Key observations:**
- Active listings outnumber sold listings significantly across all cards — the supply side has more inventory than the demand side absorbs at posted prices.
- Asking-vs-sold gap is small at high volume (cards 1, 2, 3) and large at low volume (card 4).
- Older / vintage cards have thin data on both sides (card 5).
- The asking-vs-sold gap is not constant — it's a function of market activity for that specific card.

**Implications:**
- Path E (Browse API only with mitigation) is viable for the bulk of any checklist where market volume is sufficient: base cards, common parallels, common autos of star players. This is most of the cards in any modern box.
- Path E breaks down on low-volume cards: numbered parallels with small print runs, vintage/legacy cards, obscure parallels. These are also the cards where users care most about precision (Top Chases and Grails).
- The right answer is hybrid: Browse API for the bulk, paid sold-data source for Top Chases and Grails. Concentrates accuracy spend where users care most.
- Legacy boxes (1995-2017) are confirmed to have thin data on both sides — reinforces existing decision to skip EV/ROI for legacy product.

### May 2026 — License Agreement was updated September 3, 2025

The current License Agreement we read is dated September 3, 2025, with a banner indicating "significant enhancements" including data protection measures and AI restrictions. Future updates can happen at any time with 30 days' notice and are binding on continued API use.

**Implication:** This file becomes stale. Any change to Ripper's eBay relationship needs to start with re-reading the current License Agreement. Calendar reminder for periodic re-reads (every 6 months minimum).

---

## OPEN QUESTIONS

### 1. eBay API verification — sandbox capability check
- Confirm what the eBay sandbox actually exposes for Marketplace Insights testing
- Confirm whether sandbox returns realistic test data or stub data
- Confirm whether the OAuth flow in sandbox matches production
- Confirm the rate limit shape in sandbox

**Depends on:** Hands-on session with a sandbox account, scheduled before sandbox integration build begins.

### 2. Sandbox vs. production data display strategy
- Question: When sandbox integration is live but production access is not yet granted, what does the live hobbyripper.com show on the box profile?
- Options: (a) Sandbox data with a "Beta" banner, (b) Browse API asking-price data, (c) Placeholder language with no live numbers, (d) Hybrid
- Each option has tradeoffs for credibility vs. accuracy vs. application strength

**Depends on:** Sandbox integration being built, then deciding what to render with what's available.

### 3. Plan B if Marketplace Insights is denied — ACTIVE WORKSTREAM, NOW HIGH PRIORITY
- Promoted from question to active workstream as of May 1, 2026
- Promoted again to high priority after May 1 active-vs-sold research confirmed Path E+ hybrid is the design assumption regardless of Path A outcome
- Plan B = paid aggregator licensed for Top Chases and Grails specifically (not full checklist)
- Specific candidates to investigate now, not later:
  - **Card Hedge AI** — has API + MCP support, partner-friendly, contact form on ai.cardhedger.com/api-services. Email Cam-led, ask four questions: (1) pricing for paid-data calls scoped to Top Chases and Grails only (~50-200 cards per box × 1,200-2,000 boxes, with refresh frequency TBD), (2) eBay data sourcing method (direct API access, scraping, or aggregation), (3) SLA and stability commitments, (4) terms-of-service compatibility with combining their data with Browse API active-listing data
  - **PriceCharting / SportsCardsPro** — published paid API model, predictable pricing, sportscardspro.com — get a quote with the same scoped call-volume estimate
  - **Card Ladder direct partnership** — owned by PSA/Collectors Universe, no public API listed, would require business-development outreach. Lower priority unless smaller paths fail.
- Both emails should happen this week — quotes inform the design even if Path A succeeds, because Path E+ hybrid wants paid sold-data for top chases regardless
- Decision tree: Path A approved → use Path A as primary for top chases AND bulk, log Path B research as cost comparison and design redundancy. Path A denied → use Path B as primary for top chases, Browse API for bulk (full Path E+).

### 4. AI trend summaries — drop or pursue consent?
- Section 8.5.2.a blocks AI ingestion of Marketplace Insights data by default
- Question: Do we drop the feature from the roadmap, or pursue explicit written consent during partnership conversations?
- Pursuing consent may complicate the application and slow approval. Dropping the feature loses a planned differentiator.

**Depends on:** Whether the approval process is going smoothly enough that asking for an additional carve-out is reasonable.

### 5. Buy Now visual separation requirements
- Section 8.1.2.b.2 requires visual isolation of eBay content from non-eBay content
- Question: How strict is the line in practice? Side-by-side with separator lines? Different page sections? Different pages entirely?
- We'd want to confirm during application review rather than guess.

**Depends on:** Direct conversation with eBay during the application process.

### 6. Refresh cadence implementation
- Section 8.1.3 requires 6-hour refresh on listings, 24-hour on other content
- Question: How do we implement this without burning eBay API quota?
- Tiered refresh (hot cards more often, base cards less often) becomes more constrained — base cards still need to refresh within 24 hours of any pricing display change
- May affect our Supabase Pro storage budget if refresh frequency drives more `price_history` rows than projected

**Depends on:** Final eBay API rate limits granted, real refresh testing in sandbox.

---

## Application Package — Contents

When the Marketplace Insights application goes in, the package includes:

1. **EPN approval email** (attached as confirmation we're an approved Partner Network member)
2. **Buy API Application questionnaire** (the form eBay sends after EPN approval)
3. **Mocks of the user experience**
   - Homepage flow
   - Browse → box profile flow
   - Box profile with Find on eBay buttons highlighted
   - Top Chases / Grails with eBay links per card
   - Mocks of where Marketplace Insights data is displayed
4. **Data flows describing the user journey**
   - How a user discovers a box
   - How they research it
   - How analytics drive purchase decisions
   - How they end up clicking through to eBay
5. **Sandbox testing instructions** (login credentials for our sandbox demo, walkthrough of what reviewers can test)
6. **Estimated call volume per requested API**
   - Browse API rate limit increase justification (active listing refresh estimates for full checklists across all sports)
   - Marketplace Insights call volume — scoped to Top Chases and Grails only (~50-200 cards per box × 1,200-2,000 boxes, refresh frequency TBD). Smaller, more targeted ask than full-checklist sold-data dependency. Frame as "precision on the cards that drive purchase decisions."
   - Feed API usage (bulk listing file frequency)
   - Notification API subscription topic estimates
7. **Cover letter** explaining business model, partnership intent, and revenue commitment to eBay

Cam owns the mocks and data flows package; this is closer to his lane than Zach's. Sandbox testing instructions and call volume estimates are technical and produced by Zach.

---

## Roadmap Sequencing

This supersedes the eBay-related portions of CONTEXT.md's Full Roadmap and PRE-BETA-CHECKLIST.md's eBay Integration section. Other docs will sync to this in the next docs update.

### Phase 1 — Foundation (current focus)
- POC database hookup
- 2024 Topps Chrome Baseball profile populated
- Manual image pass (homepage + Topps Chrome)
- Rename pass: DIR → Ripper
- Real About, Contact, Help pages
- Find on eBay button rendered on box profile

### Phase 2 — EPN Application
- Submit EPN application as soon as Phase 1 is complete
- Expected response: hours to days
- Use the wait time productively (Browse API integration, sandbox setup)

### Phase 3 — Browse API + Sandbox Integration
- Wire up Browse API (free, immediate access, gives us active listings data)
- Set up eBay sandbox account
- Build Marketplace Insights integration against sandbox
- Build mock package
- Estimate call volumes for the application
- LLC formation completes during this phase

### Phase 4 — Marketplace Insights Application + Path B Research (parallel, both urgent)
**Path A track:**
- Submit Buy API Application questionnaire (single combined ask: Browse rate limit + Marketplace Insights scoped to top chases/grails + Feed API + Notification API)
- Reply with mocks and data flows
- 10 business days for EPN to approve or deny
- If approved, open support ticket with Developer Support for production access
- Application Growth Check process: 5-7 business days
- Contract negotiation: variable
- Production access granted: full pipeline can flip to live data

**Path B research track (parallel during Path A wait, urgent regardless of Path A outcome):**
- Email Card Hedge AI for pricing/sourcing/SLA/TOS info, scoped to top chases and grails call volumes (Cam-led)
- Email PriceCharting/SportsCardsPro for pricing on the same scoped call volumes (Cam-led)
- Document quotes and terms in EBAY-STRATEGY.md OBSERVED section
- Path B information is needed to finalize the Path E+ hybrid design even if Path A is approved — paid sold-data for top chases is the design assumption regardless

**Decision point at end of Phase 4:**
- Path A approved → proceed with Path A + paid Path B for top chases (Path E+ design)
- Path A denied + Path B viable → proceed with Path B for top chases + Browse for bulk (full Path E+)
- Path A denied + Path B not viable → reconsider scope (graded-only reframe, marketplace pivot, or other strategic redirection — see Strategic captures pending in Docs Sync section)

### Phase 5 — Production Integration
- Switch sandbox integration to production credentials
- Full data seeding of all four sports begins
- Refresh cadence enforced per License Agreement (6h listings, 24h other content)
- Cleanup pipeline for delete-when-unavailable goes live

---

## Maintenance

- **Read this file before any eBay-related decision.** It exists to prevent re-deciding things that are already decided.
- **Add to OPEN QUESTIONS the moment a question surfaces.** Don't trust memory.
- **Move items to DECIDED only when reasoning is fully captured.**
- **Re-read the License Agreement every 6 months minimum.** It updates and our compliance must update with it.
- **Update Schema and Roadmap impacts whenever new constraints surface.**

---

## Docs Sync — Pending

The following updates to other docs are pending and should happen in a focused Claude Code session, not piecemeal:

- **CONTEXT.md:** Update "What's Been Decided and Locked" with EPN-first sequencing and the five-paths framing. Update Full Roadmap with the corrected eBay phases including parallel Plan B research. Add reminder bullets about refresh cadence and AI restrictions.
- **PRE-BETA-CHECKLIST.md:** Update Section 6 (eBay Integration) to reflect the EPN → Buy API → Application Growth Check path. Add new items: 6-hour refresh cadence, delete-when-unavailable cleanup pipeline, Buy Now visual separation, AI trend summaries blocked status, LLC formation pre-contract, Path B parallel research workstream. Cross-reference EBAY-STRATEGY.md throughout.
- **project-brief.md:** Update the eBay Partner Network reference in the Business Context section. Update the AI Summaries reference under Tech Stack to note it's blocked by default and requires explicit consent. Update the Refresh Cadence section under Data Strategy. Add brief mention of Path B aggregator option.
- **SCHEMA-AND-DATA.md:** Update OPEN QUESTION #11 (price_history retention policy) to note the License Agreement deletion requirement.

These edits do NOT need to happen tonight. They should be batched into a single focused session and applied surgically.

**New strategic captures pending (NOT for tonight):**
- Marketplace pivot idea (Reverb-for-cards style) — flagged during May 1 session as "half-joking but not crazy." Should be captured in a future strategic-directions document if/when it gets serious consideration. Not on the active roadmap.
- Graded-card-only pricing reframe — alternative product positioning that sidesteps eBay entirely. Captured in conversation but not in any doc yet.
