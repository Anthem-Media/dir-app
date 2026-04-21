/**
 * ChecklistTier
 *
 * Renders one tier of the box checklist as an accordion row.
 * Collapsed by default — clicking the header opens the tier.
 * When open, shows a search input and the first 5 cards.
 * Clicking "Show all" reveals every card in the tier.
 * Clicking the header again closes the tier entirely.
 *
 * Purely presentational — no internal state. All behavior is driven by props:
 * - isExpanded / onToggle — tier open/closed (header click)
 * - isShowingAll / onShowAllToggle — full card list vs initial 5 (show more click)
 * - searchQuery / onSearchChange — real-time card filter
 * All state and callbacks live in BoxProfilePage so this component stays
 * fully controlled and predictable.
 *
 * @param {object}   tier             - Tier data object from the hook
 * @param {boolean}  isExpanded       - Whether this tier is currently open
 * @param {function} onToggle         - Called when the user clicks the tier header
 * @param {boolean}  isShowingAll     - Whether the full card list is showing
 * @param {function} onShowAllToggle  - Called when the user clicks Show all / Show less
 * @param {string}   searchQuery      - Current search string for this tier (empty when collapsed)
 * @param {function} onSearchChange   - Called with the new query string on every keystroke
 */

import { filterCardsByQuery } from '../utils/checklistUtils';
import { formatCurrency } from '../utils/formatters';
import './ChecklistTier.css';

// How many cards to show before the "Show all" button appears.
const COLLAPSED_CARD_LIMIT = 5;

export function ChecklistTier({
  tier,
  isExpanded,
  onToggle,
  isShowingAll,
  onShowAllToggle,
  searchQuery,
  onSearchChange,
}) {
  const { label, cardCount, avgValue, cards } = tier;

  // Apply the search filter first (no-op when query is blank).
  const filteredCards = filterCardsByQuery(cards, searchQuery);

  // When a search query is active, lift the 5-card limit — the user is explicitly
  // looking for something and hiding results would be confusing.
  const hasActiveSearch = searchQuery.trim().length > 0;

  // Determine which cards to display:
  //   - Tier closed:          nothing (empty array)
  //   - Open, search active:  all filtered results (ignore card limit)
  //   - Open, showing all:    all filtered results
  //   - Open, default view:   first 5 filtered results
  const visibleCards = !isExpanded
    ? []
    : isShowingAll || hasActiveSearch
      ? filteredCards
      : filteredCards.slice(0, COLLAPSED_CARD_LIMIT);

  // Show more/less button only when:
  //   - Tier is open
  //   - No active search (search already shows everything matching)
  //   - Tier has more cards than the initial limit
  const showToggle = isExpanded && !hasActiveSearch && cards.length > COLLAPSED_CARD_LIMIT;

  return (
    <div className="checklist-tier">

      {/* Tier header — interactive toggle for open/close */}
      <button
        className="checklist-tier__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="checklist-tier__label">{label}</span>
        <span className="checklist-tier__meta">
          <span className="checklist-tier__count">{cardCount} cards</span>
          <span className="checklist-tier__avg">avg {formatCurrency(avgValue)}</span>
        </span>
        {/* Rotates 90° when open to point downward */}
        <span
          className={`checklist-tier__chevron${isExpanded ? ' checklist-tier__chevron--open' : ''}`}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      {/* Search input — only in the DOM when the tier is open */}
      {isExpanded && (
        <div className="checklist-tier__search-wrapper">
          <input
            className="checklist-tier__search"
            type="text"
            placeholder="Search players or card numbers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Card list — only rendered when the tier is open */}
      {isExpanded && (
        <div className="checklist-tier__body">
          {visibleCards.length > 0 ? (
            visibleCards.map((card) => (
              <div key={card.id} className="checklist-tier__card-row">
                <span className="checklist-tier__card-name">{card.name}</span>
                <span className="checklist-tier__card-number">{card.number}</span>
                <span className="checklist-tier__card-category">{card.category}</span>
                <span className="checklist-tier__card-value">
                  {card.value !== null ? formatCurrency(card.value) : ''}
                </span>
              </div>
            ))
          ) : (
            /* Empty state — only reachable when search returns no results */
            <p className="checklist-tier__empty">No cards match your search.</p>
          )}
        </div>
      )}

      {/* Show all / show less button — only when open, search inactive, and tier exceeds limit */}
      {showToggle && (
        <button className="checklist-tier__toggle" onClick={onShowAllToggle}>
          {isShowingAll
            ? 'Show less ↑'
            : `Show all ${cards.length} cards ↓`}
        </button>
      )}

    </div>
  );
}
