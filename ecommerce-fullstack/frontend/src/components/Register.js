import React, { useState } from 'react';
import './Register.css';

const Register = ({ language, onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      orSignUpWith: 'Или зарегистрируйтесь, используя:',
      continueWithGoogle: 'Продолжить с Google',
      continueWithFacebook: 'Продолжить с Facebook',
      agreeToTerms: 'Я согласен с',
      termsOfService: 'Условиями использования',
      and: 'и',
      privacyPolicy: 'Политикой конфиденциальности',
      firstNameRequired: 'Имя обязательно',
      lastNameRequired: 'Фамилия обязательна',
      emailRequired: 'Email обязателен',
      passwordRequired: 'Пароль обязателен',
      confirmPasswordRequired: 'Подтверждение пароля обязательно',
      passwordsNotMatch: 'Пароли не совпадают',
      invalidEmail: 'Некорректный email',
      passwordTooShort: 'Пароль должен содержать минимум 6 символов',
      showPassword: 'Показать пароль',
      hidePassword: 'Скрыть пароль'
    },
    en: {
      register: 'Register',
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
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      confirmPasswordRequired: 'Confirm password is required',
      passwordsNotMatch: 'Passwords do not match',
      invalidEmail: 'Invalid email',
      passwordTooShort: 'Password must be at least 6 characters',
      showPassword: 'Show password',
      hidePassword: 'Hide password'
    },
    pl: {
      register: 'Rejestracja',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      password: 'Hasło',
      confirmPassword: 'Potwierdź hasło',
      signUp: 'Zarejestruj się',
      alreadyHaveAccount: 'Masz już konto?',
      signIn: 'Zaloguj się',
      orSignUpWith: 'Lub zarejestruj się używając:',
      continueWithGoogle: 'Kontynuuj z Google',
      continueWithFacebook: 'Kontynuuj z Facebook',
      agreeToTerms: 'Zgadzam się z',
      termsOfService: 'Regulaminem',
      and: 'i',
      privacyPolicy: 'Polityką prywatności',
      firstNameRequired: 'Imię jest wymagane',
      lastNameRequired: 'Nazwisko jest wymagane',
      emailRequired: 'Email jest wymagany',
      passwordRequired: 'Hasło jest wymagane',
      confirmPasswordRequired: 'Potwierdzenie hasła jest wymagane',
      passwordsNotMatch: 'Hasła nie pasują do siebie',
      invalidEmail: 'Nieprawidłowy email',
      passwordTooShort: 'Hasło musi mieć co najmniej 6 znaków',
      showPassword: 'Pokaż hasło',
      hidePassword: 'Ukryj hasło'
    }
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert(t.passwordsNotMatch);
      return;
    }
    // Здесь будет логика регистрации
    console.log('Registration attempt:', formData);
  };

  const handleGoogleRegister = () => {
    // Здесь будет логика регистрации через Google
    console.log('Google registration');
  };

  const handleFacebookRegister = () => {
    // Здесь будет логика регистрации через Facebook
    console.log('Facebook registration');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          <h1>{t.register}</h1>
          
          <form onSubmit={handleSubmit} className="register-form">
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
                  placeholder={t.firstName}
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
                  placeholder={t.lastName}
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
                placeholder={t.email}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={t.password}
                  minLength="6"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">{t.confirmPassword}</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder={t.confirmPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? t.hidePassword : t.showPassword}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <span className="checkmark"></span>
                {t.agreeToTerms}{' '}
                <button type="button" onClick={() => onNavigate('page', 'terms')} className="link-btn">
                  {t.termsOfService}
                </button>{' '}
                {t.and}{' '}
                <button type="button" onClick={() => onNavigate('page', 'privacy')} className="link-btn">
                  {t.privacyPolicy}
                </button>
              </label>
            </div>

            <button type="submit" className="register-btn" disabled={!agreeToTerms}>
              {t.signUp}
            </button>
          </form>

          <div className="social-login">
            <p className="social-text">{t.orSignUpWith}</p>
            
            <div className="social-buttons">
              <button onClick={handleGoogleRegister} className="social-btn google-btn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.continueWithGoogle}
              </button>

              <button onClick={handleFacebookRegister} className="social-btn facebook-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {t.continueWithFacebook}
              </button>
            </div>
          </div>

          <div className="signin-link">
            <p>
              {t.alreadyHaveAccount}{' '}
              <button type="button" onClick={() => onNavigate('page', 'login')} className="link-btn">
                {t.signIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
