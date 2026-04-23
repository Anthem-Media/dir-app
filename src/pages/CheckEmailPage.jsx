/**
 * CheckEmailPage
 *
 * Post-signup destination. Supabase sends an email verification link after
 * signup, and users have to click that link before they can sign in — this
 * page tells them so and gives them a way to resend the email if they
 * didn't receive it.
 *
 * Email arrives via navigate('/check-email', { state: { email } }) from
 * SignUpPage and is read through useLocation().state. If state is missing
 * (direct visit, page refresh, bookmark), the page renders cleanly with
 * fallback copy and the resend button is disabled — the "Go to sign in"
 * CTA still works because the account already exists in Supabase regardless
 * of whether the email made it into route state.
 *
 * Not in the header nav. This is a flow state reached via the post-signup
 * redirect or by typing the URL directly — users should not navigate here
 * through normal browsing.
 *
 * Layout mirrors SignInPage and SignUpPage (split panel on desktop, form
 * side only on mobile) so the three auth-flow pages feel like siblings.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { supabase } from '../api/supabaseClient';
import './CheckEmailPage.css';

export function CheckEmailPage() {
  const [isResending, setIsResending]     = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Email is passed from SignUpPage via navigate(..., { state: { email } }).
  // Optional-chain + null fallback covers direct visits and hard refreshes
  // where route state is lost.
  const location = useLocation();
  const email = location.state?.email || null;

  async function handleResend() {
    if (!email) {
      // Can't resend without an address. Tell the user what to do instead.
      setResendMessage('No email on file — please sign up again.');
      return;
    }

    setResendMessage('');
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });

      if (error) {
        setResendMessage(error.message);
      } else {
        setResendMessage('Confirmation email sent. Check your inbox.');
      }
    } catch {
      // Catches unexpected exceptions (network drop, SDK throw) that aren't
      // returned as the structured { error } response from Supabase.
      setResendMessage('Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="check-email-page">

      {/* ── BRANDED PANEL (left) ───────────────────────────────────────── */}
      {/*
        Same structure as SignInPage/SignUpPage panels — dark surface,
        decorative hollow circles, wordmark, short supportive copy.
        Hidden on mobile to give the content side the full width.
      */}
      <div className="check-email-panel" aria-hidden="true">
        <div className="check-email-panel__circle check-email-panel__circle--large" />
        <div className="check-email-panel__circle check-email-panel__circle--small" />

        <div className="check-email-panel__content">
          <p className="check-email-panel__wordmark">DIR</p>
          <p className="check-email-panel__tagline">Almost there.</p>
          <p className="check-email-panel__description">
            One quick step to activate your account.
          </p>
        </div>
      </div>

      {/* ── CONTENT PANEL (right) ───────────────────────────────────────── */}
      <div className="check-email-form-panel">
        <div className="check-email-form-panel__inner">

          {/* Brand mark shown on mobile when the panel is hidden */}
          <p className="check-email-form-panel__mobile-brand">DIR</p>

          <h1 className="check-email__heading">Check your email</h1>

          {email ? (
            <p className="check-email__message">
              We sent a confirmation link to{' '}
              <span className="check-email__email">{email}</span>. Click the
              link in the email to activate your account, then sign in.
            </p>
          ) : (
            <p className="check-email__message">
              We sent a confirmation link to your email. Click the link in
              the email to activate your account, then sign in.
            </p>
          )}

          <p className="check-email__hint">
            Didn't get it? Check your spam folder or resend below.
          </p>

          {/* Resend section — styled as a ghost button so it reads clearly
              subordinate to the primary "Go to sign in" CTA below. */}
          <div className="check-email__resend">
            <button
              type="button"
              className="check-email__resend-button"
              onClick={handleResend}
              disabled={isResending || !email}
            >
              {isResending ? 'Resending...' : 'Resend confirmation email'}
            </button>

            {/* Single status line — copy itself carries success vs. failure meaning */}
            {resendMessage && (
              <p className="check-email__resend-message">{resendMessage}</p>
            )}
          </div>

          {/* Primary CTA — visually matches signup/signin submit buttons */}
          <Link to="/signin" className="check-email__cta">
            Go to sign in
          </Link>

          {/* Fallback for users who signed up with the wrong address */}
          <p className="check-email__footer">
            Signed up with a different email?{' '}
            <Link to="/signup" className="check-email__footer-link">Sign up again</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
