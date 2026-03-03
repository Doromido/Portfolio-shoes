import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="footer">

      <div className="footer-statement">
        <div className="footer-statement-inner">
          <span className="footer-statement-text">BORN TO</span>
          <span className="footer-statement-outline">FLY</span>
          <span className="footer-statement-dot">.</span>
        </div>
        <div className="footer-statement-line" />
      </div>

      <div className="footer-main">

        <div className="footer-left">
          <img src="/logo.png" alt="Jordan" className="footer-logo" />
          <p className="footer-sub">EST. 1984 / AIR JORDAN BRAND</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-nav-grid">
          <div className="footer-col">
            <span className="footer-col-title">COLLECTION</span>
            <ul className="footer-links">
              <li><Link to="/">New Arrivals</Link></li>
              <li><Link to="/men">Men</Link></li>
              <li><Link to="/women">Women</Link></li>
              <li><Link to="/kids">Kids</Link></li>
              <li><Link to="/sale" className="footer-sale-link">Sale <span>↗</span></Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">HELP</span>
            <ul className="footer-links">
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">BRAND</span>
            <ul className="footer-links">
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Athletes</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <div className="footer-newsletter-label">DROP ALERTS</div>
          <p className="footer-newsletter-desc">
            Be first for exclusive releases,<br />collabs and restocks.
          </p>
          {subscribed ? (
            <div className="footer-subscribed">
              <div className="footer-subscribed-icon">✓</div>
              <span>YOU'RE IN THE SQUAD</span>
            </div>
          ) : (
            <div className="footer-form">
              <input
                type="email"
                className="footer-email-input"
                placeholder="YOUR@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <button className="footer-subscribe-btn" onClick={handleSubscribe}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          )}
          <p className="footer-privacy-note">No spam. Unsubscribe anytime.</p>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">© {new Date().getFullYear()} JORDAN BRAND</span>
          <div className="footer-legal">
            <a href="#">Privacy</a><span className="footer-sep">/</span>
            <a href="#">Terms</a><span className="footer-sep">/</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>

    </footer>
  );
}