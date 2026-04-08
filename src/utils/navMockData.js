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
 *   cascade  → "All" tab: 3-level cascading sport → brand → year
 *   trending → "Trending" tab: 4-column layout, one column per sport
 *   list     → "Brands", "Sports", "Year" tabs: multi-column item list
 *   sport    → sport tabs: brands column + years column + popular boxes column
 *
 * When the real backend is connected, replace this file with a useNavData()
 * hook that fetches from the API. The shape of NAV_DROPDOWN_DATA stays the same.
 */

import { BOXES } from './homePageMockData';

// Helper: pull an ordered array of boxes from the catalogue by ID
function pick(...ids) {
  return ids.map((id) => BOXES[id]);
}

// ─── Tab labels ────────────────────────────────────────────────────────────
// Order determines left-to-right position in the nav bar.

export const NAV_TABS = [
  'All', 'Trending', 'Brands', 'Sports', 'Year',
  'Baseball', 'Football', 'Basketball', 'Hockey',
];

// ─── Dropdown content ──────────────────────────────────────────────────────
// Keyed by tab label. SiteNavBar looks up NAV_DROPDOWN_DATA[openTab] to
// decide what to render in the panel.

export const NAV_DROPDOWN_DATA = {
  All: {
    type: 'cascade',
    // Level 1 options
    sports: ['Baseball', 'Football', 'Basketball', 'Hockey'],
    // Level 2 options — brands available per sport
    brandsBySport: {
      Baseball:   ['Bowman', 'Panini', 'Topps'],
      Football:   ['Panini'],
      Basketball: ['Panini'],
      Hockey:     ['Panini', 'Upper Deck'],
    },
    // Level 3 options — years (same list regardless of brand in mock data)
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
  },

  Trending: {
    type: 'trending',
    // One column per sport, each with 10 top boxes this week
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
    items: [
      'Bowman', 'Donruss', 'Fleer', 'Hoops', 'Leaf',
      'Mosaic', 'Pacific', 'Panini', 'Prizm', 'Score',
      'Select', 'Skybox', 'Topps', 'Upper Deck',
    ],
  },

  Sports: {
    type: 'list',
    items: ['Baseball', 'Basketball', 'Football', 'Hockey'],
  },

  Year: {
    type: 'list',
    items: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
  },

  Baseball: {
    type: 'sport',
    brands: ['Bowman', 'Panini', 'Topps', 'Upper Deck'],
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
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
    brands: ['Panini'],
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
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
    brands: ['Panini'],
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
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
    brands: ['Panini', 'Upper Deck'],
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
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
};
