/**
 * BoxProfilePage
 *
 * The core page of the DIR app. Displays everything a collector or investor
 * needs to evaluate a sports card box: hero stats, top chases, pull rates,
 * price trend, and the full collapsible checklist.
 *
 * Data comes from useBoxProfile (hook) → mock data today, real API later.
 * All formatting lives in utils/formatters.js.
 * Each section's UI lives in a dedicated component.
 */

import { useParams } from 'react-router-dom';
import { useBoxProfile } from '../hooks/useBoxProfile';
import { MetricCard } from '../components/MetricCard';
import { TopChaseRow } from '../components/TopChaseRow';
import { PullRateCard } from '../components/PullRateCard';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { ChecklistTier } from '../components/ChecklistTier';
import { formatCurrency, formatPercent, getRoiSentiment } from '../utils/formatters';
import './BoxProfilePage.css';

export function BoxProfilePage() {
  // slug comes from the URL — e.g. /box/topps-chrome-2024-hobby → slug = 'topps-chrome-2024-hobby'
  // It matches the id field in the BOXES catalogue and the slug column in the database.
  const { slug } = useParams();

  const { box, topChases, pullRates, priceHistory, checklistTiers, isLoading, error } =
    useBoxProfile(slug);

  if (isLoading) {
    return (
      <div className="box-profile-page box-profile-page--loading">
        <div className="box-profile-page__spinner" aria-label="Loading..." />
      </div>
    );
  }

  if (error || !box) {
    return (
      <div className="box-profile-page box-profile-page--error">
        <p>Unable to load box data. Please try again.</p>
      </div>
    );
  }

  const roiSentiment = getRoiSentiment(box.pricing.roi);

  return (
    <div className="box-profile-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="box-profile-page__hero">
        {/* Box image — placeholder until real images are sourced */}
        <div className="box-profile-page__hero-image">
          {box.imageUrl ? (
            <img src={box.imageUrl} alt={box.name} />
          ) : (
            <div className="box-profile-page__image-placeholder" aria-hidden="true">
              <span>No image yet</span>
            </div>
          )}
        </div>

        {/* Box metadata + metric cards */}
        <div className="box-profile-page__hero-info">
          <div className="box-profile-page__hero-meta">
            <h1 className="box-profile-page__title">{box.name}</h1>
            <p className="box-profile-page__subtitle">
              {box.manufacturer} &middot; {box.year} &middot; {box.format}
            </p>
            <p className="box-profile-page__config">
              {box.config.packsPerBox} packs/box &nbsp;&bull;&nbsp;
              {box.config.cardsPerPack} cards/pack &nbsp;&bull;&nbsp;
              {box.config.totalCards} total cards
            </p>
          </div>

          {/* Four metric cards in a row */}
          <div className="box-profile-page__metrics">
            <MetricCard
              label="Market Price"
              value={formatCurrency(box.pricing.marketPrice)}
              subtext="eBay sold avg"
            />
            <MetricCard
              label="MSRP"
              value={formatCurrency(box.pricing.msrp)}
            />
            <MetricCard
              label="Expected Value"
              value={formatCurrency(box.pricing.expectedValue)}
              subtext="Based on pull rates"
            />
            <MetricCard
              label="ROI"
              value={formatPercent(box.pricing.roi)}
              sentiment={roiSentiment}
              subtext="vs. market price"
            />
          </div>
        </div>
      </section>

      {/* ── TOP CHASES ───────────────────────────────────────────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Top chases</h2>
          <p className="box-profile-page__section-subtitle">
            Highest value cards in this set.
          </p>
        </div>
        <div className="box-profile-page__card-list">
          {topChases.map((card) => (
            <TopChaseRow key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* ── PULL RATES ───────────────────────────────────────────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Pull rates</h2>
          <p className="box-profile-page__section-subtitle">
            Manufacturer-published odds per pack.
          </p>
        </div>
        <div className="box-profile-page__pull-rate-grid">
          {pullRates.map((rate) => (
            <PullRateCard key={rate.id} pullRate={rate} />
          ))}
        </div>
      </section>

      {/* ── PRICE TREND ──────────────────────────────────────────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Price trend</h2>
          <p className="box-profile-page__section-subtitle">
            Sealed box market price over time.
          </p>
        </div>
        <PriceTrendChart data={priceHistory} />
      </section>

      {/* ── FULL CHECKLIST ───────────────────────────────────────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Full checklist</h2>
          <p className="box-profile-page__section-subtitle">
            All cards in this set — tap a tier to expand.
          </p>
        </div>
        <div className="box-profile-page__checklist">
          {checklistTiers.map((tier) => (
            <ChecklistTier key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

    </div>
  );
}
