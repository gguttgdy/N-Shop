import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReceipts = ({ language }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    ru: {
      title: 'Мои чеки',
      noReceipts: 'У вас пока нет чеков',
      receiptNumber: 'Номер чека',
      date: 'Дата',
      amount: 'Сумма',
      status: 'Статус',
      download: 'Скачать',
      view: 'Просмотр',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки чеков'
    },
    en: {
      title: 'My Receipts',
      noReceipts: 'You have no receipts yet',
      receiptNumber: 'Receipt Number',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      download: 'Download',
      view: 'View',
      loading: 'Loading...',
      error: 'Error loading receipts'
    },
    pl: {
      title: 'Moje paragony',
      noReceipts: 'Nie masz jeszcze żadnych paragonów',
      receiptNumber: 'Numer paragonu',
      date: 'Data',
      amount: 'Kwota',
      status: 'Status',
      download: 'Pobierz',
      view: 'Zobacz',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania paragonów'
    }
  };

  const t = translations[language];
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.getReceipts();
      setReceipts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (receiptId) => {
    // Implement receipt download logic
    console.log('Downloading receipt:', receiptId);
  };

  const handleView = (receiptId) => {
    // Implement receipt view logic
    console.log('Viewing receipt:', receiptId);
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
        <h2>{t.title}</h2>
        
        {receipts.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noReceipts}</p>
          </div>
        ) : (
          <div className="receipts-list">
            <div className="receipts-table">
              <div className="table-header">
                <div className="header-cell">{t.receiptNumber}</div>
                <div className="header-cell">{t.date}</div>
                <div className="header-cell">{t.amount}</div>
                <div className="header-cell">{t.status}</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {receipts.map(receipt => (
                <div key={receipt.id} className="table-row">
                  <div className="table-cell">{receipt.receiptNumber}</div>
                  <div className="table-cell">{receipt.date}</div>
                  <div className="table-cell">${receipt.amount}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${receipt.status.toLowerCase()}`}>
                      {receipt.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleView(receipt.id)}
                    >
                      {t.view}
                    </button>
                    <button 
                      className="action-btn download-btn"
                      onClick={() => handleDownload(receipt.id)}
                    >
                      {t.download}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReceipts;
