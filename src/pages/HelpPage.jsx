/**
 * HelpPage
 *
 * Help center for DIR. More expressive than core app pages — uses shaped
 * backgrounds, category cards, and a working FAQ accordion to give the
 * help content a polished, product-grade feel.
 *
 * All text is placeholder. When real content is ready:
 *  - Update CATEGORIES and FAQ_ITEMS arrays at the top of this file.
 *  - Replace icon placeholder divs with real icons or SVGs.
 *  - No layout or style changes needed for a content-only swap.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpPage.css';

// ── Help category cards ────────────────────────────────────────────────────
// Shown in the grid below the hero. Add, remove, or reorder as needed.

const CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to DIR? Learn the basics and get oriented fast.',
  },
  {
    id: 'box-analytics',
    title: 'Box Analytics',
    description: 'Understanding expected value, ROI, and pull rates.',
  },
  {
    id: 'your-account',
    title: 'Your Account',
    description: 'Sign in, account settings, and preferences.',
  },
  {
    id: 'pricing-plans',
    title: 'Pricing & Plans',
    description: "What's free, what's Pro, and what you get with each.",
  },
  {
    id: 'data-sources',
    title: 'Data & Sources',
    description: 'Where our numbers come from and how often they update.',
  },
  {
    id: 'contact-support',
    title: 'Contact Support',
    description: "Can't find what you need? Reach out and we'll help.",
  },
];

// ── FAQ accordion items ────────────────────────────────────────────────────
// Expandable Q&A pairs. Each item can be opened and closed independently.

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What is expected value (EV)?',
    answer:
      'Expected value is the average return you can expect from a box based on its checklist, pull rates, and current market prices. DIR calculates it by multiplying each card\'s market price by its probability of being pulled, then summing across the full checklist. A box with an EV above its retail price is generally a better bet.',
  },
  {
    id: 'faq-2',
    question: 'How is ROI calculated?',
    answer:
      'ROI (return on investment) is the difference between a box\'s expected value and its current retail price, expressed as a percentage. A positive ROI means the box\'s EV exceeds what you\'re paying for it. DIR shows this prominently on every box profile so you can compare options at a glance.',
  },
  {
    id: 'faq-3',
    question: 'Where do card prices come from?',
    answer:
      'All prices are sourced from actual eBay sold listings — not asking prices or estimated values. We pull recent sales data for each card in raw and graded form, filter out outliers, and surface the most representative recent price. This is the closest thing to real market value available.',
  },
  {
    id: 'faq-4',
    question: 'How often is pricing data updated?',
    answer:
      'Pricing data is refreshed regularly to reflect recent market activity. High-volume cards update more frequently than low-volume ones. You\'ll always see a timestamp on each price so you know how fresh the data is.',
  },
  {
    id: 'faq-5',
    question: 'What sports are supported?',
    answer:
      'DIR currently covers baseball, basketball, football, and hockey. Additional sports are on the roadmap. If a sport or product line you care about isn\'t available yet, let us know — user demand shapes what we prioritize.',
  },
  {
    id: 'faq-6',
    question: 'Can I track my personal collection?',
    answer:
      'Collection tracking is planned for a future release. Right now DIR is focused on the pre-purchase decision — giving you the data you need before you open a box. Collection tools are on the roadmap for after the core analytics experience is solid.',
  },
  {
    id: 'faq-7',
    question: 'How do pull rates work?',
    answer:
      'Pull rates come from manufacturer-published odds, which are required on hobby products by law in most regions. DIR maps these odds to every card in the checklist so you can see the exact probability of pulling any given card from a specific box configuration.',
  },
  {
    id: 'faq-8',
    question: 'Is DIR free to use?',
    answer:
      'DIR has a free tier that gives you access to core box analytics across all sports and products. A Pro plan with advanced features — deeper historical data, collection tools, and more — is in development. Free access will always exist.',
  },
];

// ── FaqItem ────────────────────────────────────────────────────────────────
// Single accordion row. Manages its own open/closed state internally.
// Each item is independent — opening one does not close others.

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`help-faq__item ${isOpen ? 'help-faq__item--open' : ''}`}>
      <button
        className="help-faq__question"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        {/* Chevron rotates 180° when open via CSS */}
        <span className="help-faq__chevron" aria-hidden="true">›</span>
      </button>
      {isOpen && (
        <div className="help-faq__answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="help-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        Dark green, centered layout. Large headline + visual-only search bar.
        Two decorative circles in the background give it depth without clutter.
        The search bar renders but doesn't filter anything yet — wire it up
        when the help content search is implemented.
      */}
      <section className="help-hero">
        {/* Decorative background circles — texture, not content */}
        <div className="help-hero__circle help-hero__circle--left"  aria-hidden="true" />
        <div className="help-hero__circle help-hero__circle--right" aria-hidden="true" />

        <div className="help-hero__inner">
          <p className="help-hero__eyebrow">Help Center</p>
          <h1 className="help-hero__headline">How can we help?</h1>
          <p className="help-hero__subtitle">
            Search our help docs or browse by category below.
          </p>

          {/* Visual-only search bar — replace onSubmit handler when search is live */}
          <form
            className="help-hero__search"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <span className="help-hero__search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="help-hero__search-input"
              placeholder="Search help topics…"
              aria-label="Search help topics"
            />
            <button type="submit" className="help-hero__search-button">Search</button>
          </form>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      {/*
        Six cards in a 3-column grid on a white background.
        The fourth card is offset downward (--offset modifier) to break the
        rigid grid rhythm — same stagger technique as the About mission section.
        Cards have hover lift but don't link anywhere yet.
      */}
      <section className="help-categories">
        <div className="help-categories__inner">
          <h2 className="help-categories__heading">Browse by topic</h2>

          <div className="help-categories__grid">
            {CATEGORIES.map(({ id, title, description }, i) => (
              <div
                key={id}
                className={[
                  'help-category__card',
                  i === 3 ? 'help-category__card--offset' : '',
                ].join(' ').trim()}
              >
                {/* Icon placeholder — replace with real icon or SVG when assets are ready */}
                <div className="help-category__icon" aria-label="Category icon placeholder" />
                <h3 className="help-category__title">{title}</h3>
                <p className="help-category__description">{description}</p>
                {/* Arrow nudges right on hover via CSS — signals the card is clickable */}
                <span className="help-category__arrow" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ────────────────────────────────────────────────── */}
      {/*
        Subtle grey background section. Each FaqItem manages its own open/closed
        state — clicking its question button toggles the answer below it.
        Items are independent: opening one doesn't close others.
      */}
      <section className="help-faq">
        <div className="help-faq__inner">
          <div className="help-faq__intro">
            <h2 className="help-faq__heading">Popular questions</h2>
            <p className="help-faq__subheading">
              Quick answers to the things people ask most.
            </p>
          </div>

          <div className="help-faq__list">
            {FAQ_ITEMS.map(({ id, question, answer }) => (
              <FaqItem key={id} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STILL NEED HELP CTA ──────────────────────────────────────────── */}
      {/*
        Dark green section with diagonal top edge — same clip-path pattern
        as the About and News CTA blocks. Links to /contact.
      */}
      <section className="help-cta">
        <div className="help-cta__inner">
          <h2 className="help-cta__headline">Still have questions?</h2>
          <p className="help-cta__subtitle">
            We're a small team and we read every message. Reach out and
            we'll get back to you within one business day.
          </p>
          <Link to="/contact" className="help-cta__button">Contact support</Link>
        </div>
      </section>

    </div>
  );
}
