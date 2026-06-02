/**
 * Hook: useBoxProfile
 *
 * Responsible for fetching all data needed by the BoxProfilePage.
 * Currently returns mock data synchronously. When the backend is ready,
 * replace the mock imports with a real async fetch (e.g. fetch(`/api/boxes/${id}`)),
 * restore useState/useEffect, and set isLoading: true until the data arrives.
 *
 * @param {string} boxId - The unique identifier for the box set
 * @returns {{ box, topChases, grailCards, pullRates, priceHistory, checklistTiers, isLoading, error }}
 */

import {
  MOCK_BOX,
  MOCK_TOP_CHASES,
  MOCK_GRAIL_CARDS,
  MOCK_PULL_RATES,
  MOCK_PRICE_HISTORY,
  MOCK_CHECKLIST_TIERS,
} from '../utils/boxProfileMockData';

export function useBoxProfile(boxId) {
  // All mock data is synchronous — return it directly so there is no
  // window where stale or empty values can appear on navigation.
  // The artificial 300ms timeout was removed because it caused topChases
  // to briefly revert to [] on every re-mount, producing stale-data flicker.
  return {
    box: MOCK_BOX,
    topChases: MOCK_TOP_CHASES,
    grailCards: MOCK_GRAIL_CARDS,
    pullRates: MOCK_PULL_RATES,
    priceHistory: MOCK_PRICE_HISTORY,
    checklistTiers: MOCK_CHECKLIST_TIERS,
    isLoading: false,
    error: null,
  };
}
