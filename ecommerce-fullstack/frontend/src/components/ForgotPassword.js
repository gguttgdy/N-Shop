import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = ({ language = 'en' }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const translations = {
        en: {
            title: 'Forgot Password',
            emailPlaceholder: 'Enter your email address',
            sendButton: 'Send Reset Link',
            sendingButton: 'Sending...',
            backToLogin: 'Back to Login',
            checkEmailTitle: 'Check Your Email',
            checkEmailMessage: 'Password reset instructions have been sent to your email.',
            emailRequired: 'Email is required',
            invalidEmail: 'Please enter a valid email address',
            networkError: 'Network error. Please try again.'
        },
        ru: {
            title: 'Забыли пароль?',
            emailPlaceholder: 'Введите ваш email адрес',
            sendButton: 'Отправить ссылку',
            sendingButton: 'Отправка...',
            backToLogin: 'Вернуться к входу',
            checkEmailTitle: 'Проверьте почту',
            checkEmailMessage: 'Инструкции по сбросу пароля отправлены на ваш email.',
            emailRequired: 'Email обязателен',
            invalidEmail: 'Пожалуйста, введите корректный email адрес',
            networkError: 'Ошибка сети. Попробуйте снова.'
        },
        pl: {
            title: 'Zapomniałeś hasła?',
            emailPlaceholder: 'Wprowadź swój adres e-mail',
            sendButton: 'Wyślij link resetujący',
            sendingButton: 'Wysyłanie...',
            backToLogin: 'Powrót do logowania',
            checkEmailTitle: 'Sprawdź swoją pocztę',
            checkEmailMessage: 'Instrukcje resetowania hasła zostały wysłane na Twój e-mail.',
            emailRequired: 'E-mail jest wymagany',
            invalidEmail: 'Proszę wprowadzić prawidłowy adres e-mail',
            networkError: 'Błąd sieci. Spróbuj ponownie.'
        }
    };

    const t = translations[language] || translations.en;

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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
            await axios.post('/api/auth/forgot-password', {
                email: email.trim()
            });

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
    };

    if (sent) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>{t.checkEmailTitle}</h1>
                    </div>
                    <div className="auth-form">
                        <div className="success-message">
                            <p style={{color: 'var(--success)', textAlign: 'center', marginBottom: '20px'}}>
                                {t.checkEmailMessage}
                            </p>
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
        );
    }

    return (
        <div className="auth-page">
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

                    <button 
                        type="submit" 
                        className="auth-btn primary"
                        disabled={loading || !email.trim()}
                    >
                        {loading ? t.sendingButton : t.sendButton}
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

export default ForgotPassword;
