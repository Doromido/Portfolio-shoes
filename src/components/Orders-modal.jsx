import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, cancelOrder } from '../store';
import './Profile-drop-down.css'; 

export default function OrdersModal({ onClose }) {
  const dispatch   = useDispatch();
  const orders     = useSelector(selectOrders);
  const [closing, setClosing]   = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleClose    = () => { setClosing(true); setTimeout(onClose, 300); };
  const handleBackdrop = (e) => { if (e.target === backdropRef.current) handleClose(); };
  const handleCancel   = (id) => { dispatch(cancelOrder(id)); setCancelId(null); };

  const deliveryLabels = { free: 'Free Shipping', nova: 'Nova Poshta', ukr: 'Ukrposhta' };
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return createPortal(
    <div
      className={`sm-backdrop ${closing ? 'closing' : ''}`}
      ref={backdropRef}
      onClick={handleBackdrop}
    >
      <div className={`sm-modal orders-modal ${closing ? 'closing' : ''}`}>
        <div className="sm-deco" />

        <button className="sm-close" onClick={handleClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="sm-header">
          <span className="sm-tagline">ACCOUNT / HISTORY</span>
          <h2 className="sm-title">MY <span className="sm-accent">ORDERS</span></h2>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p>NO ORDERS YET</p>
            <span>Your placed orders will appear here</span>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className={`order-card ${order.status === 'cancelled' ? 'cancelled' : ''}`}>
                <div className="order-card-head">
                  <div className="order-card-meta">
                    <span className="order-num">#{order.num}</span>
                    <span className="order-date">{formatDate(order.date)}</span>
                  </div>
                  <span className={`order-status ${order.status}`}>
                    {order.status === 'active' ? '● ACTIVE' : '✕ CANCELLED'}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <img src={item.img} alt={item.name} className="order-item-img" />
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-meta">
                          {item.size && `EU ${item.size}`}{item.color && ` · ${item.color}`} · QTY {item.qty}
                        </span>
                      </div>
                      <span className="order-item-price">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-foot">
                  <span className="order-delivery">
                    {deliveryLabels[order.delivery?.delivery] || '—'}
                  </span>
                  <span className="order-total">
                    TOTAL <strong>${order.total + order.shipping}</strong>
                  </span>
                </div>

                {order.status === 'active' && (
                  cancelId === order.id ? (
                    <div className="order-confirm-cancel">
                      <span>Cancel this order?</span>
                      <div className="order-confirm-btns">
                        <button className="order-cancel-yes" onClick={() => handleCancel(order.id)}>YES, CANCEL</button>
                        <button className="order-cancel-no"  onClick={() => setCancelId(null)}>KEEP</button>
                      </div>
                    </div>
                  ) : (
                    <button className="order-cancel-btn" onClick={() => setCancelId(order.id)}>
                      CANCEL ORDER
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}