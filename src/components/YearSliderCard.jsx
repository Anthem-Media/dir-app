/**
 * YearSliderCard
 *
 * A compact card for the "By Year" slider row.
 * Clicking navigates to the browse page filtered by this year.
 * Displays the year as a large number — no box name, no price.
 *
 * @param {object}   item
 * @param {string}   item.id
 * @param {number}   item.year  - The calendar year (e.g. 2024)
 */

import { Link } from 'react-router-dom';
import './YearSliderCard.css';

export function YearSliderCard({ item }) {
  const { year } = item;

  return (
    <Link
      to={`/browse?year=${year}`}
      className="year-slider-card"
      aria-label={`Browse ${year} releases`}
    >
      {/* The "image" area is just the year number rendered large */}
      <div className="year-slider-card__display" aria-hidden="true">
        <span className="year-slider-card__year">{year}</span>
      </div>
    </Link>
  );
}
