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
      emailSent: 'Email отправлен',      download: 'Скачать HTML',
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
      emailSent: 'Email Sent',      download: 'Download HTML',
      view: 'View',
      yes: 'Yes',
      no: 'No',
      breakdown: 'Breakdown'
    },    pl: {
      title: 'Moje paragony',
      noReceipts: 'Nie masz jeszcze żadnych paragonów',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania paragonów',
      receiptNumber: 'Paragon #',
      date: 'Data',
      totalAmount: 'Łączna kwota',
      taxAmount: 'Podatek',
      shippingAmount: 'Dostawa',
      paymentMethod: 'Metoda płatności',
      transactionId: 'ID transakcji',
      emailSent: 'Wysłane mailem',
      download: 'Pobierz HTML',
      view: 'Zobacz',
      yes: 'Tak',
      no: 'Nie',
      breakdown: 'Szczegóły'
    }
  };

  const t = translations[language];  useEffect(() => {
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
        <h2>{t.title}</h2>
          {receipts.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
            <p>{t.noReceipts}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Чеки появятся здесь после оформления заказов' : 
               language === 'en' ? 'Receipts will appear here after placing orders' :
               'Paragony pojawią się tutaj po złożeniu zamówień'}
            </p>
          </div>
        ) : (
          <div className="receipts-list">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="receipt-card">
                <div className="receipt-header">
                  <h3>🧾 {t.receiptNumber}: {receipt.receiptNumber}</h3>
                  <div className="receipt-actions">                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleView(receipt.id)}
                      title={t.view}
                    >
                      👁️ {t.view}
                    </button>
                    <button 
                      className="action-btn download-btn"
                      onClick={() => handleDownload(receipt.id)}
                      title={t.download}
                    >
                      💾 {t.download}
                    </button>
                  </div>
                </div>
                <div className="receipt-details">                  <div className="receipt-info">
                    <p><strong>📅 {t.date}:</strong> <span>{new Date(receipt.issuedAt || receipt.createdAt).toLocaleDateString()}</span></p>
                    <p><strong>💰 {t.totalAmount}:</strong> <span>{convertAndFormatPrice ? convertAndFormatPrice(receipt.totalAmount) : `${receipt.currency || '$'}${receipt.totalAmount}`}</span></p>
                    <p><strong>💳 {t.paymentMethod}:</strong> <span>{receipt.paymentMethod}</span></p>
                  </div><div className="receipt-breakdown">
                    <h4>{t.breakdown}</h4>
                    <div className="breakdown-item">
                      <span>{t.taxAmount}:</span>
                      <span>{convertAndFormatPrice ? convertAndFormatPrice(receipt.taxAmount || 0) : `${receipt.currency || '$'}${receipt.taxAmount || 0}`}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>{t.shippingAmount}:</span>
                      <span>{convertAndFormatPrice ? convertAndFormatPrice(receipt.shippingAmount || 0) : `${receipt.currency || '$'}${receipt.shippingAmount || 0}`}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>{t.totalAmount}:</span>
                      <span>{convertAndFormatPrice ? convertAndFormatPrice(receipt.totalAmount) : `${receipt.currency || '$'}${receipt.totalAmount}`}</span>
                    </div>
                  </div>                  <div className="receipt-meta">
                    <p><strong>🔗 {t.transactionId}:</strong> {receipt.paymentTransactionId}</p>
                    <p><strong>Email Sent:</strong> {receipt.emailSent ? t.yes : t.no}</p>
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

export default UserReceipts;
