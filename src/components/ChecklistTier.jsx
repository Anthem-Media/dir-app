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
 * - shownCount / onShowMore — paginated card reveal (25 per click)
 * - searchQuery / onSearchChange — real-time card filter
 * All state and callbacks live in BoxProfilePage so this component stays
 * fully controlled and predictable.
 *
 * @param {object}   tier         - Tier data object from the hook
 * @param {boolean}  isExpanded   - Whether this tier is currently open
 * @param {function} onToggle     - Called when the user clicks the tier header
 * @param {number}   shownCount   - Total cards currently visible (0 = use default PAGE_SIZE)
 * @param {function} onShowMore   - Called with PAGE_SIZE when the user clicks Show more
 * @param {string}   searchQuery  - Current search string for this tier (empty when collapsed)
 * @param {function} onSearchChange - Called with the new query string on every keystroke
 */

import { filterCardsByQuery } from '../utils/checklistUtils';
import { formatCurrency } from '../utils/formatters';
import { CardBadge } from './CardBadge';
import './ChecklistTier.css';

const INITIAL_SIZE = 5;   // cards shown when a tier first opens
const PAGE_SIZE = 25;     // cards added per "Show more" click

export function ChecklistTier({
  tier,
  isExpanded,
  onToggle,
  shownCount,
  onShowMore,
  searchQuery,
  onSearchChange,
  showPricing = true,
}) {
  const { label, cardCount, avgValue, cards } = tier;

  // Apply the search filter first (no-op when query is blank).
  const filteredCards = filterCardsByQuery(cards, searchQuery);

  // When a search query is active, show everything — the user is explicitly
  // looking for something and hiding results would be confusing.
  const hasActiveSearch = searchQuery.trim().length > 0;

  // Total cards currently visible: first PAGE_SIZE by default, then +PAGE_SIZE per click.
  // shownCount === 0 means "not yet expanded" — default to PAGE_SIZE.
  const totalVisible = (shownCount == null || shownCount === 0) ? INITIAL_SIZE : shownCount;

  // Determine which cards to display:
  //   - Tier closed:         nothing (empty array)
  //   - Open, search active: all filtered results (bypass page limit)
  //   - Open, paginating:    filteredCards up to totalVisible
  const visibleCards = !isExpanded
    ? []
    : hasActiveSearch
      ? filteredCards
      : filteredCards.slice(0, totalVisible);

  // Remaining count drives the button label.
  const remaining = filteredCards.length - totalVisible;

  // Show more button: open, no active search, cards remain hidden.
  const showToggle = isExpanded && !hasActiveSearch && remaining > 0;

  // Show less button: open, no active search, and user has expanded beyond the initial 5.
  const showLess = isExpanded && !hasActiveSearch && totalVisible > INITIAL_SIZE;

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
                <div className="checklist-tier__card-info">
                  <span className="checklist-tier__card-name">{card.player_name ?? card.name}</span>
                  {/* Detail line: variation + print run.
                      Skipped for plain Base / Base Rookie — the player name is enough. */}
                  {(() => {
                    const vn = card.variation_name;
                    const isPlainBase = vn === 'Base' || vn === 'Base Rookie';
                    if (vn && !isPlainBase) {
                      return (
                        <span className="checklist-tier__card-variation">
                          {vn}{card.print_run ? ` /${card.print_run}` : ''}
                        </span>
                      );
                    }
                    return null;
                  })()}
                  <span className="checklist-tier__card-number">
                    {card.card_number ? `#${card.card_number}` : card.number}
                  </span>
                </div>
                <div className="checklist-tier__card-badges">
                  <CardBadge card={card} />
                </div>
                {showPricing && (
                  <span className="checklist-tier__card-value">
                    {(card.current_value ?? card.value) != null
                      ? formatCurrency(card.current_value ?? card.value)
                      : ''}
                  </span>
                )}
              </div>
            ))
          ) : (
            /* Empty state — only reachable when search returns no results */
            <p className="checklist-tier__empty">No cards match your search.</p>
          )}
        </div>
      )}

      {/* Pagination controls — horizontal row, separator above */}
      {(showLess || showToggle) && (
        <div className="checklist-tier__pagination">
          {showLess && (
            <button
              className="checklist-tier__toggle checklist-tier__toggle--less"
              onClick={() => onShowMore(Math.max(INITIAL_SIZE, totalVisible - PAGE_SIZE))}
            >
              Show less ↑
            </button>
          )}
          {showToggle && (
            <button
              className="checklist-tier__toggle"
              onClick={() => onShowMore(totalVisible + PAGE_SIZE)}
            >
              Show more ({remaining} remaining) ↓
            </button>
          )}
        </div>
      )}

    </div>
  );
}
