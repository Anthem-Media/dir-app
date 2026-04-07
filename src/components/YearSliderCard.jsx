/**
 * YearSliderCard
 *
 * A compact card for the "By Year" slider row.
 * Displays the year as a large number — no box name, no price.
 * Clicking links to a filtered view of all boxes from that year.
 *
 * @param {object}   item
 * @param {string}   item.id
 * @param {number}   item.year  - The calendar year (e.g. 2024)
 * @param {function} onClick
 */

import './YearSliderCard.css';

export function YearSliderCard({ item, onClick }) {
  const { year } = item;

  return (
    <article
      className="year-slider-card"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Browse ${year} releases`}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* The "image" area is just the year number rendered large */}
      <div className="year-slider-card__display" aria-hidden="true">
        <span className="year-slider-card__year">{year}</span>
      </div>
    </article>
  );
}
