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
  },  // Логин
  login: async (credentials) => {
    try {
      console.log('Sending login request with credentials:', {
        email: credentials.email,
        rememberMe: credentials.rememberMe
      });
      
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });
      
      console.log('Login response received:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userData: response.data.user
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Saved token and user to localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
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
