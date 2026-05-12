import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCart, toggleWishlist, selectWishlistIds } from '../store';
import { useWishlist } from '../hooks/useWishlist';
import { KIDS_PRODUCTS, FILTERS } from './K-products';
import './Kids.css';

const TRENDING = KIDS_PRODUCTS[1];

const POPULAR = [0, 1, 2, 13, 15, 16].map(i => KIDS_PRODUCTS[i]);

const DECORATIONS = ['✦', '★', '◆', '✿', '⬟'];

// Data for stars in hero 
const HERO_STARS = [
  // 1–50: right side, left: 55–99%
  { top:'10%', left:'58%',  color:'var(--kp-yellow)', size:'2.2rem', delay:'0.0s' },
  { top:' 6%', left:'65%',  color:'var(--kp-red)',    size:'1.4rem', delay:'0.3s' },
  { top:' 4%', left:'72%',  color:'var(--kp-pink)',   size:'1.0rem', delay:'0.6s' },
  { top:' 8%', left:'80%',  color:'var(--kp-green)',  size:'1.6rem', delay:'0.9s' },
  { top:' 5%', left:'88%',  color:'var(--kp-orange)', size:'1.2rem', delay:'0.2s' },
  { top:'12%', left:'93%',  color:'var(--kp-yellow)', size:'1.8rem', delay:'1.5s' },
  { top:'20%', left:'96%',  color:'var(--kp-red)',    size:'1.0rem', delay:'0.4s' },
  { top:'30%', left:'97%',  color:'var(--kp-pink)',   size:'1.4rem', delay:'1.8s' },
  { top:'40%', left:'95%',  color:'var(--kp-green)',  size:'1.1rem', delay:'0.7s' },
  { top:'50%', left:'94%',  color:'var(--kp-yellow)', size:'2.0rem', delay:'2.1s' },
  { top:'60%', left:'93%',  color:'var(--kp-orange)', size:'1.3rem', delay:'0.1s' },
  { top:'70%', left:'90%',  color:'var(--kp-red)',    size:'1.6rem', delay:'1.2s' },
  { top:'78%', left:'85%',  color:'var(--kp-pink)',   size:'1.0rem', delay:'2.4s' },
  { top:'84%', left:'78%',  color:'var(--kp-green)',  size:'1.4rem', delay:'0.5s' },
  { top:'88%', left:'70%',  color:'var(--kp-yellow)', size:'1.8rem', delay:'1.7s' },
  { top:'90%', left:'62%',  color:'var(--kp-orange)', size:'1.2rem', delay:'0.8s' },
  { top:'85%', left:'55%',  color:'var(--kp-red)',    size:'2.2rem', delay:'2.7s' },
  { top:'75%', left:'57%',  color:'var(--kp-pink)',   size:'1.0rem', delay:'0.2s' },
  { top:'63%', left:'56%',  color:'var(--kp-green)',  size:'1.5rem', delay:'1.4s' },
  { top:'52%', left:'57%',  color:'var(--kp-yellow)', size:'1.1rem', delay:'0.6s' },
  { top:'15%', left:'60%',  color:'var(--kp-orange)', size:'1.7rem', delay:'1.9s' },
  { top:' 2%', left:'63%',  color:'var(--kp-red)',    size:'1.3rem', delay:'0.3s' },
  { top:' 2%', left:'75%',  color:'var(--kp-pink)',   size:'2.0rem', delay:'2.2s' },
  { top:' 3%', left:'84%',  color:'var(--kp-yellow)', size:'1.0rem', delay:'0.9s' },
  { top:'18%', left:'98%',  color:'var(--kp-green)',  size:'1.6rem', delay:'1.1s' },
  { top:'35%', left:'99%',  color:'var(--kp-orange)', size:'1.2rem', delay:'2.5s' },
  { top:'55%', left:'98%',  color:'var(--kp-red)',    size:'1.8rem', delay:'0.4s' },
  { top:'72%', left:'95%',  color:'var(--kp-pink)',   size:'1.0rem', delay:'1.6s' },
  { top:'82%', left:'88%',  color:'var(--kp-yellow)', size:'2.4rem', delay:'0.0s' },
  { top:'92%', left:'80%',  color:'var(--kp-green)',  size:'1.3rem', delay:'2.0s' },
  { top:'94%', left:'68%',  color:'var(--kp-orange)', size:'1.5rem', delay:'0.7s' },
  { top:'93%', left:'57%',  color:'var(--kp-red)',    size:'1.1rem', delay:'1.3s' },
  { top:'22%', left:'55%',  color:'var(--kp-pink)',   size:'1.6rem', delay:'2.8s' },
  { top:'38%', left:'56%',  color:'var(--kp-yellow)', size:'1.0rem', delay:'0.5s' },
  { top:'55%', left:'59%',  color:'var(--kp-green)',  size:'1.4rem', delay:'1.0s' },
  { top:'70%', left:'58%',  color:'var(--kp-orange)', size:'1.2rem', delay:'2.3s' },
  { top:' 8%', left:'69%',  color:'var(--kp-red)',    size:'1.8rem', delay:'0.2s' },
  { top:'82%', left:'63%',  color:'var(--kp-pink)',   size:'1.1rem', delay:'1.6s' },
  { top:'45%', left:'97%',  color:'var(--kp-yellow)', size:'2.0rem', delay:'0.8s' },
  { top:'65%', left:'96%',  color:'var(--kp-green)',  size:'1.3rem', delay:'2.1s' },
  { top:'25%', left:'67%',  color:'var(--kp-orange)', size:'1.0rem', delay:'1.4s' },
  { top:'32%', left:'92%',  color:'var(--kp-red)',    size:'1.7rem', delay:'0.1s' },
  { top:'48%', left:'91%',  color:'var(--kp-pink)',   size:'1.3rem', delay:'2.6s' },
  { top:'58%', left:'88%',  color:'var(--kp-yellow)', size:'1.6rem', delay:'0.6s' },
  { top:'14%', left:'76%',  color:'var(--kp-green)',  size:'1.1rem', delay:'1.9s' },
  { top:'20%', left:'85%',  color:'var(--kp-orange)', size:'2.2rem', delay:'0.4s' },
  { top:'42%', left:'64%',  color:'var(--kp-red)',    size:'1.4rem', delay:'1.1s' },
  { top:'68%', left:'62%',  color:'var(--kp-pink)',   size:'1.0rem', delay:'2.9s' },
  { top:'78%', left:'68%',  color:'var(--kp-yellow)', size:'1.5rem', delay:'0.3s' },
  { top:'28%', left:'73%',  color:'var(--kp-green)',  size:'1.2rem', delay:'1.7s' },
  // 51–100: left side, left: 1–52%
  { top:' 4%', left:' 3%',  color:'var(--kp-yellow)', size:'1.8rem', delay:'0.5s' },
  { top:' 8%', left:'14%',  color:'var(--kp-red)',    size:'1.2rem', delay:'1.3s' },
  { top:' 5%', left:'28%',  color:'var(--kp-pink)',   size:'1.6rem', delay:'0.8s' },
  { top:' 3%', left:'42%',  color:'var(--kp-green)',  size:'1.0rem', delay:'2.1s' },
  { top:'12%', left:' 6%',  color:'var(--kp-orange)', size:'2.0rem', delay:'0.2s' },
  { top:'15%', left:'20%',  color:'var(--kp-yellow)', size:'1.3rem', delay:'1.6s' },
  { top:'18%', left:'36%',  color:'var(--kp-red)',    size:'1.7rem', delay:'0.4s' },
  { top:'10%', left:'48%',  color:'var(--kp-pink)',   size:'1.1rem', delay:'2.4s' },
  { top:'22%', left:' 2%',  color:'var(--kp-green)',  size:'1.5rem', delay:'0.9s' },
  { top:'25%', left:'15%',  color:'var(--kp-orange)', size:'1.0rem', delay:'1.1s' },
  { top:'28%', left:'32%',  color:'var(--kp-yellow)', size:'2.2rem', delay:'0.6s' },
  { top:'20%', left:'46%',  color:'var(--kp-red)',    size:'1.4rem', delay:'2.7s' },
  { top:'35%', left:' 5%',  color:'var(--kp-pink)',   size:'1.2rem', delay:'0.1s' },
  { top:'38%', left:'22%',  color:'var(--kp-green)',  size:'1.8rem', delay:'1.9s' },
  { top:'32%', left:'40%',  color:'var(--kp-orange)', size:'1.0rem', delay:'0.7s' },
  { top:'30%', left:'50%',  color:'var(--kp-yellow)', size:'1.6rem', delay:'2.2s' },
  { top:'45%', left:' 3%',  color:'var(--kp-red)',    size:'1.3rem', delay:'0.3s' },
  { top:'42%', left:'18%',  color:'var(--kp-pink)',   size:'2.0rem', delay:'1.5s' },
  { top:'48%', left:'35%',  color:'var(--kp-green)',  size:'1.1rem', delay:'0.0s' },
  { top:'44%', left:'50%',  color:'var(--kp-orange)', size:'1.7rem', delay:'2.6s' },
  { top:'55%', left:' 6%',  color:'var(--kp-yellow)', size:'1.4rem', delay:'0.8s' },
  { top:'58%', left:'24%',  color:'var(--kp-red)',    size:'1.0rem', delay:'1.2s' },
  { top:'52%', left:'42%',  color:'var(--kp-pink)',   size:'1.8rem', delay:'0.5s' },
  { top:'60%', left:'51%',  color:'var(--kp-green)',  size:'1.2rem', delay:'2.0s' },
  { top:'65%', left:' 2%',  color:'var(--kp-orange)', size:'2.4rem', delay:'0.4s' },
  { top:'68%', left:'16%',  color:'var(--kp-yellow)', size:'1.0rem', delay:'1.8s' },
  { top:'62%', left:'34%',  color:'var(--kp-red)',    size:'1.5rem', delay:'0.1s' },
  { top:'70%', left:'48%',  color:'var(--kp-pink)',   size:'1.3rem', delay:'2.9s' },
  { top:'75%', left:' 8%',  color:'var(--kp-green)',  size:'1.6rem', delay:'0.6s' },
  { top:'78%', left:'26%',  color:'var(--kp-orange)', size:'1.1rem', delay:'1.4s' },
  { top:'72%', left:'44%',  color:'var(--kp-yellow)', size:'2.0rem', delay:'0.2s' },
  { top:'80%', left:'52%',  color:'var(--kp-red)',    size:'1.4rem', delay:'2.3s' },
  { top:'84%', left:' 4%',  color:'var(--kp-pink)',   size:'1.2rem', delay:'0.9s' },
  { top:'86%', left:'20%',  color:'var(--kp-green)',  size:'1.8rem', delay:'1.7s' },
  { top:'82%', left:'38%',  color:'var(--kp-orange)', size:'1.0rem', delay:'0.3s' },
  { top:'88%', left:'50%',  color:'var(--kp-yellow)', size:'1.6rem', delay:'2.5s' },
  { top:'92%', left:' 6%',  color:'var(--kp-red)',    size:'1.3rem', delay:'0.7s' },
  { top:'90%', left:'24%',  color:'var(--kp-pink)',   size:'2.2rem', delay:'1.0s' },
  { top:'94%', left:'40%',  color:'var(--kp-green)',  size:'1.1rem', delay:'0.4s' },
  { top:'96%', left:'52%',  color:'var(--kp-orange)', size:'1.5rem', delay:'2.8s' },
  { top:' 7%', left:'52%',  color:'var(--kp-yellow)', size:'1.7rem', delay:'0.6s' },
  { top:'16%', left:'10%',  color:'var(--kp-red)',    size:'1.2rem', delay:'1.3s' },
  { top:'26%', left:'44%',  color:'var(--kp-pink)',   size:'1.9rem', delay:'0.0s' },
  { top:'36%', left:'12%',  color:'var(--kp-green)',  size:'1.0rem', delay:'2.2s' },
  { top:'50%', left:'28%',  color:'var(--kp-orange)', size:'1.4rem', delay:'0.8s' },
  { top:'56%', left:'10%',  color:'var(--kp-yellow)', size:'1.1rem', delay:'1.6s' },
  { top:'40%', left:' 8%',  color:'var(--kp-red)',    size:'2.0rem', delay:'0.3s' },
  { top:'76%', left:'36%',  color:'var(--kp-pink)',   size:'1.3rem', delay:'2.4s' },
  { top:'87%', left:'10%',  color:'var(--kp-green)',  size:'1.6rem', delay:'0.5s' },
  { top:'95%', left:'18%',  color:'var(--kp-orange)', size:'1.0rem', delay:'1.9s' },
];

const STAR_CHARS = ['✦', '★', '✸'];

const COLORS = [
  'var(--kp-yellow)', 'var(--kp-red)', 'var(--kp-pink)',
  'var(--kp-green)',  'var(--kp-blue)', 'var(--kp-orange)',
];
const SIZES = ['0.9rem', '1.1rem', '1.3rem', '1.6rem', '2.0rem'];

/** Generates N stars evenly around the perimeter with a small random offset.
 * offset — how far from the edge (in % of the container size).
 */
function makePerimeterStars(count = 28, offset = 8, seed = 42) {
  // simple seeded pseudo-random so that it does not change on re-render
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };

  const stars = [];
  for (let i = 0; i < count; i++) {
    const t = i / count; // 0..1 around the perimeter
    const jitter = (rand() - 0.5) * 10; // ±5% chaos
    const dist = offset + rand() * 4;   // distance from the edge

    let top, left;
    if      (t < 0.25) { top = -dist;       left = (t / 0.25) * 100 + jitter; }  // up
    else if (t < 0.50) { top  = ((t - 0.25) / 0.25) * 100 + jitter; left = 100 + dist; } // right
    else if (t < 0.75) { top  = 100 + dist; left = (1 - (t - 0.50) / 0.25) * 100 + jitter; } // down
    else               { top  = (1 - (t - 0.75) / 0.25) * 100 + jitter; left = -dist; } // left

    stars.push({
      top:   `${top.toFixed(1)}%`,
      left:  `${left.toFixed(1)}%`,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      size:  SIZES[Math.floor(rand() * SIZES.length)],
      delay: `${(rand() * 2.5).toFixed(2)}s`,
      char:  STAR_CHARS[Math.floor(rand() * STAR_CHARS.length)],
    });
  }
  return stars;
}

const TRENDING_STARS = makePerimeterStars(28, 8);

/** Universal star component.
 * @param {Array}  stars  — мarray of objects { top, left, color, size, delay }
 * @param {string} chars  — a string of alternating characters 
 */
const FloatingStars = ({ stars, chars = STAR_CHARS }) => (
  <>
    {stars.map((s, i) => (
      <span
        key={i}
        className="kp-deco"
        style={{
          top: s.top,
          left: s.left,
          color: s.color,
          fontSize: s.size,
          animationDelay: s.delay,
        }}
      >
        {s.char ?? chars[i % chars.length]}
      </span>
    ))}
  </>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="16" height="16"
    stroke="currentColor" fill={filled ? 'currentColor' : 'none'} strokeWidth="2.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function KidsPage() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(() => location.state?.activeFilter ?? 'ALL');
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);

  React.useEffect(() => {
    if (location.state?.scrollY != null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: location.state.scrollY, behavior: 'instant' });
      });
    }
  }, []);

  const goToProduct = (id) => {
    navigate(`/product/${id}`, {
      state: { returnTo: '/kids', scrollY: window.scrollY, activeFilter },
    });
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

  const handleWishlist = useWishlist();

  const filtered = activeFilter === 'ALL'
    ? KIDS_PRODUCTS
    : activeFilter === 'SALE'
      ? KIDS_PRODUCTS.filter(p => p.category === 'SALE' || p.badge?.includes('%'))
      : KIDS_PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="kp-root">

      {/* HERO */}
      <section className="kp-hero">
        {/* bg squiggles */}
        <div className="kp-hero-blob kp-hero-blob--yellow" />
        <div className="kp-hero-blob kp-hero-blob--pink" />
        <div className="kp-hero-blob kp-hero-blob--blue" />

        {/* floating stars */}
        <FloatingStars stars={HERO_STARS} />

        <div className="kp-hero-inner">
          <div className="kp-hero-text">
            <div className="kp-hero-eyebrow">SS 2026 / KIDS COLLECTION</div>
            <h1 className="kp-hero-title">
              <span className="kp-hero-title--red">THE</span> <span className="kp-hero-title--red">NEW</span><br/>
              <span className="kp-hero-title--outline">SNEAKERS</span><br/>
              <span className="kp-hero-title--white">COLLECTION</span>
            </h1>
            <p className="kp-hero-desc">
              At Jordan, each shoe is built with authentic technology<br/>
              that feels fresh and stays flawless — made for little legends.
            </p>
            <button
              className="kp-hero-cta"
              onClick={() => document.querySelector('.kp-collection').scrollIntoView({ behavior: 'smooth' })}
            >
              START →
            </button>
          </div>

          <div className="kp-hero-img-wrap">
            <div className="kp-hero-img-bg" />
            <img src="/kids/kids.png" alt="Kids sneaker hero" className="kp-hero-img" />
          </div>

          <div className="kp-hero-badge-wrap">
            <div className="kp-hero-badge">
              <span>All Products</span>
              <span className="kp-hero-badge-sub">All</span>
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="kp-stats-bar">
          <div className="kp-stat-item">
            <span className="kp-stat-num">22M+</span>
            <span className="kp-stat-label">USER TRUST US</span>
          </div>
          <div className="kp-stat-divider" />
          <div className="kp-stat-item">
            <span className="kp-stat-num">30K+</span>
            <span className="kp-stat-label">BRAND VISION</span>
          </div>
          <div className="kp-stat-divider" />
          <div className="kp-stat-item">
            <span className="kp-stat-num">6K+</span>
            <span className="kp-stat-label">AWARDS</span>
          </div>
        </div>
      </section>

      {/* TRENDING SHOE OF THE DAY */}
      <section className="kp-trending">
        <div className="kp-trending-img-col">
          <div className="kp-trending-img-card">
            <img src={TRENDING.img} alt={TRENDING.name} />
            <div className="kp-trending-img-accent" />
          </div>
        </div>
        <div className="kp-trending-text">
          <h2 className="kp-trending-title">
            TRENDING<br/>
            SHOES OF<br/>
            <span className="kp-trending-title--outline">THE DAY</span>
          </h2>
          <p className="kp-trending-desc">
            At Jordan, each shoe is built with authentic German Technology<br/>
            that uses Injection Molding techniques. This process ensures that<br/>
            each shoe looks, feels and stays flawless for a long period of time.
          </p>
          <button className="kp-btn-primary" onClick={() => document.querySelector('.kp-popular').scrollIntoView({ behavior: 'smooth' })}>START →</button>
        </div>
      </section>

      {/* TOP COLLECTION */}
      <section className="kp-collection">
        <div className="kp-collection-header">
          <h2 className="kp-collection-title">
            TOP<br/>
            <span className="kp-collection-rainbow">
              <span className="kp-cl--red">C</span><span className="kp-cl--yellow">O</span><span className="kp-cl--blue">L</span><span className="kp-cl--white">L</span><span className="kp-cl--red">E</span><span className="kp-cl--yellow">C</span><span className="kp-cl--blue">T</span><span className="kp-cl--white">I</span><span className="kp-cl--red">O</span><span className="kp-cl--yellow">N</span>
            </span>
          </h2>
          <div className="kp-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`kp-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <span className="kp-deco kp-deco-c1">✦</span>
        <span className="kp-deco kp-deco-c2">★</span>

        <div className="kp-grid">
          {filtered.map((p, i) => {
            const liked = wishlistIds.includes(p.id);
            const rotations = [-3, 0, 2, -2, 3, 0, -1, 2, -3];
            return (
              <div
                key={p.id}
                className={`kp-card kp-card--${i % 3 === 1 ? 'accent' : i % 3 === 2 ? 'alt' : 'base'}`}
                style={{ '--card-rot': `${rotations[i % rotations.length]}deg` }}
              >
                <div className="kp-card-img-wrap" style={{ cursor: 'pointer' }}
                  onClick={() => goToProduct(p.id)}>
                  {p.badge && <span className="kp-badge">{p.badge}</span>}
                  <button
                    className={`kp-heart ${liked ? 'liked' : ''}`}
                    onClick={(e) => handleWishlist(p.id, e)}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                  <img src={p.img} alt={p.name} className="kp-card-img" />
                </div>
                <div className="kp-card-info">
                  <p className="kp-card-name" style={{ cursor: 'pointer' }}
                    onClick={() => goToProduct(p.id)}>{p.name}</p>
                  <p className="kp-card-sub">{p.sub}</p>
                  <div className="kp-card-bottom">
                    <span className="kp-card-price">${p.price}</span>
                    <button
                      className="kp-explore-btn"
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MOST POPULAR */}
      <section className="kp-popular">
        <div className="kp-popular-header">
          <h2 className="kp-popular-title">MOST POPULAR</h2>
          <p className="kp-popular-desc">Here's our most popular collection. People tend to love whatever is in here.</p>
        </div>

        <div className="kp-popular-grid">
          {POPULAR.map((p, i) => {
            const liked = wishlistIds.includes(p.id);
            const accents = ['kp-pop-card--yellow', 'kp-pop-card--green', 'kp-pop-card--orange', 'kp-pop-card--blue', 'kp-pop-card--pink', 'kp-pop-card--yellow'];
            return (
              <div key={p.id} className={`kp-pop-card ${accents[i]}`}>
                <div className="kp-pop-img-wrap" style={{ cursor: 'pointer' }}
                  onClick={() => goToProduct(p.id)}>
                  <img src={p.img} alt={p.name} />
                  <button
                    className={`kp-heart kp-pop-heart ${liked ? 'liked' : ''}`}
                    onClick={(e) => handleWishlist(p.id, e)}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                </div>
                <div className="kp-pop-info">
                  <p className="kp-pop-name" style={{ cursor: 'pointer' }}
                    onClick={() => goToProduct(p.id)}>{p.name}</p>
                  <div className="kp-pop-bottom">
                    <span className="kp-pop-price">${p.price}</span>
                    <button
                      className="kp-explore-btn kp-explore-btn--sm"
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SIZE STRIP */}
      <section className="kp-size-strip">
        <div className="kp-size-inner">
          <div className="kp-size-left">
            <span className="kp-size-eyebrow">FIND YOUR FIT</span>
            <h3 className="kp-size-title">NOT SURE ON SIZE?</h3>
          </div>
          <div className="kp-size-chips">
            {[
              { s: '29', insole: '20.0' },
              { s: '30', insole: '20.5' },
              { s: '31', insole: '21.0' },
              { s: '32', insole: '21.5' },
              { s: '33', insole: '22.0' },
              { s: '34', insole: '22.5' },
              { s: '35', insole: '23.0' },
            ].map(({ s, insole }) => (
              <div key={s} className="kp-size-chip">
                {s}
                <div className="kp-size-tooltip">
                  <span className="kp-size-tooltip-label">INSOLE</span>
                  <span className="kp-size-tooltip-val">{insole} cm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div className={`kp-toast ${toastHiding ? 'hiding' : ''}`}>
          <img src={toast.img} alt={toast.name} className="kp-toast-img" />
          <div className="kp-toast-body">
            <span className="kp-toast-label">✓ ADDED TO CART</span>
            <span className="kp-toast-name">{toast.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}