import React, { useState, useEffect } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, user, language, currency, formatPrice, currencySymbol, onOrderSuccess }) => {
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirmation
  const [orderData, setOrderData] = useState({
    address: {
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    payment: {
      method: 'card', // card, paypal, apple_pay
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    },
    saveAddress: false // checkbox to save address to user profile
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Auto-fill address from user profile when modal opens and reset to step 1
  useEffect(() => {
    if (isOpen) {
      // Всегда сбрасываем на первый шаг при открытии
      setStep(1);
      setError('');
      
      if (user) {
        setOrderData(prev => ({
          ...prev,
          address: {
            street: user.address || '',
            apartment: user.apartment || '',
            city: user.city || '',
            state: user.state || '',
            postalCode: user.postalCode || '',
            country: user.country || ''
          }
        }));
      }
    }
  }, [isOpen, user]);

  const translations = {
    ru: {
      checkout: 'Оформление заказа',      address: 'Адрес доставки',
      payment: 'Способ оплаты',
      confirmation: 'Подтверждение',
      street: 'Улица и дом',
      apartment: 'Квартира/Офис',
      city: 'Город',
      state: 'Область/Регион',
      postalCode: 'Почтовый индекс',
      country: 'Страна',
      saveAddress: 'Сохранить адрес в профиле',
      next: 'Далее',
      back: 'Назад',
      placeOrder: 'Оформить заказ',
      cancel: 'Отмена',
      paymentMethod: 'Способ оплаты',
      creditCard: 'Банковская карта',
      paypal: 'PayPal',
      applePay: 'Apple Pay',
      cardNumber: 'Номер карты',
      expiryDate: 'Срок действия',
      cvv: 'CVV',
      nameOnCard: 'Имя на карте',      orderSummary: 'Сводка заказа',
      total: 'Итого',
      processing: 'Обработка...',
      orderSuccess: 'Заказ успешно оформлен!',
      orderNumber: 'Номер заказа',
      required: 'Обязательное поле',
      shippingAddress: 'Адрес доставки',
      quantity: 'Количество',
      each: 'шт.',
      subtotal: 'Промежуточный итог',
      shipping: 'Доставка',
      free: 'Бесплатно'
    },
    en: {
      checkout: 'Checkout',      address: 'Delivery Address',
      payment: 'Payment Method',
      confirmation: 'Confirmation',
      street: 'Street Address',
      apartment: 'Apartment/Suite',
      city: 'City',
      state: 'State/Region',
      postalCode: 'Postal Code',
      country: 'Country',
      saveAddress: 'Save address to profile',
      next: 'Next',
      back: 'Back',
      placeOrder: 'Place Order',
      cancel: 'Cancel',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      paypal: 'PayPal',
      applePay: 'Apple Pay',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      nameOnCard: 'Name on Card',      orderSummary: 'Order Summary',
      total: 'Total',
      processing: 'Processing...',
      orderSuccess: 'Order placed successfully!',
      orderNumber: 'Order Number',
      required: 'Required field',
      shippingAddress: 'Shipping Address',
      quantity: 'Quantity',
      each: 'each',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free'
    },
    pl: {
      checkout: 'Składanie zamówienia',
      address: 'Adres dostawy',
      payment: 'Metoda płatności',
      confirmation: 'Potwierdzenie',      street: 'Ulica i numer',
      apartment: 'Mieszkanie/Biuro',
      city: 'Miasto',
      state: 'Województwo/Region',
      postalCode: 'Kod pocztowy',
      country: 'Kraj',
      saveAddress: 'Zapisz adres w profilu',
      next: 'Dalej',
      back: 'Wstecz',
      placeOrder: 'Złóż zamówienie',
      cancel: 'Anuluj',
      paymentMethod: 'Metoda płatności',
      creditCard: 'Karta kredytowa',
      paypal: 'PayPal',
      applePay: 'Apple Pay',
      cardNumber: 'Numer karty',
      expiryDate: 'Data ważności',
      cvv: 'CVV',
      nameOnCard: 'Imię na karcie',      orderSummary: 'Podsumowanie zamówienia',
      total: 'Razem',
      processing: 'Przetwarzanie...',
      orderSuccess: 'Zamówienie złożone pomyślnie!',
      orderNumber: 'Numer zamówienia',
      required: 'Pole wymagane',
      shippingAddress: 'Adres dostawy',
      quantity: 'Ilość',
      each: 'szt.',
      subtotal: 'Suma częściowa',
      shipping: 'Dostawa',
      free: 'Za darmo'
    }
  };

  const t = translations[language];

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  const validateStep = () => {
    setError('');
    
    if (step === 1) {
      if (!orderData.address.street || !orderData.address.city || 
          !orderData.address.postalCode || !orderData.address.country) {
        setError(t.required);
        return false;
      }
    } else if (step === 2 && orderData.payment.method === 'card') {
      if (!orderData.payment.cardNumber || !orderData.payment.expiryDate || 
          !orderData.payment.cvv || !orderData.payment.nameOnCard) {
        setError(t.required);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };  const handleSubmit = async () => {
    if (!validateStep()) return;

    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token || !user) {
      setError('Please log in to place an order');
      return;
    }

    setLoading(true);
    setError('');try {      const order = {
        items: cartItems.map(item => ({
          productId: String(item.id),
          productName: item.name || item.title,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price).toFixed(2),
          productImage: item.image
        })),
        street: orderData.address.street.trim(),
        apartment: orderData.address.apartment ? orderData.address.apartment.trim() : null,
        city: orderData.address.city.trim(),
        state: orderData.address.state ? orderData.address.state.trim() : null,
        postalCode: orderData.address.postalCode.trim(),
        country: orderData.address.country.trim(),
        paymentMethod: orderData.payment.method,
        currency: currency || 'USD',
        totalAmount: parseFloat(getTotalPrice()).toFixed(2),
        saveDeliveryAddress: orderData.saveAddress || false
      };console.log('Sending order data:', JSON.stringify(order, null, 2));
      console.log('Token:', localStorage.getItem('authToken'));

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(order)
      });if (response.ok) {
        const result = await response.json();
        // Show success message with order number
        alert(`${t.orderSuccess} ${t.orderNumber}: ${result.orderNumber}`);
        
        // Call the success callback to clear cart and close modal
        if (onOrderSuccess) {
          onOrderSuccess();
        } else {
          onClose();
        }      } else {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        const errorData = await response.json();
        console.log('Error response:', errorData);
        setError(errorData.message || 'Error placing order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>{t.checkout}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. {t.address}</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. {t.payment}</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. {t.confirmation}</div>
        </div>

        <div className="checkout-content">
          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <div className="address-form">
              <h3>{t.address}</h3>              <div className="form-group">
                <label>{t.street}</label>
                <input
                  type="text"
                  value={orderData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.apartment}</label>
                  <input
                    type="text"
                    value={orderData.address.apartment}
                    onChange={(e) => handleInputChange('address', 'apartment', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t.city}</label>
                  <input
                    type="text"
                    value={orderData.address.city}
                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.state}</label>
                  <input
                    type="text"
                    value={orderData.address.state}
                    onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t.postalCode}</label>
                  <input
                    type="text"
                    value={orderData.address.postalCode}
                    onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t.country}</label>
                <input
                  type="text"
                  value={orderData.address.country}
                  onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={orderData.saveAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                  />
                  {t.saveAddress}
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="payment-form">
              <h3>{t.payment}</h3>
              <div className="payment-methods">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={orderData.payment.method === 'card'}
                    onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                  />
                  {t.creditCard}
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={orderData.payment.method === 'paypal'}
                    onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                  />
                  {t.paypal}
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple_pay"
                    checked={orderData.payment.method === 'apple_pay'}
                    onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                  />
                  {t.applePay}
                </label>
              </div>

              {orderData.payment.method === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label>{t.cardNumber}</label>
                    <input
                      type="text"
                      value={orderData.payment.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.expiryDate}</label>
                      <input
                        type="text"
                        value={orderData.payment.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.cvv}</label>
                      <input
                        type="text"
                        value={orderData.payment.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t.nameOnCard}</label>
                    <input
                      type="text"
                      value={orderData.payment.nameOnCard}
                      onChange={(e) => handleInputChange('payment', 'nameOnCard', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}          {step === 3 && (
            <div className="confirmation">
              <h3 className="confirmation-title">{t.confirmation}</h3>
              
              <div className="confirmation-sections">
                {/* Shipping Address Section */}
                <div className="confirmation-section">
                  <h4 className="section-title">{t.shippingAddress}</h4>
                  <div className="address-display">
                    <div className="address-line">{orderData.address.street}</div>
                    {orderData.address.apartment && (
                      <div className="address-line">{orderData.address.apartment}</div>
                    )}
                    <div className="address-line">
                      {orderData.address.city}, {orderData.address.state} {orderData.address.postalCode}
                    </div>
                    <div className="address-line">{orderData.address.country}</div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="confirmation-section">
                  <h4 className="section-title">{t.paymentMethod}</h4>
                  <div className="payment-display">
                    <div className="payment-method">
                      {orderData.payment.method === 'card' && '💳 ' + t.creditCard}
                      {orderData.payment.method === 'paypal' && '🅿️ PayPal'}
                      {orderData.payment.method === 'apple_pay' && '🍎 Apple Pay'}
                    </div>
                    {orderData.payment.method === 'card' && orderData.payment.cardNumber && (
                      <div className="card-info">
                        **** **** **** {orderData.payment.cardNumber.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="confirmation-section order-summary-section">
                  <h4 className="section-title">{t.orderSummary}</h4>
                  <div className="confirmation-order-items">                    {cartItems.map(item => (
                      <div key={item.id} className="confirmation-order-item">
                        <div className="confirmation-item-image">
                          {item.image ? (
                            // Проверяем, является ли image URL или emoji
                            item.image.startsWith('http') || item.image.startsWith('/') ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="confirmation-item-emoji">{item.image}</div>
                            )
                          ) : (
                            <div className="confirmation-item-placeholder">📦</div>
                          )}
                        </div>
                        <div className="confirmation-item-details">
                          <div className="confirmation-item-name">{item.name}</div>
                          <div className="confirmation-item-meta">
                            <div className="confirmation-item-quantity">
                              {t.quantity}: {item.quantity}
                            </div>                            <div className="confirmation-item-unit-price">
                              {formatPrice ? formatPrice(item.price) : `${currencySymbol}${item.price}`} {t.each || 'each'}
                            </div>
                          </div>
                        </div>                        <div className="confirmation-item-total">
                          {formatPrice ? formatPrice(item.price * item.quantity) : `${currencySymbol}${(item.price * item.quantity).toFixed(2)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="confirmation-order-total">
                    <div className="total-breakdown">                      <div className="total-line">
                        <span>{t.subtotal}:</span>
                        <span>{formatPrice ? formatPrice(getTotalPrice()) : `${currencySymbol}${getTotalPrice().toFixed(2)}`}</span>
                      </div>
                      <div className="total-line">
                        <span>{t.shipping}:</span>
                        <span>{t.free}</span>
                      </div>
                      <div className="total-line total-final">
                        <span>{t.total}:</span>
                        <span>{formatPrice ? formatPrice(getTotalPrice()) : `${getTotalPrice()} ${currency}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={handleBack} disabled={loading}>
              {t.back}
            </button>
          )}
          
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext} disabled={loading}>
              {t.next}
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t.processing : t.placeOrder}
            </button>
          )}
          
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
