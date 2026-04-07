/**
 * SiteFooter
 *
 * The site-wide footer. Logo and tagline on the left,
 * two link columns on the right: Company and Support.
 */

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
            <a className="site-footer__link" href="#about">About</a>
            <a className="site-footer__link" href="#news">News</a>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__col-heading">Support</span>
            <a className="site-footer__link" href="#help">Help</a>
            <a className="site-footer__link" href="#faq">FAQ</a>
            <a className="site-footer__link" href="#contact">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
