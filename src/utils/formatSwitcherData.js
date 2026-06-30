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
      { category: 'Base',                 oddsNumerator: 1, oddsDenominator: 1,      probability: 1.000000, source: 'Topps' },
      { category: 'Refractor',            oddsNumerator: 1, oddsDenominator: 3,      probability: 0.333333, source: 'Baseballcardpedia' },
      { category: 'Future Stars',         oddsNumerator: 1, oddsDenominator: 16,     probability: 0.062500, source: 'Baseballcardpedia' },
      { category: '1988 Topps',           oddsNumerator: 1, oddsDenominator: 6,      probability: 0.166667, source: 'Baseballcardpedia' },
      { category: 'Titans',               oddsNumerator: 1, oddsDenominator: 12,     probability: 0.083333, source: 'Baseballcardpedia' },
      { category: 'In Technicolor',       oddsNumerator: 1, oddsDenominator: 24,     probability: 0.041667, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 1',      oddsNumerator: 1, oddsDenominator: 497,    probability: 0.002012, source: 'Baseballcardpedia' },
      { category: 'Authentics',           oddsNumerator: 1, oddsDenominator: 575,    probability: 0.001739, source: 'Baseballcardpedia' },
      { category: 'Radiating Rookies',    oddsNumerator: 1, oddsDenominator: 686,    probability: 0.001458, source: 'Baseballcardpedia' },
      { category: 'Ultraviolet All-Stars',oddsNumerator: 1, oddsDenominator: 686,    probability: 0.001458, source: 'Baseballcardpedia' },
      { category: "Let's Go!",            oddsNumerator: 1, oddsDenominator: 11241,  probability: 0.000089, source: 'Baseballcardpedia' },
      { category: 'Expose',               oddsNumerator: 1, oddsDenominator: 28102,  probability: 0.000036, source: 'Baseballcardpedia' },
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
      { category: 'Base',                 oddsNumerator: 1, oddsDenominator: 1,      probability: 1.000000, source: 'Topps' },
      { category: 'Refractor',            oddsNumerator: 1, oddsDenominator: 1,      probability: 1.000000, source: 'Baseballcardpedia' },
      { category: 'Future Stars',         oddsNumerator: 1, oddsDenominator: 6,      probability: 0.166667, source: 'Baseballcardpedia' },
      { category: '1988 Topps',           oddsNumerator: 1, oddsDenominator: 2,      probability: 0.500000, source: 'Baseballcardpedia' },
      { category: 'Titans',               oddsNumerator: 1, oddsDenominator: 4,      probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'In Technicolor',       oddsNumerator: 1, oddsDenominator: 6,      probability: 0.166667, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 1',      oddsNumerator: 1, oddsDenominator: 216,    probability: 0.004630, source: 'Baseballcardpedia' },
      { category: 'Authentics',           oddsNumerator: 1, oddsDenominator: 208,    probability: 0.004808, source: 'Baseballcardpedia' },
      { category: 'Radiating Rookies',    oddsNumerator: 1, oddsDenominator: 260,    probability: 0.003846, source: 'Baseballcardpedia' },
      { category: 'Ultraviolet All-Stars',oddsNumerator: 1, oddsDenominator: 260,    probability: 0.003846, source: 'Baseballcardpedia' },
      { category: "Let's Go!",            oddsNumerator: 1, oddsDenominator: 4880,   probability: 0.000205, source: 'Baseballcardpedia' },
      { category: 'Expose',               oddsNumerator: 1, oddsDenominator: 12200,  probability: 0.000082, source: 'Baseballcardpedia' },
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
      { category: 'Base',                  oddsNumerator: 1, oddsDenominator: 1,      probability: 1.000000, source: 'Topps' },
      { category: 'Refractor',             oddsNumerator: 1, oddsDenominator: 5,      probability: 0.200000, source: 'Baseballcardpedia' },
      { category: 'Pink Refractor',        oddsNumerator: 1, oddsDenominator: 4,      probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Sepia Refractor',       oddsNumerator: 1, oddsDenominator: 4,      probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Future Stars',          oddsNumerator: 1, oddsDenominator: 16,     probability: 0.062500, source: 'Baseballcardpedia' },
      { category: '1988 Topps',            oddsNumerator: 1, oddsDenominator: 4,      probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Titans',                oddsNumerator: 1, oddsDenominator: 16,     probability: 0.062500, source: 'Baseballcardpedia' },
      { category: 'In Technicolor',        oddsNumerator: 1, oddsDenominator: 32,     probability: 0.031250, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 1',       oddsNumerator: 1, oddsDenominator: 861,    probability: 0.001161, source: 'Baseballcardpedia' },
      { category: 'Ultraviolet All-Stars', oddsNumerator: 1, oddsDenominator: 346,    probability: 0.002890, source: 'Baseballcardpedia' },
      { category: "Let's Go!",             oddsNumerator: 1, oddsDenominator: 19601,  probability: 0.000051, source: 'Baseballcardpedia' },
      { category: 'Expose',                oddsNumerator: 1, oddsDenominator: 49003,  probability: 0.000020, source: 'Baseballcardpedia' },
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
      { category: 'Base',                  oddsNumerator: 1, oddsDenominator: 1,    probability: 1.000000, source: 'Topps' },
      { category: 'YouthQuake',            oddsNumerator: 1, oddsDenominator: 2,    probability: 0.500000, source: 'Baseballcardpedia' },
      { category: 'Radiating Rookies',     oddsNumerator: 1, oddsDenominator: 31,   probability: 0.032258, source: 'Baseballcardpedia' },
      { category: 'Ultraviolet All-Stars', oddsNumerator: 1, oddsDenominator: 30,   probability: 0.033333, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 1',       oddsNumerator: 1, oddsDenominator: 16,   probability: 0.062500, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 2',       oddsNumerator: 1, oddsDenominator: 547,  probability: 0.001828, source: 'Baseballcardpedia' },
      { category: 'Super Short Print',     oddsNumerator: 1, oddsDenominator: 547,  probability: 0.001828, source: 'Baseballcardpedia' },
      { category: "Let's Go!",             oddsNumerator: 1, oddsDenominator: 365,  probability: 0.002740, source: 'Baseballcardpedia' },
      { category: 'Expose',                oddsNumerator: 1, oddsDenominator: 925,  probability: 0.001081, source: 'Baseballcardpedia' },
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
      { category: 'Base',                  oddsNumerator: 1, oddsDenominator: 1,      probability: 1.000000, source: 'Topps' },
      { category: 'Refractor',             oddsNumerator: 1, oddsDenominator: 4,      probability: 0.250000, source: 'Baseballcardpedia' },
      { category: 'Future Stars',          oddsNumerator: 1, oddsDenominator: 21,     probability: 0.047619, source: 'Baseballcardpedia' },
      { category: '1988 Topps',            oddsNumerator: 1, oddsDenominator: 11,     probability: 0.090909, source: 'Baseballcardpedia' },
      { category: 'Titans',                oddsNumerator: 1, oddsDenominator: 21,     probability: 0.047619, source: 'Baseballcardpedia' },
      { category: 'In Technicolor',        oddsNumerator: 1, oddsDenominator: 28,     probability: 0.035714, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 1',       oddsNumerator: 1, oddsDenominator: 721,    probability: 0.001387, source: 'Baseballcardpedia' },
      { category: 'Gimmicks Tier 2',       oddsNumerator: 1, oddsDenominator: 24515,  probability: 0.000041, source: 'Baseballcardpedia' },
      { category: 'Super Short Print',     oddsNumerator: 1, oddsDenominator: 24515,  probability: 0.000041, source: 'Baseballcardpedia' },
      { category: 'Ultraviolet All-Stars', oddsNumerator: 1, oddsDenominator: 449,    probability: 0.002227, source: 'Baseballcardpedia' },
      { category: "Let's Go!",             oddsNumerator: 1, oddsDenominator: 16205,  probability: 0.000062, source: 'Baseballcardpedia' },
      { category: 'Expose',                oddsNumerator: 1, oddsDenominator: 41569,  probability: 0.000024, source: 'Baseballcardpedia' },
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
