/**
 * ScrollToTop
 *
 * Scrolls the window to the top on every pathname change.
 * Watching only pathname (not search) means browse filter
 * changes (/browse?sport=Baseball → ?sport=Football) do NOT
 * reset scroll — only actual page navigations do.
 *
 * Renders nothing. Mount once inside App, inside BrowserRouter.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
