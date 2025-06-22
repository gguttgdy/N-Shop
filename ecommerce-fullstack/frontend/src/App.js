import React, { useState } from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SectionPage from './components/SectionPage';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import HelpCenter from './components/HelpCenter';
import './App.css';

function App() {
  const [language, setLanguage] = useState('ru');
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedInfoPage, setSelectedInfoPage] = useState(null);

  const handleNavigation = (pageType, value) => {
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
  };

  const handleCategorySelect = (categoryId, subcategoryId = null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setCurrentPage('category');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSection(null);
    setSelectedInfoPage(null);
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

  return (
    <div className="App">
      <Header 
        language={language}
        setLanguage={setLanguage}
        user={user}
        setUser={setUser}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        onHomeClick={handleHomeClick}
        onNavigate={handleNavigation}
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
          />
        ) : currentPage === 'category' ? (
          <CategoryPage 
            language={language}
            categoryId={selectedCategory}
            subcategoryId={selectedSubcategory}
            addToCart={addToCart}
          />
        ) : currentPage === 'section' ? (
          <SectionPage 
            language={language}
            sectionType={selectedSection}
            addToCart={addToCart}
          />
        ) : currentPage === 'info' ? (
          selectedInfoPage === 'help-center' ? (
            <HelpCenter language={language} />
          ) : (
            <InfoPage 
              language={language}
              pageType={selectedInfoPage}
            />
          )
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
