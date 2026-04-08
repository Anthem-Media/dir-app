import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// BrowserRouter lives here (the outermost wrapper) so every component in the
// app — including AppNav, SiteNavBar, and all pages — can use React Router
// hooks like useNavigate, useParams, and useLocation.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
