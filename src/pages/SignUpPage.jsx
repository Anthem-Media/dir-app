/**
 * SignUpPage
 *
 * Same split layout as SignInPage — branded dark green panel on the left,
 * clean sign-up form on the right. The panel copy is tailored for someone
 * creating an account rather than returning to one.
 *
 * Email/password signup is wired to Supabase Auth — successful signups
 * create a user in Supabase's auth.users table and redirect to the homepage.
 * Google OAuth is still a placeholder pending separate Google Cloud setup.
 * Profile row creation in our users table (display_name, email_opt_in, plan)
 * is handled in a later step once that table exists; for now, display_name
 * and email_opt_in are attached to user metadata via options.data.
 *
 * All text is placeholder — update copy strings directly in this file.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import './SignUpPage.css';

export function SignUpPage() {
  const [displayName, setDisplayName]             = useState('');
  const [email, setEmail]                         = useState('');
  const [password, setPassword]                   = useState('');
  const [confirmPassword, setConfirmPassword]     = useState('');
  // Each password field has its own independent show/hide toggle
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);
  // Unchecked by default — user must actively opt in
  const [emailOptIn, setEmailOptIn]               = useState(false);

  // Inline error message shown above the submit button when signup fails
  const [errorMessage, setErrorMessage]           = useState('');
  // Disables the submit button and swaps its label while the request is in flight
  const [isSubmitting, setIsSubmitting]           = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            email_opt_in: emailOptIn,
          },
        },
      });

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

  // TODO: Google OAuth — requires Google Cloud project setup. Skipped during initial auth wire-up.
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

            {/* Email opt-in — unchecked by default, user actively opts in */}
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

            {/* Inline error — rendered only when something fails (validation or Supabase) */}
            {errorMessage && (
              <p className="signup-form__error">{errorMessage}</p>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              className="signup-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

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
