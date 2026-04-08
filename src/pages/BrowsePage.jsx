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

import { useSearchParams } from 'react-router-dom';
import { useBrowse } from '../hooks/useBrowse';
import { FilterSidebar } from '../components/FilterSidebar';
import { BoxSetCard } from '../components/BoxSetCard';
import './BrowsePage.css';

export function BrowsePage() {
  const [, setSearchParams] = useSearchParams();
  const { boxes, filterOptions, activeFilters, isLoading, error } = useBrowse();

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

  const resultCount = boxes.length;
  const hasFilters  = Object.values(activeFilters).some(Boolean);

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
    </div>
  );
}
