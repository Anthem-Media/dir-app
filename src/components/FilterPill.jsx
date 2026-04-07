/**
 * FilterPill
 *
 * A single clickable filter chip used in the HomePage filter bar.
 * Generic — works for any filter category (manufacturer, year, format).
 * The parent component owns which pill is active and handles the toggle logic.
 */

import './FilterPill.css';

/**
 * @param {string}   label    - Text shown on the pill (e.g. "Topps", "2024", "Hobby")
 * @param {boolean}  isActive - Whether this pill is the currently selected filter
 * @param {function} onClick  - Called when the pill is clicked
 */
export function FilterPill({ label, isActive, onClick }) {
  return (
    <button
      className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
      onClick={onClick}
      // aria-pressed tells screen readers whether this toggle button is on or off
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
