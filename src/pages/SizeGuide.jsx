import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SizeGuide.css';

// Data

const SHARED_SIZES = [
  { eu: '36', insole: '23.5', foot: '23.0' },
  { eu: '37', insole: '24.0', foot: '23.5' },
  { eu: '38', insole: '24.5', foot: '24.0' },
  { eu: '39', insole: '25.0', foot: '24.5' },
  { eu: '40', insole: '25.5', foot: '25.0' },
  { eu: '41', insole: '26.0', foot: '25.5' },
  { eu: '42', insole: '26.5', foot: '26.0' },
];

const FIT_TYPES = [
  {
    key: 'snug',
    label: 'SNUG',
    sub: 'Performance',
    desc: 'Toe just touches the front. Ideal for basketball and court sports — maximum control, zero foot sliding during cuts and pivots.',
    tag: '0 – 3 mm',
    icon: '◈',
  },
  {
    key: 'standard',
    label: 'STANDARD',
    sub: 'Everyday',
    desc: 'Thumb-width space at the toe. Best for training, street wear, and all-day comfort across any activity.',
    tag: '10 – 12 mm',
    icon: '◇',
  },
  {
    key: 'wide',
    label: 'WIDE',
    sub: 'Comfort',
    desc: 'Extra room across the toe box. Great for wide feet, long sessions, or wearing thicker performance socks.',
    tag: '15+ mm',
    icon: '○',
  },
];

const FAQS = [
  {
    q: 'Does Jordan run small?',
    a: "Jordan Brand typically runs half a size small on retro models. If you're between sizes, we always recommend sizing up. Performance models like the Jumpman PF tend to fit more true to size.",
  },
  {
    q: "What if I'm between two sizes?",
    a: "Always go up. A shoe that's slightly large can be adjusted with thicker socks or an aftermarket insole. A shoe that's too tight cannot be fixed and will cause discomfort over time.",
  },
  {
    q: 'How does Jordan compare to Nike sizing?',
    a: "Jordan Brand generally matches Nike sizing on performance silhouettes, but some retro models run narrow. If you have a wide foot, consider going half a size up in Jordan retros compared to your Nike size.",
  },
  {
    q: 'Should I measure both feet?',
    a: "Yes — feet are rarely identical in size. Always measure both and use your larger foot as the reference. The difference is usually minor, but it matters for fit and long-term comfort.",
  },
];

const BRAND_COMPARE = [
  { brand: 'JORDAN',      note: 'Runs ½ size small on retros. True to size on performance models.' },
  { brand: 'NIKE',        note: 'Generally true to size — the reference point for other brands.' },
  { brand: 'ADIDAS',      note: 'Runs ½ size large. Size down for a snug fit.' },
  { brand: 'NEW BALANCE', note: 'True to size but wider last. May feel large for narrow feet.' },
];

// Page

export default function SizeGuidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const returnTo = location.state?.returnTo || '/';

  return (
    <div className="sg-root">

      {/* BG word */}
      <div className="sg-bg-word" aria-hidden="true">SIZE</div>

      {/* Back */}
      <button className="sg-back" onClick={() => navigate(returnTo)}>
        <svg viewBox="0 0 40 12" width="32" height="12" fill="none">
          <line x1="38" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points="8,1 2,6 8,11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        BACK
      </button>

      <div className="sg-inner">

        {/* HERO */}
        <header className="sg-hero">
          <div className="sg-hero-left">
            <span className="sg-eyebrow">JORDAN BRAND / FIT GUIDE</span>
            <h1 className="sg-title">
              <span className="sg-title-solid">SIZE</span>
              <span className="sg-title-outline">GUIDE.</span>
            </h1>
            <p className="sg-hero-desc">
              Find your perfect fit. Measure once, order right the first time.
            </p>
          </div>

        </header>

        {/* TICKER */}
        <div className="sg-ticker" aria-hidden="true">
          <div className="sg-ticker-track">
            {Array(6).fill(['FIND YOUR FIT', 'MEASURE ONCE', 'ORDER RIGHT', 'JORDAN BRAND', 'SS 2026']).flat().map((t, i) => (
              <span key={i} className="sg-ticker-item">{t} <span className="sg-ticker-dot">✦</span></span>
            ))}
          </div>
        </div>

        {/*SECTION 01 — SIZE CHART*/}
        <section className="sg-section">
          <div className="sg-section-header">
            <span className="sg-section-num">01</span>
            <div className="sg-section-title-group">
              <h2 className="sg-section-title">SIZE CHART</h2>
              <p className="sg-section-sub">Foot length in centimetres. Always size up if between sizes.</p>
            </div>
          </div>

          <div className="sg-table-wrap">
            <table className="sg-table">
              <thead>
                <tr>
                  <th>EU</th>
                  <th>FOOT cm</th>
                  <th>INSOLE cm</th>
                </tr>
              </thead>
              <tbody>
                {SHARED_SIZES.map((row, i) => (
                  <tr key={i}>
                    <td className="sg-td-eu">{row.eu}</td>
                    <td>{row.foot}</td>
                    <td>{row.insole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Brand compare — horizontal strip */}
          <div className="sg-brand-strip">
            {BRAND_COMPARE.map(b => (
              <div key={b.brand} className="sg-brand-tile">
                <span className="sg-brand-name">{b.brand}</span>
                <span className="sg-brand-note">{b.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* section divider */}
        <div className="sg-section-divider" aria-hidden="true">
          <span className="sg-section-divider-line" />
          <span className="sg-section-divider-dot">✦</span>
          <span className="sg-section-divider-line" />
        </div>

        {/* SECTION 02 — HOW TO MEASURE */}
        <section className="sg-section">
          <div className="sg-section-header">
            <span className="sg-section-num">02</span>
            <div className="sg-section-title-group">
              <h2 className="sg-section-title">HOW TO MEASURE</h2>
              <p className="sg-section-sub">Four steps. One sheet of paper. One ruler.</p>
            </div>
          </div>

          {/* Steps — 2-column grid on desktop */}
          <div className="sg-steps-grid">
            {[
              { num: '01', title: 'STAND ON PAPER', desc: 'Place a blank sheet of paper on a hard floor. Stand upright with your full body weight on the foot being measured.' },
              { num: '02', title: 'TRACE YOUR FOOT', desc: 'Hold a pencil vertically and carefully trace the full outline of your foot. Keep the pencil perpendicular to the floor at all times.' },
              { num: '03', title: 'MEASURE THE LENGTH', desc: 'Draw a straight line from the back of the heel to the tip of the longest toe. Measure this line in centimetres.' },
              { num: '04', title: 'FIND YOUR SIZE', desc: 'Match your measurement to the chart above. If your length falls between two rows, always choose the larger EU size.' },
            ].map(s => (
              <div key={s.num} className="sg-step-card">
                <div className="sg-step-card-num">{s.num}</div>
                <div className="sg-step-card-body">
                  <div className="sg-step-card-title">{s.title}</div>
                  <p className="sg-step-card-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sg-tip">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="8" cy="8" r="7"/>
              <line x1="8" y1="7" x2="8" y2="11"/>
              <circle cx="8" cy="5" r="0.6" fill="var(--accent)"/>
            </svg>
            <span>Always measure both feet and use the <strong>larger foot</strong> as your reference size.</span>
          </div>
        </section>

        {/* section divider */}
        <div className="sg-section-divider" aria-hidden="true">
          <span className="sg-section-divider-line" />
          <span className="sg-section-divider-dot">✦</span>
          <span className="sg-section-divider-line" />
        </div>

        {/* SECTION 03 — FIT TYPES */}
        <section className="sg-section">
          <div className="sg-section-header">
            <span className="sg-section-num">03</span>
            <div className="sg-section-title-group">
              <h2 className="sg-section-title">FIT TYPES</h2>
              <p className="sg-section-sub">The right fit depends on how you plan to wear the shoe.</p>
            </div>
          </div>

          <div className="sg-fit-grid">
            {FIT_TYPES.map(f => (
              <div key={f.key} className="sg-fit-card">
                <div className="sg-fit-icon">{f.icon}</div>
                <div className="sg-fit-label">{f.label}</div>
                <div className="sg-fit-sub">{f.sub}</div>
                <p className="sg-fit-desc">{f.desc}</p>
                <div className="sg-fit-tag">{f.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* section divider */}
        <div className="sg-section-divider" aria-hidden="true">
          <span className="sg-section-divider-line" />
          <span className="sg-section-divider-dot">✦</span>
          <span className="sg-section-divider-line" />
        </div>

        {/* SECTION 04 — FAQ */}
        <section className="sg-section">
          <div className="sg-section-header">
            <span className="sg-section-num">04</span>
            <div className="sg-section-title-group">
              <h2 className="sg-section-title">FAQ</h2>
              <p className="sg-section-sub">Common questions about sizing and fit.</p>
            </div>
          </div>

          <div className="sg-faq-list">
            {FAQS.map((item, i) => (
              <div key={i} className={`sg-faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="sg-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <svg viewBox="0 0 12 12" width="11" height="11" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }}>
                    <polyline points="1,3 6,9 11,3"/>
                  </svg>
                </button>
                {openFaq === i && <p className="sg-faq-a">{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA STRIP */}
        <div className="sg-cta-strip">
          <div className="sg-cta-text">
            <span className="sg-cta-eyebrow">READY TO SHOP?</span>
            <h3 className="sg-cta-title">FIND YOUR PAIR.</h3>
          </div>
          <div className="sg-cta-btns">
            <button className="sg-btn-primary" onClick={() => { navigate('/women'); window.scrollTo(0, 0); }}>SHOP WOMEN →</button>
            <button className="sg-btn-primary" onClick={() => { navigate('/men'); window.scrollTo(0, 0); }}>SHOP MEN →</button>
          </div>
        </div>

      </div>
    </div>
  );
}