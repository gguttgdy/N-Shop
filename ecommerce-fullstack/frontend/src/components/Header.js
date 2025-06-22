import React, { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import CartDropdown from './CartDropdown';
import './Header.css';

const Header = ({ language, setLanguage, user, setUser, cartItems, removeFromCart, updateCartQuantity, onHomeClick, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const translations = {
    ru: {
      search: 'Поиск товаров...',
      profile: 'Профиль',
      login: 'Войти',
      cart: 'Корзина',
      helpCenter: 'Центр помощи'
    },
    en: {
      search: 'Search products...',
      profile: 'Profile',
      login: 'Login',
      cart: 'Cart',
      helpCenter: 'Help Center'
    },
    pl: {
      search: 'Szukaj produktów...',
      profile: 'Profil',
      login: 'Zaloguj',
      cart: 'Koszyk',
      helpCenter: 'Centrum pomocy'
    }
  };

  const t = translations[language];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={onHomeClick}>
          <h1>ShopLogo</h1>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </form>

        <div className="header-actions">
          <div className="profile-section">
            <button 
              className="profile-button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="profile-icon">👤</span>
              <span>{user ? user.name : t.login}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {isProfileOpen && (
              <ProfileDropdown 
                user={user}
                setUser={setUser}
                language={language}
                onClose={() => setIsProfileOpen(false)}
              />
            )}
          </div>

          <button 
            className="help-center-button"
            onClick={() => onNavigate('page', 'help-center')}
            title={t.helpCenter}
          >
            ❓
          </button>

          <div className="cart-section">
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
              title={t.cart}
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>
            {isCartOpen && (
              <CartDropdown 
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                language={language}
                onClose={() => setIsCartOpen(false)}
              />
            )}
          </div>

          <select 
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇺🇸 EN</option>
            <option value="pl">🇵🇱 PL</option>
          </select>
        </div>
      </div>
    </header>
  );
};


export default Header;
