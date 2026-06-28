/**
 * TopPullsTab
 *
 * Shows the top 10 rarest pull categories for the selected format,
 * sorted from rarest to most common.
 *
 * Props:
 *   pullRates — formatData.pullRates (array of { category, probability, ... })
 */

import './TopPullsTab.css';

function formatOdds(probability) {
  if (!probability || probability <= 0) return '—';
  const denominator = Math.round(1 / probability);
  return `1 in ${denominator.toLocaleString()}`;
}

export function TopPullsTab({ pullRates }) {
  if (!pullRates || pullRates.length === 0) return null;

  const sorted = [...pullRates]
    .filter((r) => r.probability > 0)
    .sort((a, b) => a.probability - b.probability)
    .slice(0, 10);

  return (
    <div className="top-pulls-tab">
      {sorted.map((rate, index) => (
        <div key={rate.category} className="top-pulls-tab__row">
          <span className="top-pulls-tab__rank">{index + 1}</span>
          <span className="top-pulls-tab__category">{rate.category}</span>
          <span className="top-pulls-tab__odds">{formatOdds(rate.probability)}</span>
        </div>
      ))}
    </div>
  );
}
