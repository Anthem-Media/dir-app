/**
 * App.jsx — root component and persistent site shell
 *
 * Renders the top bar, secondary nav bar, the current page, and the footer.
 * When React Router is added, the <HomePage /> below becomes <RouterOutlet />
 * and each page gets its own URL. The chrome (top bar, nav, footer) stays here.
 */

import { useState } from 'react';
import { AppNav } from './components/AppNav';
import { SiteNavBar } from './components/SiteNavBar';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { NAV_TABS } from './utils/homePageMockData';
import './App.css';

function App() {
  // Search query is lifted here so SiteTopBar can control it and
  // eventually pass it down to whichever page needs it
  const [searchQuery, setSearchQuery] = useState('');

  // Active nav tab is also app-level state — it will control which page
  // or filtered view is shown once routing is in place
  const [activeTab, setActiveTab] = useState('All');

  return (
    <>
      <AppNav searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <SiteNavBar tabs={NAV_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        <HomePage />
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
