# Руководство по интеграции Frontend

## Интеграция React Frontend с Backend API

### Базовая настройка

#### 1. Установка необходимых пакетов
```bash
npm install axios
```

#### 2. Создание API сервиса

Создайте файл `src/services/AuthService.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек, перенаправляем на логин
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Логин
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Выход
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Получение профиля
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Получение заказов
  getOrders: async () => {
    const response = await api.get('/users/orders');
    return response.data;
  },

  // Получение квитанций
  getReceipts: async () => {
    const response = await api.get('/users/receipts');
    return response.data;
  },

  // Получение отзывов
  getReviews: async () => {
    const response = await api.get('/users/reviews');
    return response.data;
  },

  // Получение жалоб
  getComplaints: async () => {
    const response = await api.get('/users/complaints');
    return response.data;
  },

  // Получение скидок
  getDiscounts: async () => {
    const response = await api.get('/users/discounts');
    return response.data;
  },

  // Получение возвратов
  getReturns: async () => {
    const response = await api.get('/users/returns');
    return response.data;
  },

  // Проверка токена
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Получение текущего пользователя
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
```

#### 3. Обновление компонентов Login и Register

Обновите `src/components/Login.js`:

```javascript
import React, { useState } from 'react';
import { authService } from '../services/AuthService';
import './Auth.css';

const Login = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData);
      onLogin(response.user);
      // Перенаправление на главную или профиль
    } catch (error) {
      setError(error.response?.data?.message || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          Запомнить меня
        </label>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        <div className="auth-links">
          <button type="button" onClick={() => onNavigate('register')}>
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
```

Обновите `src/components/Register.js`:

```javascript
import React, { useState } from 'react';
import { authService } from '../services/AuthService';
import './Auth.css';

const Register = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }
    
    try {
      const response = await authService.register(formData);
      onLogin(response.user);
      // Перенаправление на главную или профиль
    } catch (error) {
      setError(error.response?.data?.message || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Номер телефона (необязательно)"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Пароль (мин. 6 символов)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <div className="auth-links">
          <button type="button" onClick={() => onNavigate('login')}>
            Уже есть аккаунт? Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
```

#### 4. Обновление App.js

```javascript
import React, { useState, useEffect } from 'react';
import { authService } from './services/AuthService';
// ... другие импорты

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="App">
      {/* Ваши компоненты с передачей user, onLogin, onLogout */}
    </div>
  );
}

export default App;
```

#### 5. Компонент профиля пользователя

Создайте `src/components/UserProfile.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

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
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="profile-container">
      <h2>Мой профиль</h2>
      
      {!editing ? (
        <div className="profile-view">
          <p><strong>Имя:</strong> {user.fullName}</p>
          <p><strong>Электронная почта:</strong> {user.email}</p>
          <p><strong>Телефон:</strong> {user.phoneNumber || 'Не указан'}</p>
          <p><strong>Город:</strong> {user.billingCity || 'Не указан'}</p>
          <p><strong>Страна:</strong> {user.billingCountry || 'Не указана'}</p>
          <button onClick={() => setEditing(true)}>Редактировать профиль</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="profile-form">
          <input
            type="text"
            placeholder="Имя"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Номер телефона"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          />
          <input
            type="text"
            placeholder="Адрес для выставления счета"
            value={formData.billingAddress}
            onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
          />
          <input
            type="text"
            placeholder="Город"
            value={formData.billingCity}
            onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
          />
          <input
            type="text"
            placeholder="Страна"
            value={formData.billingCountry}
            onChange={(e) => setFormData({...formData, billingCountry: e.target.value})}
          />
          <input
            type="text"
            placeholder="Почтовый индекс"
            value={formData.billingPostalCode}
            onChange={(e) => setFormData({...formData, billingPostalCode: e.target.value})}
          />
          
          <div className="form-buttons">
            <button type="submit">Сохранить изменения</button>
            <button type="button" onClick={() => setEditing(false)}>Отмена</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
```

### Готовые Hooks

Создайте `src/hooks/useAuth.js`:

```javascript
import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};
```

### Использование

```javascript
// В любом компоненте
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  
  return (
    <div>
      <h1>Добро пожаловать, {user.fullName}!</h1>
      <button onClick={logout}>Выход</button>
    </div>
  );
};
```

## Готово к использованию!

Теперь frontend полностью интегрирован с backend API. Все компоненты Login, Register, Profile готовы к работе с реальными данными.
