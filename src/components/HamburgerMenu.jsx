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
 *   Auth section — auth-aware via useAuth():
 *     Signed out: Sign In (outlined) and Sign Up (filled) buttons.
 *     Signed in:  "Signed in as <name>" row + full-width Sign Out button.
 *     Loading:    renders nothing in the button row (no flicker on refresh).
 *     Styled to match the desktop header buttons in AppNav.css exactly.
 *
 * Completely hidden on desktop via CSS — no JS conditional rendering needed.
 * Uses the same NAV_DROPDOWN_DATA as SiteNavBar so sub-items always stay in sync.
 *
 * Accordion animation uses the CSS grid-template-rows trick (0fr → 1fr) which
 * animates height from 0 to auto without a fixed max-height value.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_DROPDOWN_DATA } from '../utils/navMockData';
import { useAuth } from '../context/AuthContext';
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

// Years shown in the Year sub-section of every sport accordion.
// 9 items displayed in a 2-column × 5-row grid; the 10th slot is always "More…".
// 2026 is excluded (too early for a full-profile season at launch);
// 2017 included since legacy profiles exist for 1995–2017.
const MENU_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

// Hardcoded popular box entries per sport — 4 per sport to fill the sub-section.
// TODO: replace with real box slugs and names fetched from the database at database phase.
const POPULAR_BOXES = {
  Baseball: [
    { name: '2024 Topps Chrome Baseball',        slug: '2024-topps-chrome-baseball'         },
    { name: '2024 Bowman Chrome Baseball Jumbo', slug: '2024-bowman-chrome-baseball-jumbo'  },
    { name: '2024 Topps Museum Collection',      slug: '2024-topps-museum-collection'       },
    { name: '2024 Panini Prizm Baseball',        slug: '2024-panini-prizm-baseball'         },
  ],
  Football: [
    { name: '2024 Panini Prizm Football',        slug: '2024-panini-prizm-football'         },
    { name: '2024 Panini National Treasures',    slug: '2024-panini-national-treasures-fb'  },
    { name: '2024 Panini Immaculate Football',   slug: '2024-panini-immaculate-football'    },
    { name: '2024 Panini Spectra Football',      slug: '2024-panini-spectra-football'       },
  ],
  Basketball: [
    { name: '2024-25 Panini Flawless Basketball', slug: '2024-25-panini-flawless-basketball' },
    { name: '2024-25 Panini NT Basketball',       slug: '2024-25-panini-nt-basketball'       },
    { name: '2024-25 Panini Immaculate',          slug: '2024-25-panini-immaculate-bball'    },
    { name: '2024-25 Panini Prizm Basketball',    slug: '2024-25-panini-prizm-basketball'    },
  ],
  Hockey: [
    { name: '2024-25 Upper Deck Black Diamond',  slug: '2024-25-ud-black-diamond-hockey'    },
    { name: '2024-25 Upper Deck Ice Hockey',     slug: '2024-25-ud-ice-hockey'              },
    { name: '2024-25 Upper Deck SP Authentic',   slug: '2024-25-ud-sp-authentic-hockey'     },
    { name: '2024-25 Upper Deck Artifacts',      slug: '2024-25-ud-artifacts-hockey'        },
  ],
  Soccer: [
    { name: '2024-25 Panini Prizm Soccer',       slug: '2024-25-panini-prizm-soccer'        },
    { name: '2024-25 Topps Champions League',    slug: '2024-25-topps-champions-league'     },
    { name: '2024 Panini Donruss Soccer',        slug: '2024-panini-donruss-soccer'         },
    { name: '2024 Topps Chrome Soccer',          slug: '2024-topps-chrome-soccer'           },
  ],
};

export function HamburgerMenu({ isOpen, onClose }) {
  // Only one sport can be expanded at a time. Null means all collapsed.
  const [expandedSport, setExpandedSport] = useState(null);

  // Drives the auth section at the bottom. Same source of truth as AppNav,
  // so desktop and mobile always agree on whether the user is signed in.
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    onClose();         // close the overlay like the other nav actions do
    navigate('/');     // the AuthContext listener clears user on its own
  }

  // Falls back to email when display_name metadata isn't set.
  const displayName = user?.user_metadata?.display_name || user?.email;

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

                      {/* Brands — 2-column grid, up to 10 slots (max 5 rows).
                          Most sports have 1–3 brands; empty grid slots are invisible. */}
                      {sportData.brands.length > 0 && (
                        <div className="hamburger-menu__sub-group">
                          <p className="hamburger-menu__sub-heading">Brands</p>
                          <div className="hamburger-menu__sub-grid">
                            {sportData.brands.map((brand) => (
                              <Link
                                key={brand}
                                className="hamburger-menu__sub-item"
                                to={`/browse?sport=${sport}&manufacturer=${brand}`}
                                onClick={onClose}
                              >
                                {brand}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Year — 2-column × 5-row grid.
                          9 hardcoded years (2025–2017) fill slots 1–9.
                          The 10th slot (column B, row 5) is always "More…" — never conditional. */}
                      <div className="hamburger-menu__sub-group">
                        <p className="hamburger-menu__sub-heading">Year</p>
                        <div className="hamburger-menu__sub-grid">
                          {MENU_YEARS.map((year) => (
                            <Link
                              key={year}
                              className="hamburger-menu__sub-item"
                              to={`/browse?sport=${sport}&year=${year}`}
                              onClick={onClose}
                            >
                              {year}
                            </Link>
                          ))}
                          {/* 10th slot — always present, styled identically to year items */}
                          <Link
                            className="hamburger-menu__sub-item"
                            to="/browse?openFilter=year"
                            onClick={onClose}
                          >
                            More…
                          </Link>
                        </div>
                      </div>

                      {/* Popular Boxes — single-column list, 4 hardcoded entries per sport.
                          Long names are truncated with ellipsis — never wrap to a second line.
                          TODO: wire box names and slugs to real data from the database at database phase. */}
                      {POPULAR_BOXES[sport] && (
                        <div className="hamburger-menu__sub-group">
                          <p className="hamburger-menu__sub-heading">Popular Boxes</p>
                          {POPULAR_BOXES[sport].map((box) => (
                            // TODO: replace hardcoded slug with real slug from database at database phase
                            <Link
                              key={box.slug}
                              className="hamburger-menu__sub-item hamburger-menu__sub-item--ellipsis"
                              to={`/box/${box.slug}`}
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

        {/* Signed-in identifier — only shown when a user is signed in.
            Reuses .hamburger-menu__extra-link so its typography and bottom
            border match the links above it without any new styles. */}
        {!loading && user && (
          <p className="hamburger-menu__extra-link">
            Signed in as {displayName}
          </p>
        )}

      </div>

      {/* ── Auth section — anchored to the bottom of the overlay ──────────── */}
      {/* Padding-bottom accounts for the iOS home indicator on notched devices
          via env(safe-area-inset-bottom). Falls back to 0 on other platforms.
          Contents are auth-aware: Sign In / Sign Up when signed out, a single
          full-width Sign Out button when signed in. */}
      <div className="hamburger-menu__auth">
        {loading ? null : user ? (
          <button
            type="button"
            className="hamburger-menu__sign-in"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>

    </div>
  );
}
