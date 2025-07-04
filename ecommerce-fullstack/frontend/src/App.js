import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SectionPage from './components/SectionPage';
import SearchPage from './components/SearchPage';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import UserMyData from './components/UserMyData';
import UserOrders from './components/UserOrders';
import UserReceipts from './components/UserReceipts';
import UserDiscounts from './components/UserDiscounts';
import UserReviews from './components/UserReviews';
import UserComplaints from './components/UserComplaints';
import UserReturns from './components/UserReturns';
import CheckoutModal from './components/CheckoutModal';
import { useCurrency } from './hooks/useCurrency';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');
  const { user, loading, login, register, logout, updateProfile } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedInfoPage, setSelectedInfoPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);  // Хук для управления валютой
  const { currency, currencySymbol, formatPrice, convertAndFormatPrice } = useCurrency(language);
  // Загружаем корзину из localStorage при загрузке компонента
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Проверяем, что данные корректны
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // При ошибке просто оставляем пустую корзину
      localStorage.removeItem('cartItems');
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // При ошибке сохранения просто логируем, но не прерываем работу
    }
  }, [cartItems]);  const handleNavigation = (pageType, value) => {
    console.log('Navigating to:', pageType, value);
    
    // Специальная обработка для checkout
    if (pageType === 'checkout') {
      if (!user) {
        // Если пользователь не залогинен, перенаправляем на логин
        setCurrentPage('login');
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedSection(null);
        setSelectedInfoPage(null);
        setSearchQuery('');
      } else {
        // Если пользователь залогинен, открываем модальное окно
        setIsCheckoutOpen(true);
      }
      return;
    }
    
    // Обработка прямых переходов на страницы
    if (['login', 'register', 'profile', 'my-data', 'home', 'orders', 'receipts', 'discounts', 'reviews', 'complaints', 'returns', 'forgot-password', 'reset-password'].includes(pageType)) {
      setCurrentPage(pageType);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedSection(null);
      setSelectedInfoPage(null);
      if (pageType !== 'search') {
        setSearchQuery('');
      }
    } else if (pageType === 'category') {
      setSelectedCategory(value.categoryId);
      setSelectedSubcategory(value.subcategoryId || null);
      setCurrentPage('category');
    } else if (pageType === 'section') {
      setSelectedSection(value);
      setCurrentPage('section');
    } else if (pageType === 'page') {
      if (value === 'login' || value === 'register' || value === 'profile' || value === 'forgot-password' || value === 'reset-password') {
        setCurrentPage(value);
      } else {
        setSelectedInfoPage(value);
        setCurrentPage('info');
      }
    }
  };const handleCategorySelect = (categoryId, subcategoryId = null) => {
    console.log('Category selected:', categoryId, 'Subcategory:', subcategoryId);    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setCurrentPage('category');
    // Очищаем поиск при переходе на категорию
    setSearchQuery('');
    setSelectedSection(null);
    setSelectedInfoPage(null);
  };
  const handleHomeClick = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSection(null);
    setSelectedInfoPage(null);
    // Очищаем searchQuery последним
    setSearchQuery('');
  };const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim().length > 0) {
      setCurrentPage('search');
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedSection(null);
      setSelectedInfoPage(null);
    } else if (currentPage === 'search') {
      // Если мы были на странице поиска и запрос очищен, возвращаемся на главную
      setCurrentPage('home');
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedSection(null);
      setSelectedInfoPage(null);
    }
    // Если мы на другой странице (например, категории), не меняем currentPage
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };  const clearCart = () => {
    setCartItems([]);  };
  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
  };

  const handleOrderSuccess = () => {
    // Закрываем модальное окно и очищаем корзину после успешного заказа
    setIsCheckoutOpen(false);
    clearCart();
  };
    const handleLogin = async (credentials) => {
    try {
      console.log('App.js handleLogin called with:', credentials);
      await login(credentials);
      // После успешного логина переходим на главную
      setCurrentPage('home');
      console.log('User logged in successfully, current user:', user);
    } catch (error) {
      console.error('Login error in App.js:', error);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      // После успешной регистрации переходим на главную
      setCurrentPage('home');
      console.log('User registered successfully');
    } catch (error) {
      console.error('Register error:', error);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('rememberedUser');
      // После выхода переходим на главную
      setCurrentPage('home');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };  return (
    <div className="App">
      <Header 
        language={language}
        setLanguage={setLanguage}
        user={user}
        loading={loading}
        onLogout={handleLogout}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        clearCart={clearCart}
        onHomeClick={handleHomeClick}
        onNavigate={handleNavigation}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        formatPrice={convertAndFormatPrice}
      />
      
      <Catalog 
        language={language} 
        onCategorySelect={handleCategorySelect}
      />
        
      <main className="main-content">
        {currentPage === 'home' ? (
          <HomePage 
            language={language} 
            onNavigate={handleNavigation}
            addToCart={addToCart}
            currency={currency}
            formatPrice={formatPrice}
          />
        ) : currentPage === 'category' ? (
          <CategoryPage 
            language={language}
            categoryId={selectedCategory}
            subcategoryId={selectedSubcategory}
            addToCart={addToCart}
            currency={currency}
            formatPrice={formatPrice}
          />
        ) : currentPage === 'section' ? (
          <SectionPage 
            language={language}
            sectionType={selectedSection}
            addToCart={addToCart}
            currency={currency}
            formatPrice={formatPrice}
          />        ) : currentPage === 'login' ? (
          <Login 
            language={language}
            onNavigate={handleNavigation}
            onLogin={handleLogin}
          />        ) : currentPage === 'register' ? (
          <Register 
            language={language}
            onNavigate={handleNavigation}
            onLogin={handleRegister}
          />        ) : currentPage === 'profile' ? (
          <UserProfile 
            language={language}
            user={user}
            updateProfile={updateProfile}
          />
        ) : currentPage === 'my-data' ? (
          <UserMyData 
            language={language}
            user={user}
            updateProfile={updateProfile}
          />        ) : currentPage === 'orders' ? (
          <UserOrders 
            language={language}
            user={user}
            loading={loading}
            currency={currency}
            formatPrice={formatPrice}
            convertAndFormatPrice={convertAndFormatPrice}
          />        ) : currentPage === 'receipts' ? (
          <UserReceipts 
            language={language}
            user={user}
            loading={loading}
            currency={currency}
            formatPrice={formatPrice}
            convertAndFormatPrice={convertAndFormatPrice}
          />
        ) : currentPage === 'discounts' ? (
          <UserDiscounts 
            language={language}
          />
        ) : currentPage === 'reviews' ? (
          <UserReviews 
            language={language}
          />
        ) : currentPage === 'complaints' ? (
          <UserComplaints 
            language={language}
          />        ) : currentPage === 'returns' ? (
          <UserReturns 
            language={language}
          />
        ) : currentPage === 'forgot-password' ? (
          <ForgotPassword />
        ) : currentPage === 'reset-password' ? (
          <ResetPassword />
        ) : currentPage === 'info' ? (
          selectedInfoPage === 'help-center' ? (
            <HelpCenter language={language} />
          ) : (
            <InfoPage 
              language={language}
              pageType={selectedInfoPage}
            />
          )
        ) : currentPage === 'search' ? (
          <SearchPage 
            language={language}
            searchQuery={searchQuery}
            addToCart={addToCart}
            currency={currency}
            formatPriceWithCurrency={formatPrice}
            onHomeClick={handleHomeClick}
          />        ) : null}
      </main>
      
      <Footer 
        language={language} 
        onNavigate={handleNavigation}
      />        <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        cartItems={cartItems}
        user={user}
        language={language}
        currency={currency}
        currencySymbol={currencySymbol}
        formatPrice={convertAndFormatPrice}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}

export default App;
