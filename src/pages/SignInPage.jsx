/**
 * SignInPage
 *
 * Split layout: branded dark green panel on the left, clean sign-in form
 * on the right. The panel carries the visual personality so the form can
 * stay focused and uncluttered.
 *
 * Email/password sign-in is wired to Supabase Auth via
 * supabase.auth.signInWithPassword — on success the user is redirected to
 * the homepage; on failure Supabase's error.message is displayed inline.
 * Google OAuth is still a placeholder pending separate Google Cloud setup.
 * The "Forgot password?" link is a placeholder pending the password reset
 * flow (built in a later auth phase step).
 *
 * All text is placeholder — update copy strings directly in this file.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import './SignInPage.css';

export function SignInPage() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  // Controls whether the password field shows plain text or bullets
  const [showPassword, setShowPassword] = useState(false);

  // Inline error shown above the submit button when validation or sign-in fails
  const [errorMessage, setErrorMessage] = useState('');
  // Disables the submit button and swaps its label while the request is in flight
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      navigate('/');
    } catch {
      // Catches unexpected exceptions (network drop, SDK throw) that aren't
      // returned as the structured { error } response from Supabase.
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogle(e) {
    e.preventDefault();
    // TODO: Google OAuth — requires Google Cloud project setup. Deferred until pre-launch polish.
  }

  return (
    <div className="signin-page">

      {/* ── BRANDED PANEL (left) ──────────────────────────────────────── */}
      {/*
        Dark green half of the split. Contains the app name, tagline,
        and decorative background shapes. Hidden on mobile — the form
        takes the full screen width instead.
      */}
      <div className="signin-panel" aria-hidden="true">
        {/* Decorative hollow circles — background texture */}
        <div className="signin-panel__circle signin-panel__circle--large" />
        <div className="signin-panel__circle signin-panel__circle--small" />

        <div className="signin-panel__content">
          <p className="signin-panel__wordmark">DIR</p>
          <p className="signin-panel__tagline">Think inside the box.</p>
          <p className="signin-panel__description">
            Real pull rates. Actual market prices. Box-level ROI — before
            you buy. The analytics tool the hobby has always needed.
          </p>
        </div>

        {/* Stat pills — reinforce value at the moment a user is deciding to sign in */}
        <div className="signin-panel__stats">
          <div className="signin-panel__stat">
            <span className="signin-panel__stat-value">10,000+</span>
            <span className="signin-panel__stat-label">Box sets tracked</span>
          </div>
          <div className="signin-panel__stat">
            <span className="signin-panel__stat-value">Live</span>
            <span className="signin-panel__stat-label">eBay price data</span>
          </div>
          <div className="signin-panel__stat">
            <span className="signin-panel__stat-value">Free</span>
            <span className="signin-panel__stat-label">to get started</span>
          </div>
        </div>
      </div>

      {/* ── FORM PANEL (right) ───────────────────────────────────────────── */}
      {/*
        White side. Centered card containing the full sign-in form.
        Stays clean — no decorative elements competing with the inputs.
      */}
      <div className="signin-form-panel">
        <div className="signin-form-panel__inner">

          {/* Brand mark visible on mobile only (panel is hidden) */}
          <p className="signin-form-panel__mobile-brand">DIR</p>

          <h1 className="signin-form__heading">Welcome back</h1>
          <p className="signin-form__subheading">Sign in to your DIR account</p>

          <form className="signin-form" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="signin-form__field">
              <label className="signin-form__label" htmlFor="signin-email">Email</label>
              <input
                id="signin-email"
                type="email"
                className="signin-form__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password — with show/hide toggle */}
            <div className="signin-form__field">
              <div className="signin-form__label-row">
                <label className="signin-form__label" htmlFor="signin-password">Password</label>
                {/* TODO: Forgot password flow — wire up to supabase.auth.resetPasswordForEmail() when the password reset page exists (later auth phase step). */}
                <a href="#" className="signin-form__forgot" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <div className="signin-form__password-wrap">
                <input
                  id="signin-password"
                  /* Toggle between password and text to show/hide characters */
                  type={showPassword ? 'text' : 'password'}
                  className="signin-form__input signin-form__input--password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="signin-form__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Inline error — rendered only when something fails (validation or Supabase) */}
            {errorMessage && (
              <p className="signin-form__error">{errorMessage}</p>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              className="signin-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Divider */}
            <div className="signin-form__divider">
              <span className="signin-form__divider-line" />
              <span className="signin-form__divider-text">or</span>
              <span className="signin-form__divider-line" />
            </div>

            {/* Google OAuth — visual only, wire to Supabase OAuth when ready */}
            <button
              type="button"
              className="signin-form__google"
              onClick={handleGoogle}
            >
              {/* Google "G" logo rendered in CSS — no image dependency */}
              <span className="signin-form__google-icon" aria-hidden="true">G</span>
              Sign in with Google
            </button>

          </form>

          {/* Sign up prompt */}
          <p className="signin-form__footer">
            Don't have an account?{' '}
            <Link to="/signup" className="signin-form__footer-link">Create one free</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
