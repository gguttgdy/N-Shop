import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = ({ language, onNavigate, addToCart, currency, formatPrice }) => {
  const [hotDeals, setHotDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setFallbackData = useCallback(() => {
    // Демо данные как fallback
    setHotDeals([
      { id: 1, name: 'iPhone 14', price: 999, oldPrice: 1299, image: '📱', discount: 25 },
      { id: 2, name: 'MacBook Air', price: 1199, oldPrice: 1499, image: '💻', discount: 23 },
      { id: 3, name: 'AirPods Pro', price: 199, oldPrice: 249, image: '🎧', discount: 25 },
      { id: 4, name: 'iPad Pro', price: 899, oldPrice: 1099, image: '📱', discount: 19 }
    ]);

    setNewArrivals([
      { id: 5, name: 'Samsung Galaxy S24', price: 899, image: '📱', isNew: true },
      { id: 6, name: 'Sony WH-1000XM5', price: 399, image: '🎧', isNew: true },
      { id: 7, name: 'Dell XPS 13', price: 1299, image: '💻', isNew: true },
      { id: 8, name: 'Canon EOS R6', price: 2499, image: '📷', isNew: true }
    ]);

    setRecommended([
      { id: 9, name: 'Apple Watch', price: 399, image: '⌚', rating: 4.8 },
      { id: 10, name: 'Nike Air Max', price: 159, image: '👟', rating: 4.7 },
      { id: 11, name: 'Kindle Oasis', price: 249, image: '📖', rating: 4.6 },
      { id: 12, name: 'JBL Speaker', price: 99, image: '🔊', rating: 4.5 }
    ]);
  }, []);

  const loadSectionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем данные для всех секций параллельно
      const [hotDealsRes, newArrivalsRes, recommendedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/products/with-currency', {
          params: { section: 'hot-deals', currency: currency || 'USD' }
        }),
        axios.get('http://localhost:8080/api/products/with-currency', {
          params: { section: 'new-arrivals', currency: currency || 'USD' }
        }),
        axios.get('http://localhost:8080/api/products/with-currency', {
          params: { section: 'recommended', currency: currency || 'USD' }
        })
      ]);

      // Ограничиваем количество товаров для отображения на главной странице
      setHotDeals(hotDealsRes.data.products.slice(0, 4));
      setNewArrivals(newArrivalsRes.data.products.slice(0, 4));
      setRecommended(recommendedRes.data.products.slice(0, 4));
    } catch (err) {
      console.error('Error loading section data:', err);
      setError(err.message);
      // Fallback данные при ошибке
      setFallbackData();
    } finally {
      setLoading(false);
    }
  }, [currency, setFallbackData]);

  useEffect(() => {
    loadSectionData();
  }, [loadSectionData]);

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

  const t = translations[language];

  const ProductCard = ({ product, showDiscount = false, showNew = false, showRating = false }) => {
    // Функция для получения названия продукта в зависимости от языка
    const getProductName = (product) => {
      switch(language) {
        case 'ru': return product.nameRu || product.name;
        case 'pl': return product.namePl || product.name;
        default: return product.name;
      }
    };

    // Вычисляем скидку если есть старая цена
    const discount = product.oldPrice ? 
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
          <button onClick={loadSectionData}>Try Again</button>
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
