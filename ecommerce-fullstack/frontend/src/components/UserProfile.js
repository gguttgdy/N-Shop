import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserProfile = ({ language = 'en', user: initialUser, updateProfile }) => {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(!initialUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingPostalCode: ''
  });

  const translations = {
    ru: {
      profile: 'Профиль',
      personalInfo: 'Личная информация',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phoneNumber: 'Телефон',
      billingInfo: 'Платежная информация',
      billingAddress: 'Адрес',
      billingCity: 'Город',
      billingCountry: 'Страна',
      billingPostalCode: 'Почтовый индекс',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      notSet: 'Не указан',
      profileUpdated: 'Профиль успешно обновлен',
      updateError: 'Ошибка при обновлении профиля'
    },
    en: {
      profile: 'Profile',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      billingInfo: 'Billing Information',
      billingAddress: 'Address',
      billingCity: 'City',
      billingCountry: 'Country',
      billingPostalCode: 'Postal Code',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      notSet: 'Not set',
      profileUpdated: 'Profile updated successfully',
      updateError: 'Error updating profile'
    },
    pl: {
      profile: 'Profil',
      personalInfo: 'Informacje osobiste',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      phoneNumber: 'Numer telefonu',
      billingInfo: 'Informacje płatnicze',
      billingAddress: 'Adres',
      billingCity: 'Miasto',
      billingCountry: 'Kraj',
      billingPostalCode: 'Kod pocztowy',
      edit: 'Edytuj',
      save: 'Zapisz',
      cancel: 'Anuluj',
      notSet: 'Nie ustawiono',
      profileUpdated: 'Profil został pomyślnie zaktualizowany',
      updateError: 'Błąd podczas aktualizacji profilu'
    }
  };

  const t = translations[language];
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData({
        firstName: initialUser.firstName || '',
        lastName: initialUser.lastName || '',
        phoneNumber: initialUser.phoneNumber || '',
        billingAddress: initialUser.billingAddress || '',
        billingCity: initialUser.billingCity || '',
        billingCountry: initialUser.billingCountry || '',
        billingPostalCode: initialUser.billingPostalCode || ''
      });
      setLoading(false);
    } else {
      loadUserProfile();
    }
  }, [initialUser]);

  const loadUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
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
      const updatedUser = updateProfile 
        ? await updateProfile(formData)
        : await authService.updateProfile(formData);
      setUser(updatedUser);
      setEditing(false);
      setSuccess(t.profileUpdated);
      
      // Убираем сообщение об успехе через 3 секунды
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
      billingAddress: user.billingAddress || '',
      billingCity: user.billingCity || '',
      billingCountry: user.billingCountry || '',
      billingPostalCode: user.billingPostalCode || ''
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{t.profile}</h2>
        {!editing && (
          <button 
            className="edit-btn"
            onClick={() => setEditing(true)}
          >
            {t.edit}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!editing ? (
        <div className="profile-view">
          <div className="profile-section">
            <h3>{t.personalInfo}</h3>
            <div className="profile-field">
              <label>{t.firstName}:</label>
              <span>{user.firstName || t.notSet}</span>
            </div>
            <div className="profile-field">
              <label>{t.lastName}:</label>
              <span>{user.lastName || t.notSet}</span>
            </div>
            <div className="profile-field">
              <label>{t.email}:</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-field">
              <label>{t.phoneNumber}:</label>
              <span>{user.phoneNumber || t.notSet}</span>
            </div>
          </div>

          <div className="profile-section">
            <h3>{t.billingInfo}</h3>
            <div className="profile-field">
              <label>{t.billingAddress}:</label>
              <span>{user.billingAddress || t.notSet}</span>
            </div>
            <div className="profile-field">
              <label>{t.billingCity}:</label>
              <span>{user.billingCity || t.notSet}</span>
            </div>
            <div className="profile-field">
              <label>{t.billingCountry}:</label>
              <span>{user.billingCountry || t.notSet}</span>
            </div>
            <div className="profile-field">
              <label>{t.billingPostalCode}:</label>
              <span>{user.billingPostalCode || t.notSet}</span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="profile-edit">
          <div className="profile-section">
            <h3>{t.personalInfo}</h3>
            <div className="form-group">
              <label htmlFor="firstName">{t.firstName}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={saving}
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
              />
            </div>
          </div>

          <div className="profile-section">
            <h3>{t.billingInfo}</h3>
            <div className="form-group">
              <label htmlFor="billingAddress">{t.billingAddress}</label>
              <input
                type="text"
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                disabled={saving}
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
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? '...' : t.save}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={handleCancel}
              disabled={saving}
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
