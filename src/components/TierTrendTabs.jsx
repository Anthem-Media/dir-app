/**
 * TierTrendTabs
 *
 * Tab row for switching between card tiers on the tier price trend chart.
 * Tabs: Base, Rookies, Autos, Patch Autos.
 *
 * Purely presentational — receives active state and a callback via props.
 * No state, no data fetching, no calculations. Follows the same pattern
 * as FormatSwitcher.jsx exactly.
 */

import './TierTrendTabs.css';

/**
 * Tab definitions — ordered list with display label and internal slug.
 * Defined here (not in the page) because they are fixed UI constants,
 * not data that varies per box set.
 */
const TIER_TABS = [
  { label: 'Base',        slug: 'base'       },
  { label: 'Rookies',     slug: 'rookies'    },
  { label: 'Autos',       slug: 'autos'      },
  { label: 'Patch Autos', slug: 'patchAutos' },
];

/**
 * @param {string}   activeTier    - Slug of the currently selected tier
 * @param {function} onTierChange  - Called with the tier slug string when a tab is clicked
 */
export function TierTrendTabs({ activeTier, onTierChange }) {
  return (
    <div className="tier-trend-tabs" role="tablist" aria-label="Card tier">
      {TIER_TABS.map((tab) => {
        const isActive = tab.slug === activeTier;
        return (
          <button
            key={tab.slug}
            role="tab"
            aria-selected={isActive}
            className={`tier-trend-tabs__tab${isActive ? ' tier-trend-tabs__tab--active' : ''}`}
            onClick={() => onTierChange(tab.slug)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
