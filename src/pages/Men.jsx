import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { MEN_PRODUCTS, MEN_FILTERS } from './M-products.js';
import {
  toggleWishlist,
  addToCart,
} from '../store';
import './Men.css';

// Namespace men product ids to avoid collisions
const PRODUCTS = MEN_PRODUCTS.map(p => ({ ...p, id: `m${p.id}` }));

const HeartIcon = ({ filled }) => (
  <svg className="bs-heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    style={{ fill: filled ? 'white' : 'none', stroke: 'white', strokeWidth: 2 }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function MenPage() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(() => location.state?.activeFilter ?? 'ALL');
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const dispatch = useDispatch();
  const wishlistIds = useSelector(state => state.wishlist.ids);

  // Restore scroll position when returning from product page
  React.useEffect(() => {
    if (location.state?.scrollY != null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: location.state.scrollY, behavior: 'instant' });
      });
    }
  }, []);

  const goToProduct = (id) => {
    navigate(`/product/${id}`, {
      state: { returnTo: '/men', scrollY: window.scrollY, activeFilter },
    });
  };

  const handleToggleWishlist = (e, id) => {
    e.stopPropagation();
    dispatch(toggleWishlist(id));
  };

  const showToast = useCallback((p) => {
    setToastHiding(false);
    setToast({ name: p.name, img: p.img });
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
    <div className="mp-root">

      {/* HERO */}
      <section className="mp-hero">
        <div className="mp-hero-bg-word" aria-hidden="true">MEN</div>
        <div className="mp-hero-stripe" />

        <div className="mp-hero-content">
          <div className="mp-hero-right">
            <span className="mp-hero-eyebrow">SS 2026 / COLLECTION</span>
            <h1 className="mp-hero-title">
              <span className="mp-hero-title-solid">YOUR</span>
              <span className="mp-hero-title-outline">MOVE.</span>
            </h1>
            <p className="mp-hero-desc">
              Precision-engineered for every stride, every court, every street.<br />
              Play sharp. Look sharp.
            </p>
            <div className="mp-hero-cta-row">
              <button className="mp-btn-ghost" onClick={() => document.getElementById('editorial-bottom').scrollIntoView({ behavior: 'smooth' })}>VIEW SALE</button>
              <button
                className="mp-btn-primary"
                onClick={() => document.querySelector('.mp-products').scrollIntoView({ behavior: 'smooth' })}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        <div className="mp-hero-stats">
          <div className="mp-stat"><span className="mp-stat-num">54</span><span className="mp-stat-label">STYLES</span></div>
          <div className="mp-stat-divider" />
          <div className="mp-stat"><span className="mp-stat-num">8</span><span className="mp-stat-label">COLOURWAYS</span></div>
          <div className="mp-stat-divider" />
          <div className="mp-stat"><span className="mp-stat-num">∞</span><span className="mp-stat-label">POSSIBILITIES</span></div>
        </div>

        <div className="mp-hero-athlete">
          <img src="/men/man.png" alt="Jordan Men's athlete" />
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="mp-editorial-banner">
        <img src="/men/b.png" alt="Men collection" />
        <div className="mp-editorial-banner-text">
          <h2 className="mp-editorial-banner-title">
            ELEVATE<br />
            <span style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 20px var(--glow))' }}>YOUR</span><br />
            GAME.
          </h2>
          <div className="mp-editorial-banner-tags">
            {['PRECISION', 'CUSHIONING', 'CRAFT'].map(tag => (
              <span key={tag} className="mp-editorial-banner-tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="mp-ticker" aria-hidden="true">
        <div className="mp-ticker-track">
          {Array(4).fill(["NEW ARRIVALS", "MEN'S COLLECTION", 'SS 2026', 'JUST FLY', 'YOUR MOVE', 'AIR JORDAN']).flat().map((t, i) => (
            <span key={i} className="mp-ticker-item">{t} <span className="mp-ticker-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="mp-products">
        <div className="mp-products-header">
          <div>
            <span className="mp-tagline">SS 2026 / MEN'S COLLECTION</span>
            <h2 className="mp-products-title">THE <span className="mp-products-title-accent">EDIT</span></h2>
            <p className="mp-products-meta">{filtered.length} PRODUCTS</p>
          </div>
          <div className="mp-filters">
            {MEN_FILTERS.map(f => (
              <button
                key={f}
                className={`mp-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mc-grid">
          {filtered.map(p => {
            const liked = wishlistIds.includes(p.id);
            return (
              <div key={p.id} className="bs-card mc-card">
                <div className="bs-img-wrap" style={{ cursor: 'pointer' }}
                  onClick={() => goToProduct(p.id)}>                  {p.badge && <span className="bs-badge">{p.badge}</span>}
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
                  <p className="bs-name" style={{ cursor: 'pointer' }}
                    onClick={() => goToProduct(p.id)}>{p.name}</p>
                  <div className="bs-price-row">
                    <span className="bs-price">${p.price}</span>
                    <span className="mc-colors">{p.colorways.length} COLORS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EDITORIAL BOTTOM */}
      <section className="mp-editorial-bottom" id="editorial-bottom">
        <div className="mp-ed-text">
          <span className="mp-ed-eyebrow">DESIGNED FOR HIM</span>
          <h2>
            CRAFTED<br />
            <span className="mp-ed-accent">TO LAST.</span><br />
            BUILT TO<br />PERFORM.
          </h2>
          <p className="mp-ed-body">
            From the hardwood to the pavement — every detail serves
            a purpose. Precision materials, thoughtful engineering, and
            designs that age as well as the game itself.
          </p>
          <div className="mp-ed-pills">
            {['ZOOM AIR', 'REACT FOAM', 'FULL-GRAIN LEATHER', 'WIDE FIT'].map(t => (
              <span key={t} className="mp-ed-pill">{t}</span>
            ))}
          </div>
          <div className="mp-ed-cta-row">
            <button className="mp-btn-primary" onClick={() => navigate('/sale', { state: { scrollToTop: true } })}>SEE WHAT'S ON SALE →</button>
          </div>
        </div>
        <div className="mp-ed-img-wrap">
          <img src="/categories/sale.jpg" alt="Your Move" />
          <div className="mp-ed-img-overlay" />
          <span className="mp-ed-tag">SS 2026</span>
        </div>
      </section>

      {/* SIZE STRIP */}
      <section className="mp-size-strip">
        <div className="mp-size-strip-inner">
          <div>
            <span className="mp-size-eyebrow">FIND YOUR FIT</span>
            <h3 className="mp-size-title">NOT SURE ON SIZE?</h3>
          </div>
          <div className="mp-size-sizes">
            {[
              { s: '36', insole: '23.5', foot: '23.0' },
              { s: '37', insole: '24.0', foot: '23.5' },
              { s: '38', insole: '24.5', foot: '24.0' },
              { s: '39', insole: '25.0', foot: '24.5' },
              { s: '40', insole: '25.5', foot: '25.0' },
              { s: '41', insole: '26.0', foot: '25.5' },
              { s: '42', insole: '26.5', foot: '26.0' },
            ].map(({ s, insole, foot }) => (
              <div key={s} className="mp-size-chip">
                {s}
                {insole && (
                  <div className="mp-size-tooltip">
                    <div className="mp-size-tooltip-row">
                      <div className="mp-size-tooltip-line">
                        <span>INSOLE</span><span>{insole} cm</span>
                      </div>
                      <div className="mp-size-tooltip-line">
                        <span>FOOT</span><span>{foot} cm</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="mp-btn-ghost" onClick={() => navigate('/size-guide', { state: { gender: 'men', returnTo: '/men' } })}>SIZE GUIDE →</button>
        </div>
      </section>

      {/* CART TOAST */}
      {toast && (
        <div className={`mp-toast ${toastHiding ? 'hiding' : ''}`}>
          <img className="mp-toast-img" src={toast.img} alt={toast.name} />
          <div className="mp-toast-body">
            <span className="mp-toast-label">✓ ADDED TO CART</span>
            <span className="mp-toast-name">{toast.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}