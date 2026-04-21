/**
 * HamburgerMenu
 *
 * Full-screen mobile navigation overlay. Opens and closes via the isOpen prop
 * passed from AppNav. Slides in from the right with a CSS transition.
 *
 * Layout (top to bottom):
 *   Header row — close (X) button anchored top-right
 *   Sports accordion — Baseball, Football, Basketball, Hockey, Soccer.
 *     Each sport expands inline to show brands, years, and popular boxes.
 *     Only one sport open at a time (opening a new one closes the previous).
 *   Divider line
 *   Extra page links — About, News, Contact, Help
 *   Auth buttons — Sign In (outlined) and Sign Up (filled), anchored to bottom.
 *     Styled to match the desktop header buttons in AppNav.css exactly.
 *
 * Completely hidden on desktop via CSS — no JS conditional rendering needed.
 * Uses the same NAV_DROPDOWN_DATA as SiteNavBar so sub-items always stay in sync.
 *
 * Accordion animation uses the CSS grid-template-rows trick (0fr → 1fr) which
 * animates height from 0 to auto without a fixed max-height value.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_DROPDOWN_DATA } from '../utils/navMockData';
import './HamburgerMenu.css';

// All five launch sports in the menu. Soccer has no desktop dropdown data yet
// so it renders as a direct link rather than an accordion.
const MENU_SPORTS = ['Baseball', 'Football', 'Basketball', 'Hockey', 'Soccer'];

// Secondary page links shown below the sports accordion.
// Contact is included here; FAQ is excluded by product decision.
const EXTRA_LINKS = [
  { label: 'About',   to: '/about'   },
  { label: 'News',    to: '/news'    },
  { label: 'Contact', to: '/contact' },
  { label: 'Help',    to: '/help'    },
];

export function HamburgerMenu({ isOpen, onClose }) {
  // Only one sport can be expanded at a time. Null means all collapsed.
  const [expandedSport, setExpandedSport] = useState(null);

  // Lock body scroll while the menu is open so the page behind doesn't scroll.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Cleanup ensures scroll is re-enabled if the component unmounts while open.
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Collapse all sport accordions whenever the menu is closed so they start
  // fresh the next time the user opens it.
  useEffect(() => {
    if (!isOpen) setExpandedSport(null);
  }, [isOpen]);

  // Opening a sport collapses any previously open sport (one-at-a-time rule).
  // Tapping the already-open sport collapses it (toggle).
  function toggleSport(sport) {
    setExpandedSport((prev) => (prev === sport ? null : sport));
  }

  return (
    <div
      className={`hamburger-menu${isOpen ? ' hamburger-menu--open' : ''}`}
      role="dialog"
      aria-modal={isOpen}
      aria-label="Navigation menu"
    >

      {/* ── Close button ──────────────────────────────────────────────────── */}
      <div className="hamburger-menu__header">
        <button
          className="hamburger-menu__close"
          type="button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable content (sports + divider + extra links) ───────────── */}
      <div className="hamburger-menu__content">

        {/* Sports accordion */}
        <nav aria-label="Browse by sport">
          {MENU_SPORTS.map((sport) => {
            const sportData = NAV_DROPDOWN_DATA[sport];
            const hasSubs   = sportData?.type === 'sport';
            const isExpanded = expandedSport === sport;

            return (
              <div key={sport} className="hamburger-menu__sport-item">

                {/* Sport header — button with accordion if data exists, Link otherwise */}
                {hasSubs ? (
                  <button
                    className="hamburger-menu__sport-btn"
                    type="button"
                    onClick={() => toggleSport(sport)}
                    aria-expanded={isExpanded}
                  >
                    <span>{sport}</span>
                    <svg
                      className={`hamburger-menu__chevron${isExpanded ? ' hamburger-menu__chevron--open' : ''}`}
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  // Soccer (no dropdown data yet) — direct browse link
                  <Link
                    className="hamburger-menu__sport-btn"
                    to={`/browse?sport=${sport}`}
                    onClick={onClose}
                  >
                    <span>{sport}</span>
                  </Link>
                )}

                {/* Accordion body — only rendered when sub-data exists.
                    The CSS grid trick animates height from 0 to auto smoothly.
                    min-height: 0 on the inner wrapper allows the grid item to
                    collapse below its content's natural height. */}
                {hasSubs && (
                  <div className={`hamburger-menu__sub-items${isExpanded ? ' hamburger-menu__sub-items--open' : ''}`}>
                    <div className="hamburger-menu__sub-items-inner">

                      {/* Brands */}
                      {sportData.brands.length > 0 && (
                        <div className="hamburger-menu__sub-group">
                          <p className="hamburger-menu__sub-heading">Brands</p>
                          {sportData.brands.map((brand) => (
                            <Link
                              key={brand}
                              className="hamburger-menu__sub-link"
                              to={`/browse?sport=${sport}&manufacturer=${brand}`}
                              onClick={onClose}
                            >
                              {brand}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Years */}
                      {sportData.years.length > 0 && (
                        <div className="hamburger-menu__sub-group">
                          <p className="hamburger-menu__sub-heading">Year</p>
                          {sportData.years.map((year) => (
                            <Link
                              key={year}
                              className="hamburger-menu__sub-link"
                              to={`/browse?sport=${sport}&year=${year}`}
                              onClick={onClose}
                            >
                              {year}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Popular Boxes — capped at 5 to keep accordion compact on mobile */}
                      {sportData.popularBoxes.length > 0 && (
                        <div className="hamburger-menu__sub-group">
                          <p className="hamburger-menu__sub-heading">Popular Boxes</p>
                          {sportData.popularBoxes.slice(0, 5).map((box) => (
                            <Link
                              key={box.id}
                              className="hamburger-menu__sub-link"
                              to={`/box/${box.id}`}
                              onClick={onClose}
                            >
                              {box.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Browse-all shortcut */}
                      <Link
                        className="hamburger-menu__sub-link hamburger-menu__sub-link--all"
                        to={`/browse?sport=${sport}`}
                        onClick={onClose}
                      >
                        Browse all {sport} →
                      </Link>

                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </nav>

        {/* Divider between sports and extra pages */}
        <div className="hamburger-menu__divider" role="separator" />

        {/* Extra page links */}
        <nav aria-label="Site pages">
          {EXTRA_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              className="hamburger-menu__extra-link"
              to={to}
              onClick={onClose}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>

      {/* ── Auth buttons — anchored to the bottom of the overlay ──────────── */}
      {/* Padding-bottom accounts for the iOS home indicator on notched devices
          via env(safe-area-inset-bottom). Falls back to 0 on other platforms. */}
      <div className="hamburger-menu__auth">
        <Link
          className="hamburger-menu__sign-in"
          to="/signin"
          onClick={onClose}
        >
          Sign in
        </Link>
        <Link
          className="hamburger-menu__sign-up"
          to="/signup"
          onClick={onClose}
        >
          Sign up
        </Link>
      </div>

    </div>
  );
}
