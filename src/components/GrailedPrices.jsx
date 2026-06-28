/**
 * GrailedPrices
 *
 * Ranked list of grail cards (print run ≤ 10) with known market prices.
 * Shows the top 8 by value. Replaces the Card Value Trends section in v2.
 *
 * Props:
 *   cards — mergedGrails from useBoxProfile (only cards with currentValue > 0 shown)
 */

import { formatCurrency } from '../utils/formatters';
import { formatPrintRun } from '../utils/grailsUtils';
import './GrailedPrices.css';

export function GrailedPrices({ cards }) {
  if (!cards || cards.length === 0) return null;

  const priced = cards
    .filter((c) => (c.currentValue ?? c.current_value) > 0)
    .sort((a, b) => (b.currentValue ?? b.current_value) - (a.currentValue ?? a.current_value))
    .slice(0, 8);

  if (priced.length === 0) return null;

  const maxValue = priced[0].currentValue ?? priced[0].current_value;

  return (
    <div className="grailed-prices">
      {priced.map((card, index) => {
        const value = card.currentValue ?? card.current_value;
        const barWidth = Math.max(8, Math.round((value / maxValue) * 100));
        const name = card.playerName ?? card.player_name;
        const variation = card.variationName ?? card.variation_name;
        const printRun = card.printRun ?? card.print_run;

        return (
          <div key={card.id} className="grailed-prices__row">
            <span className="grailed-prices__rank">{index + 1}</span>
            <div className="grailed-prices__card-info">
              <span className="grailed-prices__name">{name}</span>
              {variation && (
                <span className="grailed-prices__variation">
                  {variation}
                  {printRun != null && ` · ${formatPrintRun(printRun)}`}
                </span>
              )}
            </div>
            <div className="grailed-prices__bar-cell">
              <div
                className="grailed-prices__bar"
                style={{ width: `${barWidth}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="grailed-prices__value">{formatCurrency(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
