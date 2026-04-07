/**
 * Utility functions for formatting numbers and values across the app.
 * Keep all display-layer formatting logic here, never in components.
 */

// ─── Calculations ─────────────────────────────────────────────────────────────
// Business logic that produces a derived value. Keep here, never in components.

/**
 * Calculates ROI as a decimal fraction.
 * Formula: (expectedValue - marketPrice) / marketPrice
 * e.g. calculateRoi(162.5, 189.99) → -0.1447 (about -14.5%)
 *
 * @param {number} expectedValue - Probability-weighted sum of all pull values
 * @param {number} marketPrice   - Current sealed box market price
 * @returns {number} ROI as a decimal (negative = loss, positive = gain)
 */
export function calculateRoi(expectedValue, marketPrice) {
  return (expectedValue - marketPrice) / marketPrice;
}

/**
 * Maps an ROI decimal to a sentiment label used for color coding.
 * Returns 'positive' (green) for zero or above, 'negative' (red) for below.
 *
 * @param {number} roi - ROI decimal from calculateRoi
 * @returns {'positive'|'negative'}
 */
export function getRoiSentiment(roi) {
  return roi >= 0 ? 'positive' : 'negative';
}

// ─── Formatters ───────────────────────────────────────────────────────────────
// Display-layer only — these return strings ready to render. No business logic.

/**
 * Formats a number as a USD currency string.
 * e.g. 1234.5 → "$1,234.50"
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Formats a decimal as a percentage string with one decimal place.
 * e.g. -0.145 → "-14.5%"
 */
export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
}

/**
 * Formats a pull rate fraction into a readable "1 in X" string.
 * e.g. 0.25 → "1 in 4"
 */
export function formatOdds(probability) {
  const oneIn = Math.round(1 / probability);
  return `1 in ${oneIn}`;
}

/**
 * Formats a decimal probability as a display percentage.
 * e.g. 0.25 → "25.0%"
 */
export function formatProbability(probability) {
  return `${(probability * 100).toFixed(1)}%`;
}
