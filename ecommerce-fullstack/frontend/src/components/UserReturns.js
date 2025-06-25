import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReturns = ({ language }) => {
  const { user, loading: userLoading } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      amount: 'Сумма возврата',
      view: 'Просмотреть',
      edit: 'Редактировать',
      createNew: 'Создать возврат',
      newReturn: 'Новый возврат',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки возвратов',
      pending: 'Ожидает',
      approved: 'Одобрен',
      processing: 'Обрабатывается',
      completed: 'Завершен',
      rejected: 'Отклонен',
      cancelled: 'Отменен',
      requested: 'Запрошен',
      intransit: 'В пути',
      cancel: 'Отмена',
      submit: 'Отправить',
      selectOrder: 'Выберите заказ',
      selectReason: 'Выберите причину',
      defective: 'Дефект товара',
      wrongItem: 'Неправильный товар',
      notAsDescribed: 'Не соответствует описанию',
      changedMind: 'Передумал',
      damaged: 'Повреждение при доставке',
      other: 'Другое',
      comments: 'Комментарии',
      commentsPlaceholder: 'Опишите проблему подробнее',
      refundMethod: 'Способ возврата',
      originalPayment: 'На оригинальный способ оплаты',
      storeCredit: 'Кредит магазина'
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
      amount: 'Refund Amount',
      view: 'View',
      edit: 'Edit',
      createNew: 'Create Return',
      newReturn: 'New Return',
      loading: 'Loading...',
      error: 'Error loading returns',
      pending: 'Pending',
      approved: 'Approved',
      processing: 'Processing',
      completed: 'Completed',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
      requested: 'Requested',
      intransit: 'In Transit',
      cancel: 'Cancel',
      submit: 'Submit',
      selectOrder: 'Select Order',
      selectReason: 'Select Reason',
      defective: 'Defective Item',
      wrongItem: 'Wrong Item',
      notAsDescribed: 'Not as Described',
      changedMind: 'Changed Mind',
      damaged: 'Damaged in Shipping',
      other: 'Other',
      comments: 'Comments',
      commentsPlaceholder: 'Describe the issue in detail',
      refundMethod: 'Refund Method',
      originalPayment: 'Original Payment Method',
      storeCredit: 'Store Credit'
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
      amount: 'Kwota zwrotu',
      view: 'Zobacz',
      edit: 'Edytuj',
      createNew: 'Utwórz zwrot',
      newReturn: 'Nowy zwrot',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zwrotów',
      pending: 'Oczekuje',
      approved: 'Zatwierdzony',
      processing: 'Przetwarzany',
      completed: 'Zakończony',
      rejected: 'Odrzucony',
      cancelled: 'Anulowany',
      requested: 'Żądane',
      intransit: 'W transporcie',
      cancel: 'Anuluj',
      submit: 'Wyślij',
      selectOrder: 'Wybierz zamówienie',
      selectReason: 'Wybierz powód',
      defective: 'Wadliwy produkt',
      wrongItem: 'Zły produkt',
      notAsDescribed: 'Niezgodny z opisem',
      changedMind: 'Zmiana zdania',
      damaged: 'Uszkodzony w transporcie',
      other: 'Inne',
      comments: 'Komentarze',
      commentsPlaceholder: 'Opisz problem szczegółowo',
      refundMethod: 'Sposób zwrotu',
      originalPayment: 'Oryginalny sposób płatności',
      storeCredit: 'Kredyt sklepowy'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const returnsData = await authService.getReturns();
        setReturns(returnsData);
      } catch (err) {
        console.error('Error fetching returns:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch returns
    if (!userLoading && user) {
      fetchReturns();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, t.error]);

  const handleViewReturn = (returnId) => {
    // Implement view return logic - could open modal or navigate to detail page
    console.log('Viewing return:', returnId);
  };

  const handleEditReturn = (returnId) => {
    // Implement edit return logic
    console.log('Editing return:', returnId);
  };

  const handleCreateReturn = () => {
    setShowCreateForm(true);
  };

  const handleSubmitReturn = async (returnData) => {
    try {
      // Here would be API call to create return
      // await authService.createReturn(returnData);
      console.log('Creating return:', returnData);
      setShowCreateForm(false);
      // Refresh returns list
      // fetchReturns();
    } catch (err) {
      console.error('Error creating return:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'approved': return 'Approved';
      case 'processing': return '🔄';
      case 'completed': return '✔️';
      case 'rejected': return 'Rejected';
      case 'cancelled': return '🚫';
      case 'requested': return '📋';
      case 'intransit': case 'in_transit': return '🚚';
      default: return '📋';
    }
  };  const getReasonIcon = (reason) => {
    const normalizedReason = reason?.toLowerCase().replace(/_/g, '');
    switch (normalizedReason) {
      case 'defective': 
      case 'defectiveproduct': return '⚠️';
      case 'wrongitem': 
      case 'wrongproduct': return '🔄';
      case 'notasdescribed': 
      case 'notdescribed': return '📝';
      case 'changedmind': 
      case 'changedmymind': return '💭';
      case 'damaged': return '📦';
      case 'other': return '❓';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'pl' ? 'pl-PL' : 'en-US');
    } catch {
      return dateString || '';
    }
  };
  const getReasonTranslation = (reason) => {
    if (!reason) return '';
    const normalizedReason = reason.toLowerCase().replace(/_/g, '').replace(/product/g, '');
    
    // Map backend reason codes to our translation keys
    const reasonMap = {
      'defective': 'defective',
      'defectiveproduct': 'defective',
      'wrongitem': 'wrongItem',
      'wrongproduct': 'wrongItem',
      'notasdescribed': 'notAsDescribed',
      'notdescribed': 'notAsDescribed',
      'changedmind': 'changedMind',
      'changedmymind': 'changedMind',
      'damaged': 'damaged',
      'other': 'other'
    };
    
    const translationKey = reasonMap[normalizedReason] || reasonMap[reason.toLowerCase()] || 'other';
    return t[translationKey] || reason;
  };

  const formatAmount = (amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `$${amount}`;
    }
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
        
        {returns.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>↩️</div>
            <p>{t.noReturns}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Возвраты появятся здесь после создания' : 
               language === 'en' ? 'Returns will appear here after creation' :
               'Zwroty pojawią się tutaj po utworzeniu'}
            </p>
            <button 
              className="action-btn create-btn"
              onClick={handleCreateReturn}
              style={{ marginTop: '1rem' }}
            >
              ➕ {t.createNew}
            </button>
          </div>
        ) : (
          <>
            <div className="page-actions">
              <button 
                className="action-btn create-btn"
                onClick={handleCreateReturn}
              >
                ➕ {t.createNew}
              </button>
            </div>
            
            <div className="returns-list">
              {returns.map((returnItem) => (
                <div key={returnItem.id} className="return-card">
                  <div className="return-header">
                    <h3>↩️ {returnItem.returnNumber}</h3>
                    <div className="return-badges">
                      <span className={`status-badge status-${returnItem.status?.toLowerCase()}`}>
                        {getStatusIcon(returnItem.status)} {t[returnItem.status?.toLowerCase()]}
                      </span>
                      {returnItem.refundAmount && (
                        <span className="amount-badge">
                          💰 {formatAmount(returnItem.refundAmount, returnItem.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="return-details">
                    <div className="return-info">
                      <p><strong>📦 {t.orderNumber}:</strong> <span>{returnItem.orderNumber}</span></p>
                      <p><strong>📅 {t.date}:</strong> <span>{formatDate(returnItem.createdAt)}</span></p>
                      {returnItem.productName && (
                        <p><strong>🛍️ {t.product}:</strong> <span>{returnItem.productName}</span></p>
                      )}                      {returnItem.reason && (
                        <p><strong>{getReasonIcon(returnItem.reason)} {t.reason}:</strong> 
                           <span> {getReasonTranslation(returnItem.reason)}</span></p>
                      )}
                    </div>

                    {returnItem.description && (
                      <div className="return-content">
                        <h4>💬 {t.comments}</h4>
                        <p className="return-text">{returnItem.description}</p>
                      </div>
                    )}

                    <div className="return-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewReturn(returnItem.id)}
                      >
                        👁️ {t.view}
                      </button>
                      {(returnItem.status?.toLowerCase() === 'pending' || returnItem.status?.toLowerCase() === 'approved' || returnItem.status?.toLowerCase() === 'requested') && (
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditReturn(returnItem.id)}
                        >
                          ✏️ {t.edit}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showCreateForm && (
        <CreateReturnModal 
          language={language}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleSubmitReturn}
        />
      )}
    </div>
  );
};

// Modal component for creating new returns
const CreateReturnModal = ({ language, onClose, onSubmit }) => {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('originalPayment');

  const translations = {
    ru: {
      newReturn: 'Новый возврат',
      selectOrder: 'Выберите заказ',
      selectReason: 'Выберите причину',
      defective: 'Дефект товара',
      wrongItem: 'Неправильный товар',
      notAsDescribed: 'Не соответствует описанию',
      changedMind: 'Передумал',
      damaged: 'Повреждение при доставке',
      other: 'Другое',
      comments: 'Комментарии',
      commentsPlaceholder: 'Опишите проблему подробнее',
      refundMethod: 'Способ возврата',
      originalPayment: 'На оригинальный способ оплаты',
      storeCredit: 'Кредит магазина',
      cancel: 'Отмена',
      submit: 'Создать возврат'
    },
    en: {
      newReturn: 'New Return',
      selectOrder: 'Select Order',
      selectReason: 'Select Reason',
      defective: 'Defective Item',
      wrongItem: 'Wrong Item',
      notAsDescribed: 'Not as Described',
      changedMind: 'Changed Mind',
      damaged: 'Damaged in Shipping',
      other: 'Other',
      comments: 'Comments',
      commentsPlaceholder: 'Describe the issue in detail',
      refundMethod: 'Refund Method',
      originalPayment: 'Original Payment Method',
      storeCredit: 'Store Credit',
      cancel: 'Cancel',
      submit: 'Create Return'
    },
    pl: {
      newReturn: 'Nowy zwrot',
      selectOrder: 'Wybierz zamówienie',
      selectReason: 'Wybierz powód',
      defective: 'Wadliwy produkt',
      wrongItem: 'Zły produkt',
      notAsDescribed: 'Niezgodny z opisem',
      changedMind: 'Zmiana zdania',
      damaged: 'Uszkodzony w transporcie',
      other: 'Inne',
      comments: 'Komentarze',
      commentsPlaceholder: 'Opisz problem szczegółowo',
      refundMethod: 'Sposób zwrotu',
      originalPayment: 'Oryginalny sposób płatności',
      storeCredit: 'Kredyt sklepowy',
      cancel: 'Anuluj',
      submit: 'Utwórz zwrot'
    }
  };

  const t = translations[language] || translations.en;

  // Mock orders for demonstration
  const mockOrders = [
    { id: 'ORD-2024-001', items: 'Wireless Headphones, Phone Case', total: '$89.99' },
    { id: 'ORD-2024-002', items: 'Gaming Mouse', total: '$49.99' },
    { id: 'ORD-2024-003', items: 'USB Cable, Charger', total: '$25.99' }
  ];

  const reasonOptions = [
    { value: 'defective', label: t.defective },
    { value: 'wrongItem', label: t.wrongItem },
    { value: 'notAsDescribed', label: t.notAsDescribed },
    { value: 'changedMind', label: t.changedMind },
    { value: 'damaged', label: t.damaged },
    { value: 'other', label: t.other }
  ];

  const refundMethods = [
    { value: 'originalPayment', label: t.originalPayment },
    { value: 'storeCredit', label: t.storeCredit }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOrder && reason) {
      onSubmit({
        orderNumber: selectedOrder,
        reason,
        comments: comments.trim(),
        refundMethod
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t.newReturn}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="return-form">
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
                  {order.id} - {order.items} ({order.total})
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
            <label htmlFor="refundMethod">{t.refundMethod}</label>
            <select
              id="refundMethod"
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value)}
            >
              {refundMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
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
          
          <div className="modal-actions">
            <button type="button" className="action-btn cancel-btn" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="action-btn submit-btn">
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserReturns;
