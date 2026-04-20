/**
 * tierPriceTrendData.js
 *
 * Dummy tier price trend data for the TierPriceTrendChart on BoxProfilePage.
 *
 * Each key matches a tab slug in TierTrendTabs. Each value is 12 months of
 * average sale prices for cards within that tier.
 *
 * Value ranges by tier (realistic for a 2023 Topps Chrome set):
 *   base       — $3–$8,    mostly flat. Base cards move slowly.
 *   rookies    — $15–$45,  gradual upward trend. Rookie demand grows over time.
 *   autos      — $40–$120, more volatile. Autograph values swing with player performance.
 *   patchAutos — $150–$400, highest and most volatile. Premium hits respond to headlines.
 *
 * During database phase: replace this with real data fetched via the price_history table,
 * keyed by tier and box set ID. The component shape (date + avgPrice) stays the same.
 *
 * This file does one job: exports dummy data. No logic, no calculations.
 */

export const DUMMY_TIER_TREND_DATA = {
  base: [
    { date: "May '24", avgPrice: 4.20 },
    { date: "Jun '24", avgPrice: 4.50 },
    { date: "Jul '24", avgPrice: 4.10 },
    { date: "Aug '24", avgPrice: 3.90 },
    { date: "Sep '24", avgPrice: 3.75 },
    { date: "Oct '24", avgPrice: 3.80 },
    { date: "Nov '24", avgPrice: 4.00 },
    { date: "Dec '24", avgPrice: 5.20 },
    { date: "Jan '25", avgPrice: 4.80 },
    { date: "Feb '25", avgPrice: 4.60 },
    { date: "Mar '25", avgPrice: 4.40 },
    { date: "Apr '25", avgPrice: 4.55 },
  ],

  rookies: [
    { date: "May '24", avgPrice: 18.50 },
    { date: "Jun '24", avgPrice: 22.00 },
    { date: "Jul '24", avgPrice: 20.75 },
    { date: "Aug '24", avgPrice: 19.50 },
    { date: "Sep '24", avgPrice: 24.00 },
    { date: "Oct '24", avgPrice: 28.50 },
    { date: "Nov '24", avgPrice: 26.00 },
    { date: "Dec '24", avgPrice: 32.00 },
    { date: "Jan '25", avgPrice: 35.50 },
    { date: "Feb '25", avgPrice: 38.00 },
    { date: "Mar '25", avgPrice: 41.25 },
    { date: "Apr '25", avgPrice: 43.00 },
  ],

  autos: [
    { date: "May '24", avgPrice: 72.00 },
    { date: "Jun '24", avgPrice: 88.50 },
    { date: "Jul '24", avgPrice: 79.00 },
    { date: "Aug '24", avgPrice: 65.00 },
    { date: "Sep '24", avgPrice: 58.00 },
    { date: "Oct '24", avgPrice: 70.00 },
    { date: "Nov '24", avgPrice: 82.00 },
    { date: "Dec '24", avgPrice: 110.00 },
    { date: "Jan '25", avgPrice: 95.00 },
    { date: "Feb '25", avgPrice: 88.00 },
    { date: "Mar '25", avgPrice: 76.50 },
    { date: "Apr '25", avgPrice: 84.00 },
  ],

  patchAutos: [
    { date: "May '24", avgPrice: 265.00 },
    { date: "Jun '24", avgPrice: 310.00 },
    { date: "Jul '24", avgPrice: 280.00 },
    { date: "Aug '24", avgPrice: 245.00 },
    { date: "Sep '24", avgPrice: 195.00 },
    { date: "Oct '24", avgPrice: 220.00 },
    { date: "Nov '24", avgPrice: 260.00 },
    { date: "Dec '24", avgPrice: 375.00 },
    { date: "Jan '25", avgPrice: 340.00 },
    { date: "Feb '25", avgPrice: 305.00 },
    { date: "Mar '25", avgPrice: 275.00 },
    { date: "Apr '25", avgPrice: 295.00 },
  ],
};
