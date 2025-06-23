import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserMyData = ({ language = 'en' }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingPostalCode: ''
  });

  const translations = {
    ru: {
      title: 'Мои данные',
      personalInfo: 'Личная информация',
      billingInfo: 'Платежная информация',
      accountInfo: 'Информация об аккаунте',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phoneNumber: 'Телефон',
      dateOfBirth: 'Дата рождения',
      billingAddress: 'Адрес',
      billingCity: 'Город',
      billingCountry: 'Страна',
      billingPostalCode: 'Почтовый индекс',
      memberSince: 'Участник с',
      lastLogin: 'Последний вход',
      accountStatus: 'Статус аккаунта',
      emailVerified: 'Email подтвержден',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      notSet: 'Не указан',
      verified: 'Подтвержден',
      notVerified: 'Не подтвержден',
      active: 'Активен',
      profileUpdated: 'Профиль успешно обновлен',
      updateError: 'Ошибка при обновлении профиля',
      loading: 'Загрузка...',
      personalTab: 'Личные данные',
      billingTab: 'Платежные данные',
      accountTab: 'Аккаунт'
    },
    en: {
      title: 'My Data',
      personalInfo: 'Personal Information',
      billingInfo: 'Billing Information',
      accountInfo: 'Account Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      billingAddress: 'Address',
      billingCity: 'City',
      billingCountry: 'Country',
      billingPostalCode: 'Postal Code',
      memberSince: 'Member since',
      lastLogin: 'Last login',
      accountStatus: 'Account status',
      emailVerified: 'Email verified',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      notSet: 'Not set',
      verified: 'Verified',
      notVerified: 'Not verified',
      active: 'Active',
      profileUpdated: 'Profile updated successfully',
      updateError: 'Error updating profile',
      loading: 'Loading...',
      personalTab: 'Personal Data',
      billingTab: 'Billing Data',
      accountTab: 'Account'
    },
    pl: {
      title: 'Moje dane',
      personalInfo: 'Informacje osobiste',
      billingInfo: 'Informacje płatnicze',
      accountInfo: 'Informacje o koncie',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      phoneNumber: 'Numer telefonu',
      dateOfBirth: 'Data urodzenia',
      billingAddress: 'Adres',
      billingCity: 'Miasto',
      billingCountry: 'Kraj',
      billingPostalCode: 'Kod pocztowy',
      memberSince: 'Członek od',
      lastLogin: 'Ostatnie logowanie',
      accountStatus: 'Status konta',
      emailVerified: 'Email zweryfikowany',
      edit: 'Edytuj',
      save: 'Zapisz',
      cancel: 'Anuluj',
      notSet: 'Nie ustawiono',
      verified: 'Zweryfikowany',
      notVerified: 'Nie zweryfikowany',
      active: 'Aktywny',
      profileUpdated: 'Profil został pomyślnie zaktualizowany',
      updateError: 'Błąd podczas aktualizacji profilu',
      loading: 'Ładowanie...',
      personalTab: 'Dane osobowe',
      billingTab: 'Dane płatnicze',
      accountTab: 'Konto'
    }
  };

  const t = translations[language];
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const profile = await authService.getProfile();
        setUser(profile);
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phoneNumber: profile.phoneNumber || '',
          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
          billingAddress: profile.billingAddress || '',
          billingCity: profile.billingCity || '',
          billingCountry: profile.billingCountry || '',
          billingPostalCode: profile.billingPostalCode || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError(t.updateError);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [t.updateError]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setEditing(false);
      setSuccess(t.profileUpdated);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || t.updateError);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      billingAddress: user.billingAddress || '',
      billingCity: user.billingCity || '',
      billingCountry: user.billingCountry || '',
      billingPostalCode: user.billingPostalCode || ''
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return t.notSet;
    try {
      return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : language === 'pl' ? 'pl-PL' : 'ru-RU');
    } catch {
      return t.notSet;
    }
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

  if (error && !user) {
    return (
      <div className="user-profile-container">
        <div className="profile-content">
          <h2>{t.title}</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="my-data-page">
      <div className="my-data-container">
        {/* Header with gradient background like hero banner */}
        <div className="my-data-header">
          <div className="header-content">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="header-text">
              <h1 className="page-title">{t.title}</h1>
              <p className="page-subtitle">
                {language === 'ru' ? 'Управляйте своими личными данными и настройками' :
                 language === 'pl' ? 'Zarządzaj swoimi danymi osobowymi i ustawieniami' :
                 'Manage your personal data and settings'}
              </p>
            </div>
            {!editing && (
              <button 
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                <span className="btn-icon">✏️</span>
                <span className="btn-text">{t.edit}</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Alerts */}
        {error && (
          <div className="enhanced-alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="enhanced-alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-text">{success}</span>
          </div>
        )}

        {/* Modern Tab Navigation */}
        <div className="modern-tabs">
          <div className="tabs-container">
            <button 
              className={`modern-tab ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <span className="tab-icon">👤</span>
              <span className="tab-label">{t.personalTab}</span>
            </button>
            <button 
              className={`modern-tab ${activeSection === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveSection('billing')}
            >
              <span className="tab-icon">💳</span>
              <span className="tab-label">{t.billingTab}</span>
            </button>
            <button 
              className={`modern-tab ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              <span className="tab-icon">⚙️</span>
              <span className="tab-label">{t.accountTab}</span>
            </button>
          </div>        </div>

        {/* Content Sections */}
        {!editing ? (
          <div className="modern-content">
            {/* Personal Information Tab */}
            {activeSection === 'personal' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>{t.personalInfo}</h3>
                  <div className="header-icon">👤</div>
                </div>
                <div className="modern-data-grid">
                  <div className="data-card">
                    <div className="data-label">{t.firstName}</div>
                    <div className="data-value">{user.firstName || t.notSet}</div>
                  </div>                  <div className="data-card">
                    <div className="data-label">{t.lastName}</div>
                    <div className="data-value">{user.lastName || t.notSet}</div>
                  </div>
                  <div className="data-card featured">
                    <div className="data-label">{t.email}</div>
                    <div className="data-value">
                      <span className="email-text">{user.email}</span>
                      <span className={`verification-badge ${user.emailVerified ? 'verified' : 'not-verified'}`}>
                        {user.emailVerified ? '✓' : '⚠️'}
                      </span>
                    </div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.phoneNumber}</div>
                    <div className="data-value">{user.phoneNumber || t.notSet}</div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.dateOfBirth}</div>
                    <div className="data-value">{formatDate(user.dateOfBirth)}</div>
                  </div>
                </div>
              </div>
            )}            {/* Billing Information Tab */}
            {activeSection === 'billing' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>{t.billingInfo}</h3>
                  <div className="header-icon">💳</div>
                </div>
                <div className="modern-data-grid">
                  <div className="data-card wide">
                    <div className="data-label">{t.billingAddress}</div>
                    <div className="data-value">{user.billingAddress || t.notSet}</div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.billingCity}</div>
                    <div className="data-value">{user.billingCity || t.notSet}</div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.billingCountry}</div>
                    <div className="data-value">{user.billingCountry || t.notSet}</div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.billingPostalCode}</div>
                    <div className="data-value">{user.billingPostalCode || t.notSet}</div>
                  </div>
                </div>
              </div>
            )}            {/* Account Information Tab */}
            {activeSection === 'account' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>{t.accountInfo}</h3>
                  <div className="header-icon">⚙️</div>
                </div>
                <div className="modern-data-grid">
                  <div className="data-card">
                    <div className="data-label">{t.memberSince}</div>
                    <div className="data-value">{formatDate(user.createdAt)}</div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.lastLogin}</div>
                    <div className="data-value">{formatDate(user.lastLogin)}</div>
                  </div>
                  <div className="data-card featured">
                    <div className="data-label">{t.accountStatus}</div>
                    <div className="data-value">
                      <span className="status-badge active">{t.active}</span>
                    </div>
                  </div>
                  <div className="data-card">
                    <div className="data-label">{t.emailVerified}</div>
                    <div className="data-value">
                      <span className={`status-badge ${user.emailVerified ? 'verified' : 'pending'}`}>
                        {user.emailVerified ? t.verified : t.notVerified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="edit-mode">
            <form onSubmit={handleSave} className="modern-form">              {/* Personal Information Form */}
              {activeSection === 'personal' && (
                <div className="form-section">
                  <div className="section-header">
                    <h3>{t.personalInfo}</h3>
                    <div className="header-icon">👤</div>
                  </div>
                  <div className="modern-form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">{t.firstName}</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">{t.lastName}</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">{t.phoneNumber}</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dateOfBirth">{t.dateOfBirth}</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Information Form */}
              {activeSection === 'billing' && (
                <div className="form-section">
                  <div className="section-header">
                    <h3>{t.billingInfo}</h3>
                    <div className="header-icon">💳</div>
                  </div>
                  <div className="modern-form-grid">
                    <div className="form-group wide">
                      <label htmlFor="billingAddress">{t.billingAddress}</label>
                      <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="billingCity">{t.billingCity}</label>
                      <input
                        type="text"
                        id="billingCity"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="billingCountry">{t.billingCountry}</label>
                      <input
                        type="text"
                        id="billingCountry"
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="billingPostalCode">{t.billingPostalCode}</label>
                      <input
                        type="text"
                        id="billingPostalCode"
                        name="billingPostalCode"
                        value={formData.billingPostalCode}
                        onChange={handleInputChange}
                        disabled={saving}
                        className="modern-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  <span className="btn-icon">{saving ? '⏳' : '💾'}</span>
                  <span className="btn-text">{saving ? 'Saving...' : t.save}</span>
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <span className="btn-icon">❌</span>
                  <span className="btn-text">{t.cancel}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMyData;
