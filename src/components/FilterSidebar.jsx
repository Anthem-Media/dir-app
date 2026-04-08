/**
 * FilterSidebar — left-hand filter panel on the BrowsePage.
 *
 * Renders four collapsible sections: Sport, Manufacturer, Year, Format.
 * Each option is a clickable item that writes to the URL query params.
 * The active filter is highlighted; clicking it again clears that filter.
 *
 * Props:
 *   filterOptions  — { sports, manufacturers, years, formats } from useBrowse
 *   activeFilters  — { sport, manufacturer, year, format } from useBrowse
 *   onFilterChange — (key: string, value: string) => void  (from BrowsePage)
 *   onClearAll     — () => void — clears all filters atomically (single history entry)
 */

import './FilterSidebar.css';

const SECTIONS = [
  { label: 'Sport',        key: 'sport',        optionsKey: 'sports' },
  { label: 'Manufacturer', key: 'manufacturer',  optionsKey: 'manufacturers' },
  { label: 'Year',         key: 'year',          optionsKey: 'years' },
  { label: 'Format',       key: 'format',        optionsKey: 'formats' },
];

export function FilterSidebar({ filterOptions, activeFilters, onFilterChange, onClearAll }) {
  const hasAnyFilter = Object.values(activeFilters).some(Boolean);

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <span className="filter-sidebar__title">Filters</span>
        {hasAnyFilter && (
          <button
            className="filter-sidebar__clear"
            onClick={onClearAll}
          >
            Clear all
          </button>
        )}
      </div>

      {SECTIONS.map(({ label, key, optionsKey }) => (
        <div key={key} className="filter-sidebar__section">
          <h3 className="filter-sidebar__section-title">{label}</h3>
          <ul className="filter-sidebar__list">
            {(filterOptions[optionsKey] ?? []).map((option) => {
              const value      = String(option);
              const isActive   = String(activeFilters[key]) === value;
              return (
                <li key={value}>
                  <button
                    className={[
                      'filter-sidebar__option',
                      isActive ? 'filter-sidebar__option--active' : '',
                    ].join(' ')}
                    onClick={() => onFilterChange(key, isActive ? '' : value)}
                  >
                    {value}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
