/**
 * formatSwitcherData.js
 *
 * Dummy format data for the BoxProfilePage format switcher.
 *
 * Each key represents one retail format of the same card set — e.g. the
 * Hobby, Jumbo, and Blaster versions of 2023 Topps Chrome Baseball.
 *
 * Pull rates and pricing vary significantly by format:
 *   - Hobby/Jumbo: highest MSRP, best odds, usually positive or near-breakeven ROI
 *   - Blaster/Mega/Retail: mass-market price points, much worse odds, negative ROI
 *
 * Shape mirrors what the real API will return per-format once `parent_set_id`
 * is added to the box_sets table. During database phase: replace DUMMY_FORMAT_DATA
 * with a real fetch keyed by format slug.
 *
 * ROI is pre-calculated here (not in components) using the shared calculateRoi util.
 * Formula: (expectedValue - msrp) / msrp
 */

import { calculateRoi } from './formatters';

// TODO: Replace with real pull rate data from pull_rates table joined with card_categories
export const DUMMY_FORMAT_DATA = {
  hobby: {
    label: 'Hobby',
    slug: 'hobby',
    imageUrl: '/images/boxes/2023 topps chrome baseball hobby.webp',
    msrp: 129.99,
    marketPrice: 234.89,
    packsPerBox: 18,
    cardsPerPack: 4,
    totalCards: 72,   // 18 packs × 4 cards
    expectedValue: 103.98,
    roi: calculateRoi(103.98, 129.99),
    pullRates: [
      { category: 'Base',                     oddsNumerator: 1, oddsDenominator: 1,     probability: 1.0,      source: 'Topps' },
      { category: 'Base Rookie',              oddsNumerator: 1, oddsDenominator: 1,     probability: 1.0,      source: 'Topps' },
      { category: 'Refractor',                oddsNumerator: 1, oddsDenominator: 3,     probability: 0.333333, source: 'Baseballcardpedia' },
      { category: 'Rookie Refractor',         oddsNumerator: 1, oddsDenominator: 3,     probability: 0.333333, source: 'Baseballcardpedia' },
      { category: 'Numbered Refractor',       oddsNumerator: 1, oddsDenominator: 96,    probability: 0.010417, source: 'Baseballcardpedia' },
      { category: 'Numbered Rookie Refractor',oddsNumerator: 1, oddsDenominator: 96,    probability: 0.010417, source: 'Baseballcardpedia' },
      { category: 'Superfractor',             oddsNumerator: 1, oddsDenominator: 37469, probability: 0.000027, source: 'Baseballcardpedia' },
      { category: 'Insert',                   oddsNumerator: 1, oddsDenominator: 6,     probability: 0.166667, source: 'Baseballcardpedia' },
      { category: 'Short Print',              oddsNumerator: 1, oddsDenominator: 497,   probability: 0.002012, source: 'Baseballcardpedia' },
      { category: 'Base Auto',                oddsNumerator: 1, oddsDenominator: 52,    probability: 0.019231, source: 'Baseballcardpedia' },
      { category: 'Refractor Auto',           oddsNumerator: 1, oddsDenominator: 172,   probability: 0.005814, source: 'Baseballcardpedia' },
      { category: 'Numbered Autograph',       oddsNumerator: 1, oddsDenominator: 291,   probability: 0.003436, source: 'Baseballcardpedia' },
      { category: 'Memorabilia / Relic',      oddsNumerator: 1, oddsDenominator: 575,   probability: 0.001739, source: 'Baseballcardpedia' },
    ],
    // Manufacturer-stated guaranteed pulls per box (probability = 1.0).
    // Mirrors the eventual box_guarantees table shape: count, category, notes.
    // When `notes` is present, the UI displays it in place of `category`.
    guarantees: [
      { count: 1, category: 'Base Auto', notes: null },
    ],
  },

  jumbo: {
    label: 'Jumbo',
    slug: 'jumbo',
    imageUrl: '/images/boxes/2023 topps chrome baseball jumbo.webp',
    msrp: 349.99,
    marketPrice: 400.00,
    packsPerBox: 6,
    cardsPerPack: 12,
    totalCards: 72,   // 6 packs × 12 cards
    expectedValue: 139.41,
    roi: calculateRoi(139.41, 349.99),
    pullRates: [
      { category: 'Refractor',                 oddsNumerator: 1, oddsDenominator: 1,     probability: 1.000000, source: 'Baseballcardpedia' },
      { category: 'Numbered Refractor',        oddsNumerator: 1, oddsDenominator: 42,    probability: 0.023810, source: 'Baseballcardpedia' },
      { category: 'Numbered Rookie Refractor', oddsNumerator: 1, oddsDenominator: 42,    probability: 0.023810, source: 'Baseballcardpedia' },
      { category: 'Superfractor',              oddsNumerator: 1, oddsDenominator: 16695, probability: 1/16695, source: 'Baseballcardpedia' },
      { category: 'Insert',                    oddsNumerator: 1, oddsDenominator: 2,     probability: 0.500000, source: 'Baseballcardpedia' },
      { category: 'Short Print',               oddsNumerator: 1, oddsDenominator: 216,   probability: 0.004630, source: 'Baseballcardpedia' },
      { category: 'Base Auto',                 oddsNumerator: 1, oddsDenominator: 9,     probability: 0.111111, source: 'Baseballcardpedia' },
      { category: 'Refractor Auto',            oddsNumerator: 1, oddsDenominator: 28,    probability: 0.035714, source: 'Baseballcardpedia' },
      { category: 'Numbered Autograph',        oddsNumerator: 1, oddsDenominator: 48,    probability: 0.020833, source: 'Baseballcardpedia' },
      { category: 'Memorabilia / Relic',       oddsNumerator: 1, oddsDenominator: 208,   probability: 0.004808, source: 'Baseballcardpedia' },
      { category: 'Patch Auto',                oddsNumerator: 1, oddsDenominator: 782,   probability: 0.001279, source: 'Baseballcardpedia' },
    ],
    guarantees: [
      { count: 3, category: 'Base Auto', notes: null },
    ],
  },

  blaster: {
    label: 'Blaster',
    slug: 'blaster',
    imageUrl: '/images/boxes/2023 topps chrome baseball blaster.webp',
    msrp: 34.99,
    marketPrice: 36.00,
    packsPerBox: 7,
    cardsPerPack: 4,
    totalCards: 28,   // 7 packs × 4 cards
    expectedValue: 54.15,
    roi: calculateRoi(54.15, 34.99),
    pullRates: [
      { category: 'Refractor',                 oddsNumerator: 1, oddsDenominator: 5,     probability: 0.200000, source: 'Baseballcardpedia' },
      { category: 'Numbered Refractor',        oddsNumerator: 1, oddsDenominator: 166,   probability: 0.006024, source: 'Baseballcardpedia' },
      { category: 'Numbered Rookie Refractor', oddsNumerator: 1, oddsDenominator: 166,   probability: 0.006024, source: 'Baseballcardpedia' },
      { category: 'Superfractor',              oddsNumerator: 1, oddsDenominator: 65337, probability: 1/65337, source: 'Baseballcardpedia' },
      { category: 'Insert',                    oddsNumerator: 1, oddsDenominator: 4,     probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Short Print',               oddsNumerator: 1, oddsDenominator: 861,   probability: 0.001161, source: 'Baseballcardpedia' },
      { category: 'Base Auto',                 oddsNumerator: 1, oddsDenominator: 120,   probability: 0.008333, source: 'Baseballcardpedia' },
      { category: 'Refractor Auto',            oddsNumerator: 1, oddsDenominator: 396,   probability: 0.002525, source: 'Baseballcardpedia' },
      { category: 'Numbered Autograph',        oddsNumerator: 1, oddsDenominator: 672,   probability: 0.001488, source: 'Baseballcardpedia' },
    ],
    guarantees: [
      { count: 4, category: 'Refractor', notes: null },
    ],
  },

  breaker: {
    label: 'Breaker Delight',
    slug: 'breaker',
    imageUrl: '/images/boxes/2023 topps chrome baseball Breakers Delight.webp',
    msrp: 249.99,
    marketPrice: 249.99,
    packsPerBox: 1,
    cardsPerPack: 1,
    totalCards: 1,
    expectedValue: 178.97,
    roi: calculateRoi(178.97, 249.99),
    pullRates: [
      { category: 'Numbered Refractor',        oddsNumerator: 1, oddsDenominator: 4,    probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Numbered Rookie Refractor', oddsNumerator: 1, oddsDenominator: 4,    probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Superfractor',              oddsNumerator: 1, oddsDenominator: 1202, probability: 0.000832, source: 'Baseballcardpedia' },
      { category: 'Short Print',               oddsNumerator: 1, oddsDenominator: 16,   probability: 0.062500, source: 'Baseballcardpedia' },
      { category: 'Base Auto',                 oddsNumerator: 1, oddsDenominator: 2,    probability: 0.500000, source: 'Baseballcardpedia' },
      { category: 'Refractor Auto',            oddsNumerator: 1, oddsDenominator: 5,    probability: 0.200000, source: 'Baseballcardpedia' },
      { category: 'Numbered Autograph',        oddsNumerator: 1, oddsDenominator: 8,    probability: 0.125000, source: 'Baseballcardpedia' },
    ],
    guarantees: [
      { count: 2, category: 'Base Auto', notes: null },
      { count: 6, category: 'Refractor', notes: null },
      { count: 3, category: 'Base',      notes: 'Numbered Base/Insert' },
      { count: 1, category: 'Insert',    notes: null },
    ],
  },

  mega: {
    label: 'Mega',
    slug: 'mega',
    imageUrl: '/images/boxes/2023 topps chrome baseball mega.webp',
    msrp: 54.99,
    marketPrice: 60.00,
    packsPerBox: 10,
    cardsPerPack: 5,
    totalCards: 50,   // 10 packs × 5 cards
    expectedValue: 102.61,
    roi: calculateRoi(102.61, 54.99),
    pullRates: [
      { category: 'Refractor',                 oddsNumerator: 1, oddsDenominator: 4,     probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Numbered Refractor',        oddsNumerator: 1, oddsDenominator: 139,   probability: 0.007194, source: 'Baseballcardpedia' },
      { category: 'Numbered Rookie Refractor', oddsNumerator: 1, oddsDenominator: 139,   probability: 0.007194, source: 'Baseballcardpedia' },
      { category: 'Superfractor',              oddsNumerator: 1, oddsDenominator: 59756, probability: 1/59756, source: 'Baseballcardpedia' },
      { category: 'Insert',                    oddsNumerator: 1, oddsDenominator: 11,    probability: 0.090909, source: 'Baseballcardpedia' },
      { category: 'Short Print',               oddsNumerator: 1, oddsDenominator: 721,   probability: 0.001387, source: 'Baseballcardpedia' },
      { category: 'Base Auto',                 oddsNumerator: 1, oddsDenominator: 93,    probability: 0.010753, source: 'Baseballcardpedia' },
      { category: 'Refractor Auto',            oddsNumerator: 1, oddsDenominator: 307,   probability: 0.003257, source: 'Baseballcardpedia' },
      { category: 'Numbered Autograph',        oddsNumerator: 1, oddsDenominator: 521,   probability: 0.001919, source: 'Baseballcardpedia' },
    ],
    guarantees: [
      { count: 10, category: 'Refractor', notes: null },
    ],
  },

  retail: {
    label: 'Retail',
    slug: 'retail',
    msrp: 4.99,
    packsPerBox: 1,   // sold as individual packs
    cardsPerPack: 4,
    totalCards: 4,    // single pack
    expectedValue: 3.20,
    roi: calculateRoi(3.20, 4.99), // ≈ -35.9% vs MSRP — worst value, widest distribution
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 24   }, // 1:24 packs
      { id: 'pr-numbered',  category: 'Numbered',       probability: 1 / 48   }, // 1:48 packs
      { id: 'pr-relic',     category: 'Relic',          probability: 1 / 72   }, // 1:72 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 72   }, // 1:72 packs — very rare
      { id: 'pr-auto-relic',category: 'Auto Relic',     probability: 1 / 144  }, // 1:144 packs
      { id: 'pr-case-hit',  category: 'Case Hit',       probability: 1 / 288  }, // 1:288 packs
    ],
  },
};

/**
 * Explicit tab order for the FormatSwitcher.
 * Using an array rather than Object.keys() keeps the display sequence intentional
 * and immune to any future JS engine key-ordering edge cases.
 */
export const FORMAT_ORDER = ['blaster', 'mega', 'hobby', 'jumbo', 'breaker'];
