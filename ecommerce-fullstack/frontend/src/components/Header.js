import React, { useState, useEffect, useRef } from 'react';
import ProfileDropdown from './ProfileDropdown';
import CartDropdown from './CartDropdown';
import './Header.css';

const Header = ({ language, setLanguage, user, setUser, cartItems, removeFromCart, updateCartQuantity, clearCart, onHomeClick, onNavigate, onSearch, searchQuery, setSearchQuery }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Рефы для отслеживания элементов
  const profileRef = useRef(null);
  const cartRef = useRef(null);

  // Динамический поиск с debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        onSearch(searchQuery.trim());
      } else if (searchQuery.trim().length === 0) {
        // Очищаем результаты поиска когда поле пустое
        onSearch('');      }
    }, 300); // Задержка 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  // Обработчик кликов вне области для закрытия дропдаунов
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Закрываем корзину если клик вне её области
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      
      // Закрываем профиль если клик вне его области
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Добавляем обработчик только если есть открытые дропдауны
    if (isCartOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isCartOpen, isProfileOpen]);

  const translations = {    ru: {
      search: 'Поиск товаров...',
      profile: 'Профиль',
      login: 'Войти',
      cart: 'Корзина',
      helpCenter: 'Центр помощи'
    },    en: {
      search: 'Search products...',
      profile: 'Profile',
      login: 'Login',
      cart: 'Cart',
      helpCenter: 'Help Center'
    },    pl: {
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
    // При нажатии Enter или кнопки поиска - сразу выполняем поиск
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <header className="header">
      <div className="header-container">        <div className="logo" onClick={() => { setSearchQuery(''); onHomeClick(); }}>
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

        <div className="header-actions">          <div className="profile-section" ref={profileRef}>
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
          </button>          <div className="cart-section" ref={cartRef}>
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
              title={t.cart}
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>{isCartOpen && (
              <CartDropdown 
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                clearCart={clearCart}
                language={language}
                onClose={() => setIsCartOpen(false)}
              />
            )}
          </div>          <select 
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="pl">PL</option>
            <option value="ru">RU</option>
          </select>
        </div>
      </div>
    </header>
  );
};


export default Header;
