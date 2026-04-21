/**
 * SearchBar
 *
 * The primary search input — used in the site header and on the homepage
 * mobile search bar.
 *
 * Props:
 *   placeholder {string}   — input placeholder text
 *   onSearch    {function} — optional callback called with the trimmed query
 *                            string when the user submits (Enter key or mobile
 *                            keyboard "Search" button). When omitted the input
 *                            is a visual-only element, same as before.
 *
 * The outer element is a <form> so that the mobile virtual keyboard's "Search"
 * button fires a proper submit event in addition to the physical Enter key.
 * When no onSearch is provided, form submit is still prevented to avoid a page
 * reload — the field just clears.
 */

import { useState } from 'react';
import './SearchBar.css';

export function SearchBar({ placeholder = 'Search any box set...', onSearch }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearch) {
      onSearch(trimmed);
      setQuery('');
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
