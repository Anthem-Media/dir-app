/**
 * MetricCard
 *
 * A single stat card used in the hero section of BoxProfilePage.
 * Displays a label and a large value. Supports optional color coding
 * (used for the ROI card — green if positive, red if negative).
 */

import './MetricCard.css';

/**
 * @param {string}  label     - The descriptor shown above the value (e.g. "Market Price")
 * @param {string}  value     - The formatted value string (e.g. "$189.99")
 * @param {'positive'|'negative'|null} sentiment - Controls value text color
 * @param {string}  [subtext] - Optional small note below the value (e.g. "MSRP $149.99")
 */
export function MetricCard({ label, value, sentiment = null, subtext }) {
  return (
    <div className="metric-card">
      <span className="metric-card__label">{label}</span>
      <span className={`metric-card__value metric-card__value--${sentiment ?? 'neutral'}`}>
        {value}
      </span>
      {subtext && <span className="metric-card__subtext">{subtext}</span>}
    </div>
  );
}
