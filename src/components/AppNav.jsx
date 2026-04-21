/**
 * AppNav
 *
 * The primary site header — logo on the left, search bar centered, links on the right.
 * Sticky so it stays visible as the user scrolls. Appears on every page.
 *
 * The logo links to the homepage.
 * The search bar is self-contained here until it is wired to URL search params (?q=...).
 *
 * On mobile, the right-side links collapse and a hamburger button appears.
 * Tapping the hamburger opens HamburgerMenu — a full-screen overlay component.
 * Open/close state lives here and is passed down to HamburgerMenu as props.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { HamburgerMenu } from './HamburgerMenu';
import './AppNav.css';

export function AppNav() {
  // Controls whether the mobile full-screen menu overlay is visible.
  // Lives here (not in HamburgerMenu) so AppNav owns the open/close lifecycle.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-top-bar">
        <div className="site-top-bar__inner">

          {/* Mobile hamburger — hidden on desktop, shown on mobile in place of the left column */}
          <button
            className="site-top-bar__hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

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

            {/* Sign in: outlined secondary, Sign up: solid green primary */}
            <Link className="site-top-bar__sign-in" to="/signin">Sign in</Link>
            <Link className="site-top-bar__sign-up" to="/signup">Sign up</Link>
          </nav>

        </div>
      </header>

      {/* Mobile full-screen navigation overlay.
          Rendered outside the <header> so its fixed positioning covers the full viewport
          without being clipped by the header's stacking context. */}
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
