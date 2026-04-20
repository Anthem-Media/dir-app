# DIR (Diamond in the Rough) — Hard Requirements

**Created:** April 20, 2026
**Purpose:** Documents hard architectural and platform requirements that are not preferences or guidelines. These are decisions that require deliberate review before they can be changed. Do not deviate from these without explicit sign-off from both partners.

---

## iOS App — Authentication Only

### Requirement
The DIR iOS app is authentication only. There is no free tier, no in-app signup flow, and no in-app purchase system.

### What the app does
- Opens to a login screen
- Includes a single line directing users without credentials to DIRapp.com
- Once authenticated, users have full premium access to all features
- Without valid credentials, the app has no usable functionality

### What the app does NOT do
- No signup or account creation flow
- No subscription selection or pricing screen
- No in-app purchase or payment processing of any kind
- No free browse mode or unauthenticated content

### Why
This is an intentional architectural decision to avoid Apple's in-app purchase (IAP) requirements. Any subscription purchased inside an iOS app is subject to Apple's 15–30% revenue cut and their billing infrastructure. By keeping all acquisition and payment on the web, DIR retains 100% of subscription revenue (minus Stripe's processing fee of ~2.9% + $0.30).

### Payment
All user acquisition and billing happens exclusively on the web at DIRapp.com via Stripe. The iOS app never touches payment processing.

### Enforcement
This requirement applies to the iOS app only. The web app has its own access model (see below). Do not build any payment or signup functionality into the iOS codebase under any circumstances. This requirement is not to be changed without a deliberate architectural review and sign-off from both partners.

---

## Web App — Access Model

### Free (unauthenticated)
- Browse card boxes by sport, year, manufacturer, and format
- View box set listings (name, format, year, thumbnail)
- Search and filter the full catalog

### Paid (authenticated + active subscription)
- Individual box profiles (checklist, pull rates, EV, ROI, market trends)
- Top Chases and Grails tabs
- Price history charts
- All analytics features

### What is never free
- Box profile pages
- Pull rate data
- Card-level pricing
- EV and ROI calculations
- Market trend charts

The free browse experience exists on the web only. It does not exist on iOS.

---

## Payment Processor

**Stripe** is the payment processor for all DIR subscriptions. No other payment processor is to be integrated without partner review. Stripe handles all billing, subscription management, and receipts on the web.

The iOS app does not integrate with Stripe or any other payment processor. It validates authentication state only.

---

## Grails Tab — EV/ROI Exclusion

Cards with `print_run` ≤ 10 are classified as Grails and are excluded from all EV and ROI calculations. This is a hard data integrity requirement, not a UI preference. Including near-impossible pulls in expected value math would produce misleading results for users and undermine the product's credibility.

The /10 cutoff is a locked product decision. It is not to be changed without partner review.

Grails are displayed in a separate tab on the box profile page with a `circulation_status` badge indicating whether the card is still in circulation, has been pulled and sold, or has unknown status.

---

## Data Integrity

- No user-submitted data influences the dataset. Ever.
- No YouTube break scraping (survivorship bias makes this unreliable).
- No AI-generated pull rate estimates or price predictions.
- Published manufacturer odds + eBay sold listings = the only valid data sources for pull rates and pricing.
- Sets without published manufacturer odds are flagged "Unavailable" — EV is skipped for those boxes.

These rules are permanent. They are not to be relaxed for speed or convenience.
