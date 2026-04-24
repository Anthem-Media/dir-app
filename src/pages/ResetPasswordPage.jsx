/**
 * ResetPasswordPage
 *
 * Landing page for the password reset email link. When the user clicks
 * the link, Supabase parses the hash tokens from the URL on client init
 * and establishes a recovery session. With that session in place,
 * supabase.auth.updateUser({ password }) sets the new password.
 *
 * Session detection handles both timing paths:
 *   1. Session already exists by the time we mount — getSession() returns
 *      it synchronously (hash was parsed before we got here).
 *   2. Hash is still being parsed — onAuthStateChange fires within a
 *      short window once the session lands.
 * If neither fires within the window, we treat the link as invalid or
 * expired and offer a link back to /forgot-password.
 *
 * On successful password update we sign the user out first, then
 * redirect to /signin with a one-time resetSuccess flag in route state.
 * The signout ensures the user re-authenticates with their new password,
 * which is the clearest confirmation that the reset actually worked.
 *
 * Uses SignInPage's split-panel layout and classes for visual
 * consistency. ResetPasswordPage.css adds only the invalid-session
 * message block.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../api/supabaseClient';
import './SignInPage.css';
import './ResetPasswordPage.css';

// How long to wait for Supabase to process the URL hash and surface a
// session before declaring the link invalid. A few hundred ms is plenty
// since hash parsing happens on client init, not over the network.
const SESSION_CHECK_WINDOW_MS = 600;

export function ResetPasswordPage() {
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Each password field has its own independent show/hide toggle
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);

  // Inline error shown above the submit button when validation or the
  // Supabase call fails.
  const [errorMessage, setErrorMessage]       = useState('');
  // Disables the submit button and swaps its label while the request is
  // in flight.
  const [isSubmitting, setIsSubmitting]       = useState(false);

  // 'checking' while we wait for Supabase to resolve the URL hash; then
  // settles to 'valid' (session present, safe to show form) or 'invalid'
  // (no session, show recovery message).
  const [sessionStatus, setSessionStatus] = useState('checking');

  const navigate = useNavigate();

  // Session detection on mount. Subscribes to auth state changes AND
  // calls getSession() — whichever surfaces a session first flips to
  // 'valid'. If neither does within the window, the fallback timer
  // flips to 'invalid'.
  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        if (session) setSessionStatus('valid');
      }
    );

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        if (data?.session) setSessionStatus('valid');
      })
      .catch(() => {
        // Swallow — the fallback timer below will settle the UI into
        // the 'invalid' branch if no session ever appears.
      });

    const fallbackTimer = setTimeout(() => {
      if (!isMounted) return;
      // Only flip to invalid if still checking; don't clobber a 'valid'
      // that arrived just before the timer fired.
      setSessionStatus((prev) => (prev === 'checking' ? 'invalid' : prev));
    }, SESSION_CHECK_WINDOW_MS);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
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
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Sign out of the recovery session so the user re-authenticates
      // with the new password on the next screen — that makes the reset
      // self-evident instead of invisible.
      await supabase.auth.signOut();

      navigate('/signin', { state: { resetSuccess: true } });
    } catch {
      // Catches unexpected exceptions that aren't returned as the
      // structured { error } response from Supabase.
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="signin-page">

      {/* ── BRANDED PANEL (left) ──────────────────────────────────────── */}
      <div className="signin-panel" aria-hidden="true">
        <div className="signin-panel__circle signin-panel__circle--large" />
        <div className="signin-panel__circle signin-panel__circle--small" />

        <div className="signin-panel__content">
          <p className="signin-panel__wordmark">DIR</p>
          <p className="signin-panel__tagline">Set a new password.</p>
          <p className="signin-panel__description">
            Pick something strong and unique. Six characters minimum.
          </p>
        </div>
      </div>

      {/* ── FORM PANEL (right) ────────────────────────────────────────── */}
      <div className="signin-form-panel">
        <div className="signin-form-panel__inner">

          {/* Brand mark shown on mobile when the panel is hidden */}
          <p className="signin-form-panel__mobile-brand">DIR</p>

          <h1 className="signin-form__heading">Reset your password</h1>
          <p className="signin-form__subheading">
            Enter a new password for your account.
          </p>

          {/*
            While sessionStatus === 'checking' neither branch renders,
            keeping the panel blank for the brief moment we're waiting
            on Supabase. Flashing the form or the invalid-link message
            before we know which is correct would be worse than a
            half-second of empty space.
          */}

          {sessionStatus === 'invalid' && (
            <div className="reset-password-form__invalid" role="status">
              <p className="reset-password-form__invalid-heading">
                This reset link is invalid or has expired.
              </p>
              <p className="reset-password-form__invalid-body">
                Request a new one — it only takes a moment.
              </p>
              <Link to="/forgot-password" className="reset-password-form__invalid-cta">
                Request a new reset link
              </Link>
            </div>
          )}

          {sessionStatus === 'valid' && (
            <form className="signin-form" onSubmit={handleSubmit} noValidate>

              {/* New password */}
              <div className="signin-form__field">
                <label className="signin-form__label" htmlFor="reset-password-new">
                  New password
                </label>
                <div className="signin-form__password-wrap">
                  <input
                    id="reset-password-new"
                    type={showPassword ? 'text' : 'password'}
                    className="signin-form__input signin-form__input--password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              {/* Confirm new password */}
              <div className="signin-form__field">
                <label className="signin-form__label" htmlFor="reset-password-confirm">
                  Confirm new password
                </label>
                <div className="signin-form__password-wrap">
                  <input
                    id="reset-password-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="signin-form__input signin-form__input--password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="signin-form__toggle"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="signin-form__error">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="signin-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
