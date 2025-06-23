import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserComplaints = ({ language }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);

  const translations = {
    ru: {
      title: 'Мои рекламации',
      noComplaints: 'У вас пока нет рекламаций',
      complaintNumber: 'Номер рекламации',
      subject: 'Тема',
      description: 'Описание',
      date: 'Дата',
      status: 'Статус',
      priority: 'Приоритет',
      view: 'Просмотр',
      newComplaint: 'Новая рекламация',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки рекламаций',
      open: 'Открыта',
      inProgress: 'В работе',
      resolved: 'Решена',
      closed: 'Закрыта',
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий',
      createComplaint: 'Создать рекламацию',
      cancel: 'Отмена',
      subjectPlaceholder: 'Введите тему рекламации',
      descriptionPlaceholder: 'Опишите вашу проблему подробно'
    },
    en: {
      title: 'My Complaints',
      noComplaints: 'You have no complaints yet',
      complaintNumber: 'Complaint Number',
      subject: 'Subject',
      description: 'Description',
      date: 'Date',
      status: 'Status',
      priority: 'Priority',
      view: 'View',
      newComplaint: 'New Complaint',
      loading: 'Loading...',
      error: 'Error loading complaints',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      createComplaint: 'Create Complaint',
      cancel: 'Cancel',
      subjectPlaceholder: 'Enter complaint subject',
      descriptionPlaceholder: 'Describe your problem in detail'
    },
    pl: {
      title: 'Moje reklamacje',
      noComplaints: 'Nie masz jeszcze żadnych reklamacji',
      complaintNumber: 'Numer reklamacji',
      subject: 'Temat',
      description: 'Opis',
      date: 'Data',
      status: 'Status',
      priority: 'Priorytet',
      view: 'Zobacz',
      newComplaint: 'Nowa reklamacja',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania reklamacji',
      open: 'Otwarta',
      inProgress: 'W trakcie',
      resolved: 'Rozwiązana',
      closed: 'Zamknięta',
      high: 'Wysoki',
      medium: 'Średni',
      low: 'Niski',
      createComplaint: 'Utwórz reklamację',
      cancel: 'Anuluj',
      subjectPlaceholder: 'Wprowadź temat reklamacji',
      descriptionPlaceholder: 'Opisz swój problem szczegółowo'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchComplaints();
  }, [user]);
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.getComplaints();
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewComplaint = (complaintId) => {
    console.log('Viewing complaint:', complaintId);
    // Implement view complaint logic
  };

  const handleCreateComplaint = (formData) => {
    // Implement create complaint logic
    console.log('Creating complaint:', formData);
    setShowNewComplaintForm(false);
    // Refresh complaints list
    fetchComplaints();
  };

  const NewComplaintForm = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (subject.trim() && description.trim()) {
        handleCreateComplaint({ subject, description });
        setSubject('');
        setDescription('');
      }
    };

    return (
      <div className="complaint-form-overlay">
        <div className="complaint-form">
          <h3>{t.newComplaint}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">{t.subject}</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.subjectPlaceholder}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">{t.description}</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows="5"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {t.createComplaint}
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                onClick={() => setShowNewComplaintForm(false)}
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
            onClick={() => setShowNewComplaintForm(true)}
          >
            {t.newComplaint}
          </button>
        </div>
        
        {complaints.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noComplaints}</p>
          </div>
        ) : (
          <div className="complaints-list">
            <div className="complaints-table">
              <div className="table-header">
                <div className="header-cell">{t.complaintNumber}</div>
                <div className="header-cell">{t.subject}</div>
                <div className="header-cell">{t.date}</div>
                <div className="header-cell">{t.status}</div>
                <div className="header-cell">{t.priority}</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {complaints.map(complaint => (
                <div key={complaint.id} className="table-row">
                  <div className="table-cell">{complaint.complaintNumber}</div>
                  <div className="table-cell">{complaint.subject}</div>
                  <div className="table-cell">{complaint.date}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${complaint.status}`}>
                      {t[complaint.status]}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span className={`priority-badge ${complaint.priority}`}>
                      {t[complaint.priority]}
                    </span>
                  </div>
                  <div className="table-cell">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewComplaint(complaint.id)}
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
      
      {showNewComplaintForm && <NewComplaintForm />}
    </div>
  );
};

export default UserComplaints;
