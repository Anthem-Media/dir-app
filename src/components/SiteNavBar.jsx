/**
 * SiteNavBar
 *
 * Dark green secondary navigation bar with a mega-menu dropdown system.
 * Sits below the top bar (sticky at top: 64px, which is the top bar height).
 *
 * Each tab has a dropdown panel. The panel opens on mouse-enter and closes
 * after a 200ms delay on mouse-leave — the delay prevents the panel from
 * flickering if the user briefly moves the cursor between the tab and panel.
 *
 * Dropdown types (defined in NAV_DROPDOWN_DATA):
 *   cascade  → "All" tab: 3-level cascading sport → brand → year
 *   trending → "Trending" tab: 4-column layout, one column per sport
 *   list     → "Brands", "Sports", "Year" tabs: multi-column item list
 *   sport    → sport tabs: brands column + years column + popular boxes column
 *
 * @param {string[]}  tabs        - Tab labels (matches keys in NAV_DROPDOWN_DATA)
 * @param {string}    activeTab   - Currently selected tab (highlighted)
 * @param {function}  onTabChange - Called with the new tab label when a tab is clicked
 */

import { useState, useRef } from 'react';
import { NAV_DROPDOWN_DATA } from '../utils/homePageMockData';
import './SiteNavBar.css';

// How long (ms) to wait before closing the dropdown after mouse-leave.
// Gives the user time to move from the tab to the dropdown panel without it closing.
const CLOSE_DELAY_MS = 200;

export function SiteNavBar({ tabs, activeTab, onTabChange }) {
  // Which tab's dropdown is currently open (null = all closed)
  const [openTab, setOpenTab] = useState(null);

  // Cascade state for the "All" tab: which sport/brand is highlighted at each level
  const [cascadeSport, setCascadeSport] = useState(null);
  const [cascadeBrand, setCascadeBrand] = useState(null);

  // Holds the setTimeout ID so we can cancel a scheduled close
  const closeTimerRef = useRef(null);

  // ── Open / close helpers ─────────────────────────────────────────────────

  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => {
      setOpenTab(null);
      setCascadeSport(null);
      setCascadeBrand(null);
    }, CLOSE_DELAY_MS);
  }

  function openDropdown(tab) {
    cancelClose();
    // Reset cascade state when switching to a different tab
    if (openTab !== tab) {
      setCascadeSport(null);
      setCascadeBrand(null);
    }
    setOpenTab(tab);
  }

  function handleTabClick(tab) {
    onTabChange(tab);
    // Toggle: clicking the already-open tab closes its dropdown
    if (openTab === tab) {
      setOpenTab(null);
    } else {
      openDropdown(tab);
    }
  }

  // ── Dropdown content renderers ───────────────────────────────────────────

  // "All" tab — 3-level cascading menu: sport → brand → year
  function renderCascadeDropdown(data) {
    return (
      <div className="nav-dropdown__cascade">
        {/* Level 1: Sports */}
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Sport</p>
          {data.sports.map((sport) => (
            <button
              key={sport}
              className={`nav-dropdown__item ${cascadeSport === sport ? 'nav-dropdown__item--active' : ''}`}
              onMouseEnter={() => { setCascadeSport(sport); setCascadeBrand(null); }}
              onClick={() => setCascadeSport(sport)}
            >
              {sport}
              <svg className="nav-dropdown__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* Level 2: Brands — only visible after a sport is highlighted */}
        {cascadeSport && (
          <div className="nav-dropdown__col">
            <p className="nav-dropdown__col-heading">Brand</p>
            {data.brandsBySport[cascadeSport].map((brand) => (
              <button
                key={brand}
                className={`nav-dropdown__item ${cascadeBrand === brand ? 'nav-dropdown__item--active' : ''}`}
                onMouseEnter={() => setCascadeBrand(brand)}
                onClick={() => setCascadeBrand(brand)}
              >
                {brand}
                <svg className="nav-dropdown__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Level 3: Years — only visible after a brand is highlighted */}
        {cascadeBrand && (
          <div className="nav-dropdown__col">
            <p className="nav-dropdown__col-heading">Year</p>
            {data.years.map((year) => (
              <button key={year} className="nav-dropdown__item">
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // "Trending" tab — 4 columns, one per sport, each with top 10 boxes
  function renderTrendingDropdown(data) {
    return (
      <div className="nav-dropdown__trending">
        {data.sections.map((section) => (
          <div key={section.sport} className="nav-dropdown__col">
            <p className="nav-dropdown__col-heading">{section.sport}</p>
            {section.boxes.map((box) => (
              <button key={box.id} className="nav-dropdown__item nav-dropdown__item--dense">
                {box.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // "Brands", "Sports", "Year" tabs — simple multi-column item list
  function renderListDropdown(data) {
    return (
      <div className="nav-dropdown__list">
        {data.items.map((item) => (
          <button key={item} className="nav-dropdown__item">
            {item}
          </button>
        ))}
      </div>
    );
  }

  // Sport tabs (Baseball, Football, etc.) — brands + years + popular boxes
  function renderSportDropdown(data) {
    return (
      <div className="nav-dropdown__sport">
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Brands</p>
          {data.brands.map((brand) => (
            <button key={brand} className="nav-dropdown__item">{brand}</button>
          ))}
        </div>
        <div className="nav-dropdown__col">
          <p className="nav-dropdown__col-heading">Year</p>
          {data.years.map((year) => (
            <button key={year} className="nav-dropdown__item">{year}</button>
          ))}
        </div>
        <div className="nav-dropdown__col nav-dropdown__col--wide">
          <p className="nav-dropdown__col-heading">Popular Boxes</p>
          {data.popularBoxes.map((box) => (
            <button key={box.id} className="nav-dropdown__item nav-dropdown__item--dense">
              {box.name}
            </button>
          ))}
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
      case 'list':     return renderListDropdown(data);
      case 'sport':    return renderSportDropdown(data);
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
              activeTab === tab  ? 'site-nav-bar__tab--active' : '',
              openTab   === tab  ? 'site-nav-bar__tab--open'   : '',
            ].join(' ')}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => openDropdown(tab)}
            onMouseLeave={scheduleClose}
            aria-current={activeTab === tab ? 'true' : undefined}
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
