import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const ResetPassword = ({ language = 'en' }) => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const translations = {
        en: {
            title: 'Reset Password',
            subtitle: 'Enter your new password below.',
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
            successSubtitle: 'You can now log in with your new password.',
            validatingMessage: 'Validating reset link...',
            passwordsDoNotMatch: 'Passwords do not match',
            passwordTooShort: 'Password must be at least 6 characters long',
            networkError: 'Network error. Please try again.',
            passwordRequirements: 'Password must be at least 6 characters long',
            showPassword: 'Show password',
            hidePassword: 'Hide password'
        },
        ru: {
            title: 'Сброс пароля',
            subtitle: 'Введите новый пароль ниже.',
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
            successSubtitle: 'Теперь вы можете войти с новым паролем.',
            validatingMessage: 'Проверка ссылки сброса...',
            passwordsDoNotMatch: 'Пароли не совпадают',
            passwordTooShort: 'Пароль должен содержать минимум 6 символов',
            networkError: 'Ошибка сети. Попробуйте снова.',
            passwordRequirements: 'Пароль должен содержать минимум 6 символов',
            showPassword: 'Показать пароль',
            hidePassword: 'Скрыть пароль'
        },
        pl: {
            title: 'Resetowanie hasła',
            subtitle: 'Wprowadź nowe hasło poniżej.',
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
            successSubtitle: 'Możesz teraz zalogować się nowym hasłem.',
            validatingMessage: 'Sprawdzanie linku resetującego...',
            passwordsDoNotMatch: 'Hasła nie pasują do siebie',
            passwordTooShort: 'Hasło musi mieć co najmniej 6 znaków',
            networkError: 'Błąd sieci. Spróbuj ponownie.',
            passwordRequirements: 'Hasło musi mieć co najmniej 6 znaków',
            showPassword: 'Pokaż hasło',
            hidePassword: 'Ukryj hasło'
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
        setMessage('');

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
            const response = await axios.post('/api/auth/reset-password', {
                token: token,
                newPassword: newPassword
            });

            setMessage(response.data.message);
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
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };    if (validating) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.title}</h1>
                        <p className="auth-subtitle">{t.validatingMessage}</p>
                    </div>
                    <div className="auth-form">
                        <div className="validating-message">
                            <div className="loading-spinner"></div>
                            <p style={{color: 'var(--text-secondary)', fontSize: '16px', marginTop: '10px'}}>
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
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.invalidLinkTitle}</h1>
                        <p className="auth-subtitle">Please request a new password reset link.</p>
                    </div>
                    <div className="auth-form">
                        <div className="error-message">
                            <span style={{fontSize: '24px', marginRight: '10px'}}>🔒</span>
                            {error || 'This reset link is invalid or has expired'}
                        </div>
                        <button 
                            type="button" 
                            className="auth-btn primary"
                            onClick={handleBackToLogin}
                        >
                            ← {t.backToLogin}
                        </button>
                    </div>
                </div>
            </div>
        );
    }    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.successTitle}</h1>
                        <p className="auth-subtitle">{t.successMessage}</p>
                    </div>
                    <div className="auth-form">
                        <div className="success-message">
                            <div className="success-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="var(--success)" stroke="var(--bg-secondary)" strokeWidth="2"/>
                                    <path d="m9 12 2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="success-title">{t.successMessage}</p>
                            <p className="success-subtitle">{t.successSubtitle}</p>
                        </div>
                        <button 
                            type="button" 
                            className="auth-btn primary"
                            onClick={handleBackToLogin}
                        >
                            <span>🚀 {t.goToLogin}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>{t.title}</h1>
                    <p className="auth-subtitle">{t.subtitle}</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">{t.newPassword}</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t.newPasswordPlaceholder}
                                disabled={loading}
                                minLength="6"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                title={showPassword ? t.hidePassword : t.showPassword}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l.94.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-.93-.93"/>
                                        <path d="M1 1l22 22"/>
                                        <path d="M12 14a2 2 0 1 1-2-2"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="field-hint">{t.passwordRequirements}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">{t.confirmPassword}</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t.confirmPasswordPlaceholder}
                                disabled={loading}
                                minLength="6"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={toggleConfirmPasswordVisibility}
                                title={showConfirmPassword ? t.hidePassword : t.showPassword}
                                disabled={loading}
                            >
                                {showConfirmPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l.94.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-.93-.93"/>
                                        <path d="M1 1l22 22"/>
                                        <path d="M12 14a2 2 0 1 1-2-2"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}                    <button 
                        type="submit" 
                        className="auth-btn primary"
                        disabled={loading || !newPassword || !confirmPassword}
                    >
                        {loading && (
                            <span className="loading-spinner" style={{width: '16px', height: '16px', marginRight: '8px', display: 'inline-block'}}></span>
                        )}
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
