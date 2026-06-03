/**
 * GrailCard
 *
 * Renders a single row in the Grails tab. Grails are cards with print_run ≤ 10 —
 * the rarest cards in any set. Layout mirrors TopChaseRow for visual consistency.
 *
 * Purely presentational — no state, no filtering, no calculations.
 * Formatting uses formatPrintRun and getCirculationBadgeConfig from grailsUtils.js.
 * Badge colors are driven by the data-status CSS attribute — no inline styles.
 *
 * @param {object}  card
 * @param {string}  card.playerName        - Player's full name
 * @param {string}  card.variationName     - Card variation (e.g. "Gold Refractor Auto /10")
 * @param {boolean} card.isAutograph       - Whether the card has an on-card autograph
 * @param {number}  card.currentValue      - Current market value in USD
 * @param {string}  card.circulationStatus - 'unknown', 'in_circulation', or 'pulled_sold'
 */

import { formatCurrency } from '../utils/formatters';
import { getCirculationBadgeConfig } from '../utils/grailsUtils';
import { CardBadge } from './CardBadge';
import './GrailCard.css';

export function GrailCard({ card }) {
  const { playerName, variationName, rookieCard, isAutograph, printRun, currentValue, circulationStatus, imageUrl } = card;
  const { label: badgeLabel } = getCirculationBadgeConfig(circulationStatus);

  // Map camelCase mock data shape to the snake_case shape CardBadge expects.
  // Circulation status intentionally excluded — handled by the dedicated badge below
  // so it shows all three states including 'unknown'.
  const badgeCard = {
    rookie_card: rookieCard,
    is_autograph: isAutograph,
    print_run: printRun,
  };

  const printRunDisplay = printRun != null ? (printRun === 1 ? ' 1/1' : ` /${printRun}`) : '';

  return (
    <div className="grail-card">
      <div className="grail-card__image">
        <img
          src={imageUrl ?? '/images/cards/Ripper Placeholder Image.png'}
          alt={`${playerName} ${variationName}`}
        />
      </div>

      {/* Line 1: player name. Line 2: variation + print run. */}
      <div className="grail-card__info">
        <span className="grail-card__player">{playerName}</span>
        <span className="grail-card__variation">{variationName}{printRunDisplay}</span>
      </div>

      {/* Attribute badges (Auto, RC, Grail/1of1) via shared CardBadge component */}
      <div className="grail-card__badges">
        <CardBadge card={badgeCard} />
      </div>

      {/* Circulation status badge — color applied via data-status in GrailCard.css */}
      <span className="grail-card__badge" data-status={circulationStatus}>
        {badgeLabel}
      </span>

      <span className="grail-card__value">{currentValue != null ? formatCurrency(currentValue) : '—'}</span>
    </div>
  );
}
