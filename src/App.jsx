import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [selectedColor, setSelectedColor] = useState(0);

  const colors = [
    { id: 0, name: 'Red',    shoe: '/1.png',   accent: '#ff0000', glow: 'rgba(255,0,0,0.3)',    glowPulse1: 'rgba(255,0,0,0.5)',   glowPulse2: 'rgba(255,0,0,0.8)' },
    { id: 1, name: 'Yellow', shoe: '/s-y.png', accent: '#f5c500', glow: 'rgba(245,197,0,0.3)',  glowPulse1: 'rgba(245,197,0,0.5)', glowPulse2: 'rgba(245,197,0,0.8)' },
    { id: 2, name: 'Purple', shoe: '/s-v.png', accent: '#8b00ff', glow: 'rgba(139,0,255,0.3)', glowPulse1: 'rgba(139,0,255,0.5)', glowPulse2: 'rgba(139,0,255,0.8)' },
    { id: 3, name: 'Green',  shoe: '/s-g.png', accent: '#22dd22', glow: 'rgba(34,221,34,0.3)', glowPulse1: 'rgba(34,221,34,0.5)', glowPulse2: 'rgba(34,221,34,0.8)' },
  ];

  const current = colors[selectedColor];

  const hexToFilter = (hex) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);

    const filters = {
      '#ff0000': 'invert(23%) sepia(89%) saturate(7491%) hue-rotate(359deg) brightness(104%) contrast(114%)',
      '#f5c500': 'invert(80%) sepia(80%) saturate(800%) hue-rotate(5deg) brightness(110%) contrast(110%)',
      '#8b00ff': 'invert(15%) sepia(100%) saturate(7000%) hue-rotate(270deg) brightness(90%) contrast(120%)',
      '#22dd22': 'invert(60%) sepia(80%) saturate(500%) hue-rotate(90deg) brightness(110%) contrast(110%)',
    };
    return filters[hex] || filters['#ff0000'];
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', current.accent);
    root.style.setProperty('--glow', current.glow);
    root.style.setProperty('--glow-pulse-1', current.glowPulse1);
    root.style.setProperty('--glow-pulse-2', current.glowPulse2);
    root.style.setProperty('--cart-filter', hexToFilter(current.accent));
  }, [selectedColor]);

  return (
    <div className="jordan-container">
      {/* Великий фоновий напис JORDAN */}
      <svg className="bg-jordan-text" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <text
          x="500" y="175"
          textAnchor="middle"
          fontFamily="'Archivo Black', sans-serif"
          fontWeight="900"
          fontStyle="normal"
          fontSize="210"
          fill="#1a1a1a"
          stroke="none"
          letterSpacing="-2"
        >JORDAN</text>
      </svg>

      {/* Декоративні лінії */}
      <div className="bg-decoration">
        <div className="bg-line bg-line-1"></div>
        <div className="bg-line bg-line-2"></div>
        <div className="bg-line bg-line-3"></div>
      </div>

      {/* Навігація */}
      <nav className="navbar">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" />
        </div>

        <ul className="nav-links">
          <li><a href="#" className="active">HOME</a></li>
          <li><a href="#">MAN</a></li>
          <li><a href="#">WOMAN</a></li>
          <li><a href="#">KIDS</a></li>
          <li><a href="#">SALE</a></li>
        </ul>

        <div className="nav-icons">
          {/* Строга іконка пошуку */}
          <button className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="10" cy="10" r="7"></circle>
              <line x1="21" y1="21" x2="15" y2="15"></line>
            </svg>
          </button>
          
          {/* Іконка кошика */}
          <button className="icon-btn">
            <img src="/cart.png" alt="Cart" />
          </button>
          
          {/* Аватар акаунту */}
          <div className="profile-icon">
            <img src="/avatar.png" alt="Profile" />
          </div>
        </div>
      </nav>

      {/* 2021 PF справа вгорі */}
      <div className="year-badge-top">2021 PF</div>

      {/* Великий текст Jump та man */}
      <h1 className="shoe-label">
        <div className="jump-text">Jump</div>
        <div className="man-text">man</div>
      </h1>

      {/* Basketball  */}
      <p className="subtitle subtitle-left">Basketball</p>
      {/* Shoes  */}
      <p className="subtitle subtitle-right">Shoes</p>

      {/* Основний контент */}
      <div className="main-content">
        {/* Ліва частина */}
        <div className="left-section">
          {/* Вибір кольору */}
          <div className="color-selector">
            <div className="color-label">CHOOSE COLOR :</div>
            <div className="color-options">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`color-option ${selectedColor === color.id ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color.id)}
                >
                  <img src={color.shoe} alt={`Color ${color.name}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div className="button-group">
            <button className="btn btn-primary">ADD TO CART</button>
            <button className="btn btn-secondary">BUY NOW</button>
          </div>
        </div>

        {/* Права частина */}
        <div className="right-section">
          <div className="shoe-display">
            <img src={current.shoe} alt="Jordan Jumpman 2021 PF" className="shoe-image" />
          </div>
        </div>
      </div>


      {/* Інформація про продукт */}
      <div className="product-info">
        <span className="exclusive-badge">exclusive</span>
        <div className="product-name">JORDAN</div>
        <div className="product-name">JUMPMAN 2021 PF</div>
        <div className="price">134$</div>
      </div>


      {/* Pagination — кольорові крапки прив'язані до кольорів */}
      <div className="pagination">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`dot ${selectedColor === color.id ? 'active' : ''}`}
            style={selectedColor === color.id ? { background: color.accent } : {}}
            onClick={() => setSelectedColor(color.id)}
          />
        ))}
      </div>
    </div>
  );
}