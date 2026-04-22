/**
 * SiteNavBar
 *
 * Dark green secondary navigation bar with a mega-menu dropdown system.
 * Sits below the top bar (sticky at top: 64px, which is the top bar height).
 *
 * Desktop: each tab opens its dropdown on hover and navigates to /browse on click.
 * Mobile: each tab opens its dropdown on tap only — no navigation occurs at the tab
 * level. Navigation happens when the user taps a specific option inside the dropdown.
 * The panel closes after a 200ms delay on mouse-leave so the cursor can move from
 * the tab to the panel without it closing.
 *
 * Dropdown types (defined in NAV_DROPDOWN_DATA):
 *   cascade   → "All" tab: 3-level cascading sport → brand → year
 *   trending  → "Trending" tab: 4-column layout, one column per sport
 *   list      → "Brands", "Sports" tabs: multi-column item list
 *   year-grid → "Year" tab: 4-column × 4-row grid of years 2025–2010
 *   sport     → sport tabs (Baseball/Football/Basketball/Hockey/Soccer):
 *               3-column grid — Brands | Year | Popular Boxes
 *
 * Desktop item cap rules:
 *   - Max 5 items per column in every dropdown
 *   - Max 2 columns per dropdown (10 items total visible)
 *   - Any list exceeding the cap gets a "More →" link as the final item,
 *     routed to /browse with the appropriate query parameters pre-applied
 *
 * Mobile item cap rules:
 *   - Complex multi-column layouts are replaced by a single flat list
 *   - Maximum 6 items shown; excess items get a "More" button (7th position)
 *   - "More" navigates to /browse with the tab's filter pre-applied
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

// Maximum items to display in a single column before the list is capped (desktop).
const ITEMS_PER_COL = 5;

// Maximum items to display in the mobile flat-list dropdown before a "More" button
// appears as the 7th item. Keeps the panel compact on narrow screens.
const MOBILE_ITEMS_CAP = 6;

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
  Soccer:     '/browse?sport=Soccer',
};

export function SiteNavBar({ tabs }) {
  const [openTab, setOpenTab]           = useState(null);
  const [cascadeSport, setCascadeSport] = useState(null);
  const [cascadeBrand, setCascadeBrand] = useState(null);
  const closeTimerRef    = useRef(null);
  // Touch gesture tracking — three refs working together:
  //
  //   isTouchActiveRef — true while a finger is on the screen (touchstart → touchend).
  //                      Used to suppress onMouseEnter, which mobile browsers fire as
  //                      a finger scrolls across buttons.
  //
  //   touchMovedRef    — set true when touchmove fires; stays true until next touchstart.
  //                      Used in onClick to ignore scroll gestures that end over a button.
  //
  //   wasTouchTapRef   — set true at touchstart; read and cleared in onClick.
  //                      Tells the click handler whether the interaction came from a
  //                      finger tap (true) or a desktop mouse click (false/undefined).
  //                      This is how we give mobile and desktop different tab-click behavior:
  //                        mobile tap   → dropdown only, no navigation
  //                        desktop click → dropdown + navigate (unchanged behavior)
  const touchMovedRef    = useRef(false);
  const isTouchActiveRef = useRef(false);
  const wasTouchTapRef   = useRef(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Active tab detection ─────────────────────────────────────────────────
  // Read the sport query param from the current URL so we know which tab to highlight.
  const currentSearch = new URLSearchParams(location.search);
  const currentSport  = currentSearch.get('sport'); // null when no sport filter is active

  function isTabActive(tab) {
    if (location.pathname !== '/browse') return false;
    const sportTabs = ['Baseball', 'Football', 'Basketball', 'Hockey', 'Soccer'];
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

  // Sport tabs (Baseball, Football, Basketball, Hockey, Soccer).
  // Three-column grid: Brands | Year | Popular Boxes.
  //   - Brands: all brands for this sport, link to sport+brand browse filter
  //   - Year: 4 most recent full-profile seasons, link to sport+year browse filter
  //   - Popular Boxes: first 4 from data.popularBoxes, link to box profile page.
  //     Column is hidden when no boxes are available (e.g. Soccer has no boxes yet).
  //     TODO: wire popularBoxes to real data from the database at database phase.
  function renderSportDropdown(data, tabKey) {
    // Show 4 most recent years — these are the seasons with complete profiles
    const DISPLAY_YEARS = [2025, 2024, 2023, 2022];
    // Cap Popular Boxes at 4 items to match the 4-row height of the Year column
    const displayBoxes = data.popularBoxes.slice(0, 4);

    return (
      <div className="nav-dropdown__sport-grid">
        {/* Column 1: Brands */}
        <div className="nav-dropdown__sport-col">
          <p className="nav-dropdown__sport-col-label">Brands</p>
          {data.brands.map((brand) => (
            <Link
              key={brand}
              to={`/browse?sport=${tabKey}&manufacturer=${brand}`}
              className="nav-dropdown__sport-item"
              onClick={closeDropdown}
            >
              {brand}
            </Link>
          ))}
        </div>

        {/* Column 2: Year — 4 hardcoded recent seasons */}
        <div className="nav-dropdown__sport-col">
          <p className="nav-dropdown__sport-col-label">Year</p>
          {DISPLAY_YEARS.map((year) => (
            <Link
              key={year}
              to={`/browse?sport=${tabKey}&year=${year}`}
              className="nav-dropdown__sport-item"
              onClick={closeDropdown}
            >
              {year}
            </Link>
          ))}
        </div>

        {/* Column 3: Popular Boxes — wider, long names truncated with ellipsis.
            Hidden when no boxes exist for this sport (e.g. Soccer until box data is seeded). */}
        {displayBoxes.length > 0 && (
          <div className="nav-dropdown__sport-col nav-dropdown__sport-col--wide">
            <p className="nav-dropdown__sport-col-label">Popular Boxes</p>
            {displayBoxes.map((box) => (
              <Link
                key={box.id}
                to={`/box/${box.id}`}
                className="nav-dropdown__sport-item"
                onClick={closeDropdown}
              >
                {box.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // "Year" tab — 16 years (2025–2010) in a 4-column × 4-row grid.
  // No column labels — the grid speaks for itself.
  // Includes legacy years (2010–2017) which have checklists/pricing but no EV/ROI.
  function renderYearGridDropdown(data) {
    return (
      <div className="nav-dropdown__year-grid">
        {data.items.map((year) => (
          <Link
            key={year}
            to={`/browse?year=${year}`}
            className="nav-dropdown__year-item"
            onClick={closeDropdown}
          >
            {year}
          </Link>
        ))}
      </div>
    );
  }

  // ── Mobile dropdown renderer ─────────────────────────────────────────────
  // Replaces all complex multi-column layouts with a single flat list on mobile.
  // Every dropdown type is reduced to a { label, to } array, capped at
  // MOBILE_ITEMS_CAP (6). When more items exist, a "More" button appears as the
  // 7th item and navigates to /browse with the tab's filter pre-applied (via
  // TAB_LINKS[openTab]), letting the user see the full filtered set.
  function renderMobileDropdown() {
    const data = NAV_DROPDOWN_DATA[openTab];
    if (!data) return null;

    let items = [];

    switch (data.type) {
      case 'cascade':
        // "All" tab: entry points into the cascade — one item per sport
        items = data.sports.map((sport) => ({
          label: sport,
          to:    `/browse?sport=${sport}`,
        }));
        break;

      case 'trending':
        // "Trending" tab: one item per sport section, linking to that sport's browse page
        items = data.sections.map((section) => ({
          label: section.sport,
          to:    `/browse?sport=${section.sport}`,
        }));
        break;

      case 'list':
        // "Brands", "Sports" tabs: flat map of each item to its browse URL
        items = data.items.map((option) => {
          const value = String(option);
          if (openTab === 'Brands') return { label: value, to: `/browse?manufacturer=${value}` };
          if (openTab === 'Sports') return { label: value, to: `/browse?sport=${value}` };
          return { label: value, to: '/browse' };
        });
        break;

      case 'year-grid':
        // "Year" tab: flat list of years, each linking to the year's browse filter
        items = data.items.map((year) => ({
          label: String(year),
          to:    `/browse?year=${year}`,
        }));
        break;

      case 'sport':
        // Sport tabs: brands first (e.g. Panini), then years (e.g. 2026, 2025…)
        // Brands link to sport+manufacturer; years link to sport+year
        items = [
          ...data.brands.map((brand) => ({
            label: brand,
            to:    `/browse?sport=${openTab}&manufacturer=${brand}`,
          })),
          ...data.years.map((year) => ({
            label: String(year),
            to:    `/browse?sport=${openTab}&year=${year}`,
          })),
        ];
        break;

      default:
        return null;
    }

    const visibleItems = items.slice(0, MOBILE_ITEMS_CAP);
    const hasMore      = items.length > MOBILE_ITEMS_CAP;
    // "More" lands on the tab's own browse URL so the category filter is pre-applied
    const moreUrl      = TAB_LINKS[openTab] ?? '/browse';

    return (
      <ul className="nav-dropdown__mobile-list">
        {visibleItems.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="nav-dropdown__item"
              onClick={closeDropdown}
            >
              {label}
            </Link>
          </li>
        ))}
        {/* More button — only when items exceed MOBILE_ITEMS_CAP.
            Accent-colored so it reads as an action, not a filter option. */}
        {hasMore && (
          <li>
            <Link
              to={moreUrl}
              className="nav-dropdown__item nav-dropdown__mobile-more"
              onClick={closeDropdown}
            >
              More
            </Link>
          </li>
        )}
      </ul>
    );
  }

  function renderDropdownContent() {
    const data = NAV_DROPDOWN_DATA[openTab];
    if (!data) return null;

    switch (data.type) {
      case 'cascade':   return renderCascadeDropdown(data);
      case 'trending':  return renderTrendingDropdown(data);
      case 'list':      return renderListDropdown(data, openTab);
      case 'year-grid': return renderYearGridDropdown(data);
      case 'sport':     return renderSportDropdown(data, openTab);
      default:          return null;
    }
  }

  const dropdownData = openTab ? NAV_DROPDOWN_DATA[openTab] : null;

  return (
    <nav className="site-nav-bar" aria-label="Browse categories">
      {/* Tab row
          Touch event listeners on the container track whether the current gesture
          is a scroll (touchmove fired) or a tap (no movement). This prevents the
          dropdown from opening when the user scrolls across tabs on mobile. */}
      <div
        className="site-nav-bar__inner"
        onTouchStart={() => { isTouchActiveRef.current = true; touchMovedRef.current = false; wasTouchTapRef.current = true; }}
        onTouchMove={() => { touchMovedRef.current = true; }}
        onTouchEnd={() => { isTouchActiveRef.current = false; }}
        onTouchCancel={() => { isTouchActiveRef.current = false; touchMovedRef.current = false; }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            className={[
              'site-nav-bar__tab',
              openTab === tab    ? 'site-nav-bar__tab--open'   : '',
              isTabActive(tab)   ? 'site-nav-bar__tab--active' : '',
            ].join(' ')}
            onClick={() => {
              // If the touch included movement, the user was scrolling — not tapping.
              // Suppress the dropdown toggle so scrolling never opens a menu.
              if (touchMovedRef.current) return;

              // Read and immediately clear the touch-tap flag.
              // wasTouchTapRef is set at touchstart and stays true through onClick.
              // A desktop mouse click never sets it, so it stays false/undefined.
              const isMobileTap = wasTouchTapRef.current;
              wasTouchTapRef.current = false;

              if (isMobileTap) {
                // Mobile tap: toggle the dropdown only. Do NOT navigate away —
                // the user needs to see the dropdown and tap a specific option
                // (e.g. a year or brand) before navigation should occur.
                if (openTab === tab) {
                  closeDropdown();
                } else {
                  openDropdown(tab);
                }
              } else {
                // Desktop mouse click: existing behavior unchanged —
                // toggle dropdown AND navigate to the tab's destination.
                handleTabClick(tab);
              }
            }}
            onMouseEnter={() => {
              // On mobile, onMouseEnter fires as a finger scrolls across buttons.
              // Guard against this by ignoring mouseenter while a touch is active.
              if (isTouchActiveRef.current) return;
              openDropdown(tab);
            }}
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
          {/* Desktop: multi-column mega-menu layout. Hidden on mobile via CSS. */}
          <div className="site-nav-bar__dropdown-inner site-nav-bar__dropdown-inner--desktop">
            {renderDropdownContent()}
          </div>
          {/* Mobile: flat single-column list, capped at 6 items + More button.
              Hidden on desktop via CSS. Constrained to the viewport width. */}
          <div className="site-nav-bar__dropdown-inner site-nav-bar__dropdown-inner--mobile">
            {renderMobileDropdown()}
          </div>
        </div>
      )}
    </nav>
  );
}
