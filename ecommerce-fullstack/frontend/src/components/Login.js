import React, { useState } from 'react';
import './Login.css';

const Login = ({ language, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const translations = {
    ru: {
      login: 'Вход',
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
      invalidEmail: 'Некорректный email',
      showPassword: 'Показать пароль',
      hidePassword: 'Скрыть пароль'
    },
    en: {
      login: 'Login',
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
      invalidEmail: 'Invalid email',
      showPassword: 'Show password',
      hidePassword: 'Hide password'
    },
    pl: {
      login: 'Logowanie',
      email: 'Email',
      password: 'Hasło',
      signIn: 'Zaloguj się',
      forgotPassword: 'Zapomniałeś hasła?',
      noAccount: 'Nie masz konta?',
      signUp: 'Zarejestruj się',
      orSignInWith: 'Lub zaloguj się używając:',
      continueWithGoogle: 'Kontynuuj z Google',
      continueWithFacebook: 'Kontynuuj z Facebook',
      emailRequired: 'Email jest wymagany',
      passwordRequired: 'Hasło jest wymagane',
      invalidEmail: 'Nieprawidłowy email',
      showPassword: 'Pokaż hasło',
      hidePassword: 'Ukryj hasło'
    }
  };

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика входа
    console.log('Login attempt:', { email, password });
  };

  const handleGoogleLogin = () => {
    // Здесь будет логика входа через Google
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Здесь будет логика входа через Facebook
    console.log('Facebook login');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1>{t.login}</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t.email}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t.password}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              {t.signIn}
            </button>            <div className="form-links">
              <button type="button" onClick={() => onNavigate('page', 'forgot-password')} className="link-btn">
                {t.forgotPassword}
              </button>
            </div>
          </form>

          <div className="social-login">
            <p className="social-text">{t.orSignInWith}</p>
            
            <div className="social-buttons">
              <button onClick={handleGoogleLogin} className="social-btn google-btn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.continueWithGoogle}
              </button>

              <button onClick={handleFacebookLogin} className="social-btn facebook-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {t.continueWithFacebook}
              </button>
            </div>
          </div>          <div className="signup-link">
            <p>
              {t.noAccount}{' '}
              <button type="button" onClick={() => onNavigate('page', 'register')} className="link-btn">
                {t.signUp}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
