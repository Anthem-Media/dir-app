/**
 * BrowsePage — filter sidebar + results grid.
 *
 * Layout: fixed-width FilterSidebar on the left, flexible BoxSetCard grid on
 * the right. Filter state lives in URL query params so every filtered view is
 * shareable and bookmarkable (/browse?sport=Baseball&year=2024).
 *
 * Data flow:
 *   URL params → useBrowse() → filterBrowseBoxes() → boxes array → grid
 *
 * onFilterChange writes a new value for one key into the URL params.
 * Passing an empty string clears that filter.
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBrowse } from '../hooks/useBrowse';
import { FilterSidebar } from '../components/FilterSidebar';
import { BoxSetCard } from '../components/BoxSetCard';
import { MobileFilterSheet } from '../components/MobileFilterSheet';
import './BrowsePage.css';

export function BrowsePage() {
  const [, setSearchParams] = useSearchParams();
  const { boxes, filterOptions, activeFilters, isLoading, error } = useBrowse();

  // Controls the mobile bottom sheet filter panel.
  const [isSheetOpen, setSheetOpen] = useState(false);

  /**
   * Updates a single filter key in the URL.
   * value = '' means "remove this filter" — we delete the param entirely so
   * the URL stays clean instead of showing ?sport= with an empty value.
   */
  function handleFilterChange(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  const resultCount       = boxes.length;
  const hasFilters        = Object.values(activeFilters).some(Boolean);
  // Number of active filter dimensions — shown inline on the Filters button.
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="browse-page">
      <FilterSidebar
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={() => setSearchParams({})}
      />

      <section className="browse-page__results">
        <header className="browse-page__results-header">
          <p className="browse-page__result-count">
            {isLoading
              ? 'Loading…'
              : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}${hasFilters ? ' (filtered)' : ''}`
            }
          </p>

          {/* Filters button — mobile only, hidden on desktop via CSS.
              Shows the number of active filter dimensions when any are set. */}
          <button
            className="browse-page__filters-btn"
            onClick={() => setSheetOpen(true)}
          >
            {`Filters${activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}`}
          </button>
        </header>

        {error && (
          <p className="browse-page__error">{error}</p>
        )}

        {!isLoading && !error && resultCount === 0 && (
          <p className="browse-page__empty">
            No boxes match the selected filters.{' '}
            <button
              className="browse-page__empty-clear"
              onClick={() => setSearchParams({})}
            >
              Clear all filters
            </button>
          </p>
        )}

        {!error && (
          <ul className="browse-page__grid">
            {boxes.map((box) => (
              <li key={box.id}>
                <BoxSetCard box={box} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MobileFilterSheet — sits outside the main layout flow so it overlays
          the page correctly. Hidden on desktop via CSS inside the component. */}
      <MobileFilterSheet
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={() => setSearchParams({})}
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
