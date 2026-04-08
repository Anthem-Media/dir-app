/**
 * Mock data for the HomePage slider rows.
 *
 * Structure:
 *   BOXES              — master catalogue of all box sets (defined once, referenced by ID)
 *                        Also exported so navMockData.js can reference the same objects.
 *   BRAND_SLIDER_CARDS — 14 brand cards for the By Brand slider row
 *   YEAR_SLIDER_CARDS  — 14 year cards (2026 → 2013) for the By Year slider row
 *   SLIDER_CATEGORIES  — ordered list of slider rows, each with a type and items array
 *
 * Navigation data (NAV_TABS, NAV_DROPDOWN_DATA) lives in navMockData.js.
 */

// ─── Master box catalogue ──────────────────────────────────────────────────
// Define each box once here. Slider rows reference boxes by ID via pick().
// Exported so navMockData.js can reference the same box objects without duplicating data.
// The id field (e.g. 'topps-chrome-2024-hobby') is also the URL slug for /box/:slug.

export const BOXES = {
  // ── Baseball ──────────────────────────────────────────────────────────────
  'topps-chrome-2024-hobby': {
    id: 'topps-chrome-2024-hobby',
    name: '2024 Topps Chrome Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 189.99, imageUrl: null,
  },
  'topps-chrome-2024-blaster': {
    id: 'topps-chrome-2024-blaster',
    name: '2024 Topps Chrome Baseball Blaster',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Blaster',
    price: 29.99, imageUrl: null,
  },
  'topps-series1-2024-hobby': {
    id: 'topps-series1-2024-hobby',
    name: '2024 Topps Series 1 Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: null,
  },
  'topps-series2-2024-hobby': {
    id: 'topps-series2-2024-hobby',
    name: '2024 Topps Series 2 Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: null,
  },
  'bowman-2024-hobby': {
    id: 'bowman-2024-hobby',
    name: '2024 Bowman Baseball',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Hobby',
    price: 119.99, imageUrl: null,
  },
  'bowman-chrome-2024-jumbo': {
    id: 'bowman-chrome-2024-jumbo',
    name: '2024 Bowman Chrome Baseball Jumbo',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Jumbo',
    price: 299.99, imageUrl: null,
  },
  'bowman-draft-2024-hobby': {
    id: 'bowman-draft-2024-hobby',
    name: '2024 Bowman Draft Baseball',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: null,
  },
  'topps-heritage-2024-hobby': {
    id: 'topps-heritage-2024-hobby',
    name: '2024 Topps Heritage Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 109.99, imageUrl: null,
  },
  'topps-stadium-club-2024-hobby': {
    id: 'topps-stadium-club-2024-hobby',
    name: '2024 Topps Stadium Club Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: null,
  },
  'topps-finest-2024-hobby': {
    id: 'topps-finest-2024-hobby',
    name: '2024 Topps Finest Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: null,
  },
  'topps-museum-2024-hobby': {
    id: 'topps-museum-2024-hobby',
    name: '2024 Topps Museum Collection Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 269.99, imageUrl: null,
  },
  'topps-allen-ginter-2024-hobby': {
    id: 'topps-allen-ginter-2024-hobby',
    name: '2024 Topps Allen & Ginter Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: null,
  },
  'topps-tier-one-2024-hobby': {
    id: 'topps-tier-one-2024-hobby',
    name: '2024 Topps Tier One Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 219.99, imageUrl: null,
  },
  'panini-prizm-baseball-2024-hobby': {
    id: 'panini-prizm-baseball-2024-hobby',
    name: '2024 Panini Prizm Baseball',
    sport: 'Baseball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 229.99, imageUrl: null,
  },

  // ── Football ──────────────────────────────────────────────────────────────
  'panini-prizm-football-2024-hobby': {
    id: 'panini-prizm-football-2024-hobby',
    name: '2024 Panini Prizm Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: null,
  },
  'panini-select-football-2024-hobby': {
    id: 'panini-select-football-2024-hobby',
    name: '2024 Panini Select Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: null,
  },
  'panini-mosaic-football-2024-hobby': {
    id: 'panini-mosaic-football-2024-hobby',
    name: '2024 Panini Mosaic Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: null,
  },
  'panini-donruss-football-2024-hobby': {
    id: 'panini-donruss-football-2024-hobby',
    name: '2024 Panini Donruss Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: null,
  },
  'panini-contenders-football-2024-hobby': {
    id: 'panini-contenders-football-2024-hobby',
    name: '2024 Panini Contenders Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: null,
  },
  'panini-chronicles-football-2024-hobby': {
    id: 'panini-chronicles-football-2024-hobby',
    name: '2024 Panini Chronicles Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: null,
  },
  'panini-absolute-football-2024-hobby': {
    id: 'panini-absolute-football-2024-hobby',
    name: '2024 Panini Absolute Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: null,
  },
  'panini-score-football-2024-hobby': {
    id: 'panini-score-football-2024-hobby',
    name: '2024 Panini Score Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 49.99, imageUrl: null,
  },
  'panini-spectra-football-2024-hobby': {
    id: 'panini-spectra-football-2024-hobby',
    name: '2024 Panini Spectra Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: null,
  },
  'panini-immaculate-football-2024-hobby': {
    id: 'panini-immaculate-football-2024-hobby',
    name: '2024 Panini Immaculate Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 499.99, imageUrl: null,
  },
  'panini-nt-football-2024-hobby': {
    id: 'panini-nt-football-2024-hobby',
    name: '2024 Panini National Treasures Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 799.99, imageUrl: null,
  },
  'panini-prizm-football-2023-hobby': {
    id: 'panini-prizm-football-2023-hobby',
    name: '2023 Panini Prizm Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 249.99, imageUrl: null,
  },
  'panini-select-football-2023-hobby': {
    id: 'panini-select-football-2023-hobby',
    name: '2023 Panini Select Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 169.99, imageUrl: null,
  },
  'panini-mosaic-football-2023-hobby': {
    id: 'panini-mosaic-football-2023-hobby',
    name: '2023 Panini Mosaic Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 119.99, imageUrl: null,
  },

  // ── Basketball ────────────────────────────────────────────────────────────
  'panini-prizm-bball-2425-hobby': {
    id: 'panini-prizm-bball-2425-hobby',
    name: '2024-25 Panini Prizm Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 349.99, imageUrl: null,
  },
  'panini-select-bball-2425-hobby': {
    id: 'panini-select-bball-2425-hobby',
    name: '2024-25 Panini Select Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 249.99, imageUrl: null,
  },
  'panini-hoops-bball-2425-hobby': {
    id: 'panini-hoops-bball-2425-hobby',
    name: '2024-25 Panini Hoops Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: null,
  },
  'panini-chronicles-bball-2425-hobby': {
    id: 'panini-chronicles-bball-2425-hobby',
    name: '2024-25 Panini Chronicles Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 129.99, imageUrl: null,
  },
  'panini-mosaic-bball-2425-hobby': {
    id: 'panini-mosaic-bball-2425-hobby',
    name: '2024-25 Panini Mosaic Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 179.99, imageUrl: null,
  },
  'panini-donruss-bball-2425-hobby': {
    id: 'panini-donruss-bball-2425-hobby',
    name: '2024-25 Panini Donruss Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: null,
  },
  'panini-court-kings-bball-2425-hobby': {
    id: 'panini-court-kings-bball-2425-hobby',
    name: '2024-25 Panini Court Kings Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: null,
  },
  'panini-noir-bball-2425-hobby': {
    id: 'panini-noir-bball-2425-hobby',
    name: '2024-25 Panini Noir Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 499.99, imageUrl: null,
  },
  'panini-immaculate-bball-2425-hobby': {
    id: 'panini-immaculate-bball-2425-hobby',
    name: '2024-25 Panini Immaculate Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 599.99, imageUrl: null,
  },
  'panini-nt-bball-2425-hobby': {
    id: 'panini-nt-bball-2425-hobby',
    name: '2024-25 Panini National Treasures Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 999.99, imageUrl: null,
  },
  'panini-flawless-bball-2425-hobby': {
    id: 'panini-flawless-bball-2425-hobby',
    name: '2024-25 Panini Flawless Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 1299.99, imageUrl: null,
  },
  'panini-prizm-bball-2324-hobby': {
    id: 'panini-prizm-bball-2324-hobby',
    name: '2023-24 Panini Prizm Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 299.99, imageUrl: null,
  },
  'panini-select-bball-2324-hobby': {
    id: 'panini-select-bball-2324-hobby',
    name: '2023-24 Panini Select Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 219.99, imageUrl: null,
  },
  'panini-hoops-bball-2324-hobby': {
    id: 'panini-hoops-bball-2324-hobby',
    name: '2023-24 Panini Hoops Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 79.99, imageUrl: null,
  },

  // ── Hockey ────────────────────────────────────────────────────────────────
  'ud-series1-hockey-2425-hobby': {
    id: 'ud-series1-hockey-2425-hobby',
    name: '2024-25 Upper Deck Series 1 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: null,
  },
  'ud-series2-hockey-2425-hobby': {
    id: 'ud-series2-hockey-2425-hobby',
    name: '2024-25 Upper Deck Series 2 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: null,
  },
  'ud-mvp-hockey-2425-hobby': {
    id: 'ud-mvp-hockey-2425-hobby',
    name: '2024-25 Upper Deck MVP Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: null,
  },
  'ud-ice-hockey-2425-hobby': {
    id: 'ud-ice-hockey-2425-hobby',
    name: '2024-25 Upper Deck Ice Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: null,
  },
  'ud-black-diamond-hockey-2425-hobby': {
    id: 'ud-black-diamond-hockey-2425-hobby',
    name: '2024-25 Upper Deck Black Diamond Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 399.99, imageUrl: null,
  },
  'ud-sp-authentic-hockey-2425-hobby': {
    id: 'ud-sp-authentic-hockey-2425-hobby',
    name: '2024-25 Upper Deck SP Authentic Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 219.99, imageUrl: null,
  },
  'ud-opc-hockey-2425-hobby': {
    id: 'ud-opc-hockey-2425-hobby',
    name: '2024-25 Upper Deck O-Pee-Chee Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 109.99, imageUrl: null,
  },
  'ud-allure-hockey-2425-hobby': {
    id: 'ud-allure-hockey-2425-hobby',
    name: '2024-25 Upper Deck Allure Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 179.99, imageUrl: null,
  },
  'ud-artifacts-hockey-2425-hobby': {
    id: 'ud-artifacts-hockey-2425-hobby',
    name: '2024-25 Upper Deck Artifacts Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: null,
  },
  'ud-parkhurst-hockey-2425-hobby': {
    id: 'ud-parkhurst-hockey-2425-hobby',
    name: '2024-25 Upper Deck Parkhurst Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: null,
  },
  'skybox-metal-hockey-2425-hobby': {
    id: 'skybox-metal-hockey-2425-hobby',
    name: '2024-25 Skybox Metal Universe Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 189.99, imageUrl: null,
  },
  'ud-series1-hockey-2324-hobby': {
    id: 'ud-series1-hockey-2324-hobby',
    name: '2023-24 Upper Deck Series 1 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2023, format: 'Hobby',
    price: 129.99, imageUrl: null,
  },
  'ud-ice-hockey-2324-hobby': {
    id: 'ud-ice-hockey-2324-hobby',
    name: '2023-24 Upper Deck Ice Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2023, format: 'Hobby',
    price: 269.99, imageUrl: null,
  },
  'ud-canvas-hockey-2425-hobby': {
    id: 'ud-canvas-hockey-2425-hobby',
    name: '2024-25 Upper Deck UD Canvas Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: null,
  },
};

// Helper: pull an ordered array of boxes from the master catalogue by ID
function pick(...ids) {
  return ids.map((id) => BOXES[id]);
}

// ─── Brand slider cards ────────────────────────────────────────────────────
// Used by the "By Brand" slider row. No price — the card just shows the brand name.

export const BRAND_SLIDER_CARDS = [
  { id: 'brand-topps',       name: 'Topps',       imageUrl: null },
  { id: 'brand-panini',      name: 'Panini',      imageUrl: null },
  { id: 'brand-bowman',      name: 'Bowman',      imageUrl: null },
  { id: 'brand-upper-deck',  name: 'Upper Deck',  imageUrl: null },
  { id: 'brand-donruss',     name: 'Donruss',     imageUrl: null },
  { id: 'brand-select',      name: 'Select',      imageUrl: null },
  { id: 'brand-prizm',       name: 'Prizm',       imageUrl: null },
  { id: 'brand-mosaic',      name: 'Mosaic',      imageUrl: null },
  { id: 'brand-fleer',       name: 'Fleer',       imageUrl: null },
  { id: 'brand-score',       name: 'Score',       imageUrl: null },
  { id: 'brand-leaf',        name: 'Leaf',        imageUrl: null },
  { id: 'brand-skybox',      name: 'Skybox',      imageUrl: null },
  { id: 'brand-hoops',       name: 'Hoops',       imageUrl: null },
  { id: 'brand-pacific',     name: 'Pacific',     imageUrl: null },
];

// ─── Year slider cards ─────────────────────────────────────────────────────
// Used by the "By Year" slider row. Just a year number — no name, no price.
// Counts backwards from 2026 to 2013 (14 years total).

export const YEAR_SLIDER_CARDS = Array.from({ length: 14 }, (_, i) => {
  const year = 2026 - i;
  return { id: `year-${year}`, year };
});

// ─── Slider category definitions ───────────────────────────────────────────
// Each category becomes one horizontal slider row on the HomePage.
//
// type: 'box'   → items are box objects → rendered by BoxSliderCard
// type: 'brand' → items are brand objects → rendered by BrandSliderCard
// type: 'year'  → items are year objects → rendered by YearSliderCard

export const SLIDER_CATEGORIES = [
  {
    id: 'featured',
    type: 'box',
    label: 'Featured',
    subtitle: 'Handpicked box sets across all sports.',
    items: pick(
      'topps-chrome-2024-hobby',
      'panini-prizm-football-2024-hobby',
      'panini-prizm-bball-2425-hobby',
      'ud-ice-hockey-2425-hobby',
      'bowman-chrome-2024-jumbo',
      'panini-select-football-2024-hobby',
      'panini-noir-bball-2425-hobby',
      'ud-black-diamond-hockey-2425-hobby',
      'topps-museum-2024-hobby',
      'panini-nt-football-2024-hobby',
      'panini-flawless-bball-2425-hobby',
      'topps-tier-one-2024-hobby',
      'panini-immaculate-football-2024-hobby',
      'panini-nt-bball-2425-hobby',
    ),
  },
  {
    id: 'trending',
    type: 'box',
    label: 'Trending',
    subtitle: 'Most viewed box sets this week.',
    items: pick(
      'panini-prizm-football-2024-hobby',
      'topps-chrome-2024-hobby',
      'panini-prizm-bball-2425-hobby',
      'bowman-chrome-2024-jumbo',
      'ud-black-diamond-hockey-2425-hobby',
      'panini-select-football-2024-hobby',
      'panini-mosaic-football-2024-hobby',
      'topps-finest-2024-hobby',
      'panini-select-bball-2425-hobby',
      'ud-sp-authentic-hockey-2425-hobby',
      'topps-museum-2024-hobby',
      'panini-chronicles-bball-2425-hobby',
      'bowman-draft-2024-hobby',
      'panini-contenders-football-2024-hobby',
    ),
  },
  {
    id: 'by-brand',
    type: 'brand',
    label: 'By Brand',
    subtitle: 'Browse by manufacturer.',
    items: BRAND_SLIDER_CARDS,
  },
  {
    id: 'by-year',
    type: 'year',
    label: 'By Year',
    subtitle: 'Browse releases by year.',
    items: YEAR_SLIDER_CARDS,
  },
  {
    id: 'baseball',
    type: 'box',
    label: 'Baseball',
    subtitle: 'The full baseball catalogue.',
    items: pick(
      'topps-chrome-2024-hobby',
      'bowman-chrome-2024-jumbo',
      'topps-series1-2024-hobby',
      'bowman-2024-hobby',
      'topps-finest-2024-hobby',
      'topps-museum-2024-hobby',
      'panini-prizm-baseball-2024-hobby',
      'topps-tier-one-2024-hobby',
      'topps-stadium-club-2024-hobby',
      'topps-heritage-2024-hobby',
      'bowman-draft-2024-hobby',
      'topps-allen-ginter-2024-hobby',
      'topps-series2-2024-hobby',
      'topps-chrome-2024-blaster',
    ),
  },
  {
    id: 'football',
    type: 'box',
    label: 'Football',
    subtitle: 'The full football catalogue.',
    items: pick(
      'panini-prizm-football-2024-hobby',
      'panini-nt-football-2024-hobby',
      'panini-immaculate-football-2024-hobby',
      'panini-spectra-football-2024-hobby',
      'panini-select-football-2024-hobby',
      'panini-mosaic-football-2024-hobby',
      'panini-contenders-football-2024-hobby',
      'panini-absolute-football-2024-hobby',
      'panini-chronicles-football-2024-hobby',
      'panini-donruss-football-2024-hobby',
      'panini-score-football-2024-hobby',
      'panini-prizm-football-2023-hobby',
      'panini-select-football-2023-hobby',
      'panini-mosaic-football-2023-hobby',
    ),
  },
  {
    id: 'basketball',
    type: 'box',
    label: 'Basketball',
    subtitle: 'The full basketball catalogue.',
    items: pick(
      'panini-flawless-bball-2425-hobby',
      'panini-nt-bball-2425-hobby',
      'panini-immaculate-bball-2425-hobby',
      'panini-noir-bball-2425-hobby',
      'panini-prizm-bball-2425-hobby',
      'panini-select-bball-2425-hobby',
      'panini-mosaic-bball-2425-hobby',
      'panini-court-kings-bball-2425-hobby',
      'panini-chronicles-bball-2425-hobby',
      'panini-hoops-bball-2425-hobby',
      'panini-donruss-bball-2425-hobby',
      'panini-prizm-bball-2324-hobby',
      'panini-select-bball-2324-hobby',
      'panini-hoops-bball-2324-hobby',
    ),
  },
  {
    id: 'hockey',
    type: 'box',
    label: 'Hockey',
    subtitle: 'The full hockey catalogue.',
    items: pick(
      'ud-black-diamond-hockey-2425-hobby',
      'ud-ice-hockey-2425-hobby',
      'ud-sp-authentic-hockey-2425-hobby',
      'skybox-metal-hockey-2425-hobby',
      'ud-artifacts-hockey-2425-hobby',
      'ud-allure-hockey-2425-hobby',
      'ud-canvas-hockey-2425-hobby',
      'ud-series1-hockey-2425-hobby',
      'ud-series2-hockey-2425-hobby',
      'ud-parkhurst-hockey-2425-hobby',
      'ud-opc-hockey-2425-hobby',
      'ud-mvp-hockey-2425-hobby',
      'ud-ice-hockey-2324-hobby',
      'ud-series1-hockey-2324-hobby',
    ),
  },
];

// NAV_TABS and NAV_DROPDOWN_DATA live in src/utils/navMockData.js
