# References

## Design References

### StockX (stockx.com / app)
- Clean, simple layout — this is the design north star
- Search bar prominently at top
- Category navigation bar across the top
- Good spacing and dimensions — nothing feels cramped
- Minimal color palette, lets the content breathe

### What to avoid
- Huge undifferentiated lists of items on the homepage (see Collectr below)
- Cluttered layouts that feel AI-generated
- Unintuitive navigation
- Using the same color schemes as competitors

## Competitor / Data References

### Sports Cards Pro (sportscardspro.com)
- **Useful for:** Scraping individual card data (checklists, card numbers, player names). Especially good for historical sets.
- **Not useful for:** Full box-level analytics — they don't do this
- **Design:** Terrible layout, clunky, not intuitive. Do not take any design cues from this site.

### Collectr (app.getcollectr.com)
- **Design:** Feels AI-built. Homepage dumps all cards and boxes in one massive list with no hierarchy or structure.
- **Takeaway:** DIR needs layered navigation — don't overwhelm users with everything at once. Guide them to what they're looking for.

### Waxstat (waxstat.com)
- **What they do:** Sealed box price comparison and tracking across 25+ retailers. Release date calendars. Recently added checklists. Monitors 27,400+ boxes with 138,000+ pricing data points. Has iOS and Android apps. Shopify integration for retailers. AI-driven market insights (WaxAI). Affiliate revenue from eBay Partner Network and Amazon Associates.
- **What they don't do:** No expected value calculation, no ROI analysis, no pull rate analytics, no card-level pricing within a set. No "which box should I buy" analytics.
- **Key difference:** Waxstat answers "where should I buy this box cheapest?" DIR answers "should I buy this box at all, and which one is best for my budget?" They're a shopping tool. DIR is an analytics tool. A collector could use both.
- **How they scale data:** Automated scraping of retailer product feeds. Box images come from retailer listings and manufacturer product images, pulled automatically during price scraping — not manually sourced. This is how they have images for 27k+ boxes.
- **Takeaway:** They've validated market demand for box-level data. Study their feature set and pricing model. They also have card shop partnerships — worth noting for Cam's distribution strategy. Their user reviews mention frustration with paywalling search — DIR should avoid adding friction to the free browsing experience.
- **Design:** Functional but not particularly clean or modern. DIR should look significantly better. Do not use their color scheme.

## Data Source References

### TCDB (tcdb.com)
- **Useful for:** Comprehensive checklists for Football, Basketball, Hockey, and Soccer. Good for card numbers, player names, team info, and set structure.
- **Not useful for:** Pull rates (TCDB does not publish pull rates). Cross-reference Beckett and Cardboard Connection for pull rate data.
- **Sport coverage:** Football (Panini exclusive until 2025, Topps post-2025), Basketball (Panini exclusive), Hockey (Upper Deck exclusive), Soccer (Panini and Topps).

### Cardboard Connection (cardboardconnection.com)
- **Useful for:** Comprehensive checklists, pull rates, product reviews for most major releases. Gets data from manufacturer press releases and sell sheets. Best single source for set-level data. Cross-reference for pull rates across all sports.
- **Not useful for:** Card pricing. They don't track sold prices.

### Baseballcardpedia
- **Useful for:** Baseball-specific checklist data and historical reference.

### Chasing Majors (chasingmajors.com)
- **Useful for:** Pack odds broken out by every box format (Hobby, Jumbo, Blaster, Mega). Very detailed pull rate data with odds per format.

### Checklist Insider (checklistinsider.com)
- **Useful for:** Parallel odds per format, box configuration details (cards per pack, packs per box, boxes per case). Clean data presentation.

### Beckett (beckett.com)
- **Useful for:** Industry standard for checklists and card identification. Historical data going back decades. Cross-reference for pull rates across all sports. Some content behind paywall.

### Topps Official Odds Page (topps.com/pages/odds)
- **Useful for:** Official manufacturer-published pack odds for all Topps sets. Primary source for pull rates.

### eBay Sold Listings
- **Useful for:** Primary source for card pricing and sealed box pricing. What cards actually sold for, not asking prices. eBay API available for programmatic access (Phase 13). Also provides box images as a byproduct of price data scraping.

### eBay Partner Network
- **What it is:** eBay's affiliate program. Free to join. 1-4% commission (collectibles at 3-4%). 24-hour cookie window. $550 USD cap per qualifying purchase.
- **When to sign up:** When real data is live on the site (Phase 10-12). Don't apply with dummy data — risks rejection.
- **How DIR uses it:** "Find on eBay" fallback link on box profiles when no distributor carries the box. Every box profile has a monetization path through either distributor Buy Now or eBay affiliate link.
