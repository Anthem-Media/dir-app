/**
 * tierPriceTrendData.js
 *
 * Dummy tier price trend data for the TierPriceTrendChart on BoxProfilePage.
 *
 * Each key matches a tab slug in TierTrendTabs. Each value is 8 weekly data points
 * representing the average sale price of the top 10 eBay sold listings for cards
 * within that tier — which is what this chart will show when real data is connected.
 *
 * Value ranges by tier (realistic for a 2023 Topps Chrome set):
 *   base       — $2–$8.    Base cards are plentiful; prices move slowly.
 *   rookies    — $15–$45.  Rookie demand fluctuates with player performance.
 *   autos      — $40–$120. Autograph values swing more widely.
 *   patchAutos — $80–$300. Premium hits; highest values and most volatile.
 *
 * TODO: Replace with real data from price_history table — average sale price of
 * top 10 eBay sold listings per tier per time period, sourced from price_history
 * where source = 'ebay', grouped by tier and sale_date.
 *
 * This file does one job: export dummy data. No logic, no calculations.
 */

export const DUMMY_TIER_TREND_DATA = {
  base: [
    { date: 'Week 1', avgPrice: 5.20 },
    { date: 'Week 2', avgPrice: 4.80 },
    { date: 'Week 3', avgPrice: 5.50 },
    { date: 'Week 4', avgPrice: 4.20 },
    { date: 'Week 5', avgPrice: 3.90 },
    { date: 'Week 6', avgPrice: 4.60 },
    { date: 'Week 7', avgPrice: 5.10 },
    { date: 'Week 8', avgPrice: 4.75 },
  ],

  rookies: [
    { date: 'Week 1', avgPrice: 22.50 },
    { date: 'Week 2', avgPrice: 28.00 },
    { date: 'Week 3', avgPrice: 24.75 },
    { date: 'Week 4', avgPrice: 19.50 },
    { date: 'Week 5', avgPrice: 31.00 },
    { date: 'Week 6', avgPrice: 38.50 },
    { date: 'Week 7', avgPrice: 35.00 },
    { date: 'Week 8', avgPrice: 42.00 },
  ],

  autos: [
    { date: 'Week 1', avgPrice: 68.00 },
    { date: 'Week 2', avgPrice: 85.00 },
    { date: 'Week 3', avgPrice: 74.50 },
    { date: 'Week 4', avgPrice: 55.00 },
    { date: 'Week 5', avgPrice: 92.00 },
    { date: 'Week 6', avgPrice: 110.00 },
    { date: 'Week 7', avgPrice: 88.00 },
    { date: 'Week 8', avgPrice: 78.50 },
  ],

  patchAutos: [
    { date: 'Week 1', avgPrice: 185.00 },
    { date: 'Week 2', avgPrice: 240.00 },
    { date: 'Week 3', avgPrice: 210.00 },
    { date: 'Week 4', avgPrice: 155.00 },
    { date: 'Week 5', avgPrice: 175.00 },
    { date: 'Week 6', avgPrice: 265.00 },
    { date: 'Week 7', avgPrice: 295.00 },
    { date: 'Week 8', avgPrice: 230.00 },
  ],
};
