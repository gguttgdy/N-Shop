import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserOrders = ({ language, user, loading: userLoading, currency, formatPrice, convertAndFormatPrice }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');  const translations = {
    ru: {
      title: 'Мои заказы',
      noOrders: 'У вас пока нет заказов',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки заказов',
      orderId: 'Заказ №',
      date: 'Дата',
      status: 'Статус',
      total: 'Сумма',
      items: 'Товары',
      deliveryAddress: 'Адрес доставки',
      statusPending: 'В обработке',
      statusProcessing: 'Обрабатывается',
      statusShipped: 'Отправлен',
      statusDelivered: 'Доставлен',
      statusCancelled: 'Отменен'
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
      items: 'Items',
      deliveryAddress: 'Delivery Address',
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      statusShipped: 'Shipped',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled'
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
      items: 'Produkty',
      deliveryAddress: 'Adres dostawy',
      statusPending: 'Oczekuje',
      statusProcessing: 'Przetwarzane',
      statusShipped: 'Wysłane',
      statusDelivered: 'Dostarczone',
      statusCancelled: 'Anulowane'
    }
  };

  const t = translations[language];

  // Function to get translated status
  const getStatusText = (status) => {
    const statusLower = (status || 'PENDING').toLowerCase();
    switch (statusLower) {
      case 'pending': return t.statusPending;
      case 'processing': return t.statusProcessing;
      case 'shipped': return t.statusShipped;
      case 'delivered': return t.statusDelivered;
      case 'cancelled': return t.statusCancelled;
      default: return t.statusPending;
    }
  };  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders for user:', user);
        setLoading(true);
        const ordersData = await authService.getOrders();
        console.log('Orders received:', ordersData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.error('Error details:', err.response?.data);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch orders
    if (!userLoading && user) {
      fetchOrders();
    } else if (!userLoading && !user) {
      console.log('No user found after loading, skipping orders fetch');
      setLoading(false);
    }
  }, [user, userLoading, t.error]);
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
        
        {orders.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noOrders}</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (              <div key={order.id} className="order-card">                <div className="order-header">
                  <h3>{t.orderId}{order.orderNumber}</h3>
                  <span className={`status ${order.status?.toLowerCase() || 'pending'}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-details">                  <div className="order-info">
                    <p><strong>{t.date}:</strong> {new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                    <p><strong>{t.total}:</strong> {convertAndFormatPrice ? convertAndFormatPrice(order.totalAmount) : `${order.currency || '$'}${order.totalAmount}`}</p>
                    <p><strong>{t.items}:</strong> {order.items?.length || 0}</p>
                  </div>{order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>{t.items} ({order.items.length})</h4>                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-image">{item.productImage || '📦'}</span>
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                          <span className="item-price">{convertAndFormatPrice ? convertAndFormatPrice(item.price) : `${order.currency || '$'}${item.price}`}</span>
                        </div>
                      ))}
                    </div>
                  )}                  {order.shippingAddress && (
                    <div className="order-shipping">
                      <p><strong>{t.deliveryAddress}:</strong> {order.shippingAddress}</p>
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
