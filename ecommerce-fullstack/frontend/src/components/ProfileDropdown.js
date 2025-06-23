import React from 'react';
import './ProfileDropdown.css';

const ProfileDropdown = ({ user, onLogout, language, onClose, onNavigate }) => {
  const translations = {
    ru: {
      login: 'Войти',
      register: 'Зарегистрироваться',
      orders: 'Заказы',
      receipts: 'Чеки',
      myData: 'Мои данные',
      discounts: 'Скидки',
      reviews: 'Отзывы',
      complaints: 'Рекламации',
      returns: 'Возвраты',
      logout: 'Выйти'
    },
    en: {
      login: 'Login',
      register: 'Register',
      orders: 'Orders',
      receipts: 'Receipts',
      myData: 'My Data',
      discounts: 'Discounts',
      reviews: 'Reviews',
      complaints: 'Complaints',
      returns: 'Returns',
      logout: 'Logout'
    },
    pl: {
      login: 'Zaloguj',
      register: 'Zarejestruj',
      orders: 'Zamówienia',
      receipts: 'Paragony',
      myData: 'Moje dane',
      discounts: 'Zniżki',
      reviews: 'Opinie',
      complaints: 'Reklamacje',
      returns: 'Zwroty',
      logout: 'Wyloguj'
    }
  };

  const t = translations[language];  const handleLogin = () => {
    onNavigate('login');
    onClose();
  };

  const handleRegister = () => {
    onNavigate('register');
    onClose();
  };
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  if (!user) {
    return (
      <div className="profile-dropdown">
        <button className="dropdown-item" onClick={handleLogin}>
          {t.login}
        </button>
        <button className="dropdown-item" onClick={handleRegister}>
          {t.register}
        </button>
      </div>
    );
  }

  return (
    <div className="profile-dropdown">      <div className="dropdown-header">
        <strong>
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email
          }
        </strong>
      </div>
      <hr />      <button className="dropdown-item" onClick={() => {
        onNavigate('orders');
        onClose();
      }}>
        {t.orders}
      </button>
      <button className="dropdown-item" onClick={() => {
        onNavigate('receipts');
        onClose();
      }}>
        {t.receipts}
      </button>      <button className="dropdown-item" onClick={() => {
        onNavigate('profile');
        onClose();
      }}>
        {t.myData}
      </button>
      <button className="dropdown-item" onClick={() => {
        onNavigate('discounts');
        onClose();
      }}>
        {t.discounts}
      </button>
      <button className="dropdown-item" onClick={() => {
        onNavigate('reviews');
        onClose();
      }}>
        {t.reviews}
      </button>
      <button className="dropdown-item" onClick={() => {
        onNavigate('complaints');
        onClose();
      }}>
        {t.complaints}
      </button>
      <button className="dropdown-item" onClick={() => {
        onNavigate('returns');
        onClose();
      }}>
        {t.returns}
      </button>
      <hr />
      <button className="dropdown-item logout" onClick={handleLogout}>
        {t.logout}
      </button>
    </div>
  );
};

export default ProfileDropdown;
