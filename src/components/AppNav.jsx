/**
 * AppNav
 *
 * The primary site header — logo on the left, search bar centered, links on the right.
 * Sticky so it stays visible as the user scrolls. Appears on every page.
 *
 * The logo links to the homepage.
 * The search bar is self-contained here until it is wired to URL search params (?q=...).
 */

import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import './AppNav.css';

export function AppNav() {
  return (
    <header className="site-top-bar">
      <div className="site-top-bar__inner">

        {/* Left — brand (links to homepage) */}
        <Link to="/" className="site-top-bar__brand">
          <span className="site-top-bar__logo">DIR</span>
          <span className="site-top-bar__logo-name">Diamond in the Rough</span>
        </Link>

        {/* Center — search */}
        <div className="site-top-bar__search">
          <SearchBar placeholder="Search brand, year, sport, box set..." />
        </div>

        {/* Right — nav links + actions */}
        <nav className="site-top-bar__actions" aria-label="Site links">
          <Link className="site-top-bar__link" to="/about">About</Link>
          <Link className="site-top-bar__link" to="/news">News</Link>
          <Link className="site-top-bar__link" to="/help">Help</Link>

          {/* Notification bell — will link to notifications once auth is built */}
          <button className="site-top-bar__icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 1.5a5.25 5.25 0 0 0-5.25 5.25c0 2.625-.75 3.75-1.5 4.5h13.5c-.75-.75-1.5-1.875-1.5-4.5A5.25 5.25 0 0 0 9 1.5Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
              />
              <path d="M7.5 15a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Link renders as <a> — styled as a button via CSS */}
          <Link className="site-top-bar__sign-in" to="/signin">Sign in</Link>
        </nav>

      </div>
    </header>
  );
}
