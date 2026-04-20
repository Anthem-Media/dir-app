/**
 * ChecklistTier
 *
 * Renders one tier of the box checklist. Shows the first 5 cards by default.
 * When expanded, shows a search input and all cards (or filtered results).
 *
 * Purely presentational — no internal state. All behavior is driven by props:
 * expand/collapse state, search query, and their callbacks all live in
 * BoxProfilePage so this component stays fully controlled and predictable.
 *
 * @param {object}   tier           - Tier data object from the hook
 * @param {boolean}  isExpanded     - Whether this tier is currently expanded
 * @param {function} onToggle       - Called when the user clicks the expand/collapse button
 * @param {string}   searchQuery    - Current search string for this tier (empty when collapsed)
 * @param {function} onSearchChange - Called with the new query string on every keystroke
 */

import { filterCardsByQuery } from '../utils/checklistUtils';
import { formatCurrency } from '../utils/formatters';
import './ChecklistTier.css';

// How many cards to show before the "Show all" button appears.
const COLLAPSED_CARD_LIMIT = 5;

export function ChecklistTier({ tier, isExpanded, onToggle, searchQuery, onSearchChange }) {
  const { label, cardCount, avgValue, cards } = tier;

  // Apply the search filter first (no-op when query is blank).
  const filteredCards = filterCardsByQuery(cards, searchQuery);

  // When a search query is active, lift the 5-card limit — the user is explicitly
  // looking for something and hiding results would be confusing. The limit only
  // applies when browsing with no query. Because the search input is only rendered
  // when expanded, and the page resets the query on collapse, searchQuery is always
  // empty when collapsed — so the slice always applies in the collapsed case.
  const visibleCards = isExpanded
    ? filteredCards
    : filteredCards.slice(0, COLLAPSED_CARD_LIMIT);

  // Toggle button appears only when the unfiltered card count exceeds the limit.
  // It reflects the total count of the tier, not the current filtered count.
  const showToggle = cards.length > COLLAPSED_CARD_LIMIT;

  return (
    <div className="checklist-tier">
      {/* Tier header — always visible, display only (not interactive) */}
      <div className="checklist-tier__header">
        <span className="checklist-tier__label">{label}</span>
        <span className="checklist-tier__meta">
          <span className="checklist-tier__count">{cardCount} cards</span>
          <span className="checklist-tier__avg">avg {formatCurrency(avgValue)}</span>
        </span>
      </div>

      {/* Search input — only in the DOM when the tier is expanded */}
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

      {/* Card list */}
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
          /* Empty state — only reachable when expanded with an active search query */
          isExpanded && (
            <p className="checklist-tier__empty">No cards match your search.</p>
          )
        )}
      </div>

      {/* Toggle button — only rendered when the tier has more than 5 cards */}
      {showToggle && (
        <button className="checklist-tier__toggle" onClick={onToggle}>
          {isExpanded
            ? 'Show less ↑'
            : `Show all ${cards.length} cards ↓`}
        </button>
      )}
    </div>
  );
}
