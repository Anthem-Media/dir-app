/**
 * TopChaseRowV3
 *
 * V3 variant of the Top Chases row. On desktop it shows badges and price/
 * circulation status identical to TopChaseRow. On mobile, badges and price
 * are replaced by a right-aligned two-line block: card number (top) and
 * insert set name (bottom).
 */

import { formatCurrency } from '../utils/formatters';
import { CardBadge } from './CardBadge';
import './TopChaseRowV3.css';

/**
 * @param {object}      card
 * @param {string}      card.playerName    - Player's full name
 * @param {string}      card.cardNumber    - Card number (e.g. "FSA-BB")
 * @param {string}      card.insertSetName - Insert set name (e.g. "Future Stars Autographs")
 * @param {string}      card.variationName - Desktop subtitle (e.g. "Future Stars Autographs SuperFractor")
 * @param {boolean}     card.rookieCard    - Whether to show RC badge (desktop)
 * @param {boolean}     card.isAutograph   - Whether to show Auto badge (desktop)
 * @param {number|null} card.printRun      - Print run; null for unlimited
 * @param {number|null} card.price         - Market value in USD; null shows "Not in Circulation"
 * @param {string|null} card.imageUrl      - Card image URL (null shows placeholder)
 */
export function TopChaseRowV3({ card }) {
  const {
    playerName, cardNumber, insertSetName, variationName,
    rookieCard, isAutograph, printRun, price, imageUrl,
  } = card;

  const badgeCard = {
    rookie_card: rookieCard,
    is_autograph: isAutograph,
    print_run: printRun,
  };

  return (
    <div className="top-chase-row-v3">
      <div className="top-chase-row-v3__image">
        <img
          src={imageUrl ?? '/images/cards/Ripper Placeholder Image.png'}
          alt={`${playerName} ${cardNumber}`}
        />
      </div>

      <div className="top-chase-row-v3__info">
        <span className="top-chase-row-v3__player">{playerName}</span>
        <span className="top-chase-row-v3__variation">
          {variationName}{printRun != null ? ` /${printRun}` : ''}
        </span>
        {price == null && (
          <span className="top-chase-row-v3__not-in-circ-mobile">Not in Circulation</span>
        )}
      </div>

      {/* Desktop: badges + price/circulation */}
      <div className="top-chase-row-v3__badges">
        <CardBadge card={badgeCard} />
      </div>
      {price != null ? (
        <span className="top-chase-row-v3__price">{formatCurrency(price)}</span>
      ) : (
        <span className="card-badge card-badge--pulled top-chase-row-v3__not-in-circ">
          Not in Circulation
        </span>
      )}

      {/* Mobile only: card number + insert set name */}
      <div className="top-chase-row-v3__card-meta">
        <span className="top-chase-row-v3__card-number">#{cardNumber}</span>
        <span className="top-chase-row-v3__insert-set">{insertSetName}</span>
      </div>
    </div>
  );
}
