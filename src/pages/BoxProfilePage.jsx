/**
 * BoxProfilePage
 *
 * The core page of the DIR app. Displays everything a collector or investor
 * needs to evaluate a sports card box: format switcher, hero stats, top chases,
 * pull rates, price trend, and the full collapsible checklist.
 *
 * Data comes from useBoxProfile (hook) → mock data today, real API later.
 * Format-specific data (MSRP, EV, ROI, pull rates) comes from DUMMY_FORMAT_DATA
 * in utils/formatSwitcherData.js — will be replaced by real per-format API data.
 * All formatting lives in utils/formatters.js.
 * Each section's UI lives in a dedicated component.
 */

import { useParams, useSearchParams } from 'react-router-dom';
import { useBoxProfile } from '../hooks/useBoxProfile';
import { FormatSwitcher } from '../components/FormatSwitcher';
import { MetricCard } from '../components/MetricCard';
import { TopChaseRow } from '../components/TopChaseRow';
import { PullRateCard } from '../components/PullRateCard';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { ChecklistTier } from '../components/ChecklistTier';
import { DUMMY_FORMAT_DATA, FORMAT_ORDER } from '../utils/formatSwitcherData';
import { formatCurrency, formatPercent, getRoiSentiment } from '../utils/formatters';
import './BoxProfilePage.css';

export function BoxProfilePage() {
  // slug comes from the URL — e.g. /box/topps-chrome-2023-hobby → slug = 'topps-chrome-2023-hobby'
  const { slug } = useParams();

  // useSearchParams reads and writes URL query parameters without a full page reload.
  // This is the React Router way to handle ?format=hobby in the URL.
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the format from the URL. Fall back to 'hobby' if absent or unrecognised.
  const formatParam = searchParams.get('format');
  const selectedFormat = DUMMY_FORMAT_DATA[formatParam] ? formatParam : 'hobby';

  // All format-specific values (MSRP, EV, ROI, pull rates, pack config) come from here.
  // Format-independent values (market price, top chases, checklist) come from the hook below.
  const formatData = DUMMY_FORMAT_DATA[selectedFormat];

  // Update the URL query parameter when the user clicks a format tab.
  // setSearchParams replaces only the format param, preserving any others.
  function handleFormatChange(formatSlug) {
    setSearchParams({ format: formatSlug });
  }

  const { box, topChases, priceHistory, checklistTiers, isLoading, error } =
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

  // ROI sentiment drives the color of the ROI metric card (green = positive, red = negative).
  // Calculated from the selected format's ROI, not the base box data.
  const roiSentiment = getRoiSentiment(formatData.roi);

  // Build the ordered formats array for the tab row — label and slug only, no extra data.
  const formatTabs = FORMAT_ORDER.map((key) => ({
    label: DUMMY_FORMAT_DATA[key].label,
    slug: DUMMY_FORMAT_DATA[key].slug,
  }));

  return (
    <div className="box-profile-page">

      {/* ── FORMAT SWITCHER ───────────────────────────────────────────────── */}
      {/* Sits above the hero. Switching format updates MSRP, EV, ROI, pull rates.
          Checklist and top chases are the same across all formats. */}
      <FormatSwitcher
        formats={formatTabs}
        activeSlug={selectedFormat}
        onFormatChange={handleFormatChange}
      />

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
            {/* box.format is replaced by formatData.label so it updates with the switcher */}
            <p className="box-profile-page__subtitle">
              {box.manufacturer} &middot; {box.year} &middot; {formatData.label}
            </p>
            {/* Pack config is format-specific — totalCards pre-computed in formatSwitcherData.js */}
            <p className="box-profile-page__config">
              {formatData.packsPerBox} packs/box &nbsp;&bull;&nbsp;
              {formatData.cardsPerPack} cards/pack &nbsp;&bull;&nbsp;
              {formatData.totalCards} total cards
            </p>
          </div>

          {/* Four metric cards — MSRP, EV, and ROI update with the selected format */}
          <div className="box-profile-page__metrics">
            <MetricCard
              label="Market Price"
              value={formatCurrency(box.pricing.marketPrice)}
              subtext="eBay sold avg"
            />
            <MetricCard
              label="MSRP"
              value={formatCurrency(formatData.msrp)}
            />
            <MetricCard
              label="Expected Value"
              value={formatCurrency(formatData.expectedValue)}
              subtext="Based on pull rates"
            />
            <MetricCard
              label="ROI"
              value={formatPercent(formatData.roi)}
              sentiment={roiSentiment}
              subtext="vs. MSRP"
            />
          </div>
        </div>
      </section>

      {/* ── TOP CHASES ───────────────────────────────────────────────────── */}
      {/* Checklist cards are the same across all formats — no format dependency here */}
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
      {/* Pull rates are format-specific — come from formatData, not the hook */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Pull rates</h2>
          <p className="box-profile-page__section-subtitle">
            Manufacturer-published odds per pack.
          </p>
        </div>
        <div className="box-profile-page__pull-rate-grid">
          {formatData.pullRates.map((rate) => (
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
      {/* Checklist is the same across all formats — only odds and pricing change */}
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
