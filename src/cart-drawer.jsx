import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  removeFromCart,
  updateQty,
  setItemSize,
  clearCart,
  setCartOpen,
  selectCartItems,
  selectCartOpen,
  selectCartTotal,
} from './store';

const SIZES_ADULT = [36, 37, 38, 39, 40, 41, 42];
const SIZES_KIDS  = [29, 30, 31, 32, 33, 34, 35];

const getSizes = (id) =>
  typeof id === 'string' && id.startsWith('k') ? SIZES_KIDS : SIZES_ADULT;

function CloseIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const open     = useSelector(selectCartOpen);
  const [visible, setVisible]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  // When store opens the drawer
  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
    } else if (visible) {
      // Trigger exit animation, then unmount
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleClose = () => dispatch(setCartOpen(false));

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div className={`wl-backdrop ${closing ? 'closing' : ''}`} onClick={handleClose} />
      <aside className={`wl-drawer cart-drawer ${closing ? 'closing' : ''}`}>

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
          <button className="wl-close" onClick={handleClose}>            <CloseIcon />
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
            <div className="wl-item" key={`${item.id}-${item.color || 'default'}-${item.size || 'nosize'}`}>

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

                {/* Size: locked badge if chosen on product page, selector if added from catalogue */}
                {item.size ? (
                  <div className="cart-size-row">
                    <span className="cart-size-label">SIZE</span>
                    <span className="cart-size-locked">{item.size}</span>
                  </div>
                ) : (
                  <div className="cart-size-row">
                    <span className="cart-size-label">SIZE</span>
                    <div className="cart-size-options">
                      {getSizes(item.id).map(s => (
                        <button
                          key={s}
                          className={`cart-size-btn ${item.size === s ? 'active' : ''}`}
                          onClick={() => {
                            dispatch(setItemSize({
                              id: item.id, color: item.color, oldSize: undefined, size: s
                            }));
                            setSizeWarning(false);
                          }}
                          type="button"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qty controls */}
                <div className="cart-qty">
                  <button className="cart-qty-btn"
                    onClick={() => dispatch(updateQty({
                      id: item.id, color: item.color, size: item.size, qty: item.qty - 1
                    }))}>−</button>
                  <span className="cart-qty-val">{item.qty}</span>
                  <button className="cart-qty-btn"
                    onClick={() => dispatch(updateQty({
                      id: item.id, color: item.color, size: item.size, qty: item.qty + 1
                    }))}>+</button>
                </div>

                <span className="cart-subtotal">
                  Subtotal: <strong>${item.price * item.qty}</strong>
                </span>
              </div>

              <button className="wl-item-remove"
                onClick={() => dispatch(removeFromCart({ id: item.id, color: item.color, size: item.size }))}>
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
            {sizeWarning && (
              <div className="cart-size-warning">
                ⚠ Please select a size for all items before checkout
              </div>
            )}
            <button className="wl-cart-all" onClick={() => {
              const hasUnsized = items.some(i => !i.size);
              if (hasUnsized) {
                setSizeWarning(true);
                return;
              }
              setSizeWarning(false);
              dispatch(setCartOpen(false));
              navigate('/checkout', { state: { from: location.pathname } });
            }}>CHECKOUT →</button>
            <button className="cart-clear" onClick={() => dispatch(clearCart())}>
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}