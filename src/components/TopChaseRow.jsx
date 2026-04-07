/**
 * TopChaseRow
 *
 * A single row in the "Top Chases" section of BoxProfilePage.
 * Shows a card thumbnail placeholder, player info, category, and price.
 */

import { formatCurrency } from '../utils/formatters';
import './TopChaseRow.css';

/**
 * @param {object}  card
 * @param {string}  card.playerName    - Player's full name
 * @param {string}  card.variationName - The specific variation (e.g. "Gold Refractor Auto /50")
 * @param {string}  card.category      - Card category from the project's taxonomy
 * @param {boolean} card.isRookie      - Whether to show the RC tag
 * @param {number}  card.price         - Market value in USD
 * @param {string|null} card.imageUrl  - Card image URL (null shows placeholder)
 */
export function TopChaseRow({ card }) {
  const { playerName, variationName, category, isRookie, price, imageUrl } = card;

  return (
    <div className="top-chase-row">
      <div className="top-chase-row__image">
        {imageUrl ? (
          <img src={imageUrl} alt={`${playerName} ${variationName}`} />
        ) : (
          // Placeholder shown until real card images are available
          <div className="top-chase-row__image-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="top-chase-row__info">
        <div className="top-chase-row__name-line">
          <span className="top-chase-row__player">{playerName}</span>
          {isRookie && <span className="top-chase-row__rc-tag">RC</span>}
        </div>
        <span className="top-chase-row__variation">{variationName}</span>
      </div>

      <span className="top-chase-row__category">{category}</span>

      <span className="top-chase-row__price">{formatCurrency(price)}</span>
    </div>
  );
}
