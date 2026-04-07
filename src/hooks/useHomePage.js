/**
 * Hook: useHomePage
 *
 * Responsible for fetching all data needed by the HomePage.
 * Returns the slider categories (each with their list of boxes) and nav tab labels.
 * When the backend is ready, replace the mock import with a real API call —
 * nothing in the components will need to change.
 *
 * @returns {{ sliderCategories, navTabs, isLoading, error }}
 */

import { useState, useEffect } from 'react';
import { SLIDER_CATEGORIES, NAV_TABS } from '../utils/homePageMockData';

export function useHomePage() {
  const [sliderCategories, setSliderCategories] = useState([]);
  const [navTabs, setNavTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated network delay — remove when wiring the real API
    const timeout = setTimeout(() => {
      try {
        setSliderCategories(SLIDER_CATEGORIES);
        setNavTabs(NAV_TABS);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return { sliderCategories, navTabs, isLoading, error };
}
