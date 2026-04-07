/**
 * HomePage
 *
 * The browse content area — one horizontal slider row per category.
 * The persistent chrome (top bar, nav bar, footer) lives in App.jsx,
 * not here, so this component stays focused on content.
 *
 * Data flow:
 *   useHomePage (hook) → sliderCategories array
 *   BoxSliderRow      → renders each category row
 *   CardComponent     → chosen based on category.type:
 *                         'box'   → BoxSliderCard   (shows name + price)
 *                         'brand' → BrandSliderCard (shows brand name only)
 *                         'year'  → YearSliderCard  (shows year number only)
 */

import { useHomePage } from '../hooks/useHomePage';
import { BoxSliderRow } from '../components/BoxSliderRow';
import { BoxSliderCard } from '../components/BoxSliderCard';
import { BrandSliderCard } from '../components/BrandSliderCard';
import { YearSliderCard } from '../components/YearSliderCard';
import './HomePage.css';

// Map a category's type string to the correct card component.
// Centralizing this here means adding a new card type only requires
// one line in this file — BoxSliderRow itself doesn't need to change.
const CARD_COMPONENT_BY_TYPE = {
  box:   BoxSliderCard,
  brand: BrandSliderCard,
  year:  YearSliderCard,
};

export function HomePage() {
  const { sliderCategories, isLoading, error } = useHomePage();

  if (isLoading) {
    return (
      <div className="home-page home-page--loading">
        <div className="home-page__spinner" aria-label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page home-page--error">
        <p>Unable to load content. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {sliderCategories.map((category) => (
        <BoxSliderRow
          key={category.id}
          label={category.label}
          subtitle={category.subtitle}
          items={category.items}
          CardComponent={CARD_COMPONENT_BY_TYPE[category.type] ?? BoxSliderCard}
        />
      ))}
    </div>
  );
}
