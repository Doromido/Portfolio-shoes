import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Header.css';
import {
  setCartOpen,
  setWishlistOpen,
  selectWishlistCount,
  selectWishlistOpen,
  selectCartCount,
  selectCartOpen,
} from '../store';

export default function Header() {
  const dispatch      = useDispatch();
  const wishCount     = useSelector(selectWishlistCount);
  const wishOpen      = useSelector(selectWishlistOpen);
  const cartCount     = useSelector(selectCartCount);
  const cartOpen      = useSelector(selectCartOpen);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src="/logo.png" alt="Logo" />
      </div>

      <ul className="nav-links">
        <li><Link to="/"      className={isActive('/')      ? 'active' : ''}>HOME</Link></li>
        <li><Link to="/women" className={isActive('/women') ? 'active' : ''}>WOMEN</Link></li>
        <li><Link to="/men"   className={isActive('/men')   ? 'active' : ''}>MEN</Link></li>
        <li><Link to="/kids"  className={isActive('/kids')  ? 'active' : ''}>KIDS</Link></li>
        <li><Link to="/sale"  className={isActive('/sale')  ? 'active' : ''}>SALE</Link></li>
      </ul>

      <div className="nav-icons">
        <div className={`search-bar ${searchOpen ? 'active' : ''}`}>
          <input
            type="text"
            className="search-input"
            placeholder="SEARCH..."
            autoFocus={searchOpen}
          />
        </div>

        <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="10" cy="10" r="7"/>
            <line x1="21" y1="21" x2="15" y2="15"/>
          </svg>
        </button>

        {/* Wishlist */}
        <button
          className={`icon-btn wishlist-nav-btn ${wishCount > 0 ? 'has-items' : ''}`}
          onClick={() => dispatch(setWishlistOpen(!wishOpen))}
          aria-label="Toggle wishlist"
        >
          <svg viewBox="0 0 24 24" width="26" height="26"
            stroke="currentColor"
            fill={wishCount > 0 ? 'currentColor' : 'none'}
            strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {wishCount > 0 && (
            <span className="wishlist-badge">{wishCount}</span>
          )}
        </button>

        {/* Cart */}
        <button
          className={`icon-btn cart-nav-btn ${cartCount > 0 ? 'has-items' : ''}`}
          onClick={() => dispatch(setCartOpen(!cartOpen))}
          aria-label="Toggle cart"
        >
          <img src="/cart.png" alt="Cart" />
          {cartCount > 0 && (
            <span className="wishlist-badge cart-badge">{cartCount}</span>
          )}
        </button>

        <div className="profile-icon">
          <img src="/avatar.png" alt="Profile" />
        </div>
      </div>
    </nav>
  );
}