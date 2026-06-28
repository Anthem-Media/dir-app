/**
 * Hook: useBoxProfile
 *
 * Responsible for fetching all data needed by the BoxProfilePage.
 * Currently returns mock data synchronously. When the backend is ready,
 * replace the mock imports with a real async fetch (e.g. fetch(`/api/boxes/${id}`)),
 * restore useState/useEffect, and set isLoading: true until the data arrives.
 *
 * @param {string} boxId - The unique identifier for the box set
 * @returns {{ box, topChases, mergedGrails, priceHistory, checklistTiers, isLoading, error }}
 */

import {
  MOCK_BOX,
  MOCK_TOP_CHASES,
  MOCK_GRAIL_CARDS,
  MOCK_UNPRICEABLE_CHASES,
  MOCK_PRICE_HISTORY,
} from '../utils/boxProfileMockData';
import { MOCK_CHECKLIST_TIERS } from '../utils/checklistTiers2023ToppsChrome';
import { mergeHitsForGrailsTab } from '../utils/grailsUtils';

// Pre-computed once at module load — merging is pure and the mock data never
// changes, so there is no need to recompute on every hook call.
const MERGED_GRAILS = mergeHitsForGrailsTab(MOCK_TOP_CHASES, MOCK_GRAIL_CARDS).slice(0, 7);

export function useBoxProfile(boxId) {
  // All mock data is synchronous — return it directly so there is no
  // window where stale or empty values can appear on navigation.
  // The artificial 300ms timeout was removed because it caused topChases
  // to briefly revert to [] on every re-mount, producing stale-data flicker.
  return {
    box: MOCK_BOX,
    // Top Chases tab: grail-tier cards with no known sale price.
    topChases: MOCK_UNPRICEABLE_CHASES,
    // Grails tab: all priced cards from both arrays, merged and sorted.
    mergedGrails: MERGED_GRAILS,
    priceHistory: MOCK_PRICE_HISTORY,
    checklistTiers: MOCK_CHECKLIST_TIERS,
    isLoading: false,
    error: null,
  };
}
