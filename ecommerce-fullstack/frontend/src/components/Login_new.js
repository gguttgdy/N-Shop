import React, { useState } from 'react';
import './Auth.css';

const Login = ({ language, onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const translations = {
    ru: {
      login: 'Вход в аккаунт',
      email: 'Email',
      password: 'Пароль',
      signIn: 'Войти',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      signUp: 'Зарегистрироваться',
      orSignInWith: 'Или войдите, используя:',
      continueWithGoogle: 'Продолжить с Google',
      continueWithFacebook: 'Продолжить с Facebook',
      emailRequired: 'Email обязателен',
      passwordRequired: 'Пароль обязателен',
      invalidCredentials: 'Неверный email или пароль',
      rememberMe: 'Запомнить меня'
    },
    en: {
      login: 'Sign In',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      orSignInWith: 'Or sign in with:',
      continueWithGoogle: 'Continue with Google',
      continueWithFacebook: 'Continue with Facebook',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      invalidCredentials: 'Invalid email or password',
      rememberMe: 'Remember me'
    },
    pl: {
      login: 'Zaloguj się',
      email: 'Email',
      password: 'Hasło',
      signIn: 'Zaloguj się',
      forgotPassword: 'Zapomniałeś hasła?',
      noAccount: 'Nie masz konta?',
      signUp: 'Zarejestruj się',
      orSignInWith: 'Lub zaloguj się za pomocą:',
      continueWithGoogle: 'Kontynuuj z Google',
      continueWithFacebook: 'Kontynuuj z Facebook',
      emailRequired: 'Email jest wymagany',
      passwordRequired: 'Hasło jest wymagane',
      invalidCredentials: 'Nieprawidłowy email lub hasło',
      rememberMe: 'Zapamiętaj mnie'
    }
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError(t.emailRequired);
      return false;
    }
    if (!formData.password.trim()) {
      setError(t.passwordRequired);
      return false;
    }
    return true;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Передаем credentials в App.js для обработки через useAuth
      const credentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      };
      
      await onLogin(credentials);
      
      // Сохраняем email если "запомнить меня"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      }
      
      onNavigate('home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setIsLoading(true);
    
    // Симуляция социального входа
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        provider: provider
      };
      
      onLogin(userData);
      onNavigate('home');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t.login}</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>{t.rememberMe}</span>
            </label>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate('page', 'forgot-password')}
              disabled={isLoading}
            >
              {t.forgotPassword}
            </button>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={isLoading}
          >
            {isLoading ? '...' : t.signIn}
          </button>

          <div className="auth-divider">
            <span>{t.orSignInWith}</span>
          </div>

          <div className="social-login">
            <button
              type="button"
              className="social-btn google"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t.continueWithGoogle}
            </button>

            <button
              type="button"
              className="social-btn facebook"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              {t.continueWithFacebook}
            </button>
          </div>

          <div className="auth-footer">
            <span>{t.noAccount} </span>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate('page', 'register')}
              disabled={isLoading}
            >
              {t.signUp}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
