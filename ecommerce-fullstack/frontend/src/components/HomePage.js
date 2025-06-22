import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import currencyService from '../services/CurrencyService';
import './HomePage.css';

const HomePage = ({ language, onNavigate, addToCart, currency, formatPrice }) => {
  const [hotDeals, setHotDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommended, setRecommended] = useState([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsLoaded, setProductsLoaded] = useState(false);
  
  // Ref для хранения оригинальных данных товаров
  const originalProductsRef = useRef({
    hotDeals: [],
    newArrivals: [],
    recommended: []
  });

  const setFallbackData = useCallback(() => {    // Демо данные как fallback
    const fallbackHotDeals = [
      { id: 1, name: 'iPhone 14', price: 999, oldPrice: 1299, originalPrice: 999, originalOldPrice: 1299, image: '📱', discount: 25 },
      { id: 2, name: 'MacBook Air', price: 1199, oldPrice: 1499, originalPrice: 1199, originalOldPrice: 1499, image: '💻', discount: 23 },
      { id: 3, name: 'AirPods Pro', price: 199, oldPrice: 249, originalPrice: 199, originalOldPrice: 249, image: '🎧', discount: 25 },
      { id: 4, name: 'iPad Pro', price: 899, oldPrice: 1099, originalPrice: 899, originalOldPrice: 1099, image: '📱', discount: 19 }
    ];

    const fallbackNewArrivals = [
      { id: 5, name: 'Samsung Galaxy S24', price: 899, originalPrice: 899, image: '📱', isNew: true },
      { id: 6, name: 'Sony WH-1000XM5', price: 399, originalPrice: 399, image: '🎧', isNew: true },
      { id: 7, name: 'Dell XPS 13', price: 1299, originalPrice: 1299, image: '💻', isNew: true },
      { id: 8, name: 'Canon EOS R6', price: 2499, originalPrice: 2499, image: '📷', isNew: true }
    ];

    const fallbackRecommended = [
      { id: 9, name: 'Apple Watch', price: 399, originalPrice: 399, image: '⌚', rating: 4.8 },
      { id: 10, name: 'Nike Air Max', price: 159, originalPrice: 159, image: '👟', rating: 4.7 },
      { id: 11, name: 'Kindle Oasis', price: 249, originalPrice: 249, image: '📖', rating: 4.6 },
      { id: 12, name: 'JBL Speaker', price: 99, originalPrice: 99, image: '🔊', rating: 4.5 }
    ];    setHotDeals(fallbackHotDeals);
    setNewArrivals(fallbackNewArrivals);
    setRecommended(fallbackRecommended);
    
    // Сохраняем оригинальные данные и в fallback случае
    originalProductsRef.current = {
      hotDeals: fallbackHotDeals,
      newArrivals: fallbackNewArrivals,
      recommended: fallbackRecommended
    };
    
    setProductsLoaded(true);
  }, []);  // Загрузка товаров один раз при монтировании компонента
  const loadInitialProducts = useCallback(async () => {
    if (productsLoaded) return; // Если товары уже загружены, не перезагружаем
      try {
      setLoading(true);
      setError(null);

      // Загружаем случайные товары для всех секций параллельно
      const [hotDealsRes, newArrivalsRes, recommendedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/products/random', {
          params: { section: 'hot-deals', limit: 4, currency: 'USD' } // Всегда USD для первичной загрузки
        }),
        axios.get('http://localhost:8080/api/products/random', {
          params: { section: 'new-arrivals', limit: 4, currency: 'USD' }
        }),
        axios.get('http://localhost:8080/api/products/random', {
          params: { section: 'recommended', limit: 4, currency: 'USD' }
        })
      ]);

      // Устанавливаем товары
      const hotDealsData = hotDealsRes.data.products || [];
      const newArrivalsData = newArrivalsRes.data.products || [];
      const recommendedData = recommendedRes.data.products || [];

      // Сохраняем оригинальные данные
      originalProductsRef.current = {
        hotDeals: hotDealsData,
        newArrivals: newArrivalsData,
        recommended: recommendedData
      };

      setHotDeals(hotDealsData);
      setNewArrivals(newArrivalsData);
      setRecommended(recommendedData);
      setProductsLoaded(true);
    } catch (err) {
      console.error('Error loading initial products:', err);
      setError(err.message);
      // Fallback данные при ошибке
      setFallbackData();
    } finally {
      setLoading(false);
    }
  }, [productsLoaded, setFallbackData]);  // Обновление цен при смене валюты
  const updatePricesForCurrency = useCallback(async () => {
    if (!productsLoaded || !currency) {
      return;
    }

    // Если валюта USD, восстанавливаем оригинальные цены
    if (currency === 'USD') {
      const originalData = originalProductsRef.current;
      setHotDeals(originalData.hotDeals);
      setNewArrivals(originalData.newArrivals);
      setRecommended(originalData.recommended);
      return;
    }

    // Быстрая конвертация на клиенте для мгновенного отображения
    const originalData = originalProductsRef.current;
    if (!originalData.hotDeals.length && !originalData.newArrivals.length && !originalData.recommended.length) {
      return;
    }

    const exchangeRates = { PLN: 3.7, RUB: 78.42, EUR: 0.85, GBP: 0.75 };
    const rate = exchangeRates[currency] || 1;

    const quickConvert = (data) => data.map(product => ({
      ...product,
      price: Math.round((product.originalPrice || product.price) * rate * 100) / 100,
      oldPrice: product.originalOldPrice ? Math.round(product.originalOldPrice * rate * 100) / 100 : product.oldPrice
    }));

    // Мгновенно обновляем с клиентской конвертацией
    setHotDeals(quickConvert(originalData.hotDeals));
    setNewArrivals(quickConvert(originalData.newArrivals));
    setRecommended(quickConvert(originalData.recommended));

    // Затем обновляем точными данными с сервера в фоне
    try {
      const [hotDealsConverted, newArrivalsConverted, recommendedConverted] = await Promise.all([
        currencyService.convertProductPrices(originalData.hotDeals, currency),
        currencyService.convertProductPrices(originalData.newArrivals, currency),
        currencyService.convertProductPrices(originalData.recommended, currency)
      ]);

      // Обновляем с точными данными
      setHotDeals(hotDealsConverted.products || originalData.hotDeals);
      setNewArrivals(newArrivalsConverted.products || originalData.newArrivals);
      setRecommended(recommendedConverted.products || originalData.recommended);
    } catch (err) {
      console.error('Error updating prices for currency:', err);
      // При ошибке оставляем быструю конвертацию
    }
  }, [currency, productsLoaded]);

  // Эффект для первичной загрузки товаров
  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);
  // Эффект для обновления цен при смене валюты
  useEffect(() => {
    if (productsLoaded && currency) {
      updatePricesForCurrency();
    }
  }, [currency, productsLoaded, updatePricesForCurrency]);

  const translations = {
    ru: {
      hotDeals: 'Горячие предложения',
      newArrivals: 'Новинки',
      recommended: 'Рекомендуем для вас',
      bestsellers: 'Хиты продаж',
      discounts: 'Скидки до 70%',
      seeAll: 'Смотреть все',
      currency: 'руб.',
      addToCart: 'В корзину',
      discount: 'Скидка'
    },
    en: {
      hotDeals: 'Hot Deals',
      newArrivals: 'New Arrivals',
      recommended: 'Recommended for You',
      bestsellers: 'Bestsellers',
      discounts: 'Discounts up to 70%',
      seeAll: 'See All',
      currency: 'USD',
      addToCart: 'Add to Cart',
      discount: 'Discount'
    },
    pl: {
      hotDeals: 'Gorące oferty',
      newArrivals: 'Nowości',
      recommended: 'Polecane dla Ciebie',
      bestsellers: 'Bestsellery',
      discounts: 'Zniżki do 70%',
      seeAll: 'Zobacz wszystkie',
      currency: 'zł',
      addToCart: 'Do koszyka',
      discount: 'Zniżka'
    }
  };

  const t = translations[language];  const ProductCard = ({ product, showDiscount = false, showNew = false, showRating = false }) => {
    // Функция для получения названия продукта в зависимости от языка
    const getProductName = (product) => {
      switch(language) {
        case 'ru': return product.nameRu || product.name;
        case 'pl': return product.namePl || product.name;
        default: return product.name;
      }
    };    // Вычисляем скидку от оригинальных цен (в USD)
    const discount = (product.originalOldPrice && product.originalPrice) ? 
      Math.round(((product.originalOldPrice - product.originalPrice) / product.originalOldPrice) * 100) : 
      (product.oldPrice && product.price) ? 
        Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) :
        product.discount;

    return (
      <div className="product-card">
        {showDiscount && discount && (
          <div className="discount-badge">-{discount}%</div>
        )}
        {showNew && (product.isNew || product.isActive) && (
          <div className="new-badge">NEW</div>
        )}
        <div className="product-image">{product.emoji || product.image || '📦'}</div>
        <h3 className="product-name">{getProductName(product)}</h3>
        <div className="product-price-section">
          <span className="product-price">
            {formatPrice ? formatPrice(product.price) : `${product.price} ${t.currency}`}
          </span>
          {product.oldPrice && (
            <span className="old-price">
              {formatPrice ? formatPrice(product.oldPrice) : `${product.oldPrice} ${t.currency}`}
            </span>
          )}
        </div>
        {showRating && product.rating && (
          <div className="product-rating">
            {'★'.repeat(Math.floor(product.rating))} {product.rating}
          </div>
        )}
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          {t.addToCart}
        </button>
      </div>
    );
  };

  const handleSectionClick = (sectionType) => {
    onNavigate('section', sectionType);
  };

  const handleHeroClick = () => {
    onNavigate('section', 'discounts');
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>{t.discounts}</h1>
          <p>На популярные товары из разных категорий</p>
          <button className="hero-btn" onClick={handleHeroClick}>
            {t.seeAll}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <h2>Loading products...</h2>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <h2>Error loading products</h2>
          <p>{error}</p>
          <button onClick={loadInitialProducts}>Try Again</button>
        </div>
      )}

      {/* Products Sections */}
      {!loading && !error && (
        <>
          {/* Hot Deals Section */}
          <section className="product-section">
            <div className="section-header">
              <h2>🔥 {t.hotDeals}</h2>
              <button className="see-all-btn" onClick={() => handleSectionClick('hot-deals')}>
                {t.seeAll}
              </button>
            </div>
            <div className="products-grid">
              {hotDeals.length > 0 ? (
                hotDeals.map(product => (
                  <ProductCard key={product.id} product={product} showDiscount={true} />
                ))
              ) : (
                <p>No hot deals available</p>
              )}
            </div>
          </section>

          {/* New Arrivals Section */}
          <section className="product-section">
            <div className="section-header">
              <h2>✨ {t.newArrivals}</h2>
              <button className="see-all-btn" onClick={() => handleSectionClick('new-arrivals')}>
                {t.seeAll}
              </button>
            </div>
            <div className="products-grid">
              {newArrivals.length > 0 ? (
                newArrivals.map(product => (
                  <ProductCard key={product.id} product={product} showNew={true} />
                ))
              ) : (
                <p>No new arrivals available</p>
              )}
            </div>
          </section>

          {/* Recommended Section */}
          <section className="product-section">
            <div className="section-header">
              <h2>💡 {t.recommended}</h2>
              <button className="see-all-btn" onClick={() => handleSectionClick('recommended')}>
                {t.seeAll}
              </button>
            </div>
            <div className="products-grid">
              {recommended.length > 0 ? (
                recommended.map(product => (
                  <ProductCard key={product.id} product={product} showRating={true} />
                ))
              ) : (
                <p>No recommendations available</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
