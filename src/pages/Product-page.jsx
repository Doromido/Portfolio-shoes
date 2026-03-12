import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleWishlist, selectWishlistIds } from '../store.jsx';
import { WOMEN_PRODUCTS } from './W-products.js';
import { MEN_PRODUCTS } from './M-products.js';
import { KIDS_PRODUCTS } from './K-products.js';
import './Product-page.css';

const ALL_PRODUCTS = [
  ...WOMEN_PRODUCTS.map(p => ({ ...p, id: `w${p.id}`, _source: 'women' })),
  ...MEN_PRODUCTS.map(p =>   ({ ...p, id: `m${p.id}`, _source: 'men'   })),
  ...KIDS_PRODUCTS.map(p =>  ({ ...p, _source: 'kids' })),
];

const COLOR_GROUPS = [
  ['w1', 'w6', 'w7', 'w10'],
  ['w3', 'w4'],
  ['w8', 'w9'],
  ['w15', 'w16'],
  ['w17', 'w18'],
  ['m14', 'm16', 'm17'],
  ['k1', 'k2', 'k3', 'k7', 'k8', 'k11', 'k13', 'k14'],
  ['k4', 'k5','k9'],
  ['k12', 'k15']
];

function findColorGroup(productId) {
  return COLOR_GROUPS.find(g => g.includes(productId)) || null;
}

export default function ProductPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const dispatch     = useDispatch();
  const wishIds      = useSelector(selectWishlistIds);

  const product = ALL_PRODUCTS.find(p => p.id === id)
    ?? (location.state?.fallbackProduct?.id === id ? location.state.fallbackProduct : null);

  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [added,         setAdded]         = useState(false);
  const [imgLoaded,     setImgLoaded]     = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(null);
    setImgLoaded(false);
  }, [id]);

  if (!product) {
    return (
      <div className="ppage-not-found">
        <span>PRODUCT NOT FOUND</span>
        <button onClick={() => navigate(-1)}>← GO BACK</button>
      </div>
    );
  }

  const isLiked   = wishIds.includes(product.id);
  const discount  = product.badge?.match(/-?(\d+)%/) ? parseInt(product.badge.match(/-?(\d+)%/)[1]) : 0;
  const origPrice = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : null;

  const colorGroup = findColorGroup(product.id);
  const colorVariants = colorGroup
    ? colorGroup.map(gid => ALL_PRODUCTS.find(p => p.id === gid)).filter(Boolean)
    : null;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id:    product.id,
      name:  product.name,
      img:   product.img,
      price: product.price,
      size:  selectedSize,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sourceBack = { women: '/women', men: '/men', kids: '/kids' };
  const backPath = location.state?.returnTo || sourceBack[product._source] || -1;
  const backState = (location.state?.scrollY != null || location.state?.bsOffset != null || location.state?.activeFilter != null)
    ? { scrollY: location.state?.scrollY, bsOffset: location.state?.bsOffset, activeFilter: location.state?.activeFilter }
    : undefined;

  return (
    <div className="ppage-root">

      <button className="ppage-back" onClick={() => {
        if (typeof backPath === 'number') {
          navigate(backPath);
        } else {
          navigate(backPath, { state: backState });
        }
      }}>
        <svg viewBox="0 0 40 12" width="40" height="12" fill="none">
          <line x1="38" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points="8,1 2,6 8,11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        BACK
      </button>

      <div className="ppage-layout">

        <div className="ppage-img-panel">
          <div className="ppage-bg-word" aria-hidden="true">
            {product.name.split(' ')[0]}
          </div>

          <button
            className={`ppage-wish ${isLiked ? 'liked' : ''}`}
            onClick={() => dispatch(toggleWishlist(product.id))}
          >
            <svg viewBox="0 0 24 24" width="20" height="20"
              stroke="currentColor"
              fill={isLiked ? 'currentColor' : 'none'}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <div className={`ppage-img-wrap ${imgLoaded ? 'loaded' : ''}`}>
            <img
              src={product.img}
              alt={product.name}
              className="ppage-img"
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          <div className="ppage-img-meta">
            <span className="ppage-img-meta-cat">{product.category}</span>
            <span className="ppage-img-meta-sep">·</span>
            <span className="ppage-img-meta-sub">{product.sub}</span>
          </div>
        </div>

        <div className="ppage-info-panel">

          <div className="ppage-info-header">
            {product.badge && (
              <span className={`ppage-badge ${discount > 0 ? 'ppage-badge--sale' : 'ppage-badge--tag'}`}>
                {product.badge}
              </span>
            )}
            <span className="ppage-eyebrow">JORDAN BRAND / {product._source?.toUpperCase()}</span>
            <h1 className="ppage-name">{product.name}</h1>
            <div className="ppage-price-row">
              <span className="ppage-price">${product.price}</span>
              {origPrice && <span className="ppage-price-orig">${origPrice}</span>}
              {discount > 0 && <span className="ppage-price-save">SAVE {discount}%</span>}
            </div>
          </div>

          <div className="ppage-divider" />

          {colorVariants && colorVariants.length > 1 && (
            <div className="ppage-section">
              <div className="ppage-section-label">
                COLORWAY
                <span className="ppage-section-value">
                  {product.colorways[colorGroup.indexOf(product.id)]}
                </span>
              </div>
              <div className="ppage-variants">
                {colorVariants.map((v, i) => {
                  const isActive = v.id === product.id;
                  return (
                    <button
                      key={v.id}
                      className={`ppage-variant-btn ${isActive ? 'active' : ''}`}
                      onClick={() => !isActive && navigate(`/product/${v.id}`, { state: { returnTo: location.state?.returnTo } })}
                      title={product.colorways[i]}
                    >
                      <img src={v.img} alt={v.colorways?.[0]} className="ppage-variant-img" />
<span className="ppage-variant-label">{v.colorways?.[0]?.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!colorVariants && product.colorways?.length > 0 && (
            <div className="ppage-section">
              <div className="ppage-section-label">
                COLORWAY
                <span className="ppage-section-value">{product.colorways[selectedColor]}</span>
              </div>
              <div className="ppage-colors">
                {product.colorways.map((c, i) => (
                  <button
                    key={i}
                    className={`ppage-color-btn ${selectedColor === i ? 'active' : ''}`}
                    onClick={() => setSelectedColor(i)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="ppage-section">
              <div className="ppage-section-label">
                SIZE (EU)
                {selectedSize && <span className="ppage-section-value">{selectedSize}</span>}
              </div>
              <div className="ppage-sizes">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`ppage-size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="ppage-section">
              <div className="ppage-section-label">ABOUT</div>
              <p className="ppage-desc">{product.description}</p>
            </div>
          )}

          <div className="ppage-divider" />

          <div className="ppage-cta">
            <button
              className={`ppage-btn-cart ${added ? 'added' : ''} ${!selectedSize ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              {added ? '✓ ADDED' : !selectedSize ? 'SELECT SIZE' : 'ADD TO CART'}
            </button>
          </div>

          <div className="ppage-shipping">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            FREE SHIPPING ON ORDERS OVER $1000
          </div>

        </div>
      </div>
    </div>
  );
}