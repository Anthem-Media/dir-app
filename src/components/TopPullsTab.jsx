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

function formatOdds(rate) {
  // Use the exact denominator from the source data when available.
  // Avoids rounding errors from inverting an already-rounded probability float.
  if (rate.oddsDenominator != null) {
    return `1 in ${Math.round(rate.oddsDenominator).toLocaleString()}`;
  }
  if (!rate.probability || rate.probability <= 0) return '—';
  return `1 in ${Math.round(1 / rate.probability).toLocaleString()}`;
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
          <span className="top-pulls-tab__odds">{formatOdds(rate)}</span>
        </div>
      ))}
    </div>
  );
}
