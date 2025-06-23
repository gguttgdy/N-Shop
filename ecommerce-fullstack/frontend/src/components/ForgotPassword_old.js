import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = ({ language = 'en' }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const translations = {
        en: {
            title: 'Forgot Password',
            subtitle: 'Enter your email address and we\'ll send you a link to reset your password.',
            emailPlaceholder: 'Enter your email address',
            sendButton: 'Send Reset Link',
            sendingButton: 'Sending...',
            backToLogin: 'Back to Login',
            checkEmailTitle: 'Check Your Email',
            checkEmailMessage: 'Password reset instructions have been sent to your email.',
            checkEmailSubtitle: 'Please check your email inbox and follow the instructions to reset your password.',
            emailRequired: 'Email is required',
            invalidEmail: 'Please enter a valid email address',
            networkError: 'Network error. Please try again.'
        },
        ru: {
            title: 'Забыли пароль?',
            subtitle: 'Введите ваш email адрес и мы отправим вам ссылку для сброса пароля.',
            emailPlaceholder: 'Введите ваш email адрес',
            sendButton: 'Отправить ссылку',
            sendingButton: 'Отправка...',
            backToLogin: 'Вернуться к входу',
            checkEmailTitle: 'Проверьте почту',
            checkEmailMessage: 'Инструкции по сбросу пароля отправлены на ваш email.',
            checkEmailSubtitle: 'Пожалуйста, проверьте почтовый ящик и следуйте инструкциям для сброса пароля.',
            emailRequired: 'Email обязателен',
            invalidEmail: 'Пожалуйста, введите корректный email адрес',
            networkError: 'Ошибка сети. Попробуйте снова.'
        },
        pl: {
            title: 'Zapomniałeś hasła?',
            subtitle: 'Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła.',
            emailPlaceholder: 'Wprowadź swój adres e-mail',
            sendButton: 'Wyślij link resetujący',
            sendingButton: 'Wysyłanie...',
            backToLogin: 'Powrót do logowania',
            checkEmailTitle: 'Sprawdź swoją pocztę',
            checkEmailMessage: 'Instrukcje resetowania hasła zostały wysłane na Twój e-mail.',
            checkEmailSubtitle: 'Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z instrukcjami.',
            emailRequired: 'E-mail jest wymagany',
            invalidEmail: 'Proszę wprowadzić prawidłowy adres e-mail',
            networkError: 'Błąd sieci. Spróbuj ponownie.'
        }
    };

    const t = translations[language] || translations.en;

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError(t.emailRequired);
            return;
        }

        if (!validateEmail(email)) {
            setError(t.invalidEmail);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/auth/forgot-password', {
                email: email.trim()
            });

            setMessage(response.data.message);
            setSent(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setError(t.networkError);
            } else {
                setError('An error occurred while processing your request');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        window.location.href = '/';
    };    if (sent) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.checkEmailTitle}</h1>
                        <p className="auth-subtitle">{t.checkEmailMessage}</p>
                    </div>
                    <div className="auth-form">
                        <div className="success-message">
                            <div className="success-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="var(--success)" stroke="var(--bg-secondary)" strokeWidth="2"/>
                                    <path d="m9 12 2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="success-title">{t.checkEmailMessage}</p>
                            <p className="success-subtitle">{t.checkEmailSubtitle}</p>
                        </div>
                        <button 
                            type="button" 
                            className="auth-btn primary"
                            onClick={handleBackToLogin}
                        >
                            <span>← {t.backToLogin}</span>
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
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.emailPlaceholder}
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}                    <button 
                        type="submit" 
                        className="auth-btn primary"
                        disabled={loading || !email.trim()}
                    >
                        {loading && (
                            <span className="loading-spinner" style={{width: '16px', height: '16px', marginRight: '8px', display: 'inline-block'}}></span>
                        )}
                        {loading ? t.sendingButton : t.sendButton}
                    </button>                    <div className="auth-footer">
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

export default ForgotPassword;
