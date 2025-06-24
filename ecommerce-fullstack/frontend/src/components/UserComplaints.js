import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserComplaints = ({ language }) => {
  const { user, loading: userLoading } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const translations = {
    ru: {
      title: 'Мои жалобы',
      noComplaints: 'У вас пока нет активных жалоб',
      subject: 'Тема',
      description: 'Описание',
      date: 'Дата',
      status: 'Статус',
      view: 'Просмотреть',
      edit: 'Редактировать',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки жалоб',
      open: 'Открыта',
      inprogress: 'В обработке',
      resolved: 'Решена',
      closed: 'Закрыта',
      createNew: 'Создать жалобу',
      newComplaint: 'Новая жалобы',
      complaintSubject: 'Введите тему жалобы',
      complaintDescription: 'Подробно опишите проблему',
      cancel: 'Отмена',
      submit: 'Отправить',
      priority: 'Приоритет',
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий'
    },
    en: {
      title: 'My Complaints',
      noComplaints: 'You have no active complaints yet',
      subject: 'Subject',
      description: 'Description',
      date: 'Date',
      status: 'Status',
      view: 'View',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error loading complaints',
      open: 'Open',
      inprogress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      createNew: 'Create Complaint',
      newComplaint: 'New Complaint',
      complaintSubject: 'Enter complaint subject',
      complaintDescription: 'Describe the problem in detail',
      cancel: 'Cancel',
      submit: 'Submit',
      priority: 'Priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    pl: {
      title: 'Moje reklamacje',
      noComplaints: 'Nie masz jeszcze aktywnych reklamacji',
      subject: 'Temat',
      description: 'Opis',
      date: 'Data',
      status: 'Status',
      view: 'Zobacz',
      edit: 'Edytuj',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania reklamacji',
      open: 'Otwarta',
      inprogress: 'W trakcie',
      resolved: 'Rozwiązana',
      closed: 'Zamknięta',
      createNew: 'Utwórz reklamację',
      newComplaint: 'Nowa reklamacja',
      complaintSubject: 'Wprowadź temat reklamacji',
      complaintDescription: 'Opisz problem szczegółowo',
      cancel: 'Anuluj',
      submit: 'Wyślij',
      priority: 'Priorytet',
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const complaintsData = await authService.getComplaints();
        setComplaints(complaintsData);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch complaints
    if (!userLoading && user) {
      fetchComplaints();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, t.error]);

  const handleViewComplaint = (complaintId) => {
    // Implement view complaint logic - could open modal or navigate to detail page
    console.log('Viewing complaint:', complaintId);
  };

  const handleEditComplaint = (complaintId) => {
    // Implement edit complaint logic
    console.log('Editing complaint:', complaintId);
  };

  const handleCreateComplaint = () => {
    setShowCreateForm(true);
  };

  const handleSubmitComplaint = async (complaintData) => {
    try {
      // Here would be API call to create complaint
      // await authService.createComplaint(complaintData);
      console.log('Creating complaint:', complaintData);
      setShowCreateForm(false);
      // Refresh complaints list
      // fetchComplaints();
    } catch (err) {
      console.error('Error creating complaint:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '🔓';
      case 'inprogress': case 'in_progress': return '⚙️';
      case 'resolved': return '✅';
      case 'closed': return '🔒';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
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
        
        {complaints.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p>{t.noComplaints}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Жалобы появятся здесь после создания' : 
               language === 'en' ? 'Complaints will appear here after creation' :
               'Reklamacje pojawią się tutaj po utworzeniu'}
            </p>
            <button 
              className="action-btn create-btn"
              onClick={handleCreateComplaint}
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
                onClick={handleCreateComplaint}
              >
                ➕ {t.createNew}
              </button>
            </div>
            
            <div className="complaints-list">
              {complaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <h3>📋 {complaint.subject}</h3>
                  <div className="complaint-badges">
                    {complaint.priority && (
                      <span className={`priority-badge priority-${complaint.priority?.toLowerCase()}`}>
                        {getPriorityIcon(complaint.priority)} {t[complaint.priority?.toLowerCase()]}
                      </span>
                    )}
                    <span className={`status-badge status-${complaint.status?.toLowerCase()}`}>
                      {getStatusIcon(complaint.status)} {t[complaint.status?.toLowerCase()]}
                    </span>
                  </div>
                </div>
                
                <div className="complaint-details">
                  <div className="complaint-info">
                    <p><strong>📅 {t.date}:</strong> <span>{formatDate(complaint.createdAt)}</span></p>
                    {complaint.orderId && (
                      <p><strong>📦 Заказ:</strong> <span>{complaint.orderId}</span></p>
                    )}
                  </div>

                  {complaint.description && (
                    <div className="complaint-content">
                      <h4>💬 {t.description}</h4>
                      <p className="complaint-text">{complaint.description}</p>
                    </div>
                  )}

                  <div className="complaint-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewComplaint(complaint.id)}
                    >
                      👁️ {t.view}
                    </button>
                    {(complaint.status?.toLowerCase() === 'open' || complaint.status?.toLowerCase() === 'inprogress') && (
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditComplaint(complaint.id)}
                      >
                        ✏️ {t.edit}
                      </button>
                    )}
                  </div>
                </div>              </div>
            ))}
          </div>
          </>
        )}
      </div>

      {showCreateForm && (
        <CreateComplaintModal 
          language={language}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleSubmitComplaint}
        />
      )}
    </div>
  );
};

// Modal component for creating new complaints
const CreateComplaintModal = ({ language, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const translations = {
    ru: {
      newComplaint: 'Новая жалоба',
      complaintSubject: 'Введите тему жалобы',
      complaintDescription: 'Подробно опишите проблему',
      priority: 'Приоритет',
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      cancel: 'Отмена',
      submit: 'Отправить'
    },
    en: {
      newComplaint: 'New Complaint',
      complaintSubject: 'Enter complaint subject',
      complaintDescription: 'Describe the problem in detail',
      priority: 'Priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    pl: {
      newComplaint: 'Nowa reklamacja',
      complaintSubject: 'Wprowadź temat reklamacji',
      complaintDescription: 'Opisz problem szczegółowo',
      priority: 'Priorytet',
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki',
      cancel: 'Anuluj',
      submit: 'Wyślij'
    }
  };

  const t = translations[language] || translations.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject.trim() && description.trim()) {
      onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        priority
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t.newComplaint}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="subject">{t.complaintSubject}</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.complaintSubject}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">{t.priority}</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">{t.complaintDescription}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.complaintDescription}
              rows="4"
              required
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

export default UserComplaints;
