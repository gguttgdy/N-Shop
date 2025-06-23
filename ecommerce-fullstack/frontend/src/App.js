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
import { useCurrency } from './hooks/useCurrency';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedInfoPage, setSelectedInfoPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Хук для управления валютой
  const { currency, currencySymbol, formatPrice, loading: currencyLoading } = useCurrency(language);
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
  }, [cartItems]);const handleNavigation = (pageType, value) => {
    if (pageType === 'category') {
      setSelectedCategory(value.categoryId);
      setSelectedSubcategory(value.subcategoryId || null);
      setCurrentPage('category');
    } else if (pageType === 'section') {
      setSelectedSection(value);
      setCurrentPage('section');
    } else if (pageType === 'page') {
      setSelectedInfoPage(value);
      setCurrentPage('info');
    }
  };  const handleCategorySelect = (categoryId, subcategoryId = null) => {
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
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="App">      <Header 
        language={language}
        setLanguage={setLanguage}
        user={user}
        setUser={setUser}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        clearCart={clearCart}
        onHomeClick={handleHomeClick}
        onNavigate={handleNavigation}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
        <Catalog 
        language={language} 
        onCategorySelect={handleCategorySelect}
      />
      
      <main className="main-content">{currentPage === 'home' ? (
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
          />
        ) : currentPage === 'info' ? (
          selectedInfoPage === 'help-center' ? (
            <HelpCenter language={language} />
          ) : (
            <InfoPage 
              language={language}
              pageType={selectedInfoPage}
            />
          )        ) : currentPage === 'search' ? (
          <SearchPage 
            language={language}
            searchQuery={searchQuery}
            addToCart={addToCart}
            currency={currency}
            formatPriceWithCurrency={formatPrice}
            onHomeClick={handleHomeClick}
          />
        ) : null}
      </main>
      <Footer 
        language={language} 
        onNavigate={handleNavigation}
      />
    </div>
  );
}

export default App;
