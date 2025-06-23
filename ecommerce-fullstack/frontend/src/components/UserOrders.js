import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserOrders = ({ language, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const translations = {
    ru: {
      title: 'Мои заказы',
      noOrders: 'У вас пока нет заказов',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки заказов',
      orderId: 'Заказ №',
      date: 'Дата',
      status: 'Статус',
      total: 'Сумма',
      items: 'Товары'
    },
    en: {
      title: 'My Orders',
      noOrders: 'You have no orders yet',
      loading: 'Loading...',
      error: 'Error loading orders',
      orderId: 'Order #',
      date: 'Date',
      status: 'Status',
      total: 'Total',
      items: 'Items'
    },
    pl: {
      title: 'Moje zamówienia',
      noOrders: 'Nie masz jeszcze żadnych zamówień',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zamówień',
      orderId: 'Zamówienie #',
      date: 'Data',
      status: 'Status',
      total: 'Suma',
      items: 'Produkty'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await authService.getOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, t.error]);

  if (loading) {
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
        
        {orders.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noOrders}</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>{t.orderId}{order.orderNumber}</h3>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <div className="order-info">
                    <p><strong>{t.date}:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>{t.total}:</strong> ${order.totalAmount}</p>
                    <p><strong>{t.items}:</strong> {order.items?.length || 0}</p>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.productName}</span>
                          <span>x{item.quantity}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>
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

export default UserOrders;
