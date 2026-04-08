/**
 * SearchBar
 *
 * The primary search input in the site header, visible on every page.
 * Currently uncontrolled — it collects input but doesn't navigate yet.
 * When wired up, it will push ?q=<query> to the URL and route to /browse.
 */

import './SearchBar.css';

/**
 * @param {string} [placeholder]
 */
export function SearchBar({ placeholder = 'Search any box set...' }) {
  return (
    <div className="search-bar">
      {/* Magnifying glass icon — purely decorative, no interaction */}
      <svg
        className="search-bar__icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <input
        className="search-bar__input"
        type="search"
        placeholder={placeholder}
        aria-label="Search box sets"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
