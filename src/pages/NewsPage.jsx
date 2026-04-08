/**
 * NewsPage
 *
 * Blog / updates page for DIR. More expressive than the core app pages —
 * diagonal section edges, staggered card layouts, and a strong typographic hero.
 *
 * All content is placeholder. When real articles are ready:
 *  - Replace the FEATURED_ARTICLE and RECENT_ARTICLES arrays at the top.
 *  - Swap placeholder <div> image blocks for <img> tags.
 *  - No layout or style changes needed for a content-only swap.
 */

import './NewsPage.css';

// ── Featured article ───────────────────────────────────────────────────────
// One article shown large at the top. Swap this object for the latest post.

const FEATURED_ARTICLE = {
  id: 'featured-1',
  category: 'Product Update',
  headline: 'DIR Is Live: Here\'s Everything You Can Do Right Now',
  date: 'April 7, 2026',
  excerpt:
    'We built DIR because we couldn\'t find the tool we actually needed before opening a box. Today that tool is live. Here\'s a full walkthrough of what\'s available, what\'s coming, and how to get the most out of it on day one.',
};

// ── Recent articles ────────────────────────────────────────────────────────
// Grid of smaller article cards below the featured post. Add more as needed.

const RECENT_ARTICLES = [
  {
    id: 'article-1',
    category: 'Deep Dive',
    headline: 'How We Calculate Expected Value',
    date: 'March 28, 2026',
    excerpt:
      'Expected value is the most useful number in sports card investing — and the most misunderstood. Here\'s exactly how DIR calculates it, what data goes in, and what the result actually means.',
  },
  {
    id: 'article-2',
    category: 'Preview',
    headline: '2026 Topps Chrome: What We Know So Far',
    date: 'March 19, 2026',
    excerpt:
      'Chrome season is approaching. We broke down the early info on checklist size, box configuration, and what last year\'s comps suggest about where prices will land at launch.',
  },
  {
    id: 'article-3',
    category: 'Education',
    headline: 'Why Pull Rates Matter More Than You Think',
    date: 'March 11, 2026',
    excerpt:
      'Most buyers look at individual card prices and forget that getting that card requires a specific pull rate. We explain why pull rates are the hidden variable that changes every ROI calculation.',
  },
];

export function NewsPage() {
  return (
    <div className="news-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        Dark green section, typography-driven — no image needed.
        Diagonal bottom edge mirrors the About hero.
        Decorative angled stripe adds visual interest without adding noise.
      */}
      <section className="news-hero">
        <div className="news-hero__inner">
          <p className="news-hero__eyebrow">DIR Journal</p>
          <h1 className="news-hero__headline">Latest from DIR.</h1>
          <p className="news-hero__subtitle">
            Product updates, deep dives on box analytics, and everything happening
            in the hobby that we think is worth your time.
          </p>
        </div>
        {/* Decorative stripe — background texture, not content */}
        <div className="news-hero__stripe" aria-hidden="true" />
      </section>

      {/* ── FEATURED ARTICLE ─────────────────────────────────────────────── */}
      {/*
        Single large card with a prominent image placeholder on the left
        and article info on the right. Sits between the hero and the grid.
      */}
      <section className="news-featured">
        <div className="news-featured__inner">
          <p className="news-featured__label">Featured</p>
          <article className="news-featured__card">
            {/* Swap this div for an <img> when the real image is ready */}
            <div className="news-featured__image" aria-label="Featured article image placeholder">
              <span className="news-featured__image-label">Article Image</span>
            </div>

            <div className="news-featured__content">
              <span className="news-featured__category">{FEATURED_ARTICLE.category}</span>
              <h2 className="news-featured__headline">{FEATURED_ARTICLE.headline}</h2>
              <p className="news-featured__date">{FEATURED_ARTICLE.date}</p>
              <p className="news-featured__excerpt">{FEATURED_ARTICLE.excerpt}</p>
              {/* href="#" keeps it visually correct; replace with real slug when live */}
              <a href="#" className="news-featured__link">Read more →</a>
            </div>
          </article>
        </div>
      </section>

      {/* ── RECENT ARTICLES ──────────────────────────────────────────────── */}
      {/*
        Three-column grid of smaller article cards. The second card is offset
        downward (news-article__card--offset) to break the rigid grid rhythm —
        same stagger technique used in the About mission section.
      */}
      <section className="news-articles">
        <div className="news-articles__inner">
          <h2 className="news-articles__heading">Recent articles</h2>

          <div className="news-articles__grid">
            {RECENT_ARTICLES.map(({ id, category, headline, date, excerpt }, i) => (
              <article
                key={id}
                className={[
                  'news-article__card',
                  i === 1 ? 'news-article__card--offset' : '',
                ].join(' ').trim()}
              >
                {/* Image placeholder — swap for <img> when images are available */}
                <div className="news-article__image" aria-label="Article image placeholder" />
                <div className="news-article__content">
                  <span className="news-article__category">{category}</span>
                  <h3 className="news-article__headline">{headline}</h3>
                  <p className="news-article__date">{date}</p>
                  <p className="news-article__excerpt">{excerpt}</p>
                  <a href="#" className="news-article__link">Read more →</a>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      {/*
        Dark green section with diagonal top edge — mirrors the About CTA.
        Simple email capture: input + subscribe button.
        No form submission logic yet — wire up when backend is ready.
      */}
      <section className="news-newsletter">
        <div className="news-newsletter__inner">
          <h2 className="news-newsletter__headline">Stay in the loop.</h2>
          <p className="news-newsletter__subtitle">
            New articles, product updates, and hobby intel — delivered when
            it's actually worth reading.
          </p>
          {/* onSubmit: replace with real handler when email service is set up */}
          <form
            className="news-newsletter__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              className="news-newsletter__input"
              placeholder="you@example.com"
              aria-label="Email address"
            />
            <button type="submit" className="news-newsletter__button">
              Subscribe
            </button>
          </form>
          <p className="news-newsletter__disclaimer">
            No spam. Unsubscribe any time.
          </p>
        </div>
      </section>

    </div>
  );
}
