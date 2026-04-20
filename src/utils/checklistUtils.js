/**
 * Checklist utility functions.
 * All filter/search logic for the checklist lives here — never inline in a component.
 */

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
