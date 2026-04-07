/**
 * SiteTopBar
 *
 * The primary site header — logo on the left, search bar centered, links on the right.
 * Sticky so it stays visible as the user scrolls.
 * Exported as AppNav to match the existing import in App.jsx.
 */

import { SearchBar } from './SearchBar';
import './AppNav.css';

/**
 * @param {string}   searchValue  - Controlled search query (lifted to App.jsx)
 * @param {function} onSearchChange
 */
export function AppNav({ searchValue = '', onSearchChange = () => {} }) {
  return (
    <header className="site-top-bar">
      <div className="site-top-bar__inner">

        {/* Left — brand */}
        <div className="site-top-bar__brand">
          <span className="site-top-bar__logo">DIR</span>
          <span className="site-top-bar__logo-name">Diamond in the Rough</span>
        </div>

        {/* Center — search */}
        <div className="site-top-bar__search">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search brand, year, sport, box set..."
          />
        </div>

        {/* Right — nav links + actions */}
        <nav className="site-top-bar__actions" aria-label="Site links">
          <a className="site-top-bar__link" href="#about">About</a>
          <a className="site-top-bar__link" href="#news">News</a>
          <a className="site-top-bar__link" href="#help">Help</a>

          {/* Notification bell */}
          <button className="site-top-bar__icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 1.5a5.25 5.25 0 0 0-5.25 5.25c0 2.625-.75 3.75-1.5 4.5h13.5c-.75-.75-1.5-1.875-1.5-4.5A5.25 5.25 0 0 0 9 1.5Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
              />
              <path d="M7.5 15a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <button className="site-top-bar__sign-in">Sign in</button>
        </nav>

      </div>
    </header>
  );
}
