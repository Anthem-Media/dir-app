/**
 * ContactPage
 *
 * Warm, approachable contact page. Asymmetric two-column layout with the
 * form taking the larger share and contact info on the right. Includes a
 * working submit confirmation and a callout linking to the Help page.
 *
 * All text is placeholder. When real content is ready:
 *  - Update copy strings directly in this file.
 *  - Wire up the form's handleSubmit to a real API call or email service.
 *  - Replace social placeholders with real links.
 *  - No layout or style changes needed for a content-only swap.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

// ── Subject dropdown options ───────────────────────────────────────────────
// Edit this array to add, remove, or rename subject options.

const SUBJECT_OPTIONS = [
  'General Question',
  'Bug Report',
  'Partnership Inquiry',
  'Data Request',
  'Other',
];

// ── Social placeholders ────────────────────────────────────────────────────
// Replace href values with real URLs when accounts are set up.

const SOCIALS = [
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
];

// ── ContactForm ────────────────────────────────────────────────────────────
// Manages its own field state and submitted flag. When submitted, the form
// is replaced by a confirmation message. Wire up handleSubmit to a real
// API or email service (e.g. Resend, Formspree) when backend is ready.

function ContactForm() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send `fields` to backend / email service here.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="contact-form__confirmation">
        <div className="contact-form__confirmation-icon" aria-hidden="true">✓</div>
        <h3 className="contact-form__confirmation-heading">Message sent!</h3>
        <p className="contact-form__confirmation-body">
          Thanks for reaching out. We'll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>

      <div className="contact-form__row contact-form__row--two-col">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            className="contact-form__input"
            placeholder="Your name"
            value={fields.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="contact-form__input"
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-subject">Subject</label>
        <select
          id="contact-subject"
          name="subject"
          className="contact-form__select"
          value={fields.subject}
          onChange={handleChange}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          className="contact-form__textarea"
          placeholder="Tell us what's on your mind…"
          rows={6}
          value={fields.message}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="contact-form__submit">Send message</button>

    </form>
  );
}

export function ContactPage() {
  return (
    <div className="contact-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        Dark green, left-aligned. Simpler than the About/News heroes —
        the main event on this page is the form, not the hero.
        A decorative angled stripe gives it presence without competing.
      */}
      <section className="contact-hero">
        <div className="contact-hero__stripe" aria-hidden="true" />
        <div className="contact-hero__inner">
          <p className="contact-hero__eyebrow">Contact</p>
          <h1 className="contact-hero__headline">Get in touch.</h1>
          <p className="contact-hero__subtitle">
            Questions, feedback, partnership inquiries — we'd love to hear
            from you. We're a small team and we read every message.
          </p>
        </div>
      </section>

      {/* ── FORM + INFO ──────────────────────────────────────────────────── */}
      {/*
        White background. Asymmetric two-column grid: form takes ~60%,
        info column takes ~40%. The info column has the email address,
        response time note, and social placeholders.
      */}
      <section className="contact-body">
        <div className="contact-body__inner">

          {/* Left — Contact form */}
          <div className="contact-body__form-col">
            <h2 className="contact-body__col-heading">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Right — Contact info */}
          <aside className="contact-body__info-col">
            <h2 className="contact-body__col-heading">Contact info</h2>

            <div className="contact-info">

              {/* Email */}
              <div className="contact-info__block">
                <p className="contact-info__label">Email</p>
                {/* Replace with real mailto link when address is confirmed */}
                <a href="mailto:hello@dirapp.com" className="contact-info__email">
                  hello@dirapp.com
                </a>
              </div>

              {/* Response time */}
              <div className="contact-info__block">
                <p className="contact-info__label">Response time</p>
                <p className="contact-info__value">
                  We typically respond within 24 hours on business days.
                </p>
              </div>

              {/* Social placeholders */}
              <div className="contact-info__block">
                <p className="contact-info__label">Follow along</p>
                <div className="contact-info__socials">
                  {SOCIALS.map(({ id, label }) => (
                    // Replace href="#" with real social URLs when ready
                    <a
                      key={id}
                      href="#"
                      className="contact-info__social"
                      aria-label={label}
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="contact-info__social-icon" aria-hidden="true" />
                      <span className="contact-info__social-label">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* ── FAQ CALLOUT ──────────────────────────────────────────────────── */}
      {/*
        Subtle green-tinted strip between the form section and the CTA.
        Catches people who could solve their own problem on the Help page.
        Keeps the contact queue lighter.
      */}
      <section className="contact-faq-callout">
        <div className="contact-faq-callout__inner">
          <div className="contact-faq-callout__text">
            <h2 className="contact-faq-callout__heading">Looking for quick answers?</h2>
            <p className="contact-faq-callout__body">
              Our Help Center covers the most common questions about box analytics,
              pricing data, and your account.
            </p>
          </div>
          <Link to="/help" className="contact-faq-callout__button">Visit Help Center →</Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      {/*
        Dark green bookend — same diagonal-top clip-path pattern as
        About, News, and Help CTA sections.
      */}
      <section className="contact-cta">
        <div className="contact-cta__inner">
          <h2 className="contact-cta__headline">We're building this for you.</h2>
          <p className="contact-cta__subtitle">
            DIR is shaped by the community. If something is confusing, broken,
            or missing — we want to know. Every message gets read.
          </p>
        </div>
      </section>

    </div>
  );
}
