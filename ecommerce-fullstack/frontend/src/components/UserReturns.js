import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReturns = ({ language }) => {
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewReturnForm, setShowNewReturnForm] = useState(false);

  const translations = {
    ru: {
      title: 'Мои возвраты',
      noReturns: 'У вас пока нет возвратов',
      returnNumber: 'Номер возврата',
      orderNumber: 'Номер заказа',
      product: 'Товар',
      reason: 'Причина',
      date: 'Дата',
      status: 'Статус',
      amount: 'Сумма',
      view: 'Просмотр',
      newReturn: 'Новый возврат',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки возвратов',
      pending: 'Ожидает',
      approved: 'Одобрен',
      processing: 'Обрабатывается',
      completed: 'Завершен',
      rejected: 'Отклонен',
      createReturn: 'Создать возврат',
      cancel: 'Отмена',
      selectOrder: 'Выберите заказ',
      selectReason: 'Выберите причину',
      defective: 'Брак',
      wrongItem: 'Неправильный товар',
      notAsDescribed: 'Не соответствует описанию',
      changedMind: 'Передумал',
      other: 'Другое',
      comments: 'Комментарии',
      commentsPlaceholder: 'Дополнительные комментарии (необязательно)'
    },
    en: {
      title: 'My Returns',
      noReturns: 'You have no returns yet',
      returnNumber: 'Return Number',
      orderNumber: 'Order Number',
      product: 'Product',
      reason: 'Reason',
      date: 'Date',
      status: 'Status',
      amount: 'Amount',
      view: 'View',
      newReturn: 'New Return',
      loading: 'Loading...',
      error: 'Error loading returns',
      pending: 'Pending',
      approved: 'Approved',
      processing: 'Processing',
      completed: 'Completed',
      rejected: 'Rejected',
      createReturn: 'Create Return',
      cancel: 'Cancel',
      selectOrder: 'Select Order',
      selectReason: 'Select Reason',
      defective: 'Defective',
      wrongItem: 'Wrong Item',
      notAsDescribed: 'Not As Described',
      changedMind: 'Changed Mind',
      other: 'Other',
      comments: 'Comments',
      commentsPlaceholder: 'Additional comments (optional)'
    },
    pl: {
      title: 'Moje zwroty',
      noReturns: 'Nie masz jeszcze żadnych zwrotów',
      returnNumber: 'Numer zwrotu',
      orderNumber: 'Numer zamówienia',
      product: 'Produkt',
      reason: 'Powód',
      date: 'Data',
      status: 'Status',
      amount: 'Kwota',
      view: 'Zobacz',
      newReturn: 'Nowy zwrot',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zwrotów',
      pending: 'Oczekuje',
      approved: 'Zatwierdzony',
      processing: 'Przetwarzany',
      completed: 'Zakończony',
      rejected: 'Odrzucony',
      createReturn: 'Utwórz zwrot',
      cancel: 'Anuluj',
      selectOrder: 'Wybierz zamówienie',
      selectReason: 'Wybierz powód',
      defective: 'Wadliwy',
      wrongItem: 'Zły produkt',
      notAsDescribed: 'Niezgodny z opisem',
      changedMind: 'Zmiana zdania',
      other: 'Inne',
      comments: 'Komentarze',
      commentsPlaceholder: 'Dodatkowe komentarze (opcjonalne)'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchReturns();
  }, [user]);
  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.getReturns();
      setReturns(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewReturn = (returnId) => {
    console.log('Viewing return:', returnId);
    // Implement view return logic
  };

  const handleCreateReturn = (formData) => {
    // Implement create return logic
    console.log('Creating return:', formData);
    setShowNewReturnForm(false);
    // Refresh returns list
    fetchReturns();
  };

  const NewReturnForm = () => {
    const [selectedOrder, setSelectedOrder] = useState('');
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');

    // Mock orders for the dropdown
    const mockOrders = [
      { id: 'ORD-2024-110', products: 'Wireless Mouse, USB Cable' },
      { id: 'ORD-2024-105', products: 'Gaming Keyboard' },
      { id: 'ORD-2024-100', products: 'Monitor Stand' }
    ];

    const reasonOptions = [
      { value: 'defective', label: t.defective },
      { value: 'wrongItem', label: t.wrongItem },
      { value: 'notAsDescribed', label: t.notAsDescribed },
      { value: 'changedMind', label: t.changedMind },
      { value: 'other', label: t.other }
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedOrder && reason) {
        handleCreateReturn({ 
          orderNumber: selectedOrder, 
          reason, 
          comments 
        });
        setSelectedOrder('');
        setReason('');
        setComments('');
      }
    };

    return (
      <div className="return-form-overlay">
        <div className="return-form">
          <h3>{t.newReturn}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="order">{t.selectOrder}</label>
              <select
                id="order"
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                required
              >
                <option value="">{t.selectOrder}</option>
                {mockOrders.map(order => (
                  <option key={order.id} value={order.id}>
                    {order.id} - {order.products}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reason">{t.selectReason}</label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">{t.selectReason}</option>
                {reasonOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comments">{t.comments}</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t.commentsPlaceholder}
                rows="4"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {t.createReturn}
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                onClick={() => setShowNewReturnForm(false)}
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
        <div className="page-header">
          <h2>{t.title}</h2>
          <button 
            className="primary-btn"
            onClick={() => setShowNewReturnForm(true)}
          >
            {t.newReturn}
          </button>
        </div>
        
        {returns.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noReturns}</p>
          </div>
        ) : (
          <div className="returns-list">
            <div className="returns-table">
              <div className="table-header">
                <div className="header-cell">{t.returnNumber}</div>
                <div className="header-cell">{t.orderNumber}</div>
                <div className="header-cell">{t.product}</div>
                <div className="header-cell">{t.reason}</div>
                <div className="header-cell">{t.date}</div>
                <div className="header-cell">{t.status}</div>
                <div className="header-cell">{t.amount}</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {returns.map(returnItem => (
                <div key={returnItem.id} className="table-row">
                  <div className="table-cell">{returnItem.returnNumber}</div>
                  <div className="table-cell">{returnItem.orderNumber}</div>
                  <div className="table-cell">{returnItem.productName}</div>
                  <div className="table-cell">{returnItem.reason}</div>
                  <div className="table-cell">{returnItem.date}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${returnItem.status}`}>
                      {t[returnItem.status]}
                    </span>
                  </div>
                  <div className="table-cell">${returnItem.amount}</div>
                  <div className="table-cell">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewReturn(returnItem.id)}
                    >
                      {t.view}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {showNewReturnForm && <NewReturnForm />}
    </div>
  );
};

export default UserReturns;
