import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReceipts = ({ language, user, loading: userLoading, currency, formatPrice, convertAndFormatPrice }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const translations = {
    ru: {
      title: 'Мои чеки',
      noReceipts: 'У вас пока нет чеков',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки чеков',
      receiptNumber: 'Чек №',
      date: 'Дата',
      totalAmount: 'Сумма',
      taxAmount: 'Налог',
      shippingAmount: 'Доставка',
      paymentMethod: 'Оплата',
      transactionId: 'ID транзакции',
      emailSent: 'Email отправлен',
      download: 'Скачать',
      view: 'Просмотр',
      yes: 'Да',
      no: 'Нет',
      breakdown: 'Детали'
    },
    en: {
      title: 'My Receipts',
      noReceipts: 'You have no receipts yet',
      loading: 'Loading...',
      error: 'Error loading receipts',
      receiptNumber: 'Receipt #',
      date: 'Date',
      totalAmount: 'Total',
      taxAmount: 'Tax',
      shippingAmount: 'Shipping',
      paymentMethod: 'Payment',
      transactionId: 'Transaction ID',
      emailSent: 'Email Sent',
      download: 'Download',
      view: 'View',
      yes: 'Yes',
      no: 'No',
      breakdown: 'Breakdown'
    },
    pl: {
      title: 'Moje paragony',
      noReceipts: 'Nie masz jeszcze żadnych paragonów',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania paragonów',
      receiptNumber: 'Paragon #',
      date: 'Data',
      totalAmount: 'Suma',
      taxAmount: 'Podatek',
      shippingAmount: 'Dostawa',
      paymentMethod: 'Płatność',
      transactionId: 'ID transakcji',
      emailSent: 'Email wysłany',
      download: 'Pobierz',
      view: 'Zobacz',
      yes: 'Tak',
      no: 'Nie',
      breakdown: 'Szczegóły'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        console.log('Fetching receipts for user:', user);
        setLoading(true);
        const receiptsData = await authService.getReceipts();
        console.log('Receipts received:', receiptsData);
        setReceipts(receiptsData);
      } catch (err) {
        console.error('Error fetching receipts:', err);
        console.error('Error details:', err.response?.data);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch receipts
    if (!userLoading && user) {
      fetchReceipts();
    } else if (!userLoading && !user) {
      console.log('No user found after loading, skipping receipts fetch');
      setLoading(false);
    }
  }, [user, userLoading, t.error]);

  const handleDownload = async (receiptId) => {
    try {
      await authService.downloadReceiptPdf(receiptId);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Ошибка при скачивании чека. Попробуйте позже.');
    }
  };

  const handleView = async (receiptId) => {
    try {
      await authService.viewReceiptPdf(receiptId);
    } catch (err) {
      console.error('Error viewing receipt:', err);
      alert('Ошибка при просмотре чека. Попробуйте позже.');
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
        <h2 className="page-title">{t.title}</h2>
        
        {receipts.length === 0 ? (
          <div className="no-data-message">
            <div className="no-data-icon">📧</div>
            <h3>{t.noReceipts}</h3>
            <p>Оформите заказ, чтобы получить первый чек</p>
          </div>
        ) : (
          <div className="receipts-grid">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="receipt-card">
                <div className="receipt-header">
                  <div className="receipt-icon">📄</div>
                  <div className="receipt-info">
                    <h3 className="receipt-title">{t.receiptNumber}{receipt.receiptNumber}</h3>
                    <span className="receipt-date">
                      {new Date(receipt.issuedAt || receipt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="receipt-amount">
                    {convertAndFormatPrice ? 
                      convertAndFormatPrice(receipt.totalAmount) : 
                      `${receipt.currency || '$'}${receipt.totalAmount}`
                    }
                  </div>
                </div>

                <div className="receipt-details">
                  <div className="detail-row">
                    <span className="detail-label">{t.paymentMethod}:</span>
                    <span className="detail-value">{receipt.paymentMethod}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">{t.transactionId}:</span>
                    <span className="detail-value transaction-id">{receipt.paymentTransactionId}</span>
                  </div>

                  <div className="breakdown-section">
                    <h4 className="breakdown-title">{t.breakdown}</h4>
                    <div className="breakdown-grid">
                      {receipt.shippingAmount && (
                        <div className="breakdown-item">
                          <span>{t.shippingAmount}</span>
                          <span>{convertAndFormatPrice ? 
                            convertAndFormatPrice(receipt.shippingAmount) : 
                            `${receipt.currency || '$'}${receipt.shippingAmount}`}
                          </span>
                        </div>
                      )}
                      
                      {receipt.taxAmount && (
                        <div className="breakdown-item">
                          <span>{t.taxAmount}</span>
                          <span>{convertAndFormatPrice ? 
                            convertAndFormatPrice(receipt.taxAmount) : 
                            `${receipt.currency || '$'}${receipt.taxAmount}`}
                          </span>
                        </div>
                      )}
                      
                      <div className="breakdown-item total">
                        <span>{t.totalAmount}</span>
                        <span>{convertAndFormatPrice ? 
                          convertAndFormatPrice(receipt.totalAmount) : 
                          `${receipt.currency || '$'}${receipt.totalAmount}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="receipt-meta">
                    <div className="email-status">
                      <span className={`email-badge ${receipt.emailSent ? 'sent' : 'not-sent'}`}>
                        {receipt.emailSent ? '✓ ' + t.yes : '✗ ' + t.no}
                      </span>
                      <span className="email-label">{t.emailSent}</span>
                    </div>
                  </div>
                </div>

                <div className="receipt-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleView(receipt.id)}
                    title={t.view}
                  >
                    <span className="btn-icon">👁️</span>
                    {t.view}
                  </button>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => handleDownload(receipt.id)}
                    title={t.download}
                  >
                    <span className="btn-icon">⬇️</span>
                    {t.download}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReceipts;
