/**
 * ChecklistTier
 *
 * A collapsible row representing one tier of the box's checklist.
 * Click the row header to expand/collapse the card list inside.
 *
 * Manages its own open/closed state locally — no parent state needed.
 */

import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import './ChecklistTier.css';

/**
 * @param {object}   tier
 * @param {string}   tier.label     - Display name (e.g. "Tier 1 — Base & Rookies")
 * @param {number}   tier.cardCount - Total number of cards in this tier
 * @param {number}   tier.avgValue  - Average card value in USD
 * @param {Array}    tier.cards     - Individual card records shown when expanded
 */
export function ChecklistTier({ tier }) {
  const { label, cardCount, avgValue, cards } = tier;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`checklist-tier ${isOpen ? 'checklist-tier--open' : ''}`}>
      {/* Clickable header row */}
      <button
        className="checklist-tier__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {/* Chevron icon — rotates when open via CSS */}
        <svg
          className="checklist-tier__chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="checklist-tier__label">{label}</span>

        <span className="checklist-tier__meta">
          <span className="checklist-tier__count">{cardCount} cards</span>
          <span className="checklist-tier__avg">avg {formatCurrency(avgValue)}</span>
        </span>
      </button>

      {/* Expanded card list */}
      {isOpen && (
        <div className="checklist-tier__body">
          {cards.map((card) => (
            <div key={card.id} className="checklist-tier__card-row">
              <span className="checklist-tier__card-name">{card.name}</span>
              <span className="checklist-tier__card-category">{card.category}</span>
              <span className="checklist-tier__card-value">
                {card.value !== null ? formatCurrency(card.value) : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
