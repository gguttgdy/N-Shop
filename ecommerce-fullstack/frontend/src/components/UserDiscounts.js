import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserDiscounts = ({ language }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    ru: {
      title: 'Мои скидки',
      noDiscounts: 'У вас пока нет активных скидок',
      discountCode: 'Код скидки',
      description: 'Описание',
      discount: 'Скидка',
      validUntil: 'Действует до',
      status: 'Статус',
      use: 'Использовать',
      copy: 'Копировать код',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки скидок',
      active: 'Активна',
      expired: 'Истекла',
      used: 'Использована',
      copied: 'Код скопирован!'
    },
    en: {
      title: 'My Discounts',
      noDiscounts: 'You have no active discounts yet',
      discountCode: 'Discount Code',
      description: 'Description',
      discount: 'Discount',
      validUntil: 'Valid Until',
      status: 'Status',
      use: 'Use',
      copy: 'Copy Code',
      loading: 'Loading...',
      error: 'Error loading discounts',
      active: 'Active',
      expired: 'Expired',
      used: 'Used',
      copied: 'Code copied!'
    },
    pl: {
      title: 'Moje zniżki',
      noDiscounts: 'Nie masz jeszcze aktywnych zniżek',
      discountCode: 'Kod zniżki',
      description: 'Opis',
      discount: 'Zniżka',
      validUntil: 'Ważne do',
      status: 'Status',
      use: 'Użyj',
      copy: 'Kopiuj kod',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zniżek',
      active: 'Aktywna',
      expired: 'Wygasła',
      used: 'Użyta',
      copied: 'Kod skopiowany!'
    }
  };

  const t = translations[language];
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.getDiscounts();
      setDiscounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCopyCode = async (code, event) => {
    try {
      await navigator.clipboard.writeText(code);
      // Show a temporary success message
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = t.copied;
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleUseDiscount = (discountId) => {
    // Implement use discount logic - redirect to cart or store code
    console.log('Using discount:', discountId);
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="profile-content">
          <h2>{t.title}</h2>
          <div className="loading-message">{t.loading}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="profile-content">
          <h2>{t.title}</h2>
          <div className="error-message">{t.error}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-content">
        <h2>{t.title}</h2>
        
        {discounts.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noDiscounts}</p>
          </div>
        ) : (
          <div className="discounts-grid">
            {discounts.map(discount => (
              <div key={discount.id} className={`discount-card ${discount.status}`}>
                <div className="discount-header">
                  <h3 className="discount-code">{discount.code}</h3>
                  <span className={`status-badge ${discount.status}`}>
                    {t[discount.status]}
                  </span>
                </div>
                
                <div className="discount-details">
                  <p className="discount-description">{discount.description}</p>
                  <div className="discount-value">{discount.discount}</div>
                  <p className="discount-validity">
                    {t.validUntil}: {discount.validUntil}
                  </p>
                </div>
                
                <div className="discount-actions">                  <button 
                    className="action-btn copy-btn"
                    onClick={(e) => handleCopyCode(discount.code, e)}
                  >
                    {t.copy}
                  </button>
                  {discount.status === 'active' && (
                    <button 
                      className="action-btn use-btn"
                      onClick={() => handleUseDiscount(discount.id)}
                    >
                      {t.use}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDiscounts;
