/**
 * App.jsx — root component, persistent site shell, and route definitions.
 *
 * The chrome (AppNav, SiteNavBar, SiteFooter) renders on every page.
 * The <Routes> block swaps in the correct page component based on the URL.
 *
 * Route map:
 *   /                → HomePage
 *   /browse          → BrowsePage
 *   /box/:slug       → BoxProfilePage  (slug matches the box id, e.g. topps-chrome-2024-hobby)
 *   /about           → AboutPage
 *   /news            → NewsPage
 *   /contact         → ContactPage
 *   /help            → HelpPage
 *   /faq             → FaqPage
 *   /signin          → SignInPage
 *   /signup          → SignUpPage
 *   /check-email     → CheckEmailPage  (post-signup confirmation landing — not in nav)
 */

import { Routes, Route } from 'react-router-dom';

import { AppNav }      from './components/AppNav';
import { SiteNavBar }  from './components/SiteNavBar';
import { SiteFooter }  from './components/SiteFooter';

import { HomePage }       from './pages/HomePage';
import { BrowsePage }     from './pages/BrowsePage';
import { BoxProfilePage } from './pages/BoxProfilePage';
import { AboutPage }      from './pages/AboutPage';
import { NewsPage }       from './pages/NewsPage';
import { ContactPage }    from './pages/ContactPage';
import { HelpPage }       from './pages/HelpPage';
import { FaqPage }        from './pages/FaqPage';
import { SignInPage }     from './pages/SignInPage';
import { SignUpPage }     from './pages/SignUpPage';
import { CheckEmailPage } from './pages/CheckEmailPage';

import { NAV_TABS } from './utils/navMockData';

function App() {
  return (
    <>
      <AppNav />
      <SiteNavBar tabs={NAV_TABS} />
      <main>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/browse"    element={<BrowsePage />} />
          <Route path="/box/:slug" element={<BoxProfilePage />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/news"      element={<NewsPage />} />
          <Route path="/contact"   element={<ContactPage />} />
          <Route path="/help"      element={<HelpPage />} />
          <Route path="/faq"       element={<FaqPage />} />
          <Route path="/signin"      element={<SignInPage />} />
          <Route path="/signup"      element={<SignUpPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
