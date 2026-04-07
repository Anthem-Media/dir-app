/**
 * BoxSliderCard
 *
 * A compact portrait card used inside horizontal slider rows.
 * Distinct from BoxCard (the grid card) — this one is narrower and
 * optimized for the slider context where many cards sit side by side.
 *
 * Shows: image placeholder, box name, price.
 * Clicking navigates to the box's profile page once routing is added.
 *
 * @param {object}      item
 * @param {string}      item.id
 * @param {string}      item.name
 * @param {number}      item.price
 * @param {string|null} item.imageUrl
 * @param {function}    onClick
 */

import { formatCurrency } from '../utils/formatters';
import './BoxSliderCard.css';

export function BoxSliderCard({ item, onClick }) {
  const { name, price, imageUrl } = item;

  return (
    <article
      className="box-slider-card"
      onClick={onClick}
      // tabIndex and role make the card keyboard-navigable since it's an article, not a button
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
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
    </article>
  );
}
