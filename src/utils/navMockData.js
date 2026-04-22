/**
 * Mock data for site navigation (SiteNavBar).
 *
 * Separated from homePageMockData.js because the nav belongs to the
 * persistent site shell, not to any specific page.
 *
 * Structure:
 *   NAV_TABS          — ordered tab labels rendered in the nav bar
 *   NAV_DROPDOWN_DATA — mega-menu content for each tab
 *
 * NAV_DROPDOWN_DATA references the BOXES catalogue from homePageMockData.js.
 * That's a one-way dependency: nav knows about boxes, not the other way around.
 *
 * Dropdown types:
 *   cascade   → "All" tab: 3-level cascading sport → brand → year
 *   trending  → "Trending" tab: 4-column layout, one column per sport
 *   list      → "Brands", "Sports" tabs: multi-column item list
 *   year-grid → "Year" tab: 4-column × 4-row grid of years 2025–2010
 *   sport     → sport tabs: 3-column grid — Brands | Year | Popular Boxes
 *
 * When the real backend is connected, replace this file with a useNavData()
 * hook that fetches from the API. The shape of NAV_DROPDOWN_DATA stays the same.
 *
 * NAV_YEARS scope: 2018–present — sport tabs and cascade only use full-profile years.
 * The Year tab uses YEAR_TAB_ITEMS (2025–2010) which also includes legacy profiles.
 *
 * Manufacturers: four major brands only — Topps, Panini, Upper Deck, Bowman.
 * Sport-specific filtering applies (e.g. Hockey is Upper Deck exclusive).
 */

import { BOXES } from './homePageMockData';

// Helper: pull an ordered array of boxes from the catalogue by ID
function pick(...ids) {
  return ids.map((id) => BOXES[id]);
}

// Years in scope for sport tabs and cascade — 2018 through current year, descending.
// Pre-2018 years are excluded: the database only carries full profiles from 2018 onward.
const NAV_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

// Extended year range for the Year tab grid — includes legacy profiles (1995–2017).
// Legacy boxes have checklists and pricing but no EV or ROI — the box profile page
// handles this gracefully. 2025–2010 gives a clean 4×4 grid (16 years).
const YEAR_TAB_ITEMS = [
  2025, 2024, 2023, 2022,
  2021, 2020, 2019, 2018,
  2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010,
];

// ─── Tab labels ────────────────────────────────────────────────────────────
// Order determines left-to-right position in the nav bar.

export const NAV_TABS = [
  'All', 'Trending', 'Brands', 'Sports', 'Year',
  'Baseball', 'Football', 'Basketball', 'Hockey', 'Soccer',
];

// ─── Dropdown content ──────────────────────────────────────────────────────
// Keyed by tab label. SiteNavBar looks up NAV_DROPDOWN_DATA[openTab] to
// decide what to render in the panel.

export const NAV_DROPDOWN_DATA = {
  All: {
    type: 'cascade',
    // Level 1 options
    sports: ['Baseball', 'Football', 'Basketball', 'Hockey', 'Soccer'],
    // Level 2 options — brands available per sport (four majors, sport-filtered)
    brandsBySport: {
      Baseball:   ['Bowman', 'Panini', 'Topps'],
      Football:   ['Panini'],
      Basketball: ['Panini'],
      Hockey:     ['Upper Deck'], // Upper Deck holds the NHL exclusive license
      Soccer:     ['Panini', 'Topps'], // Panini: Prizm Soccer; Topps: Champions League
    },
    // Level 3 options — years in scope (2018–present, descending)
    years: NAV_YEARS,
  },

  Trending: {
    type: 'trending',
    // One column per sport — SiteNavBar caps display at 5 per column + "More →"
    sections: [
      {
        sport: 'Baseball',
        boxes: pick(
          'topps-chrome-2024-hobby',
          'bowman-chrome-2024-jumbo',
          'topps-finest-2024-hobby',
          'topps-museum-2024-hobby',
          'panini-prizm-baseball-2024-hobby',
          'topps-tier-one-2024-hobby',
          'topps-series1-2024-hobby',
          'bowman-2024-hobby',
          'topps-heritage-2024-hobby',
          'bowman-draft-2024-hobby',
        ),
      },
      {
        sport: 'Football',
        boxes: pick(
          'panini-prizm-football-2024-hobby',
          'panini-nt-football-2024-hobby',
          'panini-immaculate-football-2024-hobby',
          'panini-spectra-football-2024-hobby',
          'panini-select-football-2024-hobby',
          'panini-mosaic-football-2024-hobby',
          'panini-contenders-football-2024-hobby',
          'panini-absolute-football-2024-hobby',
          'panini-chronicles-football-2024-hobby',
          'panini-prizm-football-2023-hobby',
        ),
      },
      {
        sport: 'Basketball',
        boxes: pick(
          'panini-flawless-bball-2425-hobby',
          'panini-nt-bball-2425-hobby',
          'panini-immaculate-bball-2425-hobby',
          'panini-noir-bball-2425-hobby',
          'panini-prizm-bball-2425-hobby',
          'panini-select-bball-2425-hobby',
          'panini-mosaic-bball-2425-hobby',
          'panini-court-kings-bball-2425-hobby',
          'panini-chronicles-bball-2425-hobby',
          'panini-prizm-bball-2324-hobby',
        ),
      },
      {
        sport: 'Hockey',
        boxes: pick(
          'ud-black-diamond-hockey-2425-hobby',
          'ud-ice-hockey-2425-hobby',
          'skybox-metal-hockey-2425-hobby',
          'ud-sp-authentic-hockey-2425-hobby',
          'ud-artifacts-hockey-2425-hobby',
          'ud-allure-hockey-2425-hobby',
          'ud-canvas-hockey-2425-hobby',
          'ud-series1-hockey-2425-hobby',
          'ud-series2-hockey-2425-hobby',
          'ud-ice-hockey-2324-hobby',
        ),
      },
    ],
  },

  Brands: {
    type: 'list',
    // Four major brands only — matches the manufacturers seeded in the database schema.
    items: ['Bowman', 'Panini', 'Topps', 'Upper Deck'],
  },

  Sports: {
    type: 'list',
    items: ['Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer'],
  },

  Year: {
    type: 'year-grid',
    // 2025–2010 in descending order — 16 years fills a clean 4×4 grid.
    // Includes legacy years (2010–2017) which have checklist/pricing but no EV/ROI.
    items: YEAR_TAB_ITEMS,
  },

  Baseball: {
    type: 'sport',
    // Bowman is a Topps sub-brand but listed separately as it has distinct product lines.
    // Upper Deck excluded — they do not hold a current MLB license.
    brands: ['Bowman', 'Panini', 'Topps'],
    years: NAV_YEARS,
    // Full list kept here; SiteNavBar caps display at 5 + "More →"
    popularBoxes: pick(
      'topps-chrome-2024-hobby',
      'bowman-chrome-2024-jumbo',
      'topps-finest-2024-hobby',
      'topps-museum-2024-hobby',
      'panini-prizm-baseball-2024-hobby',
      'topps-tier-one-2024-hobby',
      'topps-series1-2024-hobby',
      'bowman-2024-hobby',
      'topps-heritage-2024-hobby',
      'topps-stadium-club-2024-hobby',
    ),
  },

  Football: {
    type: 'sport',
    brands: ['Panini'], // Panini holds the NFL exclusive license
    years: NAV_YEARS,
    popularBoxes: pick(
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
    ),
  },

  Basketball: {
    type: 'sport',
    brands: ['Panini'], // Panini holds the NBA exclusive license
    years: NAV_YEARS,
    popularBoxes: pick(
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
    ),
  },

  Hockey: {
    type: 'sport',
    brands: ['Upper Deck'], // Upper Deck holds the NHL exclusive license
    years: NAV_YEARS,
    popularBoxes: pick(
      'ud-black-diamond-hockey-2425-hobby',
      'ud-ice-hockey-2425-hobby',
      'skybox-metal-hockey-2425-hobby',
      'ud-sp-authentic-hockey-2425-hobby',
      'ud-artifacts-hockey-2425-hobby',
      'ud-allure-hockey-2425-hobby',
      'ud-canvas-hockey-2425-hobby',
      'ud-series1-hockey-2425-hobby',
      'ud-series2-hockey-2425-hobby',
      'ud-parkhurst-hockey-2425-hobby',
    ),
  },

  Soccer: {
    type: 'sport',
    brands: ['Panini', 'Topps'], // Panini: Prizm Soccer, Donruss; Topps: Champions League
    years: NAV_YEARS,
    // TODO: add Soccer box IDs to homePageMockData.js BOXES catalogue, then use pick() here
    popularBoxes: [],
  },
};
