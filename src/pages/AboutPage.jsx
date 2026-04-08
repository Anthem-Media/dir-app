/**
 * AboutPage
 *
 * Company and mission page. More visually expressive than the core app pages —
 * uses angled section edges, background shapes, and asymmetric layouts to give
 * the brand personality while staying within the same design system.
 *
 * All text and images are placeholder. When real content is ready:
 *  - Replace the copy strings directly in this file.
 *  - Swap the placeholder <div> blocks for <img> tags.
 *  - The layout and styles need no changes for a content-only swap.
 */

import { Link } from 'react-router-dom';
import './AboutPage.css';

// ── Mission card data ──────────────────────────────────────────────────────
// Three value-prop blocks. Update copy here when real messaging is finalised.

const MISSION_CARDS = [
  {
    n: '01',
    title: 'Box-Level Analytics',
    body: 'See the full picture before you buy. Pull rates, expected value, and ROI are calculated per box — not per card — because that\'s the decision you\'re actually making.',
  },
  {
    n: '02',
    title: 'Real Market Data',
    body: 'Prices come from actual eBay sold listings, not asking prices. Pull rates come from manufacturer-published odds. No estimates. No guesswork.',
  },
  {
    n: '03',
    title: 'Make Smarter Decisions',
    body: 'Know before you buy which boxes give you the best shot at recouping your investment — and which ones are a losing bet no matter how good the marketing looks.',
  },
];

// ── Founder data ────────────────────────────────────────────────────────────
// Update names, roles, and bios when ready. Photo placeholders are labeled divs.

const FOUNDERS = [
  {
    name: 'Zach Seabolt',
    role: 'Co-founder · Product & Technology',
    bio: 'Mix engineer turned product builder. Zach handles everything technical — from the app to the data pipeline. Came back to the hobby after years away and immediately wanted to know why there was no real data available before you opened a box.',
  },
  {
    name: 'Cam Gibson',
    role: 'Co-founder · Business & Distribution',
    bio: 'Deep roots in the hobby industry. Cam handles business development, partnerships, and the distribution network that gets DIR in front of the right people. If you\'ve been to a card show in the last five years, you\'ve probably crossed paths.',
  },
];

export function AboutPage() {
  return (
    <div className="about-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        Dark green section with white text. Diagonal bottom edge (clip-path)
        reveals the white mission section behind it, creating a layered look.
        The image placeholder is offset upward to avoid a perfectly centered split.
        The large hollow circle is pure decoration — adds depth without adding noise.
      */}
      <section className="about-hero">
        <div className="about-hero__inner">

          <div className="about-hero__content">
            <p className="about-hero__eyebrow">About DIR</p>
            <h1 className="about-hero__headline">
              The Smartest Way<br />to Buy Sports Cards.
            </h1>
            <p className="about-hero__subtitle">
              DIR gives box buyers the data they've always needed — real pull rates,
              honest ROI, and actual market prices — so you can open smarter
              and spend better. No guesswork. No hype.
            </p>
            <Link to="/browse" className="about-hero__cta">Start exploring →</Link>
          </div>

          <div className="about-hero__image-wrap">
            <div className="about-hero__image-placeholder" aria-label="Hero image placeholder">
              <span className="about-hero__image-label">Hero Image</span>
            </div>
          </div>

        </div>

        {/* Decorative hollow circle — background texture, not content */}
        <div className="about-hero__circle" aria-hidden="true" />
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      {/*
        Three value-prop cards on a white background. The middle card is pushed
        down (about-mission__card--offset) to break the rigid grid rhythm.
        Each card has a large ghosted number in the background for visual texture.
      */}
      <section className="about-mission">
        <div className="about-mission__inner">

          <div className="about-mission__intro">
            <h2 className="about-mission__heading">Built for the box buyer.</h2>
            <p className="about-mission__subheading">
              Every tool in this hobby is built around individual cards.
              DIR is built around the box — the only decision that matters
              before you open anything.
            </p>
          </div>

          <div className="about-mission__cards">
            {MISSION_CARDS.map(({ n, title, body }, i) => (
              <div
                key={n}
                className={[
                  'about-mission__card',
                  i === 1 ? 'about-mission__card--offset' : '',
                ].join(' ')}
              >
                {/* Ghost number — decorative background text */}
                <span className="about-mission__card-number" aria-hidden="true">{n}</span>
                {/* Icon placeholder — replace with real icon or illustration later */}
                <div className="about-mission__card-icon" aria-label="Feature icon placeholder" />
                <h3 className="about-mission__card-title">{title}</h3>
                <p className="about-mission__card-body">{body}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FOUNDERS ─────────────────────────────────────────────────────── */}
      {/*
        Light green background section. Two clean centered cards with circular
        photo placeholders. Cleaner and more structured than the sections above —
        the contrast in density makes both sections feel more intentional.
      */}
      <section className="about-founders">
        <div className="about-founders__inner">

          <h2 className="about-founders__heading">The team behind it.</h2>
          <p className="about-founders__subheading">
            Two guys who couldn't find the tool they needed, so they built it.
          </p>

          <div className="about-founders__cards">
            {FOUNDERS.map(({ name, role, bio }) => (
              <div key={name} className="about-founders__card">
                {/* Circular photo placeholder — swap for <img> when photos are ready */}
                <div className="about-founders__photo" aria-label="Founder photo placeholder">
                  <span className="about-founders__photo-label">Photo</span>
                </div>
                <div className="about-founders__card-body">
                  <h3 className="about-founders__name">{name}</h3>
                  <p className="about-founders__role">{role}</p>
                  <p className="about-founders__bio">{bio}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      {/*
        Dark green section that mirrors the hero — creates a visual bookend.
        Diagonal top edge (clip-path) matches the angle of the hero's bottom edge.
        White button on dark green background for maximum contrast.
      */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__headline">Ready to open smarter?</h2>
          <p className="about-cta__subtitle">
            Create a free account and get full access to box analytics across
            every sport, manufacturer, and year.
          </p>
          <Link to="/signup" className="about-cta__button">Create free account</Link>
        </div>
      </section>

    </div>
  );
}
