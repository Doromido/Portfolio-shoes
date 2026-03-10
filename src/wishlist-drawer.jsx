import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleWishlist,
  setWishlistOpen,
  selectWishlistIds,
  selectWishlistOpen,
  addToCart,
  selectCartItems,
} from './store';
import { WOMEN_PRODUCTS } from './pages/W-products.js';
import { MEN_PRODUCTS } from './pages/M-products.js';
import { KIDS_PRODUCTS } from './pages/K-products.js';

// HOME-only product
const HOME_ONLY = [
  { id: 'h4', img: '/shoes/bs-4.png', name: 'Jordan Luka 1', price: 120, stars: 5, reviews: 97 },
];

// Jumpman 2026 PF — ProductPage colors (ids match productId = `jumpman-${colorIdx}`)
const JUMPMAN_PRODUCTS = [
  { id: 'jumpman-0', img: '/shoes/1.png',   name: 'Jordan Jumpman 2026 PF — Red',    price: 134, stars: 5, reviews: 124 },
  { id: 'jumpman-1', img: '/shoes/s-y.png', name: 'Jordan Jumpman 2026 PF — Yellow', price: 134, stars: 5, reviews: 124 },
  { id: 'jumpman-2', img: '/shoes/s-v.png', name: 'Jordan Jumpman 2026 PF — Purple', price: 134, stars: 5, reviews: 124 },
  { id: 'jumpman-3', img: '/shoes/s-g.png', name: 'Jordan Jumpman 2026 PF — Green',  price: 134, stars: 5, reviews: 124 },
];

// WOMEN catalogue (covers w1–w18, includes shared models w1–w6)
const WOMEN_NORMALISED = WOMEN_PRODUCTS.map(p => ({ ...p, id: `w${p.id}` }));

// MEN catalogue (covers m1–m18)
const MEN_NORMALISED = MEN_PRODUCTS.map(p => ({ ...p, id: `m${p.id}` }));

// KIDS catalogue — ids already have 'k' prefix (k1–k18)
const KIDS_NORMALISED = KIDS_PRODUCTS.map(p => ({ ...p }));

// Unified catalogue 
const ALL_PRODUCTS = [...HOME_ONLY, ...JUMPMAN_PRODUCTS, ...WOMEN_NORMALISED, ...MEN_NORMALISED, ...KIDS_NORMALISED];

// Icons 
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

// Component 
export default function WishlistDrawer() {
  const dispatch  = useDispatch();
  const open      = useSelector(selectWishlistOpen);
  const wishIds   = useSelector(selectWishlistIds);
  const cartItems = useSelector(selectCartItems);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // When store opens the drawer
  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  const onClose = () => dispatch(setWishlistOpen(false));

  // Items currently in the wishlist
  const items = ALL_PRODUCTS.filter(p => wishIds.includes(p.id));

  useEffect(() => {
    if (!visible) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [visible]);

  const isInCart   = (id) => cartItems.some(i => i.id === id || i.id.startsWith(id + '-'));
  const handleAdd  = (p)  => dispatch(addToCart({ id: p.id, name: p.name, img: p.img, price: p.price }));

  if (!visible) return null;

  return (
    <>
      <div className={`wl-backdrop ${closing ? 'closing' : ''}`} onClick={onClose} />
      <aside className={`wl-drawer ${closing ? 'closing' : ''}`}>

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
                  {p.sale  && <span className="wl-item-old">${p.sale}</span>}
                  {p.badge && <span className="wl-item-badge">{p.badge}</span>}
                </div>
                {p.stars && (
                  <div className="wl-item-stars">
                    {[1,2,3,4,5].map(i =>
                      <span key={i} className={i <= p.stars ? 'star-on' : 'star-off'}>★</span>
                    )}
                    {p.reviews && <span className="wl-item-reviews">({p.reviews})</span>}
                  </div>
                )}
                <button
                  className={`wl-item-cart ${isInCart(p.id) ? 'in-cart' : ''}`}
                  onClick={() => handleAdd(p)}
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
              onClick={() => items.forEach(p => handleAdd(p))}>
              ADD ALL TO CART
            </button>
          </div>
        )}
      </aside>
    </>
  );
}