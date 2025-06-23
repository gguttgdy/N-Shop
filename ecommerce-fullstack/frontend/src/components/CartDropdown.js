import React from 'react';
import './CartDropdown.css';

const CartDropdown = ({ cartItems, removeFromCart, updateCartQuantity, clearCart, language, onClose }) => {
  const translations = {    ru: {
      cart: 'Корзина',
      empty: 'Корзина пуста',
      total: 'Итого',
      checkout: 'Оформить заказ',
      clearCart: 'Очистить корзину',
      confirmClear: 'Вы уверены, что хотите очистить корзину?',
      currency: 'руб.',
      remove: 'Удалить'
    },
    en: {
      cart: 'Cart',
      empty: 'Cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      clearCart: 'Clear Cart',
      confirmClear: 'Are you sure you want to clear the cart?',
      currency: 'USD',
      remove: 'Remove'
    },
    pl: {
      cart: 'Koszyk',
      empty: 'Koszyk jest pusty',
      total: 'Suma',
      checkout: 'Do kasy',
      clearCart: 'Wyczyść koszyk',
      confirmClear: 'Czy na pewno chcesz wyczyścić koszyk?',
      currency: 'zł',
      remove: 'Usuń'
    }
  };

  const t = translations[language];
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClearCart = () => {
    if (window.confirm(t.confirmClear)) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-dropdown">
        <div className="cart-header">
          <h3>{t.cart}</h3>
        </div>
        <div className="cart-empty">
          <p>{t.empty}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-header">
        <h3>{t.cart}</h3>
      </div>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">{item.image}</div>
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <div className="cart-item-price">
                {item.price.toLocaleString()} {t.currency}
              </div>
              <div className="cart-item-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title={t.remove}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        <div className="cart-footer">
        <div className="cart-total">
          <strong>{t.total}: {getTotalPrice().toLocaleString()} {t.currency}</strong>
        </div>        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={handleClearCart}>
            {t.clearCart}
          </button>
          <button className="checkout-btn" onClick={onClose}>
            {t.checkout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
