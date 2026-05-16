/**
 * ThemeToggle
 *
 * Small pill-shaped button that switches the app between dark and light mode.
 * Lives in the footer — intentionally unobtrusive.
 *
 * How the theme is applied:
 *   - Dark mode (the default) is expressed by REMOVING the data-theme attribute
 *     from <html>. That lets the :root block in index.css govern the palette.
 *   - Light mode is expressed by SETTING document.documentElement's data-theme
 *     attribute to "light", which activates the [data-theme="light"] override
 *     block in index.css.
 *
 * Persistence:
 *   - The chosen theme is stored in localStorage under 'dir-theme'.
 *   - On mount, the saved preference is read and applied. If nothing is saved,
 *     the default is 'dark' (matches the historical app behavior).
 *
 * No hardcoded hex anywhere — all styling pulls from CSS variables defined
 * in index.css, so the toggle itself recolors correctly under either theme.
 */

import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const STORAGE_KEY = 'dir-theme';

// Apply the theme by setting or removing the data-theme attribute on <html>.
// Centralized here so the on-mount effect and the click handler stay in sync.
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    // Removing the attribute entirely (rather than setting it to 'dark')
    // lets :root act as the default palette without a competing selector.
    document.documentElement.removeAttribute('data-theme');
  }
}

export function ThemeToggle() {
  // Default to 'dark'. The saved preference (if any) overrides this in the
  // mount effect below — we deliberately do not read localStorage during
  // the initial render to keep this component SSR-safe in case the app
  // ever moves to a framework that pre-renders on the server.
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved === 'light' ? 'light' : 'dark';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function handleToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // The icon shown is the destination, not the current state — clicking the
  // sun while in dark mode SWITCHES you to light mode.
  const icon = theme === 'dark' ? '☀' : '🌙';
  const label = theme === 'dark' ? 'Light mode' : 'Dark mode';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Switch to ${label.toLowerCase()}`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">{icon}</span>
      <span className="theme-toggle__label">{label}</span>
    </button>
  );
}
