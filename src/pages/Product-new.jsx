import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleWishlist, selectWishlistIds } from '../store';
import { useWishlist } from '../hooks/useWishlist';
import './Product-new.css';

// Data
const COLORS = [
  { id: 0, name: 'Red',    shoe: '/shoes/1.png',   accent: '#ff0000', glow: 'rgba(255,0,0,0.3)',    glowPulse1: 'rgba(255,0,0,0.5)',   glowPulse2: 'rgba(255,0,0,0.8)'   },
  { id: 1, name: 'Yellow', shoe: '/shoes/s-y.png', accent: '#f5c500', glow: 'rgba(245,197,0,0.3)',  glowPulse1: 'rgba(245,197,0,0.5)', glowPulse2: 'rgba(245,197,0,0.8)' },
  { id: 2, name: 'Purple', shoe: '/shoes/s-v.png', accent: '#8b00ff', glow: 'rgba(139,0,255,0.3)', glowPulse1: 'rgba(139,0,255,0.5)', glowPulse2: 'rgba(139,0,255,0.8)' },
  { id: 3, name: 'Green',  shoe: '/shoes/s-g.png', accent: '#22dd22', glow: 'rgba(34,221,34,0.3)', glowPulse1: 'rgba(34,221,34,0.5)', glowPulse2: 'rgba(34,221,34,0.8)' },
];

// Thumbnail photos for angle selector 
const COLOR_ANGLES = [
  ['/shoes/1-1.png',   '/shoes/1-2.png',   '/shoes/1-3.png'],
  ['/shoes/s-y-1.png', '/shoes/s-y-2.png', '/shoes/s-y-3.png'],
  ['/shoes/s-v-1.png', '/shoes/s-v-2.png', '/shoes/s-v-3.png'],
  ['/shoes/s-g-1.png', '/shoes/s-g-2.png', '/shoes/s-g-3.png'],
];
const ANGLE_LABELS = ['SIDE', 'PAIR', 'SOLE'];

// Main shoe transforms per angle 
const ANGLES = [
  { label: 'SIDE',  imgRot: 'rotate(-10deg)' },
  { label: 'PAIR',  imgRot: 'rotate(5deg) scaleX(-11)' },
  { label: 'SOLE',  imgRot: 'rotate(0deg)' },
];

// Individual transform for each angle on the main big shoe image
const ANGLE_TRANSFORMS = [
  'rotate(15deg)  translateY(-40px)',
  'rotate(-35deg) translateX(-50px)  translateY(-80px) scale(0.9)',
  'rotate(-50deg) translateX(-10px)  translateY(-30px) scale(0.8)',
];

const ARC_OFFSETS = [
  { x: 0, y: 0, rotate: 18  },  
  { x: 0, y: 0, rotate: 5   },  
  { x: 0, y: 0, rotate: -6  },
  { x: 0, y: 0, rotate: -17 },  
];

const SIZES = [
  { size: '36', available: true },
  { size: '37', available: true },
  { size: '38', available: false },
  { size: '39', available: true },
  { size: '40', available: true },
  { size: '41', available: true },
  { size: '42', available: false },
];

// Component 
export default function ProductNew() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const dispatch   = useDispatch();
  const wishIds    = useSelector(selectWishlistIds);
  const handleWishlistToggle = useWishlist();

  // Read initial color from navigation state 
  const initialColor = location.state?.colorId ?? 0;
  const [colorIdx, setColorIdx]     = useState(initialColor);
  const [angleIdx, setAngleIdx]     = useState(0);
  const [sizeIdx, setSizeIdx]       = useState(1);
  const [toast, setToast]           = useState(null);
  const [toastHiding, setToastHiding] = useState(false);

  const current = COLORS[colorIdx];
  const productId = `jumpman-${colorIdx}`;
  const isLiked = wishIds.includes(productId);

  const hexToFilter = (hex) => ({
    '#ff0000': 'invert(23%) sepia(89%) saturate(7491%) hue-rotate(359deg) brightness(104%) contrast(114%)',
    '#f5c500': 'invert(80%) sepia(80%) saturate(800%) hue-rotate(5deg) brightness(110%) contrast(110%)',
    '#8b00ff': 'invert(15%) sepia(100%) saturate(7000%) hue-rotate(270deg) brightness(90%) contrast(120%)',
    '#22dd22': 'invert(60%) sepia(80%) saturate(500%) hue-rotate(90deg) brightness(110%) contrast(110%)',
  })[hex] || 'none';

  // Sync CSS accent vars when color changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', current.accent);
    root.style.setProperty('--glow', current.glow);
    root.style.setProperty('--glow-pulse-1', current.glowPulse1);
    root.style.setProperty('--glow-pulse-2', current.glowPulse2);
    root.style.setProperty('--cart-filter', hexToFilter(current.accent));
  }, [colorIdx]);

  const changeColor = useCallback((idx) => {
    if (idx === colorIdx) return;
    const next = COLORS[idx];
    const root = document.documentElement;
    root.style.setProperty('--accent', next.accent);
    root.style.setProperty('--glow', next.glow);
    root.style.setProperty('--glow-pulse-1', next.glowPulse1);
    root.style.setProperty('--glow-pulse-2', next.glowPulse2);
    root.style.setProperty('--cart-filter', hexToFilter(next.accent));
    setColorIdx(idx);
  }, [colorIdx]);

  const showToast = useCallback((name, img) => {
    setToastHiding(false);
    setToast({ name, img });
    setTimeout(() => setToastHiding(true), 2500);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAddToCart = () => {
    const size = SIZES[sizeIdx].size;
    const item = {
      id:     productId,
      name:   `Jordan Jumpman 2026 PF (${current.name})`,
      img:    current.shoe,
      price:  134,
      color:  current.name,
      accent: current.accent,
      size:   size,
    };
    dispatch(addToCart(item));
    showToast(item.name, item.img);
  };

  const handleWishlist = () => handleWishlistToggle(productId);

  return (
    <div className="product-page">
      <div className="product-bg-text">JORDAN</div>

      <div className="pp-layout">

        {/* LEFT */}
        <aside className="pp-left">
          <button className="pp-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="11 6 5 12 11 18"/>
            </svg>
            BACK
          </button>

          <span className="pp-tagline">EXCLUSIVE / 2026 PF</span>
          <div className="pp-brand">JORDAN</div>
          <div className="pp-model">JUMPMAN 2026 PF</div>

          <div className="pp-price-row">
            <span className="pp-price">$134</span>
            <span className="pp-badge-exclusive">EXCLUSIVE</span>
          </div>

          <div className="pp-rating">
            <span className="pp-stars">
              {[1,2,3,4,5].map(i =>
                <span key={i} className={i <= 5 ? '' : 'pp-star-off'}>★</span>
              )}
            </span>
            <span className="pp-review-count">(124 REVIEWS)</span>
          </div>

          <div className="pp-section-label">COLOR — {current.name.toUpperCase()}</div>
          <div className="pp-colors">
            {COLORS.map((c, i) => (
              <div
                key={c.id}
                className={`pp-color-dot ${i === colorIdx ? 'active' : ''}`}
                style={{ background: c.accent }}
                onClick={() => changeColor(i)}
                title={c.name}
              />
            ))}
          </div>

          <div className="pp-section-label">SIZE — EU</div>
          <div className="pp-sizes">
            {SIZES.map((s, i) => (
              <button
                key={s.size}
                className={`pp-size-btn ${i === sizeIdx ? 'active' : ''} ${!s.available ? 'unavailable' : ''}`}
                onClick={() => s.available && setSizeIdx(i)}
                disabled={!s.available}
              >
                {s.size}
              </button>
            ))}
          </div>

          <div className="pp-actions">
            <button className="pp-btn-cart" onClick={handleAddToCart}>ADD TO CART</button>
            <button
              className={`pp-btn-wish ${isLiked ? 'liked' : ''}`}
              onClick={handleWishlist}
            >
              <svg viewBox="0 0 24 24" width="14" height="14"
                stroke="currentColor" fill={isLiked ? 'currentColor' : 'none'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isLiked ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
            </button>
          </div>

          <div className="pp-stats">
            <div className="pp-stat">
              <span className="pp-stat-val">FREE</span>
              <span className="pp-stat-lbl">SHIPPING</span>
            </div>
            <div className="pp-stat">
              <span className="pp-stat-val">30D</span>
              <span className="pp-stat-lbl">RETURNS</span>
            </div>
            <div className="pp-stat">
              <span className="pp-stat-val">2YR</span>
              <span className="pp-stat-lbl">WARRANTY</span>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="pp-center">
          <div className="pp-slash pp-slash-1" />
          <div className="pp-slash pp-slash-2" />
          <div className="pp-slash pp-slash-3" />

          {/* Main shoe */}
          <div className="pp-shoe-stage">
            <div className="pp-shoe-glow" />
            <div className="pp-shoe-float" style={{ transform: ANGLE_TRANSFORMS[angleIdx] }}>
              <img
                key={`${colorIdx}-${angleIdx}`}
                src={angleIdx === 0 ? current.shoe : COLOR_ANGLES[colorIdx][angleIdx]}
                alt={`Jordan Jumpman ${current.name}`}
                className="pp-shoe-main"
              />
            </div>
          </div>

          <div className="pp-angles-diagonal">
            {COLOR_ANGLES[colorIdx].map((src, i) => (
              <div
                key={i}
                className={`pp-diag-card ${i === angleIdx ? 'active' : ''}`}
                onClick={() => setAngleIdx(i)}
              >
                <div className="pp-diag-bg" />
                <img src={src} alt={ANGLE_LABELS[i]} className="pp-diag-img" />
                <span className="pp-diag-label">{ANGLE_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT */}
        <aside className="pp-right">
          <div className="pp-arc-selector">

            <svg className="pp-arc-svg" xmlns="http://www.w3.org/2000/svg" overflow="visible">
              {/*Shadow thick substrate */}
              <path
                d="M 120 20 Q 40 230 120 440"
                fill="none"
                stroke="rgba(60,60,60,0.5)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Main arc */}
              <path
                d="M 120 20 Q 40 230 120 440"
                fill="none"
                stroke="rgba(140,140,140,0.6)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Internal glare */}
              <path
                d="M 120 20 Q 40 230 120 440"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* zipper */}
            {(() => {
              const t = colorIdx / (COLORS.length - 1);
              const p0x=120, p0y=20, p1x=40, p1y=230, p2x=120, p2y=440;
              const bx=(1-t)*(1-t)*p0x+2*(1-t)*t*p1x+t*t*p2x;
              const by=(1-t)*(1-t)*p0y+2*(1-t)*t*p1y+t*t*p2y;
              // Card center
              const cardCx = bx - 110 + ARC_OFFSETS[colorIdx].x + 65;
              const cardCy = by - 43 + ARC_OFFSETS[colorIdx].y + 43;
              // Right edge taking the turn into account
              const rad = (ARC_OFFSETS[colorIdx].rotate * Math.PI) / 180;
              const rx = 35 * Math.cos(rad);
              const ry = 65 * Math.sin(rad);
              const zipperOffsetY = 0;
              return (
                <div className="pp-arc-zipper" style={{ left: cardCx + rx - 10, top: cardCy + ry - 10 + zipperOffsetY }} />
              );
            })()}

            {/* Cards by curve*/}
            {COLORS.map((c, i) => {
              const t = i / (COLORS.length - 1);
              const p0x=120, p0y=20, p1x=40, p1y=230, p2x=120, p2y=440;
              const bx=(1-t)*(1-t)*p0x+2*(1-t)*t*p1x+t*t*p2x;
              const by=(1-t)*(1-t)*p0y+2*(1-t)*t*p1y+t*t*p2y;
              const isActive = i === colorIdx;
              return (
                <div
                  key={c.id}
                  className={`pp-arc-item ${isActive ? 'active' : ''}`}
                  style={{ left: bx - 110 + ARC_OFFSETS[i].x, top: by - 43 + ARC_OFFSETS[i].y, transform: `rotate(${ARC_OFFSETS[i].rotate}deg)` }}
                  onClick={() => changeColor(i)}
                >
                  <div
                    className="pp-arc-card"
                    style={{
                      borderColor: isActive ? c.accent : 'rgba(255,255,255,0.1)',
                      boxShadow: isActive
                        ? `0 0 0 1px ${c.accent}, 0 0 24px ${c.glow}, 0 8px 32px rgba(0,0,0,0.6)`
                        : '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      className="pp-arc-card-glow"
                      style={{
                        background: `radial-gradient(ellipse at 30% 50%, ${c.glow} 0%, transparent 70%)`,
                        opacity: isActive ? 0.8 : 0.25,
                      }}
                    />
                    <img src={c.shoe} alt={c.name} />
                    <div className="pp-arc-color-bar" style={{ background: c.accent }} />
                  </div>
                  {isActive && (
                    <div className="pp-arc-label" style={{ color: c.accent }}>
                      {c.name.toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`home-toast ${toastHiding ? 'hiding' : ''}`}>
          <img className="home-toast-img" src={toast.img} alt={toast.name} />
          <div className="home-toast-body">
            <span className="home-toast-label">✓ ADDED TO CART</span>
            <span className="home-toast-name">{toast.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}