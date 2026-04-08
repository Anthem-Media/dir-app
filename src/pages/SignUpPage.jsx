/**
 * SignUpPage
 *
 * Same split layout as SignInPage — branded dark green panel on the left,
 * clean sign-up form on the right. The panel copy is tailored for someone
 * creating an account rather than returning to one.
 *
 * Authentication is not wired up yet. Wire up when backend is ready:
 *  - handleSubmit: call supabase.auth.signUp({ email, password, options: { data: { display_name } } })
 *  - Google button: call supabase.auth.signInWithOAuth({ provider: 'google' })
 *
 * All text is placeholder — update copy strings directly in this file.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpPage.css';

export function SignUpPage() {
  const [displayName, setDisplayName]             = useState('');
  const [email, setEmail]                         = useState('');
  const [password, setPassword]                   = useState('');
  const [confirmPassword, setConfirmPassword]     = useState('');
  // Each password field has its own independent show/hide toggle
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);
  // Checked by default — user has to actively opt out
  const [emailOptIn, setEmailOptIn]               = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to Supabase
    // supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } })
  }

  function handleGoogle(e) {
    e.preventDefault();
    // TODO: wire up to Supabase — supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="signup-page">

      {/* ── BRANDED PANEL (left) ──────────────────────────────────────── */}
      {/*
        Same visual structure as the Sign In panel — dark green, hollow
        circles, wordmark, tagline. Copy is tuned for the sign-up context:
        emphasizes what the user is about to gain access to.
        Hidden on mobile — the form takes the full screen.
      */}
      <div className="signup-panel" aria-hidden="true">
        <div className="signup-panel__circle signup-panel__circle--large" />
        <div className="signup-panel__circle signup-panel__circle--small" />

        <div className="signup-panel__content">
          <p className="signup-panel__wordmark">DIR</p>
          <p className="signup-panel__tagline">Your edge starts here.</p>
          <p className="signup-panel__description">
            Create a free account and get full access to box analytics —
            expected value, pull rates, and real market prices across every
            sport, manufacturer, and year.
          </p>
        </div>

        <div className="signup-panel__features">
          <div className="signup-panel__feature">
            <span className="signup-panel__feature-check" aria-hidden="true">✓</span>
            <span className="signup-panel__feature-text">Full checklist with card-level EV</span>
          </div>
          <div className="signup-panel__feature">
            <span className="signup-panel__feature-check" aria-hidden="true">✓</span>
            <span className="signup-panel__feature-text">Live eBay sold listing prices</span>
          </div>
          <div className="signup-panel__feature">
            <span className="signup-panel__feature-check" aria-hidden="true">✓</span>
            <span className="signup-panel__feature-text">Box-level ROI before you buy</span>
          </div>
          <div className="signup-panel__feature">
            <span className="signup-panel__feature-check" aria-hidden="true">✓</span>
            <span className="signup-panel__feature-text">Free to get started — always</span>
          </div>
        </div>
      </div>

      {/* ── FORM PANEL (right) ───────────────────────────────────────────── */}
      <div className="signup-form-panel">
        <div className="signup-form-panel__inner">

          {/* Brand mark shown on mobile when the panel is hidden */}
          <p className="signup-form-panel__mobile-brand">DIR</p>

          <h1 className="signup-form__heading">Create your account</h1>
          <p className="signup-form__subheading">Start making smarter box decisions today</p>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>

            {/* Display name */}
            <div className="signup-form__field">
              <label className="signup-form__label" htmlFor="signup-name">Display name</label>
              <input
                id="signup-name"
                type="text"
                className="signup-form__input"
                placeholder="How should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="signup-form__field">
              <label className="signup-form__label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                className="signup-form__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="signup-form__field">
              <label className="signup-form__label" htmlFor="signup-password">Password</label>
              <div className="signup-form__password-wrap">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="signup-form__input signup-form__input--password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="signup-form__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm password — independent show/hide from the field above */}
            <div className="signup-form__field">
              <label className="signup-form__label" htmlFor="signup-confirm">Confirm password</label>
              <div className="signup-form__password-wrap">
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className="signup-form__input signup-form__input--password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="signup-form__toggle"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Email opt-in — checked by default, user actively opts out */}
            <label className="signup-form__checkbox-label">
              <input
                type="checkbox"
                className="signup-form__checkbox"
                checked={emailOptIn}
                onChange={(e) => setEmailOptIn(e.target.checked)}
              />
              <span className="signup-form__checkbox-text">
                Send me updates on new drops, market moves, and DIR news
              </span>
            </label>

            {/* Primary CTA */}
            <button type="submit" className="signup-form__submit">Create account</button>

            {/* Divider */}
            <div className="signup-form__divider">
              <span className="signup-form__divider-line" />
              <span className="signup-form__divider-text">or</span>
              <span className="signup-form__divider-line" />
            </div>

            {/* Google OAuth — visual only */}
            <button type="button" className="signup-form__google" onClick={handleGoogle}>
              <span className="signup-form__google-icon" aria-hidden="true">G</span>
              Sign up with Google
            </button>

          </form>

          {/* Sign in prompt */}
          <p className="signup-form__footer">
            Already have an account?{' '}
            <Link to="/signin" className="signup-form__footer-link">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
