/**
 * Grails utility functions.
 * Filtering and display logic for grail cards (print run ≤ 10).
 * No filtering or calculation logic should appear in Grail components —
 * everything lives here.
 */

/**
 * filterGrailCards
 *
 * Returns only cards with a print run of 10 or fewer.
 * This is the canonical grails filter — the /10 cutoff is a hard product
 * decision documented in CONTEXT.md. Do not change this value or make it
 * configurable without a deliberate product review.
 *
 * @param {Array} cards - Array of card objects
 * @returns {Array} Cards where printRun is not null/undefined and printRun <= 10
 */
export function filterGrailCards(cards) {
  return cards.filter(
    (card) => card.printRun != null && card.printRun <= 10
  );
}

/**
 * getCirculationBadgeConfig
 *
 * Returns the display label for a circulation status badge.
 * Badge colors are handled entirely in CSS via data-status attribute selectors
 * on the badge element — not via inline styles or JS-applied hex values.
 * See GrailCard.css for the three color states.
 *
 * @param {string} status - 'in_circulation', 'pulled_sold', or 'unknown'
 * @returns {{ label: string }}
 */
export function getCirculationBadgeConfig(status) {
  switch (status) {
    case 'in_circulation': return { label: 'In Circulation' };
    case 'pulled_sold':    return { label: 'Pulled & Sold'  };
    default:               return { label: 'Unknown'        };
  }
}

/**
 * formatPrintRun
 *
 * Formats an integer print run as a collector-standard fraction string.
 * A print run of 1 is the Superfractor — displayed as "1/1" (unique notation).
 * All others use the standard "#/N" shorthand (e.g. "#/5", "#/10").
 *
 * @param {number} printRun - Integer print run count
 * @returns {string}
 */
export function formatPrintRun(printRun) {
  if (printRun === 1) return '1/1';
  return `#/${printRun}`;
}
