import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import LoginModal from './Login-modal';
import ProfileDropdown from './Profile-drop-down';

export default function Header({ onUserChange }) {
  const dispatch  = useDispatch();
  const wishCount = useSelector(selectWishlistCount);
  const wishOpen  = useSelector(selectWishlistOpen);
  const cartCount = useSelector(selectCartCount);
  const cartOpen  = useSelector(selectCartOpen);

  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen]   = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jordan_user');
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.loggedIn ? parsed : null;
    } catch { return null; }
  });

  const location = useLocation();
  const navigate  = useNavigate();
  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    const handler = () => setLoginOpen(true);
    window.addEventListener('jordan:openLogin', handler);
    return () => window.removeEventListener('jordan:openLogin', handler);
  }, []);

  const navTo = (path) => (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(path);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setLoginOpen(false);
    onUserChange?.(userData);
  };

  const handleLogout = () => {
    const stored = JSON.parse(localStorage.getItem('jordan_user') || '{}');
    localStorage.setItem('jordan_user', JSON.stringify({ ...stored, loggedIn: false }));
    setUser(null);
    onUserChange?.(null);
  };

  //Allows the Footer to open the login modal
  const openLogin = () => setLoginOpen(true);

  return (
    <>
      <nav className="navbar">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" />
        </div>

        <ul className="nav-links">
          <li><Link to="/"      className={isActive('/')      ? 'active' : ''} onClick={navTo('/')}>HOME</Link></li>
          <li><Link to="/women" className={isActive('/women') ? 'active' : ''} onClick={navTo('/women')}>WOMEN</Link></li>
          <li><Link to="/men"   className={isActive('/men')   ? 'active' : ''} onClick={navTo('/men')}>MEN</Link></li>
          <li><Link to="/kids"  className={isActive('/kids')  ? 'active' : ''} onClick={navTo('/kids')}>KIDS</Link></li>
          <li><Link to="/sale"  className={isActive('/sale')  ? 'active' : ''} onClick={navTo('/sale')}>SALE</Link></li>
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
            onClick={() => {
              dispatch(setCartOpen(false));
              dispatch(setWishlistOpen(!wishOpen));
            }}
            aria-label="Toggle wishlist"
          >
            <svg viewBox="0 0 24 24" width="26" height="26"
              stroke="currentColor"
              fill={wishCount > 0 ? 'currentColor' : 'none'}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishCount > 0 && <span className="wishlist-badge">{wishCount}</span>}
          </button>

          {/* Cart */}
          <button
            className={`icon-btn cart-nav-btn ${cartCount > 0 ? 'has-items' : ''}`}
            onClick={() => {
              dispatch(setWishlistOpen(false));
              dispatch(setCartOpen(!cartOpen));
            }}
            aria-label="Toggle cart"
          >
            <img src="/cart.png" alt="Cart" />
            {cartCount > 0 && <span className="wishlist-badge cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          ) : (
            <div className="profile-icon" onClick={() => setLoginOpen(true)}>
              <img src="/avatar.png" alt="Profile" />
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export { };