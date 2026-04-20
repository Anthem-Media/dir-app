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

export const DUMMY_FORMAT_DATA = {
  hobby: {
    label: 'Hobby',
    slug: 'hobby',
    msrp: 149.99,
    packsPerBox: 18,
    cardsPerPack: 4,
    totalCards: 72,   // 18 packs × 4 cards
    expectedValue: 162.50,
    roi: calculateRoi(162.50, 149.99), // ≈ +8.3% vs MSRP
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      }, // guaranteed every pack
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 4    }, // 1:4 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 6    }, // 1:6 packs
    ],
  },

  jumbo: {
    label: 'Jumbo',
    slug: 'jumbo',
    msrp: 229.99,
    packsPerBox: 6,
    cardsPerPack: 12,
    totalCards: 72,   // 6 packs × 12 cards
    expectedValue: 244.75,
    roi: calculateRoi(244.75, 229.99), // ≈ +6.4% vs MSRP — jumbo packs carry premium odds
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 2    }, // 1:2 packs — better than hobby
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 3    }, // 1:3 packs
    ],
  },

  blaster: {
    label: 'Blaster',
    slug: 'blaster',
    msrp: 24.99,
    packsPerBox: 7,
    cardsPerPack: 4,
    totalCards: 28,   // 7 packs × 4 cards
    expectedValue: 18.75,
    roi: calculateRoi(18.75, 24.99), // ≈ -25.0% vs MSRP — retail formats skew negative
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 12   }, // 1:12 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 36   }, // 1:36 packs — rare in blasters
    ],
  },

  mega: {
    label: 'Mega',
    slug: 'mega',
    msrp: 34.99,
    packsPerBox: 10,
    cardsPerPack: 5,
    totalCards: 50,   // 10 packs × 5 cards
    expectedValue: 28.50,
    roi: calculateRoi(28.50, 34.99), // ≈ -18.5% vs MSRP
    pullRates: [
      { id: 'pr-base',      category: 'Base & Rookies', probability: 1.0      },
      { id: 'pr-refractor', category: 'Refractors',     probability: 1 / 10   }, // 1:10 packs
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 28   }, // 1:28 packs
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
      { id: 'pr-auto',      category: 'Autographs',     probability: 1 / 72   }, // 1:72 packs — very rare
    ],
  },
};

/**
 * Explicit tab order for the FormatSwitcher.
 * Using an array rather than Object.keys() keeps the display sequence intentional
 * and immune to any future JS engine key-ordering edge cases.
 */
export const FORMAT_ORDER = ['hobby', 'jumbo', 'blaster', 'mega', 'retail'];
