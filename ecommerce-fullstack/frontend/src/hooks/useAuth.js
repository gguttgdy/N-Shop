import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...');
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Сначала пробуем загрузить пользователя из localStorage
          const savedUser = authService.getCurrentUser();
          if (savedUser) {
            console.log('Loaded user from localStorage:', savedUser);
            setUser(savedUser);
          }
          
          // Затем обновляем данные с сервера
          const userProfile = await authService.getProfile();
          console.log('Updated user from server:', userProfile);
          setUser(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        console.log('No token found, user not authenticated');
      }
      setLoading(false);
    };

    initAuth();
  }, []);
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // Backend возвращает объект с user и token
      if (response && response.user) {
        setUser(response.user);
        console.log('User logged in:', response.user);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Backend возвращает объект с user и token  
    if (response.user) {
      setUser(response.user);
    }
    return response;
  };
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      console.log('User logged out');
    }
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await authService.updateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
};
