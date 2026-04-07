/**
 * BrandSliderCard
 *
 * A compact card for the "By Brand" slider row.
 * Shows the brand logo (image placeholder until real logos are added)
 * and the brand name below. No price — this links to a brand browse page,
 * not a specific purchasable box.
 *
 * @param {object}      item
 * @param {string}      item.id
 * @param {string}      item.name       - Brand name (e.g. "Topps")
 * @param {string|null} item.imageUrl   - Brand logo image URL
 * @param {function}    onClick
 */

import './BrandSliderCard.css';

export function BrandSliderCard({ item, onClick }) {
  const { name, imageUrl } = item;

  return (
    <article
      className="brand-slider-card"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
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
    </article>
  );
}
