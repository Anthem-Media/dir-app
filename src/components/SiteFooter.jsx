/**
 * SiteFooter
 *
 * The site-wide footer. Logo and tagline on the left,
 * two link columns on the right: Company and Support.
 */

import { Link } from 'react-router-dom';
import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* Left — brand */}
        <div className="site-footer__brand">
          <span className="site-footer__logo">DIR</span>
          <p className="site-footer__tagline">Think inside the box.</p>
          <p className="site-footer__copyright">
            &copy; {new Date().getFullYear()} Diamond in the Rough
          </p>
        </div>

        {/* Right — link columns */}
        <div className="site-footer__links">
          <div className="site-footer__col">
            <span className="site-footer__col-heading">Company</span>
            <Link className="site-footer__link" to="/about">About</Link>
            <Link className="site-footer__link" to="/news">News</Link>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__col-heading">Support</span>
            <Link className="site-footer__link" to="/help">Help</Link>
            <Link className="site-footer__link" to="/faq">FAQ</Link>
            <Link className="site-footer__link" to="/contact">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
