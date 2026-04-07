/**
 * Hook: useHomePage
 *
 * Responsible for fetching all data needed by the HomePage.
 * Returns the slider categories — each with their type and items array.
 * When the backend is ready, replace the mock import with a real API call —
 * nothing in the components will need to change.
 *
 * Nav tab labels (NAV_TABS) and nav dropdown data (NAV_DROPDOWN_DATA) are
 * static constants imported directly by App.jsx and SiteNavBar.jsx —
 * they don't need to go through the loading cycle.
 *
 * @returns {{ sliderCategories, isLoading, error }}
 */

import { useState, useEffect } from 'react';
import { SLIDER_CATEGORIES } from '../utils/homePageMockData';

export function useHomePage() {
  const [sliderCategories, setSliderCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated network delay — remove when wiring the real API
    const timeout = setTimeout(() => {
      try {
        setSliderCategories(SLIDER_CATEGORIES);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return { sliderCategories, isLoading, error };
}
