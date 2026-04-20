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
 * @param {number}  card.printRun          - Print run count (≤ 10 for grails)
 * @param {boolean} card.isAutograph       - Whether the card has an on-card autograph
 * @param {number}  card.currentValue      - Current market value in USD
 * @param {string}  card.circulationStatus - 'unknown', 'in_circulation', or 'pulled_sold'
 */

import { formatCurrency } from '../utils/formatters';
import { formatPrintRun, getCirculationBadgeConfig } from '../utils/grailsUtils';
import './GrailCard.css';

export function GrailCard({ card }) {
  const { playerName, variationName, printRun, isAutograph, currentValue, circulationStatus } = card;
  const { label: badgeLabel } = getCirculationBadgeConfig(circulationStatus);

  return (
    <div className="grail-card">
      {/* Print run — the defining characteristic of a grail, displayed prominently */}
      <div className="grail-card__print-run">
        {formatPrintRun(printRun)}
      </div>

      {/* Player name, auto tag, and variation */}
      <div className="grail-card__info">
        <div className="grail-card__name-line">
          <span className="grail-card__player">{playerName}</span>
          {isAutograph && (
            <span className="grail-card__auto-tag">AUTO</span>
          )}
        </div>
        <span className="grail-card__variation">{variationName}</span>
      </div>

      {/* Circulation status badge — color applied via data-status in GrailCard.css */}
      <span className="grail-card__badge" data-status={circulationStatus}>
        {badgeLabel}
      </span>

      {/* Market value */}
      <span className="grail-card__value">{formatCurrency(currentValue)}</span>
    </div>
  );
}
