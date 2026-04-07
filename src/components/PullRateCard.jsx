/**
 * PullRateCard
 *
 * Displays a single pull rate category in the "Pull Rates" section.
 * Shows the category name, "1 in X" odds, and the equivalent percentage.
 */

import { formatOdds, formatProbability } from '../utils/formatters';
import './PullRateCard.css';

/**
 * @param {object} pullRate
 * @param {string} pullRate.category    - Name of the card category (e.g. "Autographs")
 * @param {number} pullRate.probability - Decimal probability (e.g. 0.25 for 1 in 4)
 */
export function PullRateCard({ pullRate }) {
  const { category, probability } = pullRate;

  return (
    <div className="pull-rate-card">
      <span className="pull-rate-card__category">{category}</span>
      <span className="pull-rate-card__odds">{formatOdds(probability)}</span>
      <span className="pull-rate-card__percent">{formatProbability(probability)} per pack</span>
    </div>
  );
}
