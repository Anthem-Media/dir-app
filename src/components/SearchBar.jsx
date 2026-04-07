/**
 * SearchBar
 *
 * The primary navigation input on the HomePage.
 * A controlled component — the parent owns the value and handles changes.
 * Intentionally has no submit button; search filters live results as you type.
 */

import './SearchBar.css';

/**
 * @param {string}   value       - Current search query (controlled)
 * @param {function} onChange    - Called with the new string on every keystroke
 * @param {string}   [placeholder]
 */
export function SearchBar({ value, onChange, placeholder = 'Search any box set...' }) {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search box sets"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
