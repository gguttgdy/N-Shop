import React, { useState, useEffect, useRef, useCallback } from 'react';
import CurrencyService from '../services/CurrencyService';
import './ProductGrid.css';

const ProductGrid = ({ language, filters, categoryId, subcategoryId, sectionType, addToCart, currency, formatPriceWithCurrency }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const originalProductsRef = useRef(null);  // Загрузка продуктов только один раз (без валюты)
  const loadInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Маппинг неправильных названий категорий и подкатегорий к правильным
      const categoryMapping = {
        'clothing': 'fashion',  // clothing -> fashion
        'clothes': 'fashion'
      };
      
      const subcategoryMapping = {
        // Electronics
        'phones': 'smartphones',
        'phone': 'smartphones',
        'mobile': 'smartphones',
        
        // Fashion subcategories
        'mens-clothing': 'men',
        'men-clothing': 'men',
        'mens': 'men',
        'womens-clothing': 'women',
        'women-clothing': 'women',
        'womens': 'women',
        'kids-clothing': 'kids',
        'children-clothing': 'kids',
        'children': 'kids',
        
        // Home subcategories
        'tools': 'garden',
        'garden-tools': 'garden',
        'gardening': 'garden',
        
        // Sports subcategories
        'equipment': 'fitness',
        'active-recreation': 'outdoor',
        'team-sports': 'team',
        'water-sports': 'water',
        
        // Books subcategories - исправляем маппинг
        'educational': 'education',
        'children-books': 'children',  // children-books -> children
        'kids-books': 'children',      // kids-books -> children
        'childrens-books': 'children', // childrens-books -> children
        
        // Beauty subcategories
        'skin-care': 'skincare',
        'hair-care': 'haircare',
        'perfumes': 'perfume'
      };
      
      // Исправляем categoryId и subcategoryId если они неправильные
      const correctedCategoryId = categoryMapping[categoryId] || categoryId;
      const correctedSubcategoryId = subcategoryMapping[subcategoryId] || subcategoryId;
      
      const params = new URLSearchParams();
      if (correctedCategoryId) params.append('category', correctedCategoryId);
      if (correctedSubcategoryId) params.append('subcategory', correctedSubcategoryId);
      if (sectionType) params.append('section', sectionType);
      if (filters?.search) params.append('search', filters.search);
      // Загружаем товары с USD ценами (без конвертации)
      params.append('currency', 'USD');
      
      const url = `http://localhost:8080/api/products/with-currency?${params}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      
      const responseData = await response.json();
      const data = responseData.products || responseData;
      
      // Сохраняем оригинальные товары
      originalProductsRef.current = Array.isArray(data) ? data : [];
      setProducts(originalProductsRef.current);
      setProductsLoaded(true);
      
    } catch (err) {
      console.error('Error loading initial products:', err);
      setError(err.message);
      setProducts([]);    } finally {
      setLoading(false);
    }
  }, [categoryId, subcategoryId, sectionType, filters?.search]); // Убираем productsLoaded из зависимостей

  // Быстрая конвертация цен при смене валюты
  const convertPricesQuickly = useCallback((productsToConvert, targetCurrency) => {
    if (!productsToConvert || targetCurrency === 'USD') {
      return productsToConvert;
    }

    // Простые курсы для быстрой конвертации
    const quickRates = {
      'RUB': 95.0,
      'PLN': 4.2,
      'EUR': 0.92,
      'GBP': 0.78
    };

    const rate = quickRates[targetCurrency];
    if (!rate) return productsToConvert;

    return productsToConvert.map(product => ({
      ...product,
      price: product.originalPrice ? (product.originalPrice * rate) : product.price,
      oldPrice: product.originalOldPrice ? (product.originalOldPrice * rate) : product.oldPrice
    }));
  }, []);

  // Обновление цен при смене валюты
  const updatePricesForCurrency = useCallback(async () => {
    if (!productsLoaded || !currency || !originalProductsRef.current) {
      return;
    }

    // Быстрая конвертация на клиенте
    const quickConverted = convertPricesQuickly(originalProductsRef.current, currency);
    setProducts(quickConverted);

    // Точная конвертация с сервера в фоне
    try {
      const converted = await CurrencyService.convertProductPrices(originalProductsRef.current, currency);
      if (converted && converted.products) {
        setProducts(converted.products);
      }
    } catch (err) {
      console.error('Error updating prices for currency:', err);
      // При ошибке оставляем быструю конвертацию
    }
  }, [currency, productsLoaded, convertPricesQuickly]);  // Эффект для первичной загрузки товаров
  useEffect(() => {
    // Сбрасываем состояние при изменении параметров поиска
    setProductsLoaded(false);
    setProducts([]);
  }, [categoryId, subcategoryId, sectionType, filters?.search]);

  // Эффект для загрузки товаров когда они не загружены
  useEffect(() => {
    if (!productsLoaded) {
      loadInitialProducts();
    }
  }, [productsLoaded, loadInitialProducts]);

  // Эффект для обновления цен при смене валюты
  useEffect(() => {
    if (productsLoaded && currency) {
      updatePricesForCurrency();
    }
  }, [currency, productsLoaded, updatePricesForCurrency]);
  const handleRetry = () => {
    // Повторная попытка загрузки данных
    setError(null);
    setProductsLoaded(false);
    loadInitialProducts();
  };

  const translations = {
    ru: { 
      currency: 'руб.',
      popularProducts: 'Товары',
      addToCart: 'В корзину',
      noProducts: 'Товары не найдены',
      resultsCount: 'Найдено товаров:',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки товаров',
      tryChangeFilters: 'Попробуйте изменить фильтры или выберите другую категорию',
      smartphones: 'Смартфоны',
      cameras: 'Камеры',
      accessories: 'Аксессуары',
      men: 'Мужская одежда',
      women: 'Женская одежда', 
      kids: 'Детская одежда',
      shoes: 'Обувь',
      bags: 'Сумки',
      jewelry: 'Украшения',
      makeup: 'Макияж',
      skincare: 'Уход за кожей',
      haircare: 'Уход за волосами',
      perfume: 'Парфюмерия',
      // Home
      furniture: 'Мебель',
      kitchen: 'Кухня',
      bathroom: 'Ванная',
      garden: 'Сад и Инструменты',
      decor: 'Декор',
      // Sports
      fitness: 'Фитнес',
      outdoor: 'Активный отдых',
      team: 'Командные виды',
      water: 'Водные виды',
      clothing: 'Спортивная одежда',
      // Books
      fiction: 'Художественная литература',
      'non-fiction': 'Научная литература',
      education: 'Образование',
      children: 'Детские книги',
      business: 'Бизнес'
    },
    en: { 
      currency: 'USD',
      popularProducts: 'Products',
      addToCart: 'Add to Cart',
      noProducts: 'No products found',
      resultsCount: 'Products found:',
      loading: 'Loading...',
      error: 'Error loading products',
      tryChangeFilters: 'Try changing filters or select another category',
      smartphones: 'Smartphones',
      cameras: 'Cameras',
      accessories: 'Accessories',
      men: 'Men\'s Clothing',
      women: 'Women\'s Clothing',
      kids: 'Kids Clothing',
      shoes: 'Shoes',
      bags: 'Bags',
      jewelry: 'Jewelry',
      makeup: 'Makeup',
      skincare: 'Skincare',
      haircare: 'Haircare',
      perfume: 'Perfume',
      // Home
      furniture: 'Furniture',
      kitchen: 'Kitchen',
      bathroom: 'Bathroom',
      garden: 'Garden & Tools',
      decor: 'Decor',
      // Sports
      fitness: 'Fitness',
      outdoor: 'Outdoor Recreation',
      team: 'Team Sports',
      water: 'Water Sports',
      clothing: 'Sports Clothing',
      // Books
      fiction: 'Fiction',
      'non-fiction': 'Non-Fiction',
      education: 'Education',
      children: 'Children\'s Books',
      business: 'Business'
    },
    pl: { 
      currency: 'zł',
      popularProducts: 'Produkty',
      addToCart: 'Do koszyka',
      noProducts: 'Nie znaleziono produktów',
      resultsCount: 'Znaleziono produktów:',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania produktów',
      tryChangeFilters: 'Spróbuj zmienić filtry lub wybierz inną kategorię',
      smartphones: 'Smartfony',
      cameras: 'Kamery',
      accessories: 'Akcesoria',
      men: 'Odzież męska',
      women: 'Odzież damska',
      kids: 'Odzież dziecięca',
      shoes: 'Obuwie',
      bags: 'Torby',
      jewelry: 'Biżuteria',
      makeup: 'Makijaż',
      skincare: 'Pielęgnacja skóry',
      haircare: 'Pielęgnacja włosów',
      perfume: 'Perfumy',
      // Home
      furniture: 'Meble',
      kitchen: 'Kuchnia',
      bathroom: 'Łazienka',
      garden: 'Ogród i Narzędzia',
      decor: 'Dekoracje',
      // Sports
      fitness: 'Fitness',
      outdoor: 'Rekreacja na świeżym powietrzu',
      team: 'Sporty zespołowe',
      water: 'Sporty wodne',
      clothing: 'Odzież sportowa',
      // Books
      fiction: 'Beletrystyka',
      'non-fiction': 'Literatura faktu',
      education: 'Edukacja',
      children: 'Książki dla dzieci',
      business: 'Biznes'
    }
  };

  const t = translations[language];

  const getLocalizedProductName = (product) => {
    switch(language) {
      case 'ru': return product.nameRu || product.name;
      case 'pl': return product.namePl || product.name;
      default: return product.name;
    }
  };
  const formatPriceDisplay = (price) => {
    if (formatPriceWithCurrency) {
      // Используем новую систему валют если передана
      return formatPriceWithCurrency(price);
    } else {
      // Fallback к старому форматированию
      if (typeof price !== 'number') return '0';
      return price.toLocaleString(language === 'ru' ? 'ru-RU' : language === 'pl' ? 'pl-PL' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  };

  const getSectionTitle = () => {
    if (sectionType) {
      const sectionTitles = {
        'hot-deals': { ru: 'Горячие предложения', en: 'Hot Deals', pl: 'Gorące oferty' },
        'new-arrivals': { ru: 'Новинки', en: 'New Arrivals', pl: 'Nowości' },
        'recommended': { ru: 'Рекомендуемые товары', en: 'Recommended Products', pl: 'Polecane produkty' },
        'discounts': { ru: 'Товары со скидкой', en: 'Discounted Products', pl: 'Produkty ze zniżką' }
      };
      return sectionTitles[sectionType]?.[language] || t.popularProducts;
    }
    
    // Handle subcategory titles
    if (subcategoryId) {
      const subcategoryTitles = {
        // Electronics
        'smartphones': t.smartphones,
        'phones': t.smartphones,
        'phone': t.smartphones,
        'cameras': t.cameras,
        'accessories': t.accessories,
        'laptops': { ru: 'Ноутбуки', en: 'Laptops', pl: 'Laptopy' }[language],
        'tablets': { ru: 'Планшеты', en: 'Tablets', pl: 'Tablety' }[language],
        'headphones': { ru: 'Наушники', en: 'Headphones', pl: 'Słuchawki' }[language],
        
        // Fashion - добавляем все возможные варианты
        'men': t.men,
        'mens': t.men,
        'mens-clothing': t.men,
        'men-clothing': t.men,
        'women': t.women,
        'womens': t.women,
        'womens-clothing': t.women,
        'women-clothing': t.women,
        'kids': t.kids,
        'kids-clothing': t.kids,
        'children': t.kids,
        'children-clothing': t.kids,
        'shoes': t.shoes,
        'bags': t.bags,
        'jewelry': t.jewelry,
        
        // Beauty
        'makeup': t.makeup,
        'skincare': t.skincare,
        'skin-care': t.skincare,
        'haircare': t.haircare,
        'hair-care': t.haircare,
        'perfume': t.perfume,
        'perfumes': t.perfume,
        
        // Home - добавляем все возможные варианты
        'furniture': t.furniture,
        'kitchen': t.kitchen,
        'bathroom': t.bathroom,
        'garden': t.garden,
        'tools': t.garden,  // tools отображается как garden
        'garden-tools': t.garden,
        'gardening': t.garden,
        'decor': t.decor,
        
        // Sports
        'fitness': t.fitness,
        'equipment': t.fitness,  // equipment отображается как fitness
        'outdoor': t.outdoor,
        'active-recreation': t.outdoor,
        'team': t.team,
        'team-sports': t.team,
        'water': t.water,
        'water-sports': t.water,
        'clothing': { ru: 'Спортивная одежда', en: 'Sports Clothing', pl: 'Odzież sportowa' }[language],
          // Books - исправляем названия подкатегорий
        'fiction': t.fiction,
        'non-fiction': t['non-fiction'],
        'education': t.education,
        'educational': t.education,
        'children-books': t.children,  // children-books отображается как children
        'kids-books': t.children,      // kids-books отображается как children
        'childrens-books': t.children, // childrens-books отображается как children
        'business': t.business,
      };
      return subcategoryTitles[subcategoryId] || t.popularProducts;
    }
    
    return t.popularProducts;
  };
  if (loading) {
    return (
      <div className="product-grid">
        <div className="loading">
          <h2>{t.loading}</h2>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="product-grid">
        <div className="error">
          <h2>{t.error}</h2>
          <p>{error}</p>
          <button onClick={handleRetry} style={{marginTop: '10px', padding: '8px 16px'}}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid">        <div className="no-products">
          <h2>{t.noProducts}</h2>
          <p>{t.tryChangeFilters}</p>
          <button onClick={handleRetry} style={{marginTop: '10px', padding: '8px 16px'}}>
            Reload Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="product-grid">
      <div className="products-header">
        <h2>{getSectionTitle()}</h2>
        <span className="results-count">
          {t.resultsCount} {products.length}
        </span>
      </div>
      
      {/* Убираем кнопки подкатегорий - они не нужны на общей странице */}
      
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.discount > 0 && (
              <div className="discount-badge">-{product.discount}%</div>
            )}
            {product.isNew && (
              <div className="new-badge">NEW</div>
            )}
            <div className="product-image">
              {product.image}
            </div>
            <h3 className="product-name">{getLocalizedProductName(product)}</h3>
            <div className="product-price-section">
              <span className="product-price">
                {formatPriceDisplay(product.price)}{!formatPriceWithCurrency && ` ${t.currency}`}
              </span>
              {product.oldPrice && (
                <span className="old-price">
                  {formatPriceDisplay(product.oldPrice)}{!formatPriceWithCurrency && ` ${t.currency}`}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="product-rating">
                {'★'.repeat(Math.floor(product.rating))} {product.rating}
              </div>
            )}
            <button 
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              {t.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
