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
    msrp: 349.99,
    marketPrice: 400.00,
    packsPerBox: 6,
    cardsPerPack: 12,
    totalCards: 72,   // 6 packs × 12 cards
    expectedValue: 139.41,
    roi: calculateRoi(139.41, 349.99),
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 2    }, // 1:2 packs — better than hobby
      { id: 'pr-numbered',  category: 'Numbered',       probability: 1 / 8    }, // 1:8 packs
      { id: 'pr-relic',     category: 'Relic',          probability: 1 / 18   }, // 1:18 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 3    }, // 1:3 packs
      { id: 'pr-auto-relic',category: 'Auto Relic',     probability: 1 / 36   }, // 1:36 packs
      { id: 'pr-case-hit',  category: 'Case Hit',       probability: 1 / 72   }, // 1:72 packs
    ],
    guarantees: [
      { count: 3, category: 'Base Auto', notes: null },
    ],
  },

  blaster: {
    label: 'Blaster',
    slug: 'blaster',
    msrp: 34.99,
    marketPrice: 36.00,
    packsPerBox: 7,
    cardsPerPack: 4,
    totalCards: 28,   // 7 packs × 4 cards
    expectedValue: 54.15,
    roi: calculateRoi(54.15, 34.99),
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 12   }, // 1:12 packs
      { id: 'pr-numbered',  category: 'Numbered',       probability: 1 / 28   }, // 1:28 packs
      { id: 'pr-relic',     category: 'Relic',          probability: 1 / 42   }, // 1:42 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 36   }, // 1:36 packs — rare in blasters
      { id: 'pr-auto-relic',category: 'Auto Relic',     probability: 1 / 84   }, // 1:84 packs
      { id: 'pr-case-hit',  category: 'Case Hit',       probability: 1 / 144  }, // 1:144 packs
    ],
    guarantees: [
      { count: 4, category: 'Refractor', notes: null },
    ],
  },

  breaker: {
    label: 'Breaker Delight',
    slug: 'breaker',
    msrp: 249.99,
    marketPrice: 249.99,
    packsPerBox: 1,
    cardsPerPack: 1,
    totalCards: 1,
    expectedValue: 178.97,
    roi: calculateRoi(178.97, 249.99),
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0     },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 1   },
      { id: 'pr-numbered',  category: 'Numbered',       probability: 1 / 2   },
      { id: 'pr-relic',     category: 'Relic',          probability: 1 / 4   },
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 1   },
      { id: 'pr-auto-relic',category: 'Auto Relic',     probability: 1 / 8   },
      { id: 'pr-case-hit',  category: 'Case Hit',       probability: 1 / 16  },
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
    msrp: 54.99,
    marketPrice: 60.00,
    packsPerBox: 10,
    cardsPerPack: 5,
    totalCards: 50,   // 10 packs × 5 cards
    expectedValue: 102.61,
    roi: calculateRoi(102.61, 54.99),
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 10   }, // 1:10 packs
      { id: 'pr-numbered',  category: 'Numbered',       probability: 1 / 20   }, // 1:20 packs
      { id: 'pr-relic',     category: 'Relic',          probability: 1 / 40   }, // 1:40 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 28   }, // 1:28 packs
      { id: 'pr-auto-relic',category: 'Auto Relic',     probability: 1 / 60   }, // 1:60 packs
      { id: 'pr-case-hit',  category: 'Case Hit',       probability: 1 / 120  }, // 1:120 packs
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
