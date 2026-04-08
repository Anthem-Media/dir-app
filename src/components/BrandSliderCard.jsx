/**
 * BrandSliderCard
 *
 * A compact card for the "By Brand" slider row.
 * Clicking navigates to the browse page filtered by this manufacturer.
 *
 * Shows the brand logo (placeholder until real logos are added)
 * and the brand name below. No price — this links to a brand browse view,
 * not a specific purchasable box.
 *
 * @param {object}      item
 * @param {string}      item.id
 * @param {string}      item.name       - Brand name (e.g. "Topps")
 * @param {string|null} item.imageUrl   - Brand logo image URL
 */

import { Link } from 'react-router-dom';
import './BrandSliderCard.css';

export function BrandSliderCard({ item }) {
  const { name, imageUrl } = item;

  return (
    <Link to={`/browse?manufacturer=${name}`} className="brand-slider-card">
      {/* Square logo area — real brand logos will go here */}
      <div className="brand-slider-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={`${name} logo`} className="brand-slider-card__image" />
        ) : (
          // Placeholder: show the brand's first letter large and centered
          <div className="brand-slider-card__placeholder" aria-hidden="true">
            <span className="brand-slider-card__initial">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="brand-slider-card__body">
        <p className="brand-slider-card__name">{name}</p>
      </div>
    </Link>
  );
}
