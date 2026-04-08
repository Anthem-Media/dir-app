/**
 * BoxSetCard — result card for the BrowsePage grid.
 *
 * Shows: box image (placeholder until real images exist), name, year + format,
 * market price, and an ROI badge (green = positive, red = negative).
 *
 * Clicking anywhere on the card navigates to /box/:id (the box detail page).
 *
 * Props:
 *   box — a single box object from browseMockData (id, name, sport, year,
 *          format, imageUrl, marketPrice, roi)
 */

import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/formatters';
import './BoxSetCard.css';

export function BoxSetCard({ box }) {
  const { id, name, year, format, imageUrl, marketPrice, roi } = box;
  const roiPositive = roi >= 0;

  return (
    <Link to={`/box/${id}`} className="box-set-card">
      <div className="box-set-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="box-set-card__image" />
        ) : (
          <div className="box-set-card__image-placeholder">
            <span className="box-set-card__image-placeholder-text">No image</span>
          </div>
        )}
        <span
          className={[
            'box-set-card__roi',
            roiPositive ? 'box-set-card__roi--positive' : 'box-set-card__roi--negative',
          ].join(' ')}
        >
          {formatPercent(roi)}
        </span>
      </div>

      <div className="box-set-card__body">
        <p className="box-set-card__meta">{year} · {format}</p>
        <h3 className="box-set-card__name">{name}</h3>
        <p className="box-set-card__price">{formatCurrency(marketPrice)}</p>
      </div>
    </Link>
  );
}
