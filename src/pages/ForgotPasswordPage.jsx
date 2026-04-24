/**
 * ForgotPasswordPage
 *
 * Entry point for the password reset flow. User enters the email on their
 * account and Supabase emails them a reset link that lands on
 * /reset-password.
 *
 * Layout mirrors SignInPage — same split-panel structure, same classes —
 * so the three auth-flow pages (signin, signup, forgot-password) feel
 * like siblings. SignInPage.css is imported to get the shared layout and
 * form classes; ForgotPasswordPage.css adds only the success-state block
 * shown after the reset email has been sent.
 *
 * Post-submit the form is replaced with a confirmation block. The copy
 * is deliberately non-committal about whether an account actually exists
 * for the address, which avoids leaking account existence to attackers
 * probing the flow.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { supabase } from '../api/supabaseClient';
import './SignInPage.css';
import './ForgotPasswordPage.css';

// Minimal email regex — catches the obvious "no @" and "no dot" mistakes
// client-side. Supabase does authoritative validation server-side.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const [email, setEmail]               = useState('');

  // Inline error shown above the submit button when validation or the
  // Supabase call fails. Cleared on every new submit attempt.
  const [errorMessage, setErrorMessage] = useState('');
  // Disables the submit button and swaps its label while the request is
  // in flight.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When set, the form is replaced with the success confirmation block.
  // Holding the submitted address lets the confirmation echo it back.
  const [submittedEmail, setSubmittedEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // redirectTo is where Supabase sends the user after they click the
      // reset link in their email. It must match an allowed Redirect URL
      // configured in Supabase Auth settings (localhost + production
      // origin are both currently whitelisted).
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSubmittedEmail(email);
    } catch {
      // Catches unexpected exceptions (network drop, SDK throw) that
      // aren't returned as the structured { error } response from
      // Supabase.
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
          <p className="signin-panel__tagline">Forgot password?</p>
          <p className="signin-panel__description">
            Happens to everyone. Enter the email on your account and we'll
            send a link to set a new one.
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
            We'll email you a link to set a new password.
          </p>

          {submittedEmail ? (
            // Post-submit confirmation. The form is replaced entirely so
            // the user can't double-submit from the same page.
            <div className="forgot-password-form__success" role="status">
              <p className="forgot-password-form__success-heading">Check your email.</p>
              <p className="forgot-password-form__success-body">
                If an account exists for{' '}
                <span className="forgot-password-form__success-email">{submittedEmail}</span>,
                we've sent you a password reset link.
              </p>
              <p className="forgot-password-form__success-hint">
                Didn't get it? Check your spam folder, or try again in a minute.
              </p>
            </div>
          ) : (
            <form className="signin-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="signin-form__field">
                <label className="signin-form__label" htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  className="signin-form__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {errorMessage && (
                <p className="signin-form__error">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="signin-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          )}

          {/* Back link — always visible so users can bail out at any
              point, pre- or post-submit. */}
          <p className="signin-form__footer">
            Remember your password?{' '}
            <Link to="/signin" className="signin-form__footer-link">Back to sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
