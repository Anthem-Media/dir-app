/**
 * TopChaseRow
 *
 * A single row in the "Top Chases" section of BoxProfilePage.
 * Shows a card thumbnail placeholder, player info, category, and price.
 */

import { formatCurrency } from '../utils/formatters';
import { CardBadge } from './CardBadge';
import './TopChaseRow.css';

/**
 * @param {object}      card
 * @param {string}      card.playerName    - Player's full name
 * @param {string}      card.variationName - The specific variation (e.g. "Gold Refractor Auto /50")
 * @param {string}      card.category      - Card category from the project's taxonomy
 * @param {boolean}     card.rookieCard    - Whether to show the RC badge
 * @param {boolean}     card.isAutograph   - Whether to show the AUTO badge
 * @param {number|null} card.printRun      - Print run count; null for unlimited
 * @param {number}      card.price         - Market value in USD
 * @param {string|null} card.imageUrl      - Card image URL (null shows placeholder)
 */
export function TopChaseRow({ card }) {
  const { playerName, variationName, rookieCard, isAutograph, printRun, price, imageUrl } = card;

  // Map camelCase mock data shape to the snake_case shape CardBadge expects.
  // At database phase this mapping goes away — the hook will return snake_case directly.
  const badgeCard = {
    rookie_card: rookieCard,
    is_autograph: isAutograph,
    print_run: printRun,
  };

  return (
    <div className="top-chase-row">
      <div className="top-chase-row__image">
        <img
          src={imageUrl ?? '/images/cards/Ripper Placeholder Image.png'}
          alt={`${playerName} ${variationName}`}
        />
      </div>

      <div className="top-chase-row__info">
        <span className="top-chase-row__player">{playerName}</span>
        <span className="top-chase-row__variation">
          {variationName}{printRun != null ? ` /${printRun}` : ''}
        </span>
      </div>

      <div className="top-chase-row__badges">
        <CardBadge card={badgeCard} />
      </div>

      <span className="top-chase-row__price">{formatCurrency(price)}</span>
    </div>
  );
}
