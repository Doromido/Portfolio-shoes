import React, { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleWishlist, addToCart } from '../store';
import { WOMEN_PRODUCTS } from './W-products.js';
import { MEN_PRODUCTS } from './M-products.js';
import { KIDS_PRODUCTS } from './K-products.js';
import './Sale.css';

// helpers 
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="16" height="16"
    stroke="white" fill={filled ? 'white' : 'none'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
             a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
             1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// badge must include '%' to count as a sale item
const isSaleProduct = p => p.badge?.includes('%') || p.category === 'SALE';

// build sale arrays with namespaced ids
const WOMEN_SALE = WOMEN_PRODUCTS
  .filter(isSaleProduct)
  .map(p => ({ ...p, id: `w${p.id}`, _ns: 'women' }));

const MEN_SALE = MEN_PRODUCTS
  .filter(isSaleProduct)
  .map(p => ({ ...p, id: `m${p.id}`, _ns: 'men' }));

const KIDS_SALE = KIDS_PRODUCTS
  .filter(isSaleProduct)
  .map(p => ({ ...p, id: p.id, _ns: 'kids' }));          // kids already prefixed

const discountVal = p => {
  const m = p.badge?.match(/-?(\d+)%/);
  return m ? parseInt(m[1]) : 0;
};

// countdown (static decoration) 
function Countdown() {
  return (
    <div className="sp-countdown">
      <span className="sp-cd-label">FLASH SALE ENDS IN</span>
      <div className="sp-cd-units">
        {[['23', 'HRS'], ['47', 'MIN'], ['12', 'SEC']].map(([n, l]) => (
          <div key={l} className="sp-cd-unit">
            <span className="sp-cd-num">{n}</span>
            <span className="sp-cd-sub">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// product card 
function SaleCard({ p, onAddToCart, getScrollY }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(s => s.wishlist.ids);
  const liked = wishlistIds.includes(p.id);
  const discount = discountVal(p);

  const goToProduct = () => {
    navigate(`/product/${p.id}`, { state: { returnTo: '/sale', scrollY: getScrollY() } });
  };

  return (
    <div className="sp-card">
      {discount > 0 && (
        <div className="sp-card-ribbon">
          <span>-{discount}%</span>
        </div>
      )}
      <button
        className={`sp-heart ${liked ? 'liked' : ''}`}
        onClick={e => { e.stopPropagation(); dispatch(toggleWishlist(p.id)); }}
      >
        <HeartIcon filled={liked} />
      </button>
      <div className="sp-card-img-wrap" style={{ cursor: 'pointer' }}
        onClick={goToProduct}>
        <img src={p.img} alt={p.name} className="sp-card-img" />
        <div className="sp-card-overlay">
          <button className="sp-add-btn"
            onClick={e => { e.stopPropagation(); onAddToCart(p); }}>
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="sp-card-info">
        <p className="sp-card-name" style={{ cursor: 'pointer' }}
          onClick={goToProduct}>{p.name}</p>
        {p.sub && <p className="sp-card-sub">{p.sub}</p>}
        <div className="sp-card-price-row">
          <span className="sp-card-price">${p.price}</span>
          {discount > 0 && (
            <span className="sp-card-original">
              ${Math.round(p.price / (1 - discount / 100))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// section 
function SaleSection({ id, label, tagline, products, accent, onAddToCart, getScrollY }) {
  const [hovered, setHovered] = useState(false);
  return (
    <section className="sp-section" id={id}
      style={{ '--section-accent': accent }}>
      <div className="sp-section-header">
        <div className="sp-section-title-block">
          <span className="sp-section-eyebrow">{tagline}</span>
          <h2 className="sp-section-title">
            <span className="sp-section-title-white">{label.split(' ')[0]} </span>
            <span className="sp-section-title-outline">{label.split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>
        <div className="sp-section-count">{products.length} ITEMS</div>
      </div>
      <div className="sp-grid">
        {products.map(p => (
          <SaleCard key={p.id} p={p} onAddToCart={onAddToCart} getScrollY={getScrollY} />
        ))}
      </div>
    </section>
  );
}

// main page 
export default function SalePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const womenRef = useRef(null);
  const menRef   = useRef(null);
  const kidsRef  = useRef(null);

  React.useEffect(() => {
    if (location.state?.scrollY != null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: location.state.scrollY, behavior: 'instant' });
      });
    }
  }, []);

  const getScrollY = useCallback(() => window.scrollY, []);

  const showToast = useCallback(p => {
    setToastHiding(false);
    setToast({ name: p.name, img: p.img });
    setTimeout(() => setToastHiding(true), 2500);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAddToCart = useCallback(p => {
    dispatch(addToCart({ id: p.id, name: p.name, img: p.img, price: p.price }));
    showToast(p);
  }, [dispatch, showToast]);

  const tabs = [
    { id: 'ALL',   label: 'ALL DEALS' },
    { id: 'WOMEN', label: 'WOMEN',     ref: womenRef },
    { id: 'MEN',   label: 'MEN',       ref: menRef   },
    { id: 'KIDS',  label: 'KIDS',      ref: kidsRef  },
  ];

  const handleTab = t => {
    setActiveTab(t.id);
    if (t.ref?.current) {
      t.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalCount = WOMEN_SALE.length + MEN_SALE.length + KIDS_SALE.length;

  return (
    <div className="sp-root">

      {/* HERO */}
      <section className="sp-hero">

        {/* diagonal stripes */}
        <div className="sp-hero-stripe sp-hero-stripe--1" />
        <div className="sp-hero-stripe sp-hero-stripe--2" />

        {/* floating % badges — LEFT side */}
        <div className="sp-float sp-float--l1">-15%</div>
        <div className="sp-float sp-float--l2">-20%</div>
        <div className="sp-float sp-float--l3">-25%</div>

        {/* floating % badges — RIGHT side */}
        <div className="sp-float sp-float--r1">-30%</div>
        <div className="sp-float sp-float--r2">-40%</div>
        <div className="sp-float sp-float--r3">-10%</div>

        {/* centred headline */}
        <div className="sp-hero-inner">
          <h1 className="sp-hero-title">
            <span className="sp-hero-solid">FINAL</span>
            <span className="sp-hero-outline">CLEAR</span>
            <span className="sp-hero-solid">ANCE.</span>
          </h1>

          {/* bottom row: desc+button LEFT, countdown RIGHT */}
          <div className="sp-hero-bottom">
            <div className="sp-hero-bottom-left">
              <p className="sp-hero-desc">
                Up to 40% off selected styles.<br />
                Women · Men · Kids — all on the block.
              </p>
              <div className="sp-hero-cta-row">
                <button className="sp-btn-primary"
                  onClick={() => document.getElementById('sp-sections')
                    ?.scrollIntoView({ behavior: 'smooth' })}>
                  SHOP THE SALE
                </button>
              </div>
            </div>

            <Countdown />
          </div>
        </div>

      </section>

      {/* TICKER */}
      <div className="sp-ticker" aria-hidden="true">
        <div className="sp-ticker-track">
          {Array(4).fill([
            'FINAL SALE', 'UP TO -40%', 'LIMITED STOCK',
            'WOMEN · MEN · KIDS', 'SS 2026', 'JUST FLY',
          ]).flat().map((t, i) => (
            <span key={i} className="sp-ticker-item">
              {t} <span className="sp-ticker-dot">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* SECTIONS */}
      <div id="sp-sections">

        {/* WOMEN */}
        <div ref={womenRef}>
          <div className="sp-section-divider">
            <div className="sp-divider-line" />
            <span className="sp-divider-label">WOMEN</span>
            <div className="sp-divider-line" />
          </div>
          <SaleSection
            id="sale-women"
            label="WOMEN SALE"
            tagline="WOMEN / SS 2026"
            products={WOMEN_SALE}
            accent="#e63329"
            onAddToCart={handleAddToCart} getScrollY={getScrollY}
          />
        </div>

        {/* MEN */}
        <div ref={menRef}>
          <div className="sp-section-divider">
            <div className="sp-divider-line" />
            <span className="sp-divider-label">MEN</span>
            <div className="sp-divider-line" />
          </div>
          <SaleSection
            id="sale-men"
            label="MEN SALE"
            tagline="MEN / SS 2026"
            products={MEN_SALE}
            accent="#e63329"
            onAddToCart={handleAddToCart} getScrollY={getScrollY}
          />
        </div>

        {/* KIDS */}
        <div ref={kidsRef}>
          <div className="sp-section-divider">
            <div className="sp-divider-line" />
            <span className="sp-divider-label">KIDS</span>
            <div className="sp-divider-line" />
          </div>
          <SaleSection
            id="sale-kids"
            label="KIDS SALE"
            tagline="KIDS / SS 2026"
            products={KIDS_SALE}
            accent="#e63329"
            onAddToCart={handleAddToCart} getScrollY={getScrollY}
          />
        </div>
      </div>

      {/* PROMO BANNER */}
      <section className="sp-promo">
        <img src="/sale.png" alt="" className="sp-promo-bg" aria-hidden="true" />
        <div className="sp-promo-inner">
          <div className="sp-promo-text">
            <span className="sp-promo-eyebrow">DON'T MISS OUT</span>
            <h2 className="sp-promo-title">
              STOCK IS<br />
              <span className="sp-promo-accent">LIMITED.</span>
            </h2>
            <p className="sp-promo-body">
              Once they're gone, they're gone. Grab your size before the drop
              closes — no restocks, no second chances.
            </p>
            <button className="sp-btn-primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              BACK TO TOP ↑
            </button>
          </div>
          <div className="sp-promo-deco" aria-hidden="true">
            <span className="sp-promo-big">-40%</span>
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div className={`sp-toast ${toastHiding ? 'hiding' : ''}`}>
          <img className="sp-toast-img" src={toast.img} alt={toast.name} />
          <div className="sp-toast-body">
            <span className="sp-toast-label">✓ ADDED TO CART</span>
            <span className="sp-toast-name">{toast.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}