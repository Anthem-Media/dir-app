/**
 * SiteNavBar
 *
 * Dark green secondary navigation bar with a mega-menu dropdown system.
 * Sits below the top bar (sticky at top: 64px, which is the top bar height).
 *
 * Each tab navigates to /browse with query params on click and shows a
 * dropdown panel on hover. The panel closes after a 200ms delay on mouse-leave
 * so the user can move the cursor from the tab to the panel without it closing.
 *
 * Dropdown types (defined in NAV_DROPDOWN_DATA):
 *   cascade  → "All" tab: 3-level cascading sport → brand → year
 *   trending → "Trending" tab: 4-column layout, one column per sport
 *   list     → "Brands", "Sports", "Year" tabs: multi-column item list
 *   sport    → sport tabs: brands column + years column + popular boxes column
 *
 * Item cap rules:
 *   - Max 5 items per column in every dropdown
 *   - Max 2 columns per dropdown (10 items total visible)
 *   - Any list exceeding the cap gets a "More →" link as the final item,
 *     routed to /browse with the appropriate query parameters pre-applied
 *
 * Active tab: determined by useLocation() — the tab whose destination URL
 * matches the current route is highlighted with site-nav-bar__tab--active.
 */

import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_DROPDOWN_DATA } from '../utils/navMockData';
import './SiteNavBar.css';

// How long (ms) to wait before closing the dropdown after mouse-leave.
const CLOSE_DELAY_MS = 200;

// Maximum items to display in a single column before the list is capped.
const ITEMS_PER_COL = 5;

// The URL each tab navigates to when clicked directly.
const TAB_LINKS = {
  All:        '/browse',
  Trending:   '/browse',
  Brands:     '/browse',
  Sports:     '/browse',
  Year:       '/browse',
  Baseball:   '/browse?sport=Baseball',
  Football:   '/browse?sport=Football',
  Basketball: '/browse?sport=Basketball',
  Hockey:     '/browse?sport=Hockey',
};

export function SiteNavBar({ tabs }) {
  const [openTab, setOpenTab]           = useState(null);
  const [cascadeSport, setCascadeSport] = useState(null);
  const [cascadeBrand, setCascadeBrand] = useState(null);
  const closeTimerRef = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Active tab detection ─────────────────────────────────────────────────
  // Read the sport query param from the current URL so we know which tab to highlight.
  const currentSearch = new URLSearchParams(location.search);
  const currentSport  = currentSearch.get('sport'); // null when no sport filter is active

  function isTabActive(tab) {
    if (location.pathname !== '/browse') return false;
    const sportTabs = ['Baseball', 'Football', 'Basketball', 'Hockey'];
    if (sportTabs.includes(tab)) return currentSport === tab;
    if (tab === 'All')           return currentSport === null;
    return false; // Trending / Brands / Sports / Year don't map to a single URL pattern
  }

  // ── Open / close helpers ─────────────────────────────────────────────────

  function closeDropdown() {
    setOpenTab(null);
    setCascadeSport(null);
    setCascadeBrand(null);
  }

  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(closeDropdown, CLOSE_DELAY_MS);
  }

  function openDropdown(tab) {
    cancelClose();
    if (openTab !== tab) {
      // Reset cascade state when switching tabs
      setCascadeSport(null);
      setCascadeBrand(null);
    }
    setOpenTab(tab);
  }

  function handleTabClick(tab) {
    // Toggle the dropdown open/closed, then navigate to the tab's destination
    if (openTab === tab) {
      closeDropdown();
    } else {
      openDropdown(tab);
    }
    navigate(TAB_LINKS[tab] ?? '/browse');
  }

  // ── Dropdown content renderers ───────────────────────────────────────────

  // "All" tab — 3-level cascading menu: sport → brand → year
  // Years are capped at ITEMS_PER_COL; overflow gets a "More →" link.
  function renderCascadeDropdown(data) {
    const visibleYears = data.years.slice(0, ITEMS_PER_COL);
    const hasMoreYears = data.years.length > ITEMS_PER_COL;

    return (
      <div className="nav-dropdown__cascade">
        {/* Level 1: Sports */}
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Sport</p>
          {data.sports.map((sport) => (
            <Link
              key={sport}
              to={`/browse?sport=${sport}`}
              className={`nav-dropdown__item ${cascadeSport === sport ? 'nav-dropdown__item--active' : ''}`}
              onMouseEnter={() => { setCascadeSport(sport); setCascadeBrand(null); }}
              onClick={closeDropdown}
            >
              {sport}
              <svg className="nav-dropdown__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Level 2: Brands — only visible after a sport is highlighted */}
        {cascadeSport && (
          <div className="nav-dropdown__col">
            <p className="nav-dropdown__col-heading">Brand</p>
            {data.brandsBySport[cascadeSport].map((brand) => (
              <Link
                key={brand}
                to={`/browse?sport=${cascadeSport}&manufacturer=${brand}`}
                className={`nav-dropdown__item ${cascadeBrand === brand ? 'nav-dropdown__item--active' : ''}`}
                onMouseEnter={() => setCascadeBrand(brand)}
                onClick={closeDropdown}
              >
                {brand}
                <svg className="nav-dropdown__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {/* Level 3: Years — only visible after a brand is highlighted.
            Capped at ITEMS_PER_COL; "More →" links to the sport+brand browse filter. */}
        {cascadeBrand && (
          <div className="nav-dropdown__col">
            <p className="nav-dropdown__col-heading">Year</p>
            {visibleYears.map((year) => (
              <Link
                key={year}
                to={`/browse?sport=${cascadeSport}&manufacturer=${cascadeBrand}&year=${year}`}
                className="nav-dropdown__item"
                onClick={closeDropdown}
              >
                {year}
              </Link>
            ))}
            {hasMoreYears && (
              <Link
                to={`/browse?sport=${cascadeSport}&manufacturer=${cascadeBrand}`}
                className="nav-dropdown__item nav-dropdown__item--more"
                onClick={closeDropdown}
              >
                More →
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  // "Trending" tab — 4 columns, one per sport, each capped at ITEMS_PER_COL.
  // "More →" routes to the sport's browse page.
  function renderTrendingDropdown(data) {
    return (
      <div className="nav-dropdown__trending">
        {data.sections.map((section) => {
          const visible  = section.boxes.slice(0, ITEMS_PER_COL);
          const hasMore  = section.boxes.length > ITEMS_PER_COL;
          return (
            <div key={section.sport} className="nav-dropdown__col">
              <p className="nav-dropdown__col-heading">{section.sport}</p>
              {visible.map((box) => (
                <Link
                  key={box.id}
                  to={`/box/${box.id}`}
                  className="nav-dropdown__item nav-dropdown__item--dense"
                  onClick={closeDropdown}
                >
                  {box.name}
                </Link>
              ))}
              {hasMore && (
                <Link
                  to={`/browse?sport=${section.sport}`}
                  className="nav-dropdown__item nav-dropdown__item--more"
                  onClick={closeDropdown}
                >
                  More →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // "Brands", "Sports", "Year" tabs — item list, up to 2 columns of ITEMS_PER_COL.
  // If a second column is needed and items still overflow, a "More →" link appears
  // at the bottom of the second column.
  function renderListDropdown(data, tabKey) {
    function getUrl(item) {
      if (tabKey === 'Brands') return `/browse?manufacturer=${item}`;
      if (tabKey === 'Sports') return `/browse?sport=${item}`;
      if (tabKey === 'Year')   return `/browse?year=${item}`;
      return '/browse';
    }

    const MAX_VISIBLE = ITEMS_PER_COL * 2; // 10 items max across both columns
    const visible   = data.items.slice(0, MAX_VISIBLE);
    const hasMore   = data.items.length > MAX_VISIBLE;
    const col1      = visible.slice(0, ITEMS_PER_COL);
    const col2      = visible.slice(ITEMS_PER_COL);
    const needsCols = col2.length > 0;

    return (
      <div className="nav-dropdown__list-cols">
        {/* Column 1 — always present */}
        <div className="nav-dropdown__col">
          {col1.map((item) => (
            <Link
              key={item}
              to={getUrl(item)}
              className="nav-dropdown__item"
              onClick={closeDropdown}
            >
              {String(item)}
            </Link>
          ))}
        </div>

        {/* Column 2 — only rendered when there are overflow items */}
        {needsCols && (
          <div className="nav-dropdown__col">
            {col2.map((item) => (
              <Link
                key={item}
                to={getUrl(item)}
                className="nav-dropdown__item"
                onClick={closeDropdown}
              >
                {String(item)}
              </Link>
            ))}
            {hasMore && (
              <Link
                to="/browse"
                className="nav-dropdown__item nav-dropdown__item--more"
                onClick={closeDropdown}
              >
                More →
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  // Sport tabs (Baseball, Football, etc.) — brands + years + popular boxes.
  // Years and popular boxes are both capped at ITEMS_PER_COL.
  // "More →" for years and boxes both route to the sport's browse page.
  function renderSportDropdown(data, tabKey) {
    const visibleYears    = data.years.slice(0, ITEMS_PER_COL);
    const hasMoreYears    = data.years.length > ITEMS_PER_COL;
    const visibleBoxes    = data.popularBoxes.slice(0, ITEMS_PER_COL);
    const hasMoreBoxes    = data.popularBoxes.length > ITEMS_PER_COL;

    return (
      <div className="nav-dropdown__sport">
        {/* Brands column — typically 1–4 items, no cap needed */}
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Brands</p>
          {data.brands.map((brand) => (
            <Link
              key={brand}
              to={`/browse?sport=${tabKey}&manufacturer=${brand}`}
              className="nav-dropdown__item"
              onClick={closeDropdown}
            >
              {brand}
            </Link>
          ))}
        </div>

        {/* Years column — capped at ITEMS_PER_COL */}
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Year</p>
          {visibleYears.map((year) => (
            <Link
              key={year}
              to={`/browse?sport=${tabKey}&year=${year}`}
              className="nav-dropdown__item"
              onClick={closeDropdown}
            >
              {year}
            </Link>
          ))}
          {hasMoreYears && (
            <Link
              to={`/browse?sport=${tabKey}`}
              className="nav-dropdown__item nav-dropdown__item--more"
              onClick={closeDropdown}
            >
              More →
            </Link>
          )}
        </div>

        {/* Popular Boxes column — capped at ITEMS_PER_COL */}
        <div className="nav-dropdown__col nav-dropdown__col--wide">
          <p className="nav-dropdown__col-heading">Popular Boxes</p>
          {visibleBoxes.map((box) => (
            <Link
              key={box.id}
              to={`/box/${box.id}`}
              className="nav-dropdown__item nav-dropdown__item--dense"
              onClick={closeDropdown}
            >
              {box.name}
            </Link>
          ))}
          {hasMoreBoxes && (
            <Link
              to={`/browse?sport=${tabKey}`}
              className="nav-dropdown__item nav-dropdown__item--more"
              onClick={closeDropdown}
            >
              More →
            </Link>
          )}
        </div>
      </div>
    );
  }

  function renderDropdownContent() {
    const data = NAV_DROPDOWN_DATA[openTab];
    if (!data) return null;

    switch (data.type) {
      case 'cascade':  return renderCascadeDropdown(data);
      case 'trending': return renderTrendingDropdown(data);
      case 'list':     return renderListDropdown(data, openTab);
      case 'sport':    return renderSportDropdown(data, openTab);
      default:         return null;
    }
  }

  const dropdownData = openTab ? NAV_DROPDOWN_DATA[openTab] : null;

  return (
    <nav className="site-nav-bar" aria-label="Browse categories">
      {/* Tab row */}
      <div className="site-nav-bar__inner">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={[
              'site-nav-bar__tab',
              openTab === tab    ? 'site-nav-bar__tab--open'   : '',
              isTabActive(tab)   ? 'site-nav-bar__tab--active' : '',
            ].join(' ')}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => openDropdown(tab)}
            onMouseLeave={scheduleClose}
            aria-expanded={openTab === tab}
            aria-haspopup={Boolean(NAV_DROPDOWN_DATA[tab])}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dropdown panel — rendered inside the nav so it inherits sticky positioning */}
      {dropdownData && (
        <div
          className="site-nav-bar__dropdown"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="site-nav-bar__dropdown-inner">
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </nav>
  );
}
