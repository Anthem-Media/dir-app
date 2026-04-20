/**
 * FormatSwitcher
 *
 * A horizontal tab row that lets users switch between available box formats
 * (e.g. Hobby, Jumbo, Blaster) on the BoxProfilePage.
 *
 * Purely presentational — this component has one job: render tabs and fire a
 * callback when one is clicked. All URL logic and data selection live in
 * BoxProfilePage.jsx. No state, no fetching, no calculations here.
 */

import './FormatSwitcher.css';

/**
 * @param {Array<{label: string, slug: string}>} formats - Ordered list of formats to display as tabs
 * @param {string}   activeSlug      - Slug of the currently selected format
 * @param {function} onFormatChange  - Called with the format slug string when a tab is clicked
 */
export function FormatSwitcher({ formats, activeSlug, onFormatChange }) {
  return (
    <div className="format-switcher" role="tablist" aria-label="Box format">
      {formats.map((format) => {
        const isActive = format.slug === activeSlug;
        return (
          <button
            key={format.slug}
            role="tab"
            aria-selected={isActive}
            className={`format-switcher__tab${isActive ? ' format-switcher__tab--active' : ''}`}
            onClick={() => onFormatChange(format.slug)}
          >
            {format.label}
          </button>
        );
      })}
    </div>
  );
}
