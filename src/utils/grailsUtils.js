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
 * mergeHitsForGrailsTab
 *
 * Merges top-chase cards and grail cards into a single deduplicated list
 * sorted by currentValue descending. Grail cards take precedence when the
 * same card (matched by playerName + variationName) appears in both arrays.
 *
 * Top-chase cards use a `price` field; this function normalises them to the
 * `currentValue` shape that GrailCard expects before merging.
 *
 * @param {Array} topChases  - Cards from MOCK_TOP_CHASES (price field)
 * @param {Array} grailCards - Cards from MOCK_GRAIL_CARDS (currentValue field)
 * @returns {Array} Merged, deduplicated cards sorted by currentValue desc
 */
export function mergeHitsForGrailsTab(topChases, grailCards) {
  // Build a key set from grail cards so duplicates from topChases are dropped.
  const grailKeys = new Set(
    grailCards.map((c) => `${c.playerName}|${c.variationName}`)
  );

  // Normalise top-chase cards to the grail-card shape, then exclude any that
  // already exist in grailCards (grailCards version has more complete data).
  const uniqueTopChases = topChases
    .filter((c) => !grailKeys.has(`${c.playerName}|${c.variationName}`))
    .map((c) => ({
      ...c,
      currentValue: c.price ?? null,
      circulationStatus: 'unknown',
    }));

  return [...uniqueTopChases, ...grailCards].sort(
    (a, b) => (b.currentValue ?? 0) - (a.currentValue ?? 0)
  );
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
