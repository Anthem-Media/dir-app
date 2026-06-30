/**
 * PullRatesDrawer
 *
 * A bottom-sheet overlay showing granular pull rates for a given format.
 * Renders via a React portal so it overlays the full page regardless of
 * where it's mounted in the component tree.
 *
 * Tabs: Refractors | Inserts | Autographs | Superfractors
 * Each tab shows a scrollable list of rows: name | ratio | %
 *
 * Props:
 *   isOpen     {boolean}  — whether the sheet is visible
 *   onClose    {function} — called when user dismisses
 *   format     {string}   — active format key (e.g. 'hobby', 'jumbo')
 *   rates      {object}   — keyed by format; each value is an array of
 *                           { name, tab, ratio, pct } objects
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './PullRatesDrawer.css';

const TABS = ['Refractors', 'Inserts', 'Autographs', 'Superfractors'];

const FORMAT_LABELS = {
  hobby:   'Hobby',
  jumbo:   'Jumbo',
  blaster: 'Blaster',
  mega:    'Mega',
  breaker: 'Breaker Delight',
};

export function PullRatesDrawer({ isOpen, onClose, format = 'hobby', rates }) {
  const [activeTab, setActiveTab] = useState('Refractors');

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset to first tab whenever the drawer opens or format changes
  useEffect(() => {
    if (isOpen) setActiveTab('Refractors');
  }, [isOpen, format]);

  const formatRows = rates?.[format] ?? [];
  const tabRows = formatRows.filter((r) => r.tab === activeTab);
  const formatLabel = FORMAT_LABELS[format] ?? format;

  const drawer = (
    <div
      className={`pull-rates-drawer__overlay${isOpen ? ' pull-rates-drawer__overlay--open' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className={`pull-rates-drawer__sheet${isOpen ? ' pull-rates-drawer__sheet--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Detailed pull rates"
      >
        {/* Drag handle */}
        <div className="pull-rates-drawer__handle" />

        {/* Header */}
        <div className="pull-rates-drawer__header">
          <h2 className="pull-rates-drawer__title">{formatLabel} pull rates</h2>
          <button className="pull-rates-drawer__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tab bar */}
        <div className="pull-rates-drawer__tabs" role="tablist">
          {TABS.map((tab) => {
            const count = formatRows.filter((r) => r.tab === tab).length;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`pull-rates-drawer__tab${activeTab === tab ? ' pull-rates-drawer__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className="pull-rates-drawer__tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Column headers */}
        <div className="pull-rates-drawer__col-headers">
          <span className="pull-rates-drawer__col-name">Card type</span>
          <span className="pull-rates-drawer__col-ratio">Odds</span>
          <span className="pull-rates-drawer__col-pct">%</span>
        </div>

        {/* Scrollable row list */}
        <div className="pull-rates-drawer__list">
          {tabRows.length === 0 ? (
            <p className="pull-rates-drawer__empty">No data for this format.</p>
          ) : (
            tabRows.map((row, i) => (
              <div key={i} className="pull-rates-drawer__row">
                <span className="pull-rates-drawer__row-name">{row.name}</span>
                <span className="pull-rates-drawer__row-ratio">{row.ratio ?? '—'}</span>
                <span className="pull-rates-drawer__row-pct">{row.pct ?? '—'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
