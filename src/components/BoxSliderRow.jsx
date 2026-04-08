/**
 * BoxSliderRow
 *
 * A horizontally scrolling row of cards with a header and arrow buttons.
 * Uses the browser's native scroll API — no carousel library needed.
 *
 * The left/right arrows scroll the track by a fixed amount (roughly 4 cards).
 * Arrow buttons disable automatically when the track is at either end.
 *
 * The card component is swappable via the CardComponent prop so the same row
 * can render BoxSliderCards, BrandSliderCards, or YearSliderCards depending
 * on the slider category type.
 *
 * @param {string}      label         - Row heading (e.g. "Baseball")
 * @param {string}      subtitle      - Descriptive line below the heading
 * @param {Array}       items         - Array of item objects to render as cards
 * @param {Component}   CardComponent - React component to use for each card
 */

import { useRef, useState, useEffect } from 'react';
import { BoxSliderCard } from './BoxSliderCard';
import './BoxSliderRow.css';

// How far the track scrolls per arrow click (approximately 4 cards + gaps)
const SCROLL_AMOUNT = 740;

export function BoxSliderRow({ label, subtitle, items, CardComponent = BoxSliderCard }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update arrow button states whenever the track scrolls
  function updateScrollState() {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4); // 4px buffer to avoid float rounding
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  // Run once on mount (and whenever items change) to set the initial arrow state
  useEffect(() => {
    updateScrollState();
  }, [items]);

  function scrollLeft() {
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  }

  function scrollRight() {
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  }

  return (
    <section className="box-slider-row">
      {/* Row header: title + subtitle on left, arrows on right */}
      <div className="box-slider-row__header">
        <div className="box-slider-row__header-copy">
          <h2 className="box-slider-row__title">{label}</h2>
          <p className="box-slider-row__subtitle">{subtitle}</p>
        </div>

        <div className="box-slider-row__arrows">
          <button
            className="box-slider-row__arrow"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${label} left`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="box-slider-row__arrow"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label={`Scroll ${label} right`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        className="box-slider-row__track"
        ref={trackRef}
        onScroll={updateScrollState}
      >
        {items.map((item) => (
          <CardComponent
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
