import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  // wishlist
  toggleWishlist, clearWishlist, setWishlistOpen,
  selectWishlistIds, selectIsWishlisted, selectWishlistCount, selectWishlistOpen,
  // cart
  addToCart, removeFromCart, updateQty, setItemSize, clearCart, setCartOpen,
  selectCartItems, selectCartOpen, selectCartCount, selectCartTotal,
} from './store';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import WomenPage from './pages/Women';

//Product catalogue
const PRODUCTS = [
  { id: 1, img: '/shoes/bs-1.png', name: 'Jordan Retro High OG',  price: 180, stars: 5, reviews: 124 },
  { id: 2, img: '/shoes/bs-2.png', name: 'Jordan Air Max 200',     price: 160, stars: 5, reviews: 88  },
  { id: 3, img: '/shoes/bs-3.png', name: 'Jordan Zion 2',          price: 140, sale: 200, badge: '-30%', stars: 4, reviews: 63 },
  { id: 4, img: '/shoes/bs-4.png', name: 'Jordan Luka 1',          price: 120, stars: 5, reviews: 97  },
  { id: 5, img: '/shoes/bs-5.png', name: 'Jordan Why Not .5',      price: 130, sale: 190, badge: '-32%', stars: 4, reviews: 75 },
  { id: 6, img: '/shoes/bs-6.png', name: 'Jordan Stadium 90',      price: 110, stars: 5, reviews: 54  },
];

//Icons
function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16"
      stroke="currentColor" fill={filled ? 'currentColor' : 'none'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CloseIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

//Wishlist Drawer
function WishlistDrawer({ onClose }) {
  const dispatch  = useDispatch();
  const wishIds   = useSelector(selectWishlistIds);
  const cartItems = useSelector(selectCartItems);
  const items     = PRODUCTS.filter(p => wishIds.includes(p.id));

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddToCart = (p) => {
    dispatch(addToCart({ id: p.id, name: p.name, img: p.img, price: p.price }));
  };

  const isInCart = (id) => cartItems.some(i => i.id === id);

  return (
    <>
      <div className="wl-backdrop" onClick={onClose} />
      <aside className="wl-drawer">

        <div className="wl-head">
          <div className="wl-head-left">
            <HeartIcon filled />
            <span className="wl-title">WISHLIST</span>
            <span className="wl-count">{items.length}</span>
          </div>
          <button className="wl-close" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="wl-rule" />

        <div className="wl-list">
          {items.length === 0 ? (
            <div className="wl-empty">
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor"
                fill="none" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p>YOUR WISHLIST IS EMPTY</p>
              <span>Tap ♥ on any shoe to save it here</span>
            </div>
          ) : items.map(p => (
            <div className="wl-item" key={p.id}>
              <div className="wl-item-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="wl-item-info">
                <p className="wl-item-name">{p.name}</p>
                <div className="wl-item-price-row">
                  <span className="wl-item-price">${p.price}</span>
                  {p.sale && <span className="wl-item-old">${p.sale}</span>}
                  {p.badge && <span className="wl-item-badge">{p.badge}</span>}
                </div>
                <div className="wl-item-stars">
                  {[1,2,3,4,5].map(i =>
                    <span key={i} className={i <= p.stars ? 'star-on' : 'star-off'}>★</span>
                  )}
                  <span className="wl-item-reviews">({p.reviews})</span>
                </div>
                <button
                  className={`wl-item-cart ${isInCart(p.id) ? 'in-cart' : ''}`}
                  onClick={() => handleAddToCart(p)}
                >
                  {isInCart(p.id) ? '✓ IN CART' : 'ADD TO CART'}
                </button>
              </div>
              <button className="wl-item-remove"
                onClick={() => dispatch(toggleWishlist(p.id))}>
                <CloseIcon size={14} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="wl-footer">
            <button className="wl-cart-all"
              onClick={() => items.forEach(p => handleAddToCart(p))}>
              ADD ALL TO CART
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

//Cart Drawer
const SIZES = [36, 37, 38, 39, 40, 41];

function CartDrawer() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const open     = useSelector(selectCartOpen);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') dispatch(setCartOpen(false)); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="wl-backdrop" onClick={() => dispatch(setCartOpen(false))} />
      <aside className="wl-drawer cart-drawer">

        <div className="wl-head">
          <div className="wl-head-left">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="wl-title">CART</span>
            <span className="wl-count">{items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <button className="wl-close" onClick={() => dispatch(setCartOpen(false))}>
            <CloseIcon />
          </button>
        </div>

        <div className="wl-rule" />

        <div className="wl-list">
          {items.length === 0 ? (
            <div className="wl-empty">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>YOUR CART IS EMPTY</p>
              <span>Add some shoes to get started</span>
            </div>
          ) : items.map(item => (
            <div className="wl-item" key={`${item.id}-${item.color || 'default'}`}>

              <div className="wl-item-img">
                <img src={item.img} alt={item.name} />
                {item.color && (
                  <div className="cart-item-color-badge"
                    style={{ background: item.accent }} title={item.color} />
                )}
              </div>

              <div className="wl-item-info">
                <p className="wl-item-name">{item.name}</p>
                <span className="wl-item-price">${item.price}</span>

                {/* Size selection */}
                <div className="cart-size-row">
                  <span className="cart-size-label">SIZE</span>
                  <div className="cart-size-options">
                    {SIZES.map(s => (
                      <button
                        key={s}
                        className={`cart-size-btn ${item.size === s ? 'active' : ''}`}
                        onClick={() => dispatch(setItemSize({
                          id: item.id, color: item.color, size: s
                        }))}
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty controls */}
                <div className="cart-qty">
                  <button className="cart-qty-btn"
                    onClick={() => dispatch(updateQty({
                      id: item.id, color: item.color, qty: item.qty - 1
                    }))}>−</button>
                  <span className="cart-qty-val">{item.qty}</span>
                  <button className="cart-qty-btn"
                    onClick={() => dispatch(updateQty({
                      id: item.id, color: item.color, qty: item.qty + 1
                    }))}>+</button>
                </div>

                <span className="cart-subtotal">
                  Subtotal: <strong>${item.price * item.qty}</strong>
                </span>
              </div>

              <button className="wl-item-remove"
                onClick={() => dispatch(removeFromCart({ id: item.id, color: item.color }))}>
                <CloseIcon size={14} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="wl-footer">
            <div className="cart-total">
              <span>TOTAL</span>
              <span className="cart-total-amount">${total}</span>
            </div>
            <button className="wl-cart-all">CHECKOUT →</button>
            <button className="cart-clear" onClick={() => dispatch(clearCart())}>
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

//Best Selling 
const PER_PAGE = 4;

function BestSelling() {
  const dispatch   = useDispatch();
  const wishIds    = useSelector(selectWishlistIds);
  const [offset, setOffset] = useState(0);

  const GAP    = 1.5;
  const maxOff = PRODUCTS.length - PER_PAGE;
  const prev   = () => setOffset(o => Math.max(0, o - 1));
  const next   = () => setOffset(o => Math.min(maxOff, o + 1));
  const canPrev = offset > 0;
  const canNext = offset < maxOff;
  const translateX = `calc(-${offset} * (25% + ${GAP}rem))`;

  return (
    <section className="best-selling">
      <div className="bs-header">
        <div className="bs-header-left">
          <span className="bs-tagline">TOP PICKS / SEASON 2021</span>
          <h2 className="bs-title">BEST <span className="bs-accent">SELL</span>ING</h2>
        </div>
        <div className="bs-header-right">
          <div className="bs-nav">
            <button className={`bs-nav-btn ${canPrev ? '' : 'disabled'}`}
              onClick={prev} disabled={!canPrev}>
              <svg viewBox="0 0 56 16" width="56" height="16" fill="none">
                <line x1="54" y1="8" x2="2" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="10,2 2,8 10,14" stroke="currentColor" strokeWidth="1.5"
                  fill="none" strokeLinejoin="miter"/>
              </svg>
              <span>PREV</span>
            </button>
            <button className={`bs-nav-btn ${canNext ? '' : 'disabled'}`}
              onClick={next} disabled={!canNext}>
              <span>NEXT</span>
              <svg viewBox="0 0 56 16" width="56" height="16" fill="none">
                <line x1="2" y1="8" x2="54" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="46,2 54,8 46,14" stroke="currentColor" strokeWidth="1.5"
                  fill="none" strokeLinejoin="miter"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bs-viewport">
        <div className="bs-track" style={{ transform: `translateX(${translateX})` }}>
          {PRODUCTS.map((p) => {
            const isLiked = wishIds.includes(p.id);
            return (
              <div className="bs-card" key={p.id}
                style={{ width: `calc(25% - ${GAP * (PER_PAGE - 1) / PER_PAGE}rem)` }}>
                <div className="bs-img-wrap">
                  {p.badge && <span className="bs-badge">{p.badge}</span>}
                  <button
                    className={`bs-heart ${isLiked ? 'liked' : ''}`}
                    onClick={() => dispatch(toggleWishlist(p.id))}
                  >
                    <HeartIcon filled={isLiked} />
                  </button>
                  <img src={p.img} alt={p.name} className="bs-img" />
                  <div className="bs-cart-overlay">
                    <button className="bs-cart-btn"
                      onClick={() => dispatch(addToCart({
                        id: p.id, name: p.name, img: p.img, price: p.price
                      }))}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
                <div className="bs-info">
                  <p className="bs-name">{p.name}</p>
                  <div className="bs-price-row">
                    <span className="bs-price">${p.price}</span>
                    {p.sale && <span className="bs-old">${p.sale}</span>}
                  </div>
                  <div className="bs-rating">
                    <span className="bs-stars">
                      {[1,2,3,4,5].map(i =>
                        <span key={i} className={i <= p.stars ? 'star-on' : 'star-off'}>★</span>
                      )}
                    </span>
                    <span className="bs-reviews">({p.reviews})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bs-progress-track">
        <div className="bs-progress-fill"
          style={{ width: `${((offset + PER_PAGE) / PRODUCTS.length) * 100}%` }} />
      </div>

      <button className="bs-shop-now-btn">SHOP NOW</button>
    </section>
  );
}

//Categories Grid 
const CATEGORIES = [
  { label: 'MAN',   img: '/categories/man.jpg',   sub: 'New arrivals', pos: 'center 65%', path: '/men'   },
  { label: 'WOMEN', img: '/categories/women.jpg', sub: 'Latest drops',  pos: 'center 75%', path: '/women' },
  { label: 'KIDS',  img: '/categories/kids.png',  sub: 'Fresh styles',  pos: 'center 60%', path: '/kids'  },
  { label: 'SALE',  img: '/categories/sale.jpg',  sub: 'Up to -40%',   pos: 'center 40%', path: '/sale',  isSale: true },
];

function Categories() {
  const navigate = useNavigate();
  return (
    <section className="cat-section">
      <div className="cat-header">
        <span className="cat-tagline">EXPLORE / COLLECTIONS</span>
        <h2 className="cat-title">SHOP BY <span className="cat-accent">CATEGORY</span></h2>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map(cat => (
          <div
            key={cat.label}
            className={`cat-item ${cat.isSale ? 'cat-item--sale' : ''}`}
            onClick={() => navigate(cat.path)}
            style={{ cursor: 'pointer' }}
          >
            <img src={cat.img} alt={cat.label} className="cat-img"
              style={{ objectPosition: cat.pos }} />
            <div className="cat-overlay" />
            {cat.isSale && <div className="cat-sale-badge">-40%</div>}
            <div className="cat-content">
              <span className="cat-sub">{cat.sub}</span>
              <h3 className="cat-label">{cat.label}</h3>
              <div className="cat-line" />
            </div>
            <div className="cat-hover-btn">EXPLORE →</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const dispatch     = useDispatch();
  const wishlistOpen = useSelector(selectWishlistOpen);

  const [selectedColor, setSelectedColor] = useState(0);

  const colors = [
    { id: 0, name: 'Red',    shoe: '/shoes/1.png',   accent: '#ff0000', glow: 'rgba(255,0,0,0.3)',    glowPulse1: 'rgba(255,0,0,0.5)',   glowPulse2: 'rgba(255,0,0,0.8)' },
    { id: 1, name: 'Yellow', shoe: '/shoes/s-y.png', accent: '#f5c500', glow: 'rgba(245,197,0,0.3)',  glowPulse1: 'rgba(245,197,0,0.5)', glowPulse2: 'rgba(245,197,0,0.8)' },
    { id: 2, name: 'Purple', shoe: '/shoes/s-v.png', accent: '#8b00ff', glow: 'rgba(139,0,255,0.3)', glowPulse1: 'rgba(139,0,255,0.5)', glowPulse2: 'rgba(139,0,255,0.8)' },
    { id: 3, name: 'Green',  shoe: '/shoes/s-g.png', accent: '#22dd22', glow: 'rgba(34,221,34,0.3)', glowPulse1: 'rgba(34,221,34,0.5)', glowPulse2: 'rgba(34,221,34,0.8)' },
  ];

  const current = colors[selectedColor];

  const hexToFilter = (hex) => ({
    '#ff0000': 'invert(23%) sepia(89%) saturate(7491%) hue-rotate(359deg) brightness(104%) contrast(114%)',
    '#f5c500': 'invert(80%) sepia(80%) saturate(800%) hue-rotate(5deg) brightness(110%) contrast(110%)',
    '#8b00ff': 'invert(15%) sepia(100%) saturate(7000%) hue-rotate(270deg) brightness(90%) contrast(120%)',
    '#22dd22': 'invert(60%) sepia(80%) saturate(500%) hue-rotate(90deg) brightness(110%) contrast(110%)',
  })[hex] || 'none';

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', current.accent);
    root.style.setProperty('--glow', current.glow);
    root.style.setProperty('--glow-pulse-1', current.glowPulse1);
    root.style.setProperty('--glow-pulse-2', current.glowPulse2);
    root.style.setProperty('--cart-filter', hexToFilter(current.accent));
  }, [selectedColor]);

  return (
    <>
      {/* Hero */}
        <section className="hero-section">
          <svg className="bg-jordan-text" viewBox="0 0 1000 200"
            preserveAspectRatio="none" aria-hidden="true">
            <text x="500" y="175" textAnchor="middle"
              fontFamily="'Archivo Black', sans-serif" fontWeight="900"
              fontSize="210" fill="#1a1a1a" letterSpacing="-2">JORDAN</text>
          </svg>
  
          <div className="bg-decoration">
            <div className="bg-line bg-line-1"/>
            <div className="bg-line bg-line-2"/>
            <div className="bg-line bg-line-3"/>
          </div>
  
          <div className="year-badge-top">2021 PF</div>
  
          <h1 className="shoe-label">
            <div className="jump-text">Jump</div>
            <div className="man-text">man</div>
          </h1>
  
          <p className="subtitle subtitle-left">Basketball</p>
          <p className="subtitle subtitle-right">Shoes</p>
  
          <div className="main-content">
            <div className="left-section">
              <div className="color-selector">
                <div className="color-label">CHOOSE COLOR :</div>
                <div className="color-options">
                  {colors.map((color) => (
                    <div key={color.id}
                      className={`color-option ${selectedColor === color.id ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color.id)}>
                      <img src={color.shoe} alt={`Color ${color.name}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="button-group">
                <button className="btn btn-primary"
                  onClick={() => dispatch(addToCart({
                    id: `jumpman-${selectedColor}`,
                    name: `Jordan Jumpman 2021 PF (${current.name})`,
                    img: current.shoe,
                    price: 134,
                    color: current.name,
                    accent: current.accent,
                  }))}>
                  ADD TO CART
                </button>
                <button className="btn btn-secondary">BUY NOW</button>
              </div>
            </div>
  
            <div className="right-section">
              <div className="shoe-display">
                <img src={current.shoe} alt="Jordan Jumpman 2021 PF" className="shoe-image" />
              </div>
            </div>
          </div>
  
          <div className="product-info">
            <span className="exclusive-badge">exclusive</span>
            <div className="product-name">JORDAN</div>
            <div className="product-name">JUMPMAN 2021 PF</div>
            <div className="price">134$</div>
          </div>
  
          <div className="pagination">
            {colors.map((color) => (
              <div key={color.id}
                className={`dot ${selectedColor === color.id ? 'active' : ''}`}
                style={selectedColor === color.id ? { background: color.accent } : {}}
                onClick={() => setSelectedColor(color.id)}
              />
            ))}
          </div>
        </section>
  
        <BestSelling />
        <Categories />
    </>
  );
}

export default function App() {
  const dispatch     = useDispatch();
  const wishlistOpen = useSelector(selectWishlistOpen);

  return (
    <div className="jordan-container">
      {wishlistOpen && (
        <WishlistDrawer onClose={() => dispatch(setWishlistOpen(false))} />
      )}
      <CartDrawer />
      <Header />
      <Routes>
        <Route path="/"      element={<HomePage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/men"   element={<div style={{padding:'200px 4rem',color:'white',fontFamily:'Space Mono',minHeight:'100vh',background:'#0a0a0a'}}>MEN — COMING SOON</div>} />
        <Route path="/kids"  element={<div style={{padding:'200px 4rem',color:'white',fontFamily:'Space Mono',minHeight:'100vh',background:'#0a0a0a'}}>KIDS — COMING SOON</div>} />
        <Route path="/sale"  element={<div style={{padding:'200px 4rem',color:'white',fontFamily:'Space Mono',minHeight:'100vh',background:'#0a0a0a'}}>SALE — COMING SOON</div>} />
      </Routes>
      <Footer />
    </div>
  );
}