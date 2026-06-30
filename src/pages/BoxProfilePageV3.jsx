/**
 * BoxProfilePageV3
 *
 * V3 iteration of the box profile page.
 * Based on V2 layout (3-metric hero, Real ROI, Inserts section) but reverts the
 * Top Chases / Grails area back to V1's combined-tab pattern: one section, two
 * tabs — "Top Chases" (pullable cards via TopChaseRow) and "Grails" (print run ≤ 10).
 *
 * Route: /box-v3/:slug
 * V1 at /box/:slug, V2 at /box-v2/:slug remain unchanged.
 */

import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useBoxProfile } from '../hooks/useBoxProfile';
import { FormatSwitcher } from '../components/FormatSwitcher';
import { MetricCard } from '../components/MetricCard';
import { TopChaseRowV3 } from '../components/TopChaseRowV3';
import { PullRatesDrawer } from '../components/PullRatesDrawer';
import { MOCK_V3_TOP_CHASES, MOCK_GRANULAR_PULL_RATES } from '../utils/boxProfileMockData';
import { GrailsTab } from '../components/GrailsTab';
import { PullRateCard } from '../components/PullRateCard';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { TierPriceTrendChart } from '../components/TierPriceTrendChart';
import { ChecklistTier } from '../components/ChecklistTier';
import { InsertSetsSection } from '../components/InsertSetsSection';
import { DUMMY_FORMAT_DATA, FORMAT_ORDER } from '../utils/formatSwitcherData';
import { DUMMY_GRAIL_PRICE_TREND } from '../utils/tierPriceTrendData';
import { formatCurrency, formatPercent, getRoiSentiment } from '../utils/formatters';
import { sortTiersByValue } from '../utils/checklistUtils';
import './BoxProfilePageV3.css';

export function BoxProfilePageV3() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const formatParam = searchParams.get('format');
  const selectedFormat = DUMMY_FORMAT_DATA[formatParam] ? formatParam : 'hobby';
  const formatData = DUMMY_FORMAT_DATA[selectedFormat];

  function handleFormatChange(formatSlug) {
    setSearchParams({ format: formatSlug });
  }

  // V1-style combined Top Chases / Grails tab state
  const [activeHitsTab, setActiveHitsTab] = useState('topChases');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('box');
  const [expandedTiers, setExpandedTiers] = useState(new Set());
  const [shownCounts, setShownCounts] = useState({});
  const [tierSearchQueries, setTierSearchQueries] = useState({});

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
      setShownCounts((prev) => {
        const next = { ...prev };
        delete next[tierId];
        return next;
      });
    }
  }

  function handleShowMore(tierId, newTotal) {
    setShownCounts((prev) => ({ ...prev, [tierId]: newTotal }));
  }

  function handleTierSearchChange(tierId, query) {
    setTierSearchQueries((prev) => ({ ...prev, [tierId]: query }));
  }

  const { box, mergedGrails, priceHistory, checklistTiers, isLoading, error } =
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

  // Real ROI: secondary market premium (or discount) vs retail price.
  // Positive = box is trading above MSRP on the secondary market.
  const realRoi = (formatData.marketPrice - formatData.msrp) / formatData.msrp;
  const roiSentiment = getRoiSentiment(realRoi);

  const sortedChecklistTiers = sortTiersByValue(checklistTiers);

  const formatTabs = FORMAT_ORDER.map((key) => ({
    label: DUMMY_FORMAT_DATA[key].label,
    slug: DUMMY_FORMAT_DATA[key].slug,
  }));

  return (
    <div className="box-profile-page">

      {/* ── FORMAT SWITCHER ───────────────────────────────────────────────── */}
      <FormatSwitcher
        formats={formatTabs}
        activeSlug={selectedFormat}
        onFormatChange={handleFormatChange}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="box-profile-page__hero">
        <div className="box-profile-page__hero-image">
          {(formatData.imageUrl ?? box.imageUrl) ? (
            <img
              src={formatData.imageUrl ?? box.imageUrl}
              alt={`${box.name} ${formatData.label}`}
            />
          ) : (
            <div className="box-profile-page__image-placeholder" aria-hidden="true">
              <span>No image yet</span>
            </div>
          )}
        </div>

        <div className="box-profile-page__hero-info">
          <div className="box-profile-page__hero-meta">
            <div className="box-profile-page__hero-header">
              <h1 className="box-profile-page__title">{box.name}</h1>
              <p className="box-profile-page__subtitle">
                {box.manufacturer} &middot; {box.year} &middot; {formatData.label}
              </p>
            </div>
            <div className="box-profile-page__hero-stats">
              <p className="box-profile-page__config">
                {formatData.packsPerBox} packs/box &nbsp;&bull;&nbsp;
                {formatData.cardsPerPack} cards/pack &nbsp;&bull;&nbsp;
                {formatData.totalCards} total cards
              </p>
              {formatData.guarantees && formatData.guarantees.length > 0 && (
                <p className="box-profile-page__config">
                  {formatData.guarantees
                    .map((g) => `${g.count} ${g.notes || g.category}`)
                    .join(' • ')}
                </p>
              )}
            </div>
          </div>

          {/* 3 MetricCards — EV removed, ROI replaced with Real ROI */}
          <div className="box-profile-page__metrics">
            <MetricCard
              label="Market Price"
              value={formatCurrency(formatData.marketPrice)}
              subtext="Sealed box sales"
            />
            <MetricCard
              label="MSRP"
              value={formatCurrency(formatData.msrp)}
            />
            <MetricCard
              label="ROI"
              value={formatPercent(realRoi)}
              sentiment={roiSentiment}
              subtext="Market vs MSRP"
            />
          </div>

          {/* ── BUY NOW ──────────────────────────────────────────────────── */}
          <div className="box-profile-page__buy-now">
            <button className="box-profile-page__buy-now-btn" type="button">
              Buy Now
            </button>
            <p className="box-profile-page__buy-now-disclaimer">
              Prices sourced from authorized distributors
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICE TRENDS (switchable: Box Price | Grailed) ───────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Price trends</h2>
          <p className="box-profile-page__section-subtitle">
            {activeChartTab === 'box'
              ? 'Sealed box market price over time.'
              : 'Average market price of grailed cards over the past 8 weeks.'}
          </p>
        </div>
        <div className="hits-tabs" role="tablist" aria-label="Price trend type">
          <button
            role="tab"
            aria-selected={activeChartTab === 'box'}
            className={`hits-tabs__tab${activeChartTab === 'box' ? ' hits-tabs__tab--active' : ''}`}
            onClick={() => setActiveChartTab('box')}
          >
            Box price
          </button>
          <button
            role="tab"
            aria-selected={activeChartTab === 'grailed'}
            className={`hits-tabs__tab${activeChartTab === 'grailed' ? ' hits-tabs__tab--active' : ''}`}
            onClick={() => setActiveChartTab('grailed')}
          >
            Grailed
          </button>
        </div>
        {activeChartTab === 'box' && <PriceTrendChart data={priceHistory} />}
        {activeChartTab === 'grailed' && (
          <TierPriceTrendChart
            data={DUMMY_GRAIL_PRICE_TREND}
            activeTier="patchAutos"
          />
        )}
      </section>

      {/* ── TOP CHASES / GRAILS (V1-style: two tabs, one section) ────────── */}
      {/* Reverts V2's split layout back to V1's combined tab pattern.
          Top Chases = pullable cards. Grails = print run ≤ 10 (excluded from EV). */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">
            {activeHitsTab === 'topChases' ? 'Top chases' : 'Grails'}
          </h2>
          <p className="box-profile-page__section-subtitle">
            {activeHitsTab === 'topChases'
              ? 'Rarest unpulled cards from this set.'
              : 'Highest value cards in this set.'}
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
            {MOCK_V3_TOP_CHASES.map((card) => (
              <TopChaseRowV3 key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <GrailsTab cards={mergedGrails} />
        )}
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
          {formatData.pullRates.map((rate) => (
            <PullRateCard key={rate.category} pullRate={rate} />
          ))}
        </div>
        <button
          className="pull-rates-drawer__trigger"
          onClick={() => setIsDrawerOpen(true)}
        >
          See detailed odds →
        </button>
      </section>

      <PullRatesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        format={selectedFormat}
        rates={MOCK_GRANULAR_PULL_RATES}
      />

      {/* ── INSERTS ──────────────────────────────────────────────────────── */}
      <section className="box-profile-page__section">
        <div className="box-profile-page__section-header">
          <h2 className="box-profile-page__section-title">Inserts</h2>
          <p className="box-profile-page__section-subtitle">
            All insert sets in this release.
          </p>
        </div>
        <InsertSetsSection
          cards={checklistTiers.find((t) => t.id === 'tier-2')?.cards ?? []}
        />
      </section>

      {/* ── FULL CHECKLIST ───────────────────────────────────────────────── */}
      {/* Pricing removed from card rows — card values live in Top Chases above.
          showPricing={false} suppresses per-card prices. */}
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
              shownCount={shownCounts[tier.id] ?? 0}
              onShowMore={(pageSize) => handleShowMore(tier.id, pageSize)}
              searchQuery={tierSearchQueries[tier.id] || ''}
              onSearchChange={(query) => handleTierSearchChange(tier.id, query)}
              showPricing={false}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
