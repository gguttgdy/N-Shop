import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const ResetPassword = ({ language = 'en' }) => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState(false);

    const translations = {
        en: {
            title: 'Reset Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password',
            newPasswordPlaceholder: 'Enter new password',
            confirmPasswordPlaceholder: 'Confirm new password',
            resetButton: 'Reset Password',
            resettingButton: 'Resetting...',
            backToLogin: 'Back to Login',
            goToLogin: 'Go to Login',
            invalidLinkTitle: 'Invalid Link',
            successTitle: 'Password Reset Successfully',
            successMessage: 'Your password has been reset successfully.',
            validatingMessage: 'Validating reset link...',
            passwordsDoNotMatch: 'Passwords do not match',
            passwordTooShort: 'Password must be at least 6 characters long',
            networkError: 'Network error. Please try again.'
        },
        ru: {
            title: 'Сброс пароля',
            newPassword: 'Новый пароль',
            confirmPassword: 'Подтвердите новый пароль',
            newPasswordPlaceholder: 'Введите новый пароль',
            confirmPasswordPlaceholder: 'Подтвердите новый пароль',
            resetButton: 'Сбросить пароль',
            resettingButton: 'Сброс...',
            backToLogin: 'Вернуться к входу',
            goToLogin: 'Перейти к входу',
            invalidLinkTitle: 'Недействительная ссылка',
            successTitle: 'Пароль успешно сброшен',
            successMessage: 'Ваш пароль был успешно сброшен.',
            validatingMessage: 'Проверка ссылки сброса...',
            passwordsDoNotMatch: 'Пароли не совпадают',
            passwordTooShort: 'Пароль должен содержать минимум 6 символов',
            networkError: 'Ошибка сети. Попробуйте снова.'
        },
        pl: {
            title: 'Resetowanie hasła',
            newPassword: 'Nowe hasło',
            confirmPassword: 'Potwierdź nowe hasło',
            newPasswordPlaceholder: 'Wprowadź nowe hasło',
            confirmPasswordPlaceholder: 'Potwierdź nowe hasło',
            resetButton: 'Resetuj hasło',
            resettingButton: 'Resetowanie...',
            backToLogin: 'Powrót do logowania',
            goToLogin: 'Przejdź do logowania',
            invalidLinkTitle: 'Nieprawidłowy link',
            successTitle: 'Hasło zostało zresetowane',
            successMessage: 'Twoje hasło zostało pomyślnie zresetowane.',
            validatingMessage: 'Sprawdzanie linku resetującego...',
            passwordsDoNotMatch: 'Hasła nie pasują do siebie',
            passwordTooShort: 'Hasło musi mieć co najmniej 6 znaków',
            networkError: 'Błąd sieci. Spróbuj ponownie.'
        }
    };

    const t = translations[language] || translations.en;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        
        if (resetToken) {
            setToken(resetToken);
            validateToken(resetToken);
        } else {
            setError('Invalid reset link');
            setValidating(false);
        }
    }, []);

    const validateToken = async (resetToken) => {
        try {
            const response = await axios.post('/api/auth/validate-reset-token', {
                token: resetToken
            });

            if (response.data.valid) {
                setTokenValid(true);
            } else {
                setError('This reset link is invalid or has expired');
            }
        } catch (error) {
            setError('Invalid or expired reset link');
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError(t.passwordsDoNotMatch);
            return;
        }

        if (newPassword.length < 6) {
            setError(t.passwordTooShort);
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/auth/reset-password', {
                token: token,
                newPassword: newPassword
            });

            setSuccess(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setError(t.networkError);
            } else {
                setError('An error occurred while resetting your password');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        window.location.href = '/';
    };    if (validating) {
        return (
            <div className="auth-page">
                <div className="auth-content">
                    <div className="auth-container">
                        <div className="auth-header">
                            <h1>{t.title}</h1>
                        </div>
                        <div className="auth-form">
                            <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                                {t.validatingMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }    if (!tokenValid) {
        return (
            <div className="auth-page">
                <div className="auth-content">
                    <div className="auth-container">
                        <div className="auth-header">
                            <h1>{t.invalidLinkTitle}</h1>
                        </div>
                        <div className="auth-form">
                            <div className="error-message">
                                {error || 'This reset link is invalid or has expired'}
                            </div>
                            <button 
                                type="button" 
                                className="auth-btn primary"
                                onClick={handleBackToLogin}
                            >
                                {t.backToLogin}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-content">
                    <div className="auth-container">
                        <div className="auth-header">
                            <h1>{t.successTitle}</h1>
                        </div>
                        <div className="auth-form">
                            <p style={{color: 'var(--success)', textAlign: 'center', marginBottom: '20px'}}>
                                {t.successMessage}
                            </p>
                            <button 
                                type="button" 
                                className="auth-btn primary"
                                onClick={handleBackToLogin}                        >
                            {t.goToLogin}
                        </button>
                    </div>
                </div>
                </div>
            </div>
        );
    }    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.title}</h1>
                    </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="newPassword">{t.newPassword}</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t.newPasswordPlaceholder}
                            disabled={loading}
                            minLength="6"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">{t.confirmPassword}</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t.confirmPasswordPlaceholder}
                            disabled={loading}
                            minLength="6"
                            autoComplete="new-password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-btn primary"
                        disabled={loading || !newPassword || !confirmPassword}
                    >
                        {loading ? t.resettingButton : t.resetButton}
                    </button>

                    <div className="auth-footer">
                        <button 
                            type="button" 
                            className="link-btn"
                            onClick={handleBackToLogin}
                            disabled={loading}
                        >
                            ← {t.backToLogin}
                        </button>
                    </div>                </form>
            </div>
            </div>
        </div>
    );
};

export default ResetPassword;
