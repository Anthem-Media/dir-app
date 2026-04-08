/**
 * browseUtils.js — filtering logic for the BrowsePage results grid.
 *
 * filterBrowseBoxes() takes the full box list and a filters object,
 * returns only the boxes that match every active filter.
 *
 * Rules:
 *  - A filter with a falsy value (null, '', undefined) is treated as "no filter" (match all).
 *  - String comparisons are case-insensitive so URL params don't need exact casing.
 *  - year in the data is a number; the URL param arrives as a string, so we coerce before comparing.
 */

/**
 * @param {import('./browseMockData').Box[]} boxes   Full list of boxes.
 * @param {{ sport?: string, manufacturer?: string, year?: string|number, format?: string }} filters
 * @returns {import('./browseMockData').Box[]}
 */
export function filterBrowseBoxes(boxes, filters) {
  const { sport, manufacturer, year, format } = filters;

  return boxes.filter((box) => {
    if (sport        && box.sport.toLowerCase()        !== sport.toLowerCase())        return false;
    if (manufacturer && box.manufacturer.toLowerCase() !== manufacturer.toLowerCase()) return false;
    if (year         && box.year                       !== Number(year))               return false;
    if (format       && box.format.toLowerCase()       !== format.toLowerCase())       return false;
    return true;
  });
}

/**
 * Returns filter options with cascading logic applied.
 *
 * Each filter section only shows values that are actually reachable given the
 * filters upstream of it — so you can never end up in a dead-end combination.
 *
 * Cascade order: Sport → Manufacturer → Year → Format
 *
 *  - Sports:        always all options (no upstream filter).
 *  - Manufacturers: narrowed to those that have boxes in the selected sport.
 *  - Years:         narrowed to those that have boxes matching sport + manufacturer.
 *  - Formats:       narrowed to those that have boxes matching sport + manufacturer + year.
 *
 * Always operates on the *full* box list (not the filtered subset) so the
 * upstream sections never lose their own options when a downstream filter is active.
 *
 * @param {object[]} allBoxes   The complete, unfiltered box list.
 * @param {{ sport?: string, manufacturer?: string, year?: string|number, format?: string }} activeFilters
 * @returns {{ sports: string[], manufacturers: string[], years: number[], formats: string[] }}
 */
export function getCascadingFilterOptions(allBoxes, activeFilters) {
  const { sport, manufacturer, year } = activeFilters;

  // Sports: no upstream filter — always show all.
  const sports = unique(allBoxes.map((b) => b.sport)).sort();

  // Manufacturers: apply sport filter.
  const afterSport = sport
    ? allBoxes.filter((b) => b.sport.toLowerCase() === sport.toLowerCase())
    : allBoxes;
  const manufacturers = unique(afterSport.map((b) => b.manufacturer)).sort();

  // Years: apply sport + manufacturer filters.
  const afterMfg = manufacturer
    ? afterSport.filter((b) => b.manufacturer.toLowerCase() === manufacturer.toLowerCase())
    : afterSport;
  const years = unique(afterMfg.map((b) => b.year)).sort((a, b) => b - a); // newest first

  // Formats: apply sport + manufacturer + year filters.
  const afterYear = year
    ? afterMfg.filter((b) => b.year === Number(year))
    : afterMfg;
  const formats = unique(afterYear.map((b) => b.format)).sort();

  return { sports, manufacturers, years, formats };
}

/** Returns an array of unique values from an array (preserves type). */
function unique(arr) {
  return [...new Set(arr)];
}
