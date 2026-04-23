import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

// BrowserRouter lives here (the outermost wrapper) so every component in the
// app — including AppNav, SiteNavBar, and all pages — can use React Router
// hooks like useNavigate, useParams, and useLocation.
//
// AuthProvider sits inside BrowserRouter but above App so the entire route
// tree can read auth state via useAuth(). It doesn't need router hooks
// itself, but keeping routing outermost matches the convention of having
// navigation concerns wrap state concerns.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
