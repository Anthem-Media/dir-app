/**
 * BoxCard
 *
 * A single box set card displayed in the HomePage featured grid.
 * Shows image, name, manufacturer + year, market price, and ROI badge.
 * Clicking the card will eventually navigate to that box's BoxProfilePage
 * once routing is added.
 */

import { formatCurrency, formatPercent, getRoiSentiment } from '../utils/formatters';
import './BoxCard.css';

/**
 * @param {object}      box
 * @param {string}      box.id
 * @param {string}      box.name
 * @param {string}      box.manufacturer
 * @param {number}      box.year
 * @param {string}      box.format
 * @param {string|null} box.imageUrl
 * @param {object}      box.pricing
 * @param {number}      box.pricing.marketPrice
 * @param {number|null} box.pricing.roi           - null if pull rate data is unavailable
 * @param {function}    onClick                    - Called when the card is clicked
 */
export function BoxCard({ box, onClick }) {
  const { name, manufacturer, year, format, imageUrl, pricing } = box;

  const hasRoi = pricing.roi !== null && pricing.roi !== undefined;
  const roiSentiment = hasRoi ? getRoiSentiment(pricing.roi) : null;

  return (
    <article className="box-card" onClick={onClick} role="button" tabIndex={0}>
      {/* Box image — aspect ratio enforced by CSS; placeholder until real images */}
      <div className="box-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="box-card__image" />
        ) : (
          <div className="box-card__image-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="box-card__body">
        {/* Box name */}
        <p className="box-card__name">{name}</p>

        {/* Manufacturer · Year · Format — the identifying metadata line */}
        <p className="box-card__meta">
          {manufacturer} &middot; {year} &middot; {format}
        </p>

        {/* Price and ROI on the same line, price left / badge right */}
        <div className="box-card__footer">
          <span className="box-card__price">{formatCurrency(pricing.marketPrice)}</span>

          {hasRoi ? (
            <span className={`box-card__roi-badge box-card__roi-badge--${roiSentiment}`}>
              {formatPercent(pricing.roi)}
            </span>
          ) : (
            // Sets without published pull rate data can't calculate ROI
            <span className="box-card__roi-badge box-card__roi-badge--unavailable">
              ROI N/A
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
