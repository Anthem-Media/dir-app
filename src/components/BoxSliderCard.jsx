/**
 * BoxSliderCard
 *
 * A compact portrait card used inside horizontal slider rows.
 * Clicking navigates to the box's profile page (/box/:id).
 *
 * Shows: image placeholder, box name, price.
 *
 * @param {object}      item
 * @param {string}      item.id
 * @param {string}      item.name
 * @param {number}      item.price
 * @param {string|null} item.imageUrl
 */

import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import './BoxSliderCard.css';

export function BoxSliderCard({ item }) {
  const { id, name, price, imageUrl } = item;

  return (
    <Link to={`/box/${id}`} className="box-slider-card">
      {/* Box image — portrait ratio, like a real card box */}
      <div className="box-slider-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="box-slider-card__image" />
        ) : (
          <div className="box-slider-card__placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="box-slider-card__body">
        <p className="box-slider-card__name">{name}</p>
        <p className="box-slider-card__price">{formatCurrency(price)}</p>
      </div>
    </Link>
  );
}
