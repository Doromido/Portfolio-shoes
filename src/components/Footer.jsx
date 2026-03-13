import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrdersModal from './Orders-modal';
import './Footer.css';

export default function Footer() {
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // Reading the user directly from localStorage
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jordan_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Listening to localStorage changes (login/logout in Header)
  useEffect(() => {
    const onStorage = () => {
      try {
        const stored = localStorage.getItem('jordan_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch { setUser(null); }
    };
    window.addEventListener('storage', onStorage);

    const interval = setInterval(onStorage, 1000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (user) {
      setOrdersOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">

      {/* Statement */}
      <div className="footer-statement">
        <div className="footer-statement-inner">
          <span className="footer-statement-text">BORN TO</span>
          <span className="footer-statement-outline">FLY</span>
          <span className="footer-statement-dot">.</span>
        </div>
        <div className="footer-statement-line" />
      </div>

      {/* Main 3-col grid */}
      <div className="footer-main">

        {/* COL 1 — Collection */}
        <div className="footer-nav-block">
          <span className="footer-col-title">COLLECTION</span>
          <ul className="footer-links">
            <li><Link to="/">New Arrivals</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/sale" className="footer-sale-link">Sale <span>↗</span></Link></li>
          </ul>
        </div>

        <div className="footer-col-sep" />

        {/* COL 2 — Help + Location + Social */}
        <div className="footer-mid-block">
          <div>
            <span className="footer-col-title">HELP</span>
            <ul className="footer-links">
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li>
                <a href="#" onClick={handleTrackOrder}>Track Order</a>
              </li>
            </ul>
          </div>

          <div className="footer-mid-lower">
            <div>
              <span className="footer-col-title">LOCATION</span>
              <div className="footer-coords-line">
                <span className="footer-coords-dot" />
                <span className="footer-address-text">
                  12 Rue du Faubourg<br />Saint-Honoré, Paris
                </span>
              </div>
            </div>

            <div>
              <span className="footer-col-title">FOLLOW</span>
              <div className="footer-coords-social">
                {['INSTAGRAM', 'TIKTOK', 'X'].map(name => (
                  <a key={name} href="#" className="footer-social-link">
                    <span className="footer-social-arrow">→</span>
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-col-sep" />

        {/* COL 3 — Newsletter */}
        <div className="footer-newsletter">
          <div className="footer-newsletter-label">DROP<br />ALERTS</div>
          <p className="footer-newsletter-desc">
            Be first for exclusive releases,<br />collabs and restocks.
          </p>
          {subscribed ? (
            <div className="footer-subscribed">
              <div className="footer-subscribed-icon">✓</div>
              <span>YOU'RE IN THE SQUAD</span>
            </div>
          ) : (
            <>
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
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
              <p className="footer-privacy-note">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-bottom-copy">© 2025 BORN TO FLY. ALL RIGHTS RESERVED.</span>
        <div className="footer-bottom-ticker">
          <div className="footer-ticker-item"><span>EST.</span><strong>2019</strong></div>
          <div className="footer-ticker-sep" />
          <div className="footer-ticker-item"><span>DROPS</span><strong>SS25</strong></div>
          <div className="footer-ticker-sep" />
          <div className="footer-ticker-item"><span>SHIPS TO</span><strong>42 COUNTRIES</strong></div>
        </div>
      </div>

      {ordersOpen && <OrdersModal onClose={() => setOrdersOpen(false)} />}

    </footer>
  );
}