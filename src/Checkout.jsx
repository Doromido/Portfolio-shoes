import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart, placeOrder } from './store';
import './Checkout.css';

function CloseIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

const STEPS = ['CART', 'DELIVERY', 'CONFIRM'];

function StepBar({ current }) {
  return (
    <div className="ck-stepbar">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`ck-step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
            <div className="ck-step-dot">
              {i < current ? (
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <polyline points="1,6 4,9 11,2" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="ck-step-label">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`ck-step-line ${i < current ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OrderSummary({ items, total, collapsed, onToggle, deliveryMethod }) {
  const shipping = total >= 1000 ? 0 : deliveryMethod === 'nova' ? 1.7 : deliveryMethod === 'ukr' ? 1.1 : 0;
  return (
    <div className="ck-summary">
      <button className="ck-summary-toggle" onClick={onToggle}>
        <span>ORDER SUMMARY</span>
        <span className="ck-summary-toggle-right">
          <span className="ck-summary-total-preview">${total + shipping}</span>
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }}>
            <polyline points="1,3 6,9 11,3"/>
          </svg>
        </span>
      </button>

      {!collapsed && (
        <div className="ck-summary-body">
          <div className="ck-summary-items">
            {items.map(item => (
              <div className="ck-summary-item" key={`${item.id}-${item.size || 'ns'}`}>
                <div className="ck-summary-img-wrap">
                  <img src={item.img} alt={item.name} className="ck-summary-img" />
                  <span className="ck-summary-qty">{item.qty}</span>
                </div>
                <div className="ck-summary-item-info">
                  <p className="ck-summary-item-name">{item.name}</p>
                  {item.size && <p className="ck-summary-item-size">EU {item.size}</p>}
                  {item.color && <p className="ck-summary-item-size">{item.color}</p>}
                </div>
                <span className="ck-summary-item-price">${item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="ck-summary-divider" />

          <div className="ck-summary-rows">
            <div className="ck-summary-row">
              <span>SUBTOTAL</span>
              <span>${total}</span>
            </div>
            <div className="ck-summary-row">
              <span>SHIPPING</span>
              <span className={shipping === 0 ? 'ck-free' : ''}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
            </div>
            {shipping === 0 && (
              <div className="ck-summary-note">✓ Free shipping applied</div>
            )}
          </div>

          <div className="ck-summary-divider" />

          <div className="ck-summary-row ck-summary-row--total">
            <span>TOTAL</span>
            <span>${total + shipping}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Delivery 
function DeliveryStep({ data, onChange, onNext, total }) {
  const fields = [
    { id: 'firstName', label: 'FIRST NAME', half: true },
    { id: 'lastName',  label: 'LAST NAME',  half: true },
    { id: 'email',     label: 'EMAIL',       half: false },
    { id: 'phone',     label: 'PHONE',       half: false },
    { id: 'address',   label: 'ADDRESS',     half: false },
    { id: 'city',      label: 'CITY',        half: true },
    { id: 'zip',       label: 'ZIP / POSTAL CODE', half: true },
    { id: 'country',   label: 'COUNTRY',     half: false },
  ];

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    fields.forEach(f => {
      if (!data[f.id]?.trim()) e[f.id] = 'Required';
    });
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="ck-step-content">
      <div className="ck-section-label">DELIVERY INFORMATION</div>

      <div className="ck-field-grid">
        {fields.map(f => (
          <div key={f.id} className={`ck-field ${f.half ? 'half' : ''} ${errors[f.id] ? 'error' : ''} ${data[f.id] ? 'filled' : ''}`}>
            <label className="ck-label">{f.label}</label>
            <input
              className="ck-input"
              value={data[f.id] || ''}
              onChange={e => { onChange(f.id, e.target.value); setErrors(prev => ({ ...prev, [f.id]: '' })); }}
            />
            {errors[f.id] && <span className="ck-error">{errors[f.id]}</span>}
          </div>
        ))}
      </div>

      <div className="ck-delivery-opts">
        <div className="ck-section-label" style={{ marginBottom: '0.8rem' }}>DELIVERY METHOD</div>
        {[
          { id: 'free',   label: 'FREE SHIPPING',  sub: 'On orders over $1000',  price: 'FREE', free: true },
          { id: 'nova',   label: 'NOVA POSHTA',    sub: 'Delivery 2–3 days',     price: '$1.7' },
          { id: 'ukr',    label: 'UKRPOSHTA',      sub: 'Delivery 3–5 days',     price: '$1.1' },
        ].map(opt => {
          const isLocked = opt.id === 'free' && total < 1000;
          const remaining = 1000 - total;
          const progress = Math.min((total / 1000) * 100, 100);
          return (
            <label key={opt.id} className={`ck-delivery-opt ${data.delivery === opt.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
              <input type="radio" name="delivery" value={opt.id}
                checked={data.delivery === opt.id}
                onChange={() => !isLocked && onChange('delivery', opt.id)}
                disabled={isLocked}
                style={{ display: 'none' }} />
              <div className="ck-delivery-opt-radio" />
              <div className="ck-delivery-opt-info">
                <span className="ck-delivery-opt-name">
                  {opt.label}
                  {isLocked && <span className="ck-lock-icon">🔒</span>}
                </span>
                <span className="ck-delivery-opt-sub">{opt.sub}</span>
                {isLocked && (
                  <div className="ck-free-progress-wrap">
                    <div className="ck-free-progress-bar">
                      <div className="ck-free-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="ck-free-progress-label">${remaining.toFixed(0)} more to unlock</span>
                  </div>
                )}
              </div>
              <span className={`ck-delivery-opt-price ${opt.free && !isLocked ? 'ck-free' : ''} ${isLocked ? 'ck-locked-price' : ''}`}>
                {opt.price}
              </span>
            </label>
          );
        })}
      </div>

      <button className="ck-btn-primary" onClick={handleNext}>
        CONTINUE TO PAYMENT →
      </button>
    </div>
  );
}

// Confirm 
function ConfirmStep({ delivery, items, total, onBack, onPlace }) {
  const shipping = total >= 1000 ? 0 : delivery.delivery === 'nova' ? 1.7 : delivery.delivery === 'ukr' ? 1.1 : 0;
  const deliveryLabels = { free: 'Free Shipping', nova: 'Nova Poshta ($1.7)', ukr: 'Ukrposhta ($1.1)' };

  return (
    <div className="ck-step-content">
      <div className="ck-section-label">REVIEW YOUR ORDER</div>

      <div className="ck-review-blocks">
        <div className="ck-review-block">
          <div className="ck-review-block-title">DELIVERY</div>
          <p>{delivery.firstName} {delivery.lastName}</p>
          <p>{delivery.address}</p>
          <p>{delivery.city}, {delivery.zip}</p>
          <p>{delivery.country}</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--accent)' }}>{deliveryLabels[delivery.delivery]}</p>
        </div>
        <div className="ck-review-block">
          <div className="ck-review-block-title">PAYMENT</div>
          <p>Cash on Delivery</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>Pay at the post office upon pickup</p>
        </div>
      </div>

      <div className="ck-review-items">
        {items.map(item => (
          <div className="ck-review-item" key={`${item.id}-${item.size || 'ns'}`}>
            <img src={item.img} alt={item.name} className="ck-review-item-img" />
            <div className="ck-review-item-info">
              <p className="ck-review-item-name">{item.name}</p>
              <p className="ck-review-item-meta">
                {item.size && `EU ${item.size}`}{item.color && ` · ${item.color}`} · QTY {item.qty}
              </p>
            </div>
            <span className="ck-review-item-price">${item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="ck-review-total-block">
        <div className="ck-summary-row"><span>SUBTOTAL</span><span>${total}</span></div>
        <div className="ck-summary-row"><span>SHIPPING</span><span className={shipping === 0 ? 'ck-free' : ''}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
        <div className="ck-summary-divider" />
        <div className="ck-summary-row ck-summary-row--total"><span>TOTAL</span><span>${total + shipping}</span></div>
      </div>

      <div className="ck-btn-row">
        <button className="ck-btn-ghost" onClick={onBack}>← BACK</button>
        <button className="ck-btn-primary ck-btn-place" onClick={onPlace}>
          PLACE ORDER →
        </button>
      </div>
    </div>
  );
}

// Success
function SuccessStep({ orderNum, navigate, continueTo }) {
  return (
    <div className="ck-success">
      <div className="ck-success-icon">
        <svg viewBox="0 0 48 48" width="96" height="96" fill="none">
          <circle cx="24" cy="24" r="22" stroke="var(--accent)" strokeWidth="2"/>
          <polyline points="12,24 20,32 36,16" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square"/>
        </svg>
      </div>
      <div className="ck-success-eyebrow">ORDER CONFIRMED</div>
      <h2 className="ck-success-title">THANK YOU<br />FOR YOUR<br /><span>ORDER.</span></h2>
      <p className="ck-success-desc">
        Your order <strong>#{orderNum}</strong> has been placed successfully.<br />
        A confirmation email will be sent shortly.
      </p>
      <div className="ck-success-actions">
        <button className="ck-btn-primary" onClick={() => navigate('/')}>BACK TO HOME</button>
        <button className="ck-btn-ghost" onClick={() => navigate(continueTo)}>CONTINUE SHOPPING →</button>
      </div>
    </div>
  );
}

// Main 
export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);

  // The page the user came from (home, women, men, kids, sale)
  const continueTo = location.state?.from || '/';

  const [step, setStep] = useState(0);
  const [summaryClosed, setSummaryClosed] = useState(false);
  const [orderNum] = useState(() => Math.floor(1000000 + Math.random() * 9000000));

  const [delivery, setDelivery] = useState({ delivery: 'nova' });

  const setDeliveryField = (k, v) => setDelivery(p => ({ ...p, [k]: v }));

  const handlePlace = () => {
    const shipping = total >= 1000 ? 0 : delivery.delivery === 'nova' ? 1.7 : delivery.delivery === 'ukr' ? 1.1 : 0;
    dispatch(placeOrder({
      id:       orderNum,
      num:      orderNum,
      date:     new Date().toISOString(),
      items:    items.map(i => ({ ...i })),
      delivery: { ...delivery },
      total,
      shipping,
      status:   'active',
    }));
    dispatch(clearCart());
    setStep(2);
  };

  // Empty cart guard 
  if (items.length === 0 && step < 2) {
    return (
      <div className="ck-root">
        <div className="ck-empty">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>YOUR CART IS EMPTY</p>
          <button className="ck-btn-primary" onClick={() => navigate('/')}>GO SHOPPING</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ck-root">

      {step < 2 && (
        <button className="ck-back-btn" onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}>
          <svg viewBox="0 0 40 12" width="36" height="12" fill="none">
            <line x1="38" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5"/>
            <polyline points="8,1 2,6 8,11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          BACK
        </button>
      )}

      <div className="ck-bg-word" aria-hidden="true">CHECKOUT</div>

      <div className="ck-inner">

        {step < 2 && (
          <div className="ck-header">
            <span className="ck-eyebrow">JORDAN BRAND / SS 2026</span>
            <h1 className="ck-title">CHECK<span>OUT</span></h1>
          </div>
        )}

        {step === 2 ? (
          <SuccessStep orderNum={orderNum} navigate={navigate} continueTo={continueTo} />
        ) : (
          <div className="ck-layout">

            <div className="ck-main">
              <StepBar current={step} />
              <div className="ck-divider" />

              {step === 0 && (
                <DeliveryStep
                  data={delivery}
                  onChange={setDeliveryField}
                  onNext={() => setStep(1)}
                  total={total}
                />
              )}
              {step === 1 && (
                <ConfirmStep
                  delivery={delivery}
                  items={items}
                  total={total}
                  onBack={() => setStep(0)}
                  onPlace={handlePlace}
                />
              )}
            </div>

            <div className="ck-aside">
              <OrderSummary
                items={items}
                total={total}
                collapsed={summaryClosed}
                onToggle={() => setSummaryClosed(p => !p)}
                deliveryMethod={delivery.delivery}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}