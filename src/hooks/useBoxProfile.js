/**
 * Hook: useBoxProfile
 *
 * Responsible for fetching all data needed by the BoxProfilePage.
 * Currently returns mock data. When the backend is ready, replace the
 * mock imports with a real API call (e.g. fetch(`/api/boxes/${id}`))
 * and nothing in the components needs to change.
 *
 * @param {string} boxId - The unique identifier for the box set
 * @returns {{ box, topChases, grailCards, pullRates, priceHistory, checklistTiers, isLoading, error }}
 */

import { useState, useEffect } from 'react';
import {
  MOCK_BOX,
  MOCK_TOP_CHASES,
  MOCK_GRAIL_CARDS,
  MOCK_PULL_RATES,
  MOCK_PRICE_HISTORY,
  MOCK_CHECKLIST_TIERS,
} from '../utils/boxProfileMockData';

export function useBoxProfile(boxId) {
  const [box, setBox] = useState(null);
  const [topChases, setTopChases] = useState([]);
  const [grailCards, setGrailCards] = useState([]);
  const [pullRates, setPullRates] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [checklistTiers, setChecklistTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate a brief network delay so the loading state is exercised.
    // Remove this when wiring up the real API.
    const timeout = setTimeout(() => {
      try {
        setBox(MOCK_BOX);
        setTopChases(MOCK_TOP_CHASES);
        setGrailCards(MOCK_GRAIL_CARDS);
        setPullRates(MOCK_PULL_RATES);
        setPriceHistory(MOCK_PRICE_HISTORY);
        setChecklistTiers(MOCK_CHECKLIST_TIERS);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [boxId]);

  return { box, topChases, grailCards, pullRates, priceHistory, checklistTiers, isLoading, error };
}
