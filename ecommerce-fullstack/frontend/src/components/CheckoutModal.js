import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, user, language, currency, formatPrice, onOrderSuccess }) => {
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirmation
  const [orderData, setOrderData] = useState({
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    payment: {
      method: 'card', // card, paypal, apple_pay
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    ru: {
      checkout: 'Оформление заказа',
      address: 'Адрес доставки',
      payment: 'Способ оплаты',
      confirmation: 'Подтверждение',
      street: 'Улица и дом',
      city: 'Город',
      postalCode: 'Почтовый индекс',
      country: 'Страна',
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
      nameOnCard: 'Имя на карте',
      orderSummary: 'Сводка заказа',
      total: 'Итого',
      processing: 'Обработка...',
      orderSuccess: 'Заказ успешно оформлен!',
      orderNumber: 'Номер заказа',
      required: 'Обязательное поле'
    },
    en: {
      checkout: 'Checkout',
      address: 'Delivery Address',
      payment: 'Payment Method',
      confirmation: 'Confirmation',
      street: 'Street Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
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
      nameOnCard: 'Name on Card',
      orderSummary: 'Order Summary',
      total: 'Total',
      processing: 'Processing...',
      orderSuccess: 'Order placed successfully!',
      orderNumber: 'Order Number',
      required: 'Required field'
    },
    pl: {
      checkout: 'Składanie zamówienia',
      address: 'Adres dostawy',
      payment: 'Metoda płatności',
      confirmation: 'Potwierdzenie',
      street: 'Ulica i numer',
      city: 'Miasto',
      postalCode: 'Kod pocztowy',
      country: 'Kraj',
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
      nameOnCard: 'Imię na karcie',
      orderSummary: 'Podsumowanie zamówienia',
      total: 'Razem',
      processing: 'Przetwarzanie...',
      orderSuccess: 'Zamówienie złożone pomyślnie!',
      orderNumber: 'Numer zamówienia',
      required: 'Pole wymagane'
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
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const order = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        address: orderData.address,
        paymentMethod: orderData.payment.method,
        totalAmount: getTotalPrice()
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(order)
      });      if (response.ok) {
        const result = await response.json();
        // Show success message with order number
        alert(`${t.orderSuccess} ${t.orderNumber}: ${result.id}`);
        
        // Call the success callback to clear cart and close modal
        if (onOrderSuccess) {
          onOrderSuccess();
        } else {
          onClose();
        }
      } else {
        const errorData = await response.json();
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
              <h3>{t.address}</h3>
              <div className="form-group">
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
                  <label>{t.city}</label>
                  <input
                    type="text"
                    value={orderData.address.city}
                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                    required
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
          )}

          {step === 3 && (
            <div className="confirmation">
              <h3>{t.confirmation}</h3>
              <div className="order-summary">
                <h4>{t.orderSummary}</h4>
                <div className="order-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice ? formatPrice(item.price * item.quantity) : `${item.price * item.quantity} ${currency}`}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>
                    {t.total}: {formatPrice ? formatPrice(getTotalPrice()) : `${getTotalPrice()} ${currency}`}
                  </strong>
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
