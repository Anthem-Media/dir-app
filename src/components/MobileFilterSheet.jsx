/**
 * MobileFilterSheet
 *
 * Mobile-only bottom sheet filter panel. Slides up from the bottom of the
 * screen when isOpen is true and slides back down when closed.
 *
 * All filter state and logic live in BrowsePage — this component is pure UI.
 * It receives everything it needs as props and calls the provided handlers
 * immediately when the user taps a chip (no confirm step).
 *
 * Props:
 *   filterOptions  — { sports, manufacturers, years, formats } from useBrowse
 *   activeFilters  — { sport, manufacturer, year, format } from useBrowse
 *   onFilterChange — (key: string, value: string) => void
 *                    called immediately on chip tap; empty string clears that filter
 *   onClearAll     — () => void — clears all active filters at once
 *   isOpen         — boolean — controls slide-up / slide-down state
 *   onClose        — () => void — called when the overlay is tapped
 */

import './MobileFilterSheet.css';

// Sections in the exact order required by the spec.
// Matches the FilterSidebar SECTIONS so both panels stay in sync.
const SECTIONS = [
  { label: 'Sport',        key: 'sport',        optionsKey: 'sports' },
  { label: 'Manufacturer', key: 'manufacturer',  optionsKey: 'manufacturers' },
  { label: 'Year',         key: 'year',          optionsKey: 'years' },
  { label: 'Format',       key: 'format',        optionsKey: 'formats' },
];

export function MobileFilterSheet({
  filterOptions,
  activeFilters,
  onFilterChange,
  onClearAll,
  isOpen,
  onClose,
}) {
  const hasAnyFilter = Object.values(activeFilters).some(Boolean);

  return (
    <>
      {/* Overlay — position: fixed, covers the entire viewport.
          Sits above page content (z-index 250) but behind the sheet (z-index 251).
          The semi-transparent background keeps the grid visible while signalling
          the sheet is modal. rgba is used here because no CSS variable exists
          for overlay transparency — this is the one documented exception.
          Tapping anywhere on this overlay calls onClose to dismiss the sheet. */}
      <div
        className={`mobile-filter-sheet__overlay${isOpen ? ' mobile-filter-sheet__overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet — anchored to the bottom of the viewport.
          CSS transform moves it from translateY(100%) (fully off-screen below)
          to translateY(0) (fully visible). The transition property handles the
          slide animation — no JS animation libraries used. */}
      <div
        className={`mobile-filter-sheet${isOpen ? ' mobile-filter-sheet--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {/* Drag handle — decorative visual affordance only, not interactive */}
        <div className="mobile-filter-sheet__handle" aria-hidden="true" />

        {/* Header: "Filters" title left, "Clear all" right (only when active) */}
        <div className="mobile-filter-sheet__header">
          <span className="mobile-filter-sheet__title">Filters</span>
          {hasAnyFilter && (
            <button className="mobile-filter-sheet__clear" onClick={onClearAll}>
              Clear all
            </button>
          )}
        </div>

        {/* Body — scrollable so all sections are reachable on short devices */}
        <div className="mobile-filter-sheet__body">
          {SECTIONS.map(({ label, key, optionsKey }) => (
            <div key={key} className="mobile-filter-sheet__section">
              <p className="mobile-filter-sheet__section-label">{label}</p>
              <div className="mobile-filter-sheet__chips">
                {(filterOptions[optionsKey] ?? []).map((option) => {
                  const value    = String(option);
                  const isActive = String(activeFilters[key]) === value;
                  return (
                    <button
                      key={value}
                      className={`mobile-filter-chip${isActive ? ' mobile-filter-chip--active' : ''}`}
                      // Tapping an active chip passes '' to clear that filter;
                      // tapping an inactive chip passes its value to set it.
                      onClick={() => onFilterChange(key, isActive ? '' : value)}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
