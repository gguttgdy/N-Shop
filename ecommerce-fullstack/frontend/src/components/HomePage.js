import React from 'react';
import './HomePage.css';

const HomePage = ({ language, onNavigate, addToCart }) => {
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

  // Демо данные для разных секций
  const hotDeals = [
    { id: 1, name: 'iPhone 14', price: 45000, oldPrice: 60000, image: '📱', discount: 25 },
    { id: 2, name: 'MacBook Air', price: 85000, oldPrice: 110000, image: '💻', discount: 23 },
    { id: 3, name: 'AirPods Pro', price: 15000, oldPrice: 20000, image: '🎧', discount: 25 },
    { id: 4, name: 'iPad Pro', price: 65000, oldPrice: 80000, image: '📱', discount: 19 }
  ];

  const newArrivals = [
    { id: 5, name: 'Samsung Galaxy S24', price: 55000, image: '📱', isNew: true },
    { id: 6, name: 'Sony WH-1000XM5', price: 25000, image: '🎧', isNew: true },
    { id: 7, name: 'Dell XPS 13', price: 95000, image: '💻', isNew: true },
    { id: 8, name: 'Canon EOS R6', price: 180000, image: '📷', isNew: true }
  ];

  const recommended = [
    { id: 9, name: 'Apple Watch', price: 30000, image: '⌚', rating: 4.8 },
    { id: 10, name: 'Nike Air Max', price: 12000, image: '👟', rating: 4.7 },
    { id: 11, name: 'Kindle Oasis', price: 25000, image: '📖', rating: 4.6 },
    { id: 12, name: 'JBL Speaker', price: 8000, image: '🔊', rating: 4.5 }
  ];

  const ProductCard = ({ product, showDiscount = false, showNew = false, showRating = false }) => (
    <div className="product-card">
      {showDiscount && product.discount && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      {showNew && product.isNew && (
        <div className="new-badge">NEW</div>
      )}
      <div className="product-image">{product.image}</div>
      <h3 className="product-name">{product.name}</h3>
      <div className="product-price-section">
        <span className="product-price">{product.price} {t.currency}</span>
        {product.oldPrice && (
          <span className="old-price">{product.oldPrice} {t.currency}</span>
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

      {/* Hot Deals Section */}
      <section className="product-section">
        <div className="section-header">
          <h2>🔥 {t.hotDeals}</h2>
          <button className="see-all-btn" onClick={() => handleSectionClick('hot-deals')}>
            {t.seeAll}
          </button>
        </div>
        <div className="products-grid">
          {hotDeals.map(product => (
            <ProductCard key={product.id} product={product} showDiscount={true} />
          ))}
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
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} showNew={true} />
          ))}
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
          {recommended.map(product => (
            <ProductCard key={product.id} product={product} showRating={true} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
