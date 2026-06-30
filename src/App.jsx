/**
 * App.jsx — root component, persistent site shell, and route definitions.
 *
 * The chrome (AppNav, SiteNavBar, SiteFooter) renders on every page.
 * The <Routes> block swaps in the correct page component based on the URL.
 *
 * Route map:
 *   /                 → HomePage
 *   /browse           → BrowsePage
 *   /box/:slug        → BoxProfilePageV3 (default box profile — all site links use this)
 *   /box-v1/:slug     → BoxProfilePage   (V1 — accessible via "V1 Preview" nav tab)
 *   /box-v2/:slug     → BoxProfilePageV2 (V2 POC — accessible via "V2 Preview" nav tab)
 *   /about            → AboutPage
 *   /news             → NewsPage
 *   /contact          → ContactPage
 *   /help             → HelpPage
 *   /faq              → FaqPage
 *   /signin           → SignInPage
 *   /signup           → SignUpPage
 *   /check-email      → CheckEmailPage      (post-signup confirmation landing — not in nav)
 *   /forgot-password  → ForgotPasswordPage  (password reset request — not in nav)
 *   /reset-password   → ResetPasswordPage   (password reset email landing — not in nav)
 */

import { Routes, Route } from 'react-router-dom';

import { AppNav }       from './components/AppNav';
import { SiteNavBar }   from './components/SiteNavBar';
import { SiteFooter }   from './components/SiteFooter';
import { ScrollToTop }  from './components/ScrollToTop';

import { HomePage }       from './pages/HomePage';
import { BrowsePage }     from './pages/BrowsePage';
import { BoxProfilePage }   from './pages/BoxProfilePage';
import { BoxProfilePageV2 } from './pages/BoxProfilePageV2';
import { BoxProfilePageV3 } from './pages/BoxProfilePageV3';
import { AboutPage }      from './pages/AboutPage';
import { NewsPage }       from './pages/NewsPage';
import { ContactPage }    from './pages/ContactPage';
import { HelpPage }       from './pages/HelpPage';
import { FaqPage }        from './pages/FaqPage';
import { SignInPage }         from './pages/SignInPage';
import { SignUpPage }         from './pages/SignUpPage';
import { CheckEmailPage }     from './pages/CheckEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage }  from './pages/ResetPasswordPage';

import { NAV_TABS } from './utils/navMockData';

function App() {
  return (
    <>
      <ScrollToTop />
      <AppNav />
      <SiteNavBar tabs={NAV_TABS} />
      <main>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/browse"    element={<BrowsePage />} />
          <Route path="/box/:slug"     element={<BoxProfilePageV3 />} />
          <Route path="/box-v1/:slug" element={<BoxProfilePage />} />
          <Route path="/box-v2/:slug" element={<BoxProfilePageV2 />} />
          <Route path="/box-v3/:slug" element={<BoxProfilePageV3 />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/news"      element={<NewsPage />} />
          <Route path="/contact"   element={<ContactPage />} />
          <Route path="/help"      element={<HelpPage />} />
          <Route path="/faq"       element={<FaqPage />} />
          <Route path="/signin"          element={<SignInPage />} />
          <Route path="/signup"          element={<SignUpPage />} />
          <Route path="/check-email"     element={<CheckEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
