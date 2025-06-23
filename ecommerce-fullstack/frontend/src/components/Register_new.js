import React, { useState } from 'react';
import './Auth.css';

const Register = ({ language, onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const translations = {
    ru: {
      register: 'Регистрация',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      signUp: 'Зарегистрироваться',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      signIn: 'Войти',
      orSignUpWith: 'Или зарегистрируйтесь с помощью:',
      continueWithGoogle: 'Продолжить с Google',
      continueWithFacebook: 'Продолжить с Facebook',
      firstNameRequired: 'Имя обязательно',
      lastNameRequired: 'Фамилия обязательна',
      emailRequired: 'Email обязателен',
      passwordRequired: 'Пароль обязателен',
      passwordsNotMatch: 'Пароли не совпадают',
      agreeToTerms: 'Я согласен с условиями использования и политикой конфиденциальности',
      mustAgreeToTerms: 'Необходимо согласиться с условиями',
      accountCreated: 'Аккаунт успешно создан!'
    },
    en: {
      register: 'Sign Up',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signUp: 'Sign Up',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign In',
      orSignUpWith: 'Or sign up with:',
      continueWithGoogle: 'Continue with Google',
      continueWithFacebook: 'Continue with Facebook',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordsNotMatch: 'Passwords do not match',
      agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
      mustAgreeToTerms: 'You must agree to the terms',
      accountCreated: 'Account created successfully!'
    },
    pl: {
      register: 'Zarejestruj się',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      password: 'Hasło',
      confirmPassword: 'Potwierdź hasło',
      signUp: 'Zarejestruj się',
      alreadyHaveAccount: 'Masz już konto?',
      signIn: 'Zaloguj się',
      orSignUpWith: 'Lub zarejestruj się za pomocą:',
      continueWithGoogle: 'Kontynuuj z Google',
      continueWithFacebook: 'Kontynuuj z Facebook',
      firstNameRequired: 'Imię jest wymagane',
      lastNameRequired: 'Nazwisko jest wymagane',
      emailRequired: 'Email jest wymagany',
      passwordRequired: 'Hasło jest wymagane',
      passwordsNotMatch: 'Hasła nie pasują do siebie',
      agreeToTerms: 'Zgadzam się z Regulaminem i Polityką Prywatności',
      mustAgreeToTerms: 'Musisz zaakceptować warunki',
      accountCreated: 'Konto zostało pomyślnie utworzone!'
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
    if (!formData.firstName.trim()) {
      setError(t.firstNameRequired);
      return false;
    }
    if (!formData.lastName.trim()) {
      setError(t.lastNameRequired);
      return false;
    }
    if (!formData.email.trim()) {
      setError(t.emailRequired);
      return false;
    }
    if (!formData.password.trim()) {
      setError(t.passwordRequired);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsNotMatch);
      return false;
    }
    if (!agreeToTerms) {
      setError(t.mustAgreeToTerms);
      return false;
    }
    return true;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Передаем userData в App.js для обработки через useAuth
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
      
      await onLogin(userData);
      onNavigate('home');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка при создании аккаунта. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
    setIsLoading(true);
    
    // Симуляция социальной регистрации
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
      <div className="auth-content">
        <div className="auth-container">
          <div className="auth-header">
            <h1>{t.register}</h1>
          </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{t.firstName}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                autoComplete="given-name"
                disabled={isLoading}
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
                required
                autoComplete="family-name"
                disabled={isLoading}
              />
            </div>
          </div>

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
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t.confirmPassword}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={isLoading}
                required
              />
              <span>{t.agreeToTerms}</span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={isLoading}
          >
            {isLoading ? '...' : t.signUp}
          </button>

          <div className="auth-divider">
            <span>{t.orSignUpWith}</span>
          </div>

          <div className="social-login">
            <button
              type="button"
              className="social-btn google"
              onClick={() => handleSocialRegister('Google')}
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
              onClick={() => handleSocialRegister('Facebook')}
              disabled={isLoading}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              {t.continueWithFacebook}
            </button>
          </div>

          <div className="auth-footer">
            <span>{t.alreadyHaveAccount} </span>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate('page', 'login')}
              disabled={isLoading}
            >
              {t.signIn}
            </button>
          </div>        </form>
      </div>
      </div>
    </div>
  );
};

export default Register;
