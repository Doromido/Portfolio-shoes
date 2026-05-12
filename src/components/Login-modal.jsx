import React, { useState, useEffect, useRef } from 'react';
import { loadUserWishlist, loadWishlist, loadUserCart, loadCart, store } from '../store';
import './Login-modal.css';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode]         = useState('login'); 
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [error, setError]       = useState('');
  const backdropRef             = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      setSuccess(false);
      setEmail('');
      setPassword('');
      setName('');
      setMode('login');
      setError('');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 320);
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Load all saved accounts (array)
      let accounts = [];
      try {
        const raw = localStorage.getItem('jordan_accounts');
        if (raw) accounts = JSON.parse(raw);
        if (!Array.isArray(accounts)) accounts = [];
      } catch { accounts = []; }

      if (mode === 'login') {
        const found = accounts.find(
          a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (!found) {
          setError('NO_ACCOUNT');
          return;
        }
        const userData = { ...found, loggedIn: true };
        localStorage.setItem('jordan_user', JSON.stringify(userData));
        // Restore this user's wishlist and cart into Redux
        store.dispatch(loadWishlist(loadUserWishlist(found.email)));
        store.dispatch(loadCart(loadUserCart(found.email)));
        setSuccess(true);
        setTimeout(() => { onLogin(userData); handleClose(); }, 1100);
        return;
      }

      // Register — check if email already taken
      const exists = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('EMAIL_TAKEN');
        return;
      }

      const displayName = name.trim() ? name.trim() : email.split('@')[0].toUpperCase();
      const newAccount = { name: displayName, email, password };
      accounts.push(newAccount);
      localStorage.setItem('jordan_accounts', JSON.stringify(accounts));

      const userData = { ...newAccount, loggedIn: true };
      localStorage.setItem('jordan_user', JSON.stringify(userData));
      // New account — wishlist starts empty (nothing to load)
      store.dispatch(loadWishlist([]));
      setSuccess(true);
      setTimeout(() => { onLogin(userData); handleClose(); }, 1100);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`lm-backdrop ${closing ? 'closing' : ''}`}
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <div className={`lm-modal ${closing ? 'closing' : ''}`}>

        {/* Decorative diagonal line */}
        <div className="lm-deco-line" />

        {/* close */}
        <button className="lm-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* header */}
        <div className="lm-header">
          <span className="lm-tagline">JORDAN BRAND / ACCESS</span>
          <h2 className="lm-title">
            {mode === 'login' ? (
              <>SIGN <span className="lm-accent">IN</span></>
            ) : (
              <>JOIN <span className="lm-accent">US</span></>
            )}
          </h2>
        </div>

        {/* switch */}
        <div className="lm-mode-switch">
          <button
            className={`lm-mode-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >LOGIN</button>
          <button
            className={`lm-mode-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >REGISTER</button>
        </div>

        {/* form */}
        {success ? (
          <div className="lm-success">
            <div className="lm-success-icon">✓</div>
            <span>{mode === 'login' ? 'WELCOME BACK' : 'ACCOUNT CREATED'}</span>
          </div>
        ) : (
          <form className="lm-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="lm-field">
                <label className="lm-label">FULL NAME</label>
                <input
                  type="text"
                  className="lm-input"
                  placeholder="MICHAEL JORDAN"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="lm-field">
              <label className="lm-label">EMAIL</label>
              <input
                type="email"
                className="lm-input"
                placeholder="YOUR@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="lm-field">
              <label className="lm-label">PASSWORD</label>
              <div className="lm-pass-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="lm-input lm-pass-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="lm-pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <a href="#" className="lm-forgot">FORGOT PASSWORD?</a>
            )}

            {error === 'NO_ACCOUNT' && (
              <div className="lm-error-block">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>
                  Incorrect email or password.{' '}
                  <button type="button" className="lm-error-switch" onClick={() => { setError(''); setMode('register'); }}>
                    Create an account
                  </button>
                  {' '}to get started.
                </span>
              </div>
            )}

            {error === 'EMAIL_TAKEN' && (
              <div className="lm-error-block">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>
                  This email is already registered.{' '}
                  <button type="button" className="lm-error-switch" onClick={() => { setError(''); setMode('login'); }}>
                    Sign in instead
                  </button>
                </span>
              </div>
            )}

            <button
              type="submit"
              className={`lm-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="lm-spinner" />
              ) : (
                mode === 'login' ? 'ENTER →' : 'CREATE ACCOUNT →'
              )}
            </button>
          </form>
        )}

        <div className="lm-divider"><span>OR CONTINUE WITH</span></div>

        <div className="lm-socials">
          <button className="lm-social-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            GOOGLE
          </button>
          <button className="lm-social-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GITHUB
          </button>
        </div>

      </div>
    </div>
  );
}