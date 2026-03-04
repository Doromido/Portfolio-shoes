import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WOMEN_PRODUCTS, FILTERS } from './W-products.js';
import {
  toggleWishlist,
  addToCart,
} from '../store';
import './Women.css';

// Namespace women product ids to avoid collisions with home products
const PRODUCTS = WOMEN_PRODUCTS.map(p => ({ ...p, id: `w${p.id}` }));
const HeartIcon = ({ filled }) => (
  <svg className="wp-heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    style={{ fill: filled ? 'white' : 'none', stroke: 'white', strokeWidth: 2 }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function WomenPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // { name, img }
  const [toastHiding, setToastHiding] = useState(false);
  const dispatch = useDispatch();
  const wishlistIds = useSelector(state => state.wishlist.ids);

  const handleToggleWishlist = (e, id) => {
    e.stopPropagation();
    dispatch(toggleWishlist(id));
  };

  const showToast = useCallback((p) => {
    setToastHiding(false);
    setToast({ name: p.name, img: p.img });
    // start hide animation after 2.5s, remove after 2.8s
    setTimeout(() => setToastHiding(true), 2500);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAddToCart = (e, p) => {
    e.stopPropagation();
    dispatch(addToCart({ id: p.id, name: p.name, img: p.img, price: p.price }));
    showToast(p);
  };

  const filtered = activeFilter === 'ALL'
    ? PRODUCTS
    : activeFilter === 'SALE'
      ? PRODUCTS.filter(p => p.category === 'SALE' || p.badge?.includes('%'))
      : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="wp-root">

      {/* HERO */}
      <section className="wp-hero">
        <div className="wp-hero-bg-word" aria-hidden="true">WOMEN</div>
        <div className="wp-hero-stripe" />

        <div className="wp-hero-content">
          <div className="wp-hero-left">
            <span className="wp-hero-eyebrow">SS 2026 / COLLECTION</span>
            <h1 className="wp-hero-title">
              <span className="wp-hero-title-solid">HER</span>
              <span className="wp-hero-title-outline">GAME.</span>
            </h1>
            <p className="wp-hero-desc">
              Engineered for those who move without apology.<br />Court-ready. Street-perfect.
            </p>
            <div className="wp-hero-cta-row">
              <button className="wp-btn-primary" onClick={() => document.querySelector('.wp-products').scrollIntoView({ behavior: 'smooth' })}>SHOP NOW</button>
              <button className="wp-btn-ghost">VIEW LOOKBOOK ↗</button>
            </div>
          </div>
        </div>

        <div className="wp-hero-stats">
          <div className="wp-stat"><span className="wp-stat-num">48</span><span className="wp-stat-label">STYLES</span></div>
          <div className="wp-stat-divider" />
          <div className="wp-stat"><span className="wp-stat-num">6</span><span className="wp-stat-label">COLOURWAYS</span></div>
          <div className="wp-stat-divider" />
          <div className="wp-stat"><span className="wp-stat-num">∞</span><span className="wp-stat-label">POSSIBILITIES</span></div>
        </div>

        <div className="wp-hero-athlete">
          <img src="/women/woman.png" alt="Jordan Women's athlete" />
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="wp-editorial-banner">
        <img src="/women/b.png" alt="Women collection" />
        <div className="wp-editorial-banner-text">
          <h2 className="wp-editorial-banner-title">
            DEFINE<br />
            <span style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 20px var(--glow))' }}>YOUR</span><br />
            COURT.
          </h2>
          <div className="wp-editorial-banner-tags">
            {['PERFORMANCE', 'TRACTION', 'STYLE'].map(tag => (
              <span key={tag} className="wp-editorial-banner-tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="wp-ticker" aria-hidden="true">
        <div className="wp-ticker-track">
          {Array(4).fill(['NEW ARRIVALS', "WOMEN'S COLLECTION", 'SS 2026', 'JUST FLY', 'HER GAME', 'AIR JORDAN']).flat().map((t, i) => (
            <span key={i} className="wp-ticker-item">{t} <span className="wp-ticker-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="wp-products">
        <div className="wp-products-header">
          <div>
            <span className="bs-tagline">SS 2026 / WOMEN'S COLLECTION</span>
            <h2 className="wp-products-title">THE <span className="wp-products-title-accent">EDIT</span></h2>
            <p className="wp-products-meta">{filtered.length} PRODUCTS</p>
          </div>
          <div className="wp-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`wp-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="wc-grid">
          {filtered.map(p => {
            const liked = wishlistIds.includes(p.id);
            return (
              <div key={p.id} className="bs-card wc-card">
                <div className="bs-img-wrap">
                  {p.badge && <span className="bs-badge">{p.badge}</span>}
                  <button
                    className={`bs-heart ${liked ? 'liked' : ''}`}
                    onClick={(e) => handleToggleWishlist(e, p.id)}
                    aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                  <img src={p.img} alt={p.name} className="bs-img" />
                  <div className="bs-cart-overlay">
                    <button className="bs-cart-btn" onClick={(e) => handleAddToCart(e, p)}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
                <div className="bs-info">
                  <p className="bs-name">{p.name}</p>
                  <div className="bs-price-row">
                    <span className="bs-price">${p.price}</span>
                    <span className="wc-colors">{p.colorways.length} COLORS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EDITORIAL BOTTOM */}
      <section className="wp-editorial-bottom">
        <div className="wp-ed-img-wrap">
          <img src="/categories/sale.jpg" alt="Her Game" />
          <div className="wp-ed-img-overlay" />
          <span className="wp-ed-tag">SS 2026</span>
        </div>
        <div className="wp-ed-text">
          <span className="wp-ed-eyebrow">DESIGNED FOR HER</span>
          <h2>
            MADE TO<br />
            <span className="wp-ed-accent">MOVE.</span><br />
            BUILT TO<br />WIN.
          </h2>
          <p className="wp-ed-body">
            Every stitch, every sole, every silhouette — crafted around
            the way women move. From the court to the street, your game
            deserves gear that keeps up.
          </p>
          <div className="wp-ed-pills">
            {['ZOOM AIR', 'REACT FOAM', 'FULL-GRAIN LEATHER', 'WIDE FIT'].map(t => (
              <span key={t} className="wp-ed-pill">{t}</span>
            ))}
          </div>
          <div className="wp-ed-cta-row">
            <button className="wp-btn-primary" onClick={() => navigate('/sale')}>SEE WHAT'S ON SALE →</button>
            <button className="wp-ed-link">VIEW LOOKBOOK ↗</button>
          </div>
        </div>
      </section>

      {/* SIZE STRIP */}
      <section className="wp-size-strip">
        <div className="wp-size-strip-inner">
          <div>
            <span className="wp-size-eyebrow">FIND YOUR FIT</span>
            <h3 className="wp-size-title">NOT SURE ON SIZE?</h3>
          </div>
          <div className="wp-size-sizes">
            {[
              { s: '36', insole: '23.5', foot: '23.0' },
              { s: '37', insole: '24.0', foot: '23.5' },
              { s: '38', insole: '24.5', foot: '24.0' },
              { s: '39', insole: '25.0', foot: '24.5' },
              { s: '40', insole: '25.5', foot: '25.0' },
              { s: '41', insole: '26.0', foot: '25.5' },
              { s: '42', insole: '26.5', foot: '26.0' },
            ].map(({ s, insole, foot }) => (
              <div key={s} className="wp-size-chip">
                {s}
                {insole && (
                  <div className="wp-size-tooltip">
                    <div className="wp-size-tooltip-row">
                      <div className="wp-size-tooltip-line">
                        <span>INSOLE</span><span>{insole} cm</span>
                      </div>
                      <div className="wp-size-tooltip-line">
                        <span>FOOT</span><span>{foot} cm</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="wp-btn-ghost">SIZE GUIDE →</button>
        </div>
      </section>

      {/* CART TOAST */}
      {toast && (
        <div className={`wp-toast ${toastHiding ? 'hiding' : ''}`}>
          <img className="wp-toast-img" src={toast.img} alt={toast.name} />
          <div className="wp-toast-body">
            <span className="wp-toast-label">✓ ADDED TO CART</span>
            <span className="wp-toast-name">{toast.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}