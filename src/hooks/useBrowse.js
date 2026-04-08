/**
 * useBrowse — data hook for the BrowsePage.
 *
 * Reads the current URL search params (?sport=Baseball&year=2024 etc.),
 * applies them to the mock box list via filterBrowseBoxes(), and returns
 * the filtered results plus metadata.
 *
 * When the real API is ready:
 *  1. Remove the BROWSE_BOXES import and the setTimeout simulation.
 *  2. Replace with fetch('/api/boxes?' + searchParams.toString()).
 *  3. Keep the return shape identical so BrowsePage needs no changes.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BROWSE_BOXES } from '../utils/browseMockData';
import { filterBrowseBoxes, getCascadingFilterOptions } from '../utils/browseUtils';

/**
 * @returns {{
 *   boxes:         object[],   filtered boxes matching the current URL params
 *   filterOptions: object,     { sports, manufacturers, years, formats } — cascading option lists
 *   activeFilters: object,     { sport, manufacturer, year, format } — current URL param values
 *   isLoading:     boolean,
 *   error:         string|null,
 * }}
 */
export function useBrowse() {
  const [searchParams] = useSearchParams();
  const [boxes, setBoxes]       = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState(null);

  // Read the four filterable fields from the URL. Empty string = no filter.
  const activeFilters = {
    sport:        searchParams.get('sport')        ?? '',
    manufacturer: searchParams.get('manufacturer') ?? '',
    year:         searchParams.get('year')         ?? '',
    format:       searchParams.get('format')       ?? '',
  };

  // Cascading options: each section only shows values reachable given the
  // filters upstream of it. Derived from the full list, not the filtered subset,
  // so upstream sections never lose their own options.
  const filterOptions = getCascadingFilterOptions(BROWSE_BOXES, activeFilters);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate an async fetch. Replace this block with a real fetch() call later.
    const timer = setTimeout(() => {
      try {
        const filtered = filterBrowseBoxes(BROWSE_BOXES, activeFilters);
        setBoxes(filtered);
      } catch (err) {
        setError('Failed to load boxes. Please try again.');
        console.error('[useBrowse]', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);

    // Re-run whenever any URL param changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeFilters.sport,
    activeFilters.manufacturer,
    activeFilters.year,
    activeFilters.format,
  ]);

  return { boxes, filterOptions, activeFilters, isLoading, error };
}
