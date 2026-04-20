/**
 * ChecklistTier
 *
 * Renders one tier of the box checklist. Shows the first 5 cards by default.
 * A toggle button at the bottom expands the tier to reveal all cards, or
 * collapses back to 5.
 *
 * Purely presentational — no internal state. Expand/collapse state lives in
 * BoxProfilePage so that the page can manage all tiers from one place (e.g.
 * "collapse all" or deep-linking to an expanded tier in the future). This
 * component is a controlled component driven entirely by props.
 *
 * @param {object}   tier         - Tier data object from the hook
 * @param {boolean}  isExpanded   - Whether this tier is currently expanded
 * @param {function} onToggle     - Called when the user clicks the toggle button
 */

import { formatCurrency } from '../utils/formatters';
import './ChecklistTier.css';

// How many cards to show before the "Show all" button appears.
const COLLAPSED_CARD_LIMIT = 5;

export function ChecklistTier({ tier, isExpanded, onToggle }) {
  const { label, cardCount, avgValue, cards } = tier;

  // Slice to the first 5 cards when collapsed; show all when expanded.
  const visibleCards = isExpanded ? cards : cards.slice(0, COLLAPSED_CARD_LIMIT);

  // Only render the toggle button if there are more cards than the limit.
  const showToggle = cards.length > COLLAPSED_CARD_LIMIT;

  return (
    <div className="checklist-tier">
      {/* Tier header — always visible, display only (not a button) */}
      <div className="checklist-tier__header">
        <span className="checklist-tier__label">{label}</span>
        <span className="checklist-tier__meta">
          <span className="checklist-tier__count">{cardCount} cards</span>
          <span className="checklist-tier__avg">avg {formatCurrency(avgValue)}</span>
        </span>
      </div>

      {/* Card list — always visible, sliced based on expanded state */}
      <div className="checklist-tier__body">
        {visibleCards.map((card) => (
          <div key={card.id} className="checklist-tier__card-row">
            <span className="checklist-tier__card-name">{card.name}</span>
            <span className="checklist-tier__card-category">{card.category}</span>
            <span className="checklist-tier__card-value">
              {card.value !== null ? formatCurrency(card.value) : ''}
            </span>
          </div>
        ))}
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
