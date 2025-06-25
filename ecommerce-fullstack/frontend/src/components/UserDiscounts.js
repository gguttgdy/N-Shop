import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { useAuth } from '../hooks/useAuth';
import './UserProfile.css';

const UserDiscounts = ({ language }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: userLoading } = useAuth();

  const translations = {
    ru: {
      title: 'Мои скидки',
      noDiscounts: 'У вас пока нет активных скидок',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки скидок',
      code: 'Код',
      discount: 'Скидка',
      validUntil: 'Действует до',
      minOrder: 'Минимальная сумма заказа',
      status: 'Статус',
      copy: 'Копировать',
      use: 'Использовать',
      copied: 'Скопировано!',
      active: 'Активна',
      expired: 'Истекла',
      used: 'Использована',
      description: 'Описание'
    },
    en: {
      title: 'My Discounts',
      noDiscounts: 'You have no active discounts yet',
      loading: 'Loading...',
      error: 'Error loading discounts',
      code: 'Code',
      discount: 'Discount',
      validUntil: 'Valid Until',
      minOrder: 'Minimum order amount',
      status: 'Status',
      copy: 'Copy',
      use: 'Use',
      copied: 'Copied!',
      active: 'Active',
      expired: 'Expired',
      used: 'Used',
      description: 'Description'
    },
    pl: {
      title: 'Moje zniżki',
      noDiscounts: 'Nie masz jeszcze aktywnych zniżek',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zniżek',
      code: 'Kod',
      discount: 'Zniżka',
      validUntil: 'Ważne do',
      minOrder: 'Minimalna kwota zamówienia',
      status: 'Status',
      copy: 'Kopiuj',
      use: 'Użyj',
      copied: 'Skopiowane!',
      active: 'Aktywna',
      expired: 'Wygasła',
      used: 'Użyta',
      description: 'Opis'
    }
  };

  const t = translations[language] || translations.en;
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const discountsData = await authService.getDiscounts();
        setDiscounts(discountsData);
      } catch (err) {
        console.error('Error fetching discounts:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch discounts
    if (!userLoading && user) {
      fetchDiscounts();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, t.error]);

  const getDiscountStatus = (discount) => {
    if (discount.isUsed || discount.used) return 'used';
    if (discount.validUntil && new Date(discount.validUntil) < new Date()) return 'expired';
    return 'active';
  };

  const formatDiscountValue = (discount) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}%`;
    } else {
      return `$${discount.value}`;
    }
  };

  const handleCopyCode = async (code, event) => {
    try {
      await navigator.clipboard.writeText(code);
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
    // This could redirect to the shopping cart with the discount applied
    // or store the discount code for later use
  };

  if (loading || userLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>{t.title}</h2>
          <div className="loading-message">{t.loading}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>{t.title}</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>{t.title}</h2>
        
        {discounts.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
            <p>{t.noDiscounts}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Скидки появятся здесь после получения промокодов' : 
               language === 'en' ? 'Discounts will appear here after receiving promo codes' :
               'Zniżki pojawią się tutaj po otrzymaniu kodów promocyjnych'}
            </p>
          </div>
        ) : (
          <div className="discounts-list">
            {discounts.map((discount) => (
              <div key={discount.id} className="discount-card">
                <div className="discount-header">
                  <h3>🎫 {t.code}: {discount.discountCode}</h3>
                  <span className={`status-badge status-${getDiscountStatus(discount)}`}>
                    {getDiscountStatus(discount) === 'active' && t.active}
                    {getDiscountStatus(discount) === 'used' && '✓ ' + t.used}
                    {getDiscountStatus(discount) === 'expired' && '⏰ ' + t.expired}
                  </span>
                </div>
                
                <div className="discount-details">
                  <div className="discount-info">
                    <p><strong>💰 {t.discount}:</strong> <span>{formatDiscountValue(discount)}</span></p>
                    {discount.minOrderAmount && (
                      <p><strong>🛒 {t.minOrder}:</strong> <span>${discount.minOrderAmount}</span></p>
                    )}
                    {discount.validUntil && (
                      <p><strong>📅 {t.validUntil}:</strong> <span>{new Date(discount.validUntil).toLocaleDateString()}</span></p>
                    )}
                  </div>                  {discount.discountName && (
                    <div className="discount-description">
                      <h4>📋 {t.description}</h4>
                      <p>{discount.discountName}</p>
                    </div>
                  )}

                  <div className="discount-actions">
                    <button 
                      className="action-btn copy-btn"
                      onClick={(e) => handleCopyCode(discount.discountCode, e)}
                    >
                      📋 {t.copy}
                    </button>
                    {getDiscountStatus(discount) === 'active' && (
                      <button 
                        className="action-btn use-btn"
                        onClick={() => handleUseDiscount(discount.id)}
                      >
                        🎯 {t.use}
                      </button>
                    )}
                  </div>
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
