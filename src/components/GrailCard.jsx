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
import './GrailCard.css';

export function GrailCard({ card }) {
  const { playerName, variationName, rookieCard, isAutograph, printRun, currentValue, circulationStatus } = card;
  const { label: badgeLabel } = getCirculationBadgeConfig(circulationStatus);
  const printRunLabel = printRun != null ? (printRun === 1 ? '1/1' : `/${printRun}`) : null;

  return (
    <div className="grail-card">
      {/* Card thumbnail — placeholder until real card images are sourced.
          Matches TopChaseRow.jsx so both lists line up visually. */}
      <div className="grail-card__image">
        <div className="grail-card__image-placeholder" aria-hidden="true" />
      </div>

      {/* Player name, badges, and variation */}
      <div className="grail-card__info">
        <div className="grail-card__name-line">
          <span className="grail-card__player">{playerName}</span>
          {rookieCard && <span className="grail-card__rc-tag">RC</span>}
          {isAutograph && <span className="grail-card__auto-tag">AUTO</span>}
          {printRunLabel && <span className="grail-card__print-run-tag">{printRunLabel}</span>}
        </div>
        <span className="grail-card__variation">{variationName}</span>
      </div>

      {/* Circulation status badge — color applied via data-status in GrailCard.css */}
      <span className="grail-card__badge" data-status={circulationStatus}>
        {badgeLabel}
      </span>

      {/* Market value */}
      <span className="grail-card__value">{currentValue != null ? formatCurrency(currentValue) : '—'}</span>
    </div>
  );
}
