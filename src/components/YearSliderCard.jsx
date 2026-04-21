/**
 * YearSliderCard
 *
 * A compact card for the "By Year" slider row.
 * Clicking navigates to the browse page filtered by this year.
 * Displays the year as a large number — no box name, no price.
 *
 * Active state: if the current URL contains ?year=<this year>, the card
 * gets the --active modifier class which shifts it to accent colors.
 *
 * @param {object}   item
 * @param {string}   item.id
 * @param {number}   item.year  - The calendar year (e.g. 2024)
 */

import { Link, useSearchParams } from 'react-router-dom';
import './YearSliderCard.css';

export function YearSliderCard({ item }) {
  const { year } = item;
  const [searchParams] = useSearchParams();

  // Card is active when the URL's year param matches this card's year.
  const isActive = searchParams.get('year') === String(year);

  return (
    <Link
      to={`/browse?year=${year}`}
      className={`year-slider-card${isActive ? ' year-slider-card--active' : ''}`}
      aria-label={`Browse ${year} releases`}
      aria-current={isActive ? 'true' : undefined}
    >
      {/* The "image" area is just the year number rendered large */}
      <div className="year-slider-card__display" aria-hidden="true">
        <span className="year-slider-card__year">{year}</span>
      </div>
    </Link>
  );
}
