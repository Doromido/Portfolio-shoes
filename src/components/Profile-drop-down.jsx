import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectActiveOrders } from '../store';
import OrdersModal from './Orders-modal';
import './Profile-drop-down.css';

/* Settings modal*/
function SettingsModal({ user, onClose, onSave }) {
  const [tab, setTab]         = useState('name');
  const [name, setName]       = useState(user.name);
  const [email, setEmail]     = useState(user.email);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [closing, setClosing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const backdropRef           = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleClose = () => { setClosing(true); setTimeout(onClose, 300); };
  const handleBackdrop = (e) => { if (e.target === backdropRef.current) handleClose(); };

  const handleSave = () => {
    setSaved(true);
    const updated = { name, email };
    const stored = JSON.parse(localStorage.getItem('jordan_user') || '{}');
    localStorage.setItem('jordan_user', JSON.stringify({ ...stored, ...updated }));
    setTimeout(() => { onSave(updated); handleClose(); }, 900);
  };

  const TABS = [
    { id: 'name',     label: 'NAME'     },
    { id: 'email',    label: 'EMAIL'    },
    { id: 'password', label: 'PASSWORD' },
  ];

  return createPortal(
    <div
      className={`sm-backdrop ${closing ? 'closing' : ''}`}
      ref={backdropRef}
      onClick={handleBackdrop}
    >
      <div className={`sm-modal ${closing ? 'closing' : ''}`}>
        <div className="sm-deco" />

        <button className="sm-close" onClick={handleClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="sm-header">
          <span className="sm-tagline">ACCOUNT / SETTINGS</span>
          <h2 className="sm-title">EDIT <span className="sm-accent">PROFILE</span></h2>
        </div>

        <div className="sm-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`sm-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >{t.label}</button>
          ))}
        </div>

        {saved ? (
          <div className="sm-saved">
            <div className="sm-saved-icon">✓</div>
            <span>CHANGES SAVED</span>
          </div>
        ) : (
          <div className="sm-body">
            {tab === 'name' && (
              <div className="sm-field">
                <label className="sm-label">FULL NAME</label>
                <input className="sm-input" value={name} onChange={e => setName(e.target.value)}
                  placeholder="YOUR NAME" autoFocus />
              </div>
            )}
            {tab === 'email' && (
              <div className="sm-field">
                <label className="sm-label">EMAIL ADDRESS</label>
                <input type="email" className="sm-input" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="YOUR@EMAIL.COM" autoFocus />
              </div>
            )}
            {tab === 'password' && (
              <>
                <div className="sm-field">
                  <label className="sm-label">CURRENT PASSWORD</label>
                  <input type="password" className="sm-input" value={oldPass}
                    onChange={e => setOldPass(e.target.value)} placeholder="••••••••" autoFocus />
                </div>
                <div className="sm-field">
                  <label className="sm-label">NEW PASSWORD</label>
                  <input type="password" className="sm-input" value={newPass}
                    onChange={e => setNewPass(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="sm-field">
                  <label className="sm-label">CONFIRM PASSWORD</label>
                  <input type="password" className="sm-input" value={confirm}
                    onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
                </div>
              </>
            )}
            <button className="sm-save" onClick={handleSave}>SAVE CHANGES →</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ProfileDropdown */
export default function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen]           = useState(false);
  const [settings, setSettings]   = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const dropRef      = useRef(null);
  const activeOrders = useSelector(selectActiveOrders);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setCurrentUser(user); }, [user]);

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const menuItems = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
      label: 'MY ORDERS',
      badge: activeOrders.length > 0 ? activeOrders.length : null,
      onClick: () => { setOpen(false); setOrdersOpen(true); },
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      ),
      label: 'SETTINGS',
      onClick: () => { setOpen(false); setSettings(true); },
    },
  ];

  return (
    <>
      <div className="pd-wrap" ref={dropRef}>
        <div
          className={`pd-avatar ${open ? 'active' : ''}`}
          onClick={() => setOpen(o => !o)}
          title={currentUser.name}
        >
          <span className="pd-initials">{initials}</span>
          <div className="pd-online-dot" />
        </div>

        {open && (
          <div className="pd-dropdown">
            <div className="pd-deco" />
            <div className="pd-user-info">
              <div className="pd-user-avatar">{initials}</div>
              <div className="pd-user-text">
                <span className="pd-user-name">{currentUser.name}</span>
                <span className="pd-user-email">{currentUser.email}</span>
              </div>
            </div>
            <div className="pd-divider" />
            <ul className="pd-menu">
              {menuItems.map(item => (
                <li key={item.label}>
                  <button className="pd-menu-item" onClick={item.onClick}>
                    <span className="pd-menu-icon">{item.icon}</span>
                    <span className="pd-menu-label">{item.label}</span>
                    {item.badge && <span className="pd-menu-badge">{item.badge}</span>}
                    {item.sub && <span className="pd-menu-sub">{item.sub}</span>}
                    <svg className="pd-menu-arrow" viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="5,2 11,8 5,14"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <div className="pd-divider" />
            <button className="pd-logout" onClick={() => { setOpen(false); onLogout(); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              SIGN OUT
            </button>
          </div>
        )}
      </div>

      {ordersOpen && <OrdersModal onClose={() => setOrdersOpen(false)} />}
      {settings   && (
        <SettingsModal
          user={currentUser}
          onClose={() => setSettings(false)}
          onSave={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
        />
      )}
    </>
  );
}