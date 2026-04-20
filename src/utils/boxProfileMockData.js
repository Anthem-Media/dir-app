/**
 * Mock data for the BoxProfilePage.
 * This mirrors the shape of data the real API will eventually return,
 * so wiring it up later is a straightforward swap in useBoxProfile.js.
 */

import { calculateRoi } from './formatters';

export const MOCK_BOX = {
  id: 'topps-chrome-2023-hobby',
  name: '2023 Topps Chrome Baseball',
  manufacturer: 'Topps',
  year: 2023,
  format: 'Hobby',
  imageUrl: null, // placeholder until real images are added
  config: {
    packsPerBox: 18,
    cardsPerPack: 4,
    totalCards: 72,
  },
  pricing: {
    // Current sealed box market price from eBay sold listings
    marketPrice: 189.99,
    // Original manufacturer suggested retail price
    msrp: 149.99,
    // Expected value: probability-weighted sum of all pull values
    expectedValue: 162.5,
    // ROI calculated via the shared formula in utils/formatters.js
    roi: calculateRoi(162.5, 189.99),
  },
};

export const MOCK_TOP_CHASES = [
  {
    id: 'tc2023-001',
    playerName: 'Gunnar Henderson',
    variationName: 'Superfractor',
    category: 'Superfractor',
    isRookie: true,
    price: 4500,
    imageUrl: null,
  },
  {
    id: 'tc2023-002',
    playerName: 'Julio Rodríguez',
    variationName: 'Gold Refractor Auto /50',
    category: 'Numbered Autograph',
    isRookie: false,
    price: 1200,
    imageUrl: null,
  },
  {
    id: 'tc2023-003',
    playerName: 'Corbin Carroll',
    variationName: 'Orange Refractor Auto /25',
    category: 'Numbered Autograph',
    isRookie: true,
    price: 850,
    imageUrl: null,
  },
  {
    id: 'tc2023-004',
    playerName: 'Jackson Holliday',
    variationName: 'Chrome Rookie Auto',
    category: 'Base Auto',
    isRookie: true,
    price: 320,
    imageUrl: null,
  },
  {
    id: 'tc2023-005',
    playerName: 'Adley Rutschman',
    variationName: 'Purple Refractor',
    category: 'Rookie Refractor',
    isRookie: false,
    price: 145,
    imageUrl: null,
  },
];

export const MOCK_PULL_RATES = [
  {
    id: 'pr-base',
    category: 'Base & Rookies',
    // Every pack contains base cards — probability 1.0
    probability: 1.0,
  },
  {
    id: 'pr-refractor',
    category: 'Refractors',
    // Manufacturer-published: 1 refractor per 4 packs on average
    probability: 1 / 4,
  },
  {
    id: 'pr-auto',
    category: 'Autographs',
    // Manufacturer-published: 1 auto per 6 packs on average
    probability: 1 / 6,
  },
];

// 12 months of sealed box market prices (used in the price trend chart)
export const MOCK_PRICE_HISTORY = [
  { date: 'May 24', price: 215 },
  { date: 'Jun 24', price: 228 },
  { date: 'Jul 24', price: 220 },
  { date: 'Aug 24', price: 210 },
  { date: 'Sep 24', price: 198 },
  { date: 'Oct 24', price: 195 },
  { date: 'Nov 24', price: 185 },
  { date: 'Dec 24', price: 200 },
  { date: 'Jan 25', price: 192 },
  { date: 'Feb 25', price: 188 },
  { date: 'Mar 25', price: 185 },
  { date: 'Apr 25', price: 190 },
];

// The five tiers from the project brief, each with a card count and
// the individual cards that appear in the checklist.
// Tier 1-4 have more than 5 cards so the expand/collapse button appears.
// Tier 5 has 4 cards (≤ 5) to demonstrate that the button is correctly absent.
export const MOCK_CHECKLIST_TIERS = [
  {
    id: 'tier-1',
    label: 'Tier 1 — Base & Rookies',
    cardCount: 220,
    avgValue: 3.5,
    cards: [
      { id: 'c1-001', name: 'Shohei Ohtani',       category: 'Base',         value: 18 },
      { id: 'c1-002', name: 'Mike Trout',           category: 'Base',         value: 12 },
      { id: 'c1-003', name: 'Gunnar Henderson',     category: 'Base Rookie',  value: 8  },
      { id: 'c1-004', name: 'Corbin Carroll',       category: 'Base Rookie',  value: 6  },
      { id: 'c1-005', name: 'Jackson Holliday',     category: 'Base Rookie',  value: 5  },
      { id: 'c1-006', name: 'Julio Rodríguez',      category: 'Base',         value: 9  },
      { id: 'c1-007', name: 'Elly De La Cruz',      category: 'Base Rookie',  value: 7  },
      { id: 'c1-008', name: 'Adley Rutschman',      category: 'Base',         value: 4  },
    ],
  },
  {
    id: 'tier-2',
    label: 'Tier 2 — Inserts & Short Prints',
    cardCount: 45,
    avgValue: 8.2,
    cards: [
      { id: 'c2-001', name: 'Julio Rodríguez',      category: 'Insert',       value: 22 },
      { id: 'c2-002', name: 'Shohei Ohtani',        category: 'Short Print',  value: 45 },
      { id: 'c2-003', name: 'Elly De La Cruz',      category: 'Insert',       value: 15 },
      { id: 'c2-004', name: 'Gunnar Henderson',     category: 'Short Print',  value: 28 },
      { id: 'c2-005', name: 'Corbin Carroll',       category: 'Insert',       value: 12 },
      { id: 'c2-006', name: 'Jackson Holliday',     category: 'Insert',       value: 10 },
      { id: 'c2-007', name: 'Mike Trout',           category: 'Short Print',  value: 32 },
    ],
  },
  {
    id: 'tier-3',
    label: 'Tier 3 — Refractors',
    cardCount: 80,
    avgValue: 35,
    cards: [
      { id: 'c3-001', name: 'Gunnar Henderson',     category: 'Rookie Refractor',  value: 95  },
      { id: 'c3-002', name: 'Jackson Holliday',     category: 'Rookie Refractor',  value: 75  },
      { id: 'c3-003', name: 'Shohei Ohtani',        category: 'Refractor',         value: 55  },
      { id: 'c3-004', name: 'Corbin Carroll',       category: 'Rookie Refractor',  value: 48  },
      { id: 'c3-005', name: 'Julio Rodríguez',      category: 'Refractor',         value: 38  },
      { id: 'c3-006', name: 'Elly De La Cruz',      category: 'Rookie Refractor',  value: 42  },
    ],
  },
  {
    id: 'tier-4',
    label: 'Tier 4 — Autographs',
    cardCount: 40,
    avgValue: 120,
    cards: [
      { id: 'c4-001', name: 'Jackson Holliday',     category: 'Base Auto',          value: 320 },
      { id: 'c4-002', name: 'Corbin Carroll',       category: 'Refractor Auto',     value: 280 },
      { id: 'c4-003', name: 'Julio Rodríguez',      category: 'Numbered Autograph', value: 450 },
      { id: 'c4-004', name: 'Gunnar Henderson',     category: 'Refractor Auto',     value: 195 },
      { id: 'c4-005', name: 'Elly De La Cruz',      category: 'Base Auto',          value: 160 },
      { id: 'c4-006', name: 'Adley Rutschman',      category: 'Base Auto',          value: 85  },
    ],
  },
  {
    // Tier 5 intentionally has 4 cards (≤ 5) — the toggle button should NOT appear here.
    id: 'tier-5',
    label: 'Tier 5 — Premium Hits',
    cardCount: 15,
    avgValue: 450,
    cards: [
      { id: 'c5-001', name: 'Gunnar Henderson',     category: 'Superfractor',       value: 4500 },
      { id: 'c5-002', name: 'Julio Rodríguez',      category: 'Patch Auto /10',     value: 1800 },
      { id: 'c5-003', name: 'Corbin Carroll',       category: 'Patch Auto /25',     value: 950  },
      { id: 'c5-004', name: 'Jackson Holliday',     category: 'Gold Refractor /50', value: 620  },
    ],
  },
];
