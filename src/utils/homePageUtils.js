/**
 * Utility functions for the HomePage.
 * Filtering logic lives here — not in the component — so it stays testable
 * and the component only handles rendering.
 */

/**
 * Filters a list of boxes by the active filter selections and a search query.
 * Any filter set to null means "show all" for that category.
 *
 * @param {Array}  boxes                       - Full list of box objects
 * @param {object} filters
 * @param {string|null} filters.manufacturer   - Active manufacturer filter, or null
 * @param {number|null} filters.year           - Active year filter, or null
 * @param {string|null} filters.format         - Active format filter, or null
 * @param {string} searchQuery                 - Raw text from the search bar
 * @returns {Array} Filtered list of boxes
 */
export function filterBoxes(boxes, { manufacturer, year, format }, searchQuery) {
  const query = searchQuery.trim().toLowerCase();

  return boxes.filter((box) => {
    if (manufacturer && box.manufacturer !== manufacturer) return false;
    if (year && box.year !== year) return false;
    if (format && box.format !== format) return false;
    // Search matches against the box name (case-insensitive)
    if (query && !box.name.toLowerCase().includes(query)) return false;
    return true;
  });
}
