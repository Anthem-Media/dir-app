/**
 * AuthContext
 *
 * App-wide React Context that tracks the currently signed-in Supabase user
 * and exposes a sign-out function. Wraps <App /> in main.jsx so every
 * component (header nav, protected pages, etc.) can read auth state via
 * the useAuth() hook without threading props through the tree.
 *
 * Why a context (and not ad-hoc Supabase calls per component):
 *  - Session state has to stay in sync everywhere the moment it changes
 *    (sign-in, sign-out, token refresh, tab return). One listener on
 *    supabase.auth.onAuthStateChange() guarantees the whole tree re-renders
 *    together.
 *  - The initial supabase.auth.getSession() call runs once on mount
 *    instead of being duplicated by every consumer.
 *
 * Does NOT handle (intentional scope):
 *  - Sign-in or sign-up flows. Pages call supabase.auth.signInWithPassword
 *    and supabase.auth.signUp directly; onAuthStateChange picks up the
 *    resulting session automatically and updates this context.
 *  - Password reset (deferred to pre-launch polish — see PRE-BETA-CHECKLIST.md).
 *  - Profile data beyond the Supabase auth.users record (the users
 *    profile table doesn't exist yet — see CONTEXT.md).
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

// Default value is null so the useAuth() guard can detect calls made
// outside a provider and throw a clear error instead of crashing later
// when something tries to read .user off of undefined.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  // Starts true — until getSession() returns we don't know whether a session
  // exists. Consumers (protected routes, header nav) can show a neutral
  // state while loading to avoid flashing a signed-out UI on hard refresh.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount. Covers the page-refresh and tab-reopen
    // cases: Supabase keeps the session in localStorage, so a previously
    // signed-in user should stay signed in without re-authenticating.
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Keep user state in sync with every auth transition — sign in, sign
    // out, token refresh, session expiry. The listener fires automatically,
    // so sign-in and sign-out handlers never have to call setUser directly.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup prevents a memory leak if the provider ever unmounts (also
    // matters in dev because React StrictMode intentionally mounts twice).
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    // onAuthStateChange will fire with SIGNED_OUT and reset user to null —
    // no need to manage that state here.
    await supabase.auth.signOut();
  }

  const value = { user, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    // Fails loudly with a clear message if a component calls useAuth
    // outside the provider tree, instead of crashing later with a
    // "cannot read properties of null" error that's hard to trace.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
