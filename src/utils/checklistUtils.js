/**
 * Checklist utility functions.
 * All filter/search and sort logic for the checklist lives here — never inline in a component.
 */

/**
 * sortTiersByValue
 *
 * Returns tiers sorted so the highest-valued tier appears first (descending by tier number).
 * Does not mutate the original array.
 *
 * NOTE on schema mismatch: The database currently numbers tiers with 1 = Base/Rookies
 * (lowest value) and 5 = Premium Hits (highest value). Sorting descending here is a
 * workaround for that inverted numbering — it puts the most valuable tiers at the top,
 * which is what collectors expect. During the database phase, flip the tier numbering
 * in dir_database_schema.sql so Tier 1 = Premium Hits and Tier 5 = Base/Rookies, then
 * change this sort to ascending and remove this comment.
 *
 * @param {Array<{id: string}>} tiers - Tier objects with id in 'tier-N' format
 * @returns {Array} New array sorted by tier number descending (highest value first)
 */
export function sortTiersByValue(tiers) {
  return [...tiers].sort((a, b) => {
    // Extract the numeric suffix from IDs like 'tier-1', 'tier-5'
    const numA = parseInt(a.id.replace('tier-', ''), 10);
    const numB = parseInt(b.id.replace('tier-', ''), 10);
    return numB - numA; // descending — tier-5 (Premium Hits) first
  });
}

/**
 * filterCardsByQuery
 *
 * Filters a tier's card array against a search query string.
 * Searches the card's player name (`name` field) and card number (`number` field).
 * Both fields are optional — a card missing either field simply won't match on that field.
 * Case-insensitive. Returns the full array unchanged if the query is empty or whitespace.
 *
 * Note: when wired to real API data, `name` maps to `player_name` and
 * `number` maps to `card_number` in the database schema.
 *
 * @param {Array<{name?: string, number?: string}>} cards - Card objects from the checklist tier
 * @param {string} query - Search string typed by the user
 * @returns {Array} Filtered array — same reference as input if query is blank
 */
export function filterCardsByQuery(cards, query) {
  const trimmed = query.trim();
  if (!trimmed) return cards;

  const lower = trimmed.toLowerCase();
  return cards.filter((card) => {
    const nameMatch   = card.name?.toLowerCase().includes(lower)   ?? false;
    const numberMatch = card.number?.toLowerCase().includes(lower) ?? false;
    return nameMatch || numberMatch;
  });
}
