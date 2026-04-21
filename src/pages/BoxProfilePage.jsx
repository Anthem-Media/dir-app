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

import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useBoxProfile } from '../hooks/useBoxProfile';
import { FormatSwitcher } from '../components/FormatSwitcher';
import { MetricCard } from '../components/MetricCard';
import { TopChaseRow } from '../components/TopChaseRow';
import { GrailsTab } from '../components/GrailsTab';
import { PullRateCard } from '../components/PullRateCard';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { ChecklistTier } from '../components/ChecklistTier';
import { TierTrendTabs } from '../components/TierTrendTabs';
import { TierPriceTrendChart } from '../components/TierPriceTrendChart';
import { DUMMY_FORMAT_DATA, FORMAT_ORDER } from '../utils/formatSwitcherData';
import { DUMMY_TIER_TREND_DATA } from '../utils/tierPriceTrendData';
import { formatCurrency, formatPercent, getRoiSentiment } from '../utils/formatters';
import { filterGrailCards } from '../utils/grailsUtils';
import { sortTiersByValue } from '../utils/checklistUtils';
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

  // Active tab for the Top Chases / Grails section.
  // Local state only — not in the URL. Tab choice is a navigational detail within the page.
  const [activeHitsTab, setActiveHitsTab] = useState('topChases');

  // Active tier tab for the card value trend chart.
  // Local state only — not in the URL. The format switcher is shareable (bookmark a
  // specific format); the tier tab is not — it's a navigational detail within the page.
  const [activeTierTab, setActiveTierTab] = useState('base');

  // All checklist tier state (expand, card-list expansion, and search) lives here — not
  // inside ChecklistTier. Keeping it at the page level makes ChecklistTier a fully
  // controlled component with no state of its own, and lets the page coordinate related
  // actions (e.g. resetting card-list and search state when a tier is collapsed).

  // Which tier headers are open (collapsed by default — empty Set).
  const [expandedTiers, setExpandedTiers] = useState(new Set());

  // Which open tiers are showing the full card list beyond the initial 5.
  // Separate from expandedTiers so closing and reopening a tier resets to the 5-card view.
  const [expandedCardLists, setExpandedCardLists] = useState(new Set());

  // Search queries keyed by tier ID. Missing keys are treated as empty strings.
  const [tierSearchQueries, setTierSearchQueries] = useState({});

  // Toggle a tier open or closed. Closing resets both the card-list expansion and search
  // query for that tier so re-opening always starts at the 5-card default view.
  function handleTierToggle(tierId) {
    const isCurrentlyExpanded = expandedTiers.has(tierId);
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tierId)) {
        next.delete(tierId);
      } else {
        next.add(tierId);
      }
      return next;
    });
    if (isCurrentlyExpanded) {
      setTierSearchQueries((prev) => ({ ...prev, [tierId]: '' }));
      setExpandedCardLists((prev) => {
        const next = new Set(prev);
        next.delete(tierId);
        return next;
      });
    }
  }

  // Toggle between the initial 5-card view and the full card list within an open tier.
  function handleShowAllToggle(tierId) {
    setExpandedCardLists((prev) => {
      const next = new Set(prev);
      if (next.has(tierId)) {
        next.delete(tierId);
      } else {
        next.add(tierId);
      }
      return next;
    });
  }

  function handleTierSearchChange(tierId, query) {
    setTierSearchQueries((prev) => ({ ...prev, [tierId]: query }));
  }

  const { box, topChases, grailCards, priceHistory, checklistTiers, isLoading, error } =
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

  // Apply the canonical /10 filter. filterGrailCards is the single source of truth
  // for which cards qualify as grails — the cutoff must not be re-implemented elsewhere.
  const grailCardsList = filterGrailCards(grailCards);

  // Sort tiers so the most valuable appear first. The schema assigns tier numbers
  // with 1 = Base and 5 = Premium Hits, so descending order gives collectors the
  // best cards up top. See sortTiersByValue comment for database-phase follow-up.
  const sortedChecklistTiers = sortTiersByValue(checklistTiers);

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

      {/* ── TOP CHASES / GRAILS ──────────────────────────────────────────── */}
      {/* Two tabs: Top Chases (realistically pullable) and Grails (print run ≤ 10).
          Tab state is local — not in the URL. Same tab pattern as FormatSwitcher
          and TierTrendTabs: role="tablist", bottom-border active indicator. */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">
            {activeHitsTab === 'topChases' ? 'Top chases' : 'Grails'}
          </h2>
          <p className="box-profile-page__section-subtitle">
            {activeHitsTab === 'topChases'
              ? 'Highest value cards in this set.'
              : 'The rarest cards in this set — print run \u2264 10.'}
          </p>
        </div>

        <div className="hits-tabs" role="tablist" aria-label="Card type">
          <button
            role="tab"
            aria-selected={activeHitsTab === 'topChases'}
            className={`hits-tabs__tab${activeHitsTab === 'topChases' ? ' hits-tabs__tab--active' : ''}`}
            onClick={() => setActiveHitsTab('topChases')}
          >
            Top Chases
          </button>
          <button
            role="tab"
            aria-selected={activeHitsTab === 'grails'}
            className={`hits-tabs__tab${activeHitsTab === 'grails' ? ' hits-tabs__tab--active' : ''}`}
            onClick={() => setActiveHitsTab('grails')}
          >
            Grails
          </button>
        </div>

        {activeHitsTab === 'topChases' ? (
          <div className="box-profile-page__card-list">
            {topChases.map((card) => (
              <TopChaseRow key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <GrailsTab cards={grailCardsList} />
        )}
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

      {/* ── CARD VALUE TRENDS ────────────────────────────────────────────── */}
      {/* Shows average sale price over time for each card tier.
          Tab state is local — not in the URL — because tier selection is a
          navigational detail within the page, not a shareable view state. */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Card value trends</h2>
          <p className="box-profile-page__section-subtitle">
            Average sale price by tier over the past 12 months.
          </p>
        </div>
        <TierTrendTabs
          activeTier={activeTierTab}
          onTierChange={setActiveTierTab}
        />
        <TierPriceTrendChart
          data={DUMMY_TIER_TREND_DATA[activeTierTab]}
          activeTier={activeTierTab}
        />
      </section>

      {/* ── FULL CHECKLIST ───────────────────────────────────────────────── */}
      {/* Checklist is the same across all formats — only odds and pricing change */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Full checklist</h2>
          <p className="box-profile-page__section-subtitle">
            All cards in this set, grouped by tier.
          </p>
        </div>
        <div className="box-profile-page__checklist">
          {sortedChecklistTiers.map((tier) => (
            <ChecklistTier
              key={tier.id}
              tier={tier}
              isExpanded={expandedTiers.has(tier.id)}
              onToggle={() => handleTierToggle(tier.id)}
              isShowingAll={expandedCardLists.has(tier.id)}
              onShowAllToggle={() => handleShowAllToggle(tier.id)}
              searchQuery={tierSearchQueries[tier.id] || ''}
              onSearchChange={(query) => handleTierSearchChange(tier.id, query)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
