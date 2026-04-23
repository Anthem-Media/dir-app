/**
 * ProtectedRoute
 *
 * Route guard that gates its children behind authentication. Wrap any
 * route element whose page should require a signed-in user:
 *
 *   <Route path="/box/:slug" element={
 *     <ProtectedRoute>
 *       <BoxProfilePage />
 *     </ProtectedRoute>
 *   } />
 *
 * Behavior:
 *  - While AuthContext is still restoring the session, renders nothing.
 *    This prevents a flash of "/signin" on page refresh for users who
 *    are actually already signed in — we just don't know it yet until
 *    supabase.auth.getSession() resolves.
 *  - If no user once loading finishes, redirects to /signin with
 *    `replace` so the protected URL doesn't pollute browser history
 *    (back button from /signin should not land back on the protected
 *    page the user couldn't access).
 *  - Otherwise, renders the children normally.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // TODO (database phase): Once the users profile table exists, also verify
  // plan IN ('beta', 'paid'). Users with plan='free' should redirect to /upgrade.
  if (!user) return <Navigate to="/signin" replace />;

  return children;
}
