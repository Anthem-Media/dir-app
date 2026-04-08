/**
 * Mock data for the BrowsePage results grid.
 *
 * Shape mirrors what the real API will return for a box listing:
 *   id           — unique identifier, also used as the URL slug (/box/:id)
 *   name         — full display name of the box set
 *   sport        — 'Baseball' | 'Football' | 'Basketball' | 'Hockey'
 *   manufacturer — 'Topps' | 'Panini' | 'Bowman' | 'Upper Deck' | etc.
 *   year         — calendar year of the release
 *   format       — 'Hobby' | 'Jumbo' | 'Blaster' | 'Retail' | etc.
 *   imageUrl     — box image (null until real images are sourced)
 *   marketPrice  — current sealed box market price in USD (eBay sold avg)
 *   roi          — expected value vs. market price as a decimal
 *                  positive = expected to recoup more than you paid
 *                  negative = expected to lose money (most retail boxes)
 *
 * When the backend is ready, delete this file and update useBrowse.js
 * to fetch from /api/boxes with the same field names.
 */

export const BROWSE_BOXES = [

  // ── Baseball ──────────────────────────────────────────────────────────────

  {
    id: 'topps-chrome-2024-hobby',
    name: '2024 Topps Chrome Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 189.99, roi: -0.14,
  },
  {
    id: 'bowman-chrome-2024-jumbo',
    name: '2024 Bowman Chrome Baseball Jumbo',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Jumbo',
    imageUrl: null, marketPrice: 299.99, roi: 0.08,
  },
  {
    id: 'topps-series1-2024-hobby',
    name: '2024 Topps Series 1 Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 79.99, roi: -0.22,
  },
  {
    id: 'topps-finest-2024-hobby',
    name: '2024 Topps Finest Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 199.99, roi: -0.18,
  },
  {
    id: 'topps-museum-2024-hobby',
    name: '2024 Topps Museum Collection Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 269.99, roi: 0.12,
  },
  {
    id: 'panini-prizm-baseball-2024-hobby',
    name: '2024 Panini Prizm Baseball',
    sport: 'Baseball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 229.99, roi: -0.08,
  },
  {
    id: 'topps-tier-one-2024-hobby',
    name: '2024 Topps Tier One Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 219.99, roi: 0.04,
  },
  {
    id: 'bowman-2024-hobby',
    name: '2024 Bowman Baseball',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 119.99, roi: -0.31,
  },
  {
    id: 'topps-heritage-2024-hobby',
    name: '2024 Topps Heritage Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 109.99, roi: -0.19,
  },
  {
    id: 'topps-stadium-club-2024-hobby',
    name: '2024 Topps Stadium Club Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 139.99, roi: -0.11,
  },

  // ── Football ──────────────────────────────────────────────────────────────

  {
    id: 'panini-prizm-football-2024-hobby',
    name: '2024 Panini Prizm Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 299.99, roi: 0.15,
  },
  {
    id: 'panini-select-football-2024-hobby',
    name: '2024 Panini Select Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 199.99, roi: -0.06,
  },
  {
    id: 'panini-mosaic-football-2024-hobby',
    name: '2024 Panini Mosaic Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 149.99, roi: -0.24,
  },
  {
    id: 'panini-contenders-football-2024-hobby',
    name: '2024 Panini Contenders Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 149.99, roi: -0.12,
  },
  {
    id: 'panini-nt-football-2024-hobby',
    name: '2024 Panini National Treasures Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 799.99, roi: 0.21,
  },
  {
    id: 'panini-immaculate-football-2024-hobby',
    name: '2024 Panini Immaculate Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 499.99, roi: 0.07,
  },
  {
    id: 'panini-spectra-football-2024-hobby',
    name: '2024 Panini Spectra Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 299.99, roi: -0.09,
  },
  {
    id: 'panini-donruss-football-2024-hobby',
    name: '2024 Panini Donruss Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 79.99, roi: -0.35,
  },

  // ── Basketball ────────────────────────────────────────────────────────────

  {
    id: 'panini-prizm-bball-2425-hobby',
    name: '2024-25 Panini Prizm Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 349.99, roi: 0.18,
  },
  {
    id: 'panini-nt-bball-2425-hobby',
    name: '2024-25 Panini National Treasures Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 999.99, roi: 0.24,
  },
  {
    id: 'panini-flawless-bball-2425-hobby',
    name: '2024-25 Panini Flawless Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 1299.99, roi: 0.31,
  },
  {
    id: 'panini-noir-bball-2425-hobby',
    name: '2024-25 Panini Noir Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 499.99, roi: 0.09,
  },
  {
    id: 'panini-select-bball-2425-hobby',
    name: '2024-25 Panini Select Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 249.99, roi: -0.04,
  },
  {
    id: 'panini-hoops-bball-2425-hobby',
    name: '2024-25 Panini Hoops Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 89.99, roi: -0.28,
  },
  {
    id: 'panini-mosaic-bball-2425-hobby',
    name: '2024-25 Panini Mosaic Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 179.99, roi: -0.16,
  },
  {
    id: 'panini-chronicles-bball-2425-hobby',
    name: '2024-25 Panini Chronicles Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 129.99, roi: -0.21,
  },

  // ── Hockey ────────────────────────────────────────────────────────────────

  {
    id: 'ud-series1-hockey-2425-hobby',
    name: '2024-25 Upper Deck Series 1 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 139.99, roi: -0.08,
  },
  {
    id: 'ud-ice-hockey-2425-hobby',
    name: '2024-25 Upper Deck Ice Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 299.99, roi: 0.13,
  },
  {
    id: 'ud-black-diamond-hockey-2425-hobby',
    name: '2024-25 Upper Deck Black Diamond Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 399.99, roi: 0.22,
  },
  {
    id: 'ud-sp-authentic-hockey-2425-hobby',
    name: '2024-25 Upper Deck SP Authentic Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 219.99, roi: -0.03,
  },
  {
    id: 'ud-artifacts-hockey-2425-hobby',
    name: '2024-25 Upper Deck Artifacts Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 199.99, roi: -0.11,
  },
  {
    id: 'skybox-metal-hockey-2425-hobby',
    name: '2024-25 Skybox Metal Universe Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    imageUrl: null, marketPrice: 189.99, roi: 0.05,
  },
];
