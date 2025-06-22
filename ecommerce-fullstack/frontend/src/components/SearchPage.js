import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchPage.css';
import currencyService from '../services/CurrencyService';

const SearchPage = ({ language, searchQuery, addToCart, currency, formatPriceWithCurrency, onHomeClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const originalProductsRef = useRef(null);

  // Функция быстрой конвертации цен на клиенте
  const convertPricesQuickly = useCallback((productsToConvert, targetCurrency) => {
    if (!productsToConvert || targetCurrency === 'USD') return productsToConvert;
    
    // Быстрые курсы для немедленного отображения
    const quickRates = { USD: 1, PLN: 3.71, RUB: 78.42, EUR: 0.868, GBP: 0.743 };
    const rate = quickRates[targetCurrency] || 1;
    
    return productsToConvert.map(product => ({
      ...product,
      price: product.originalPrice ? product.originalPrice * rate : product.price * rate,
      oldPrice: product.originalOldPrice ? product.originalOldPrice * rate : 
                (product.oldPrice ? product.oldPrice * rate : null)
    }));
  }, []);
  // Загрузка товаров с сервера
  const loadProducts = useCallback(async () => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setProducts([]);
      setProductsLoaded(false);
      setLoading(false);
      setError(null);
      return;
    }    if (searchQuery.trim().length < 2) {
      return; // Не выполняем поиск для слишком коротких запросов
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('search', searchQuery.trim());
      params.append('currency', 'USD'); // Загружаем с USD ценами
      
      const url = `http://localhost:8080/api/products/with-currency?${params}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to search products`);
      
      const responseData = await response.json();
      const data = responseData.products || responseData;
      
      // Сохраняем оригинальные товары
      originalProductsRef.current = Array.isArray(data) ? data : [];
      
      // Применяем быструю конвертацию для текущей валюты
      const convertedProducts = convertPricesQuickly(originalProductsRef.current, currency);
      setProducts(convertedProducts);
      setProductsLoaded(true);
      
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, convertPricesQuickly, currency]);

  // Обновление цен при смене валюты
  const updatePricesForCurrency = useCallback(async () => {
    if (!productsLoaded || !currency || !originalProductsRef.current) {
      return;
    }

    // Быстрая конвертация для немедленного отклика
    const quickConverted = convertPricesQuickly(originalProductsRef.current, currency);
    setProducts(quickConverted);

    // Затем получаем точные цены с сервера в фоне
    try {
      const convertedData = await currencyService.convertProductPrices(originalProductsRef.current, currency);
      setProducts(convertedData.products || quickConverted);
    } catch (err) {
      console.error('Error updating prices for currency:', err);
      // При ошибке оставляем быструю конвертацию
    }
  }, [currency, productsLoaded, convertPricesQuickly]);

  // Эффект для поиска при изменении запроса
  useEffect(() => {
    setProductsLoaded(false);
    loadProducts();
  }, [searchQuery, loadProducts]);

  // Эффект для обновления цен при смене валюты
  useEffect(() => {
    if (productsLoaded && currency) {
      updatePricesForCurrency();
    }  }, [currency, productsLoaded, updatePricesForCurrency]);

  const translations = {
    ru: {
      searchResults: 'Результаты поиска',
      noResults: 'Товары не найдены',
      noResultsText: 'Попробуйте изменить поисковый запрос',
      resultsFor: 'Результаты для',
      addToCart: 'В корзину',
      loading: 'Поиск...',
      error: 'Ошибка поиска',
      tryAgain: 'Попробовать снова',
      foundProducts: 'Найдено товаров'
    },
    en: {
      searchResults: 'Search Results',
      noResults: 'No products found',
      noResultsText: 'Try changing your search query',
      resultsFor: 'Results for',
      addToCart: 'Add to Cart',
      loading: 'Searching...',
      error: 'Search error',
      tryAgain: 'Try again',
      foundProducts: 'Products found'
    },
    pl: {
      searchResults: 'Wyniki wyszukiwania',
      noResults: 'Nie znaleziono produktów',
      noResultsText: 'Spróbuj zmienić zapytanie wyszukiwania',
      resultsFor: 'Wyniki dla',
      addToCart: 'Do koszyka',
      loading: 'Wyszukiwanie...',
      error: 'Błąd wyszukiwania',
      tryAgain: 'Spróbuj ponownie',
      foundProducts: 'Znalezione produkty'
    }
  };
  const t = translations[language] || translations.en;

  // Показываем сообщение о необходимости ввести больше символов
  if (searchQuery && searchQuery.trim().length > 0 && searchQuery.trim().length < 2) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>{t.searchResults}</h2>
          <p style={{color: '#666', fontSize: '14px', marginTop: '10px'}}>
            {language === 'ru' ? 'Введите минимум 2 символа для поиска' : 
             language === 'pl' ? 'Wprowadź co najmniej 2 znaki do wyszukiwania' : 
             'Enter at least 2 characters to search'}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>{t.loading}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>{t.error}</h2>
          <p>{error}</p>
          <button onClick={loadProducts} className="retry-button">
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }
  if (!searchQuery || searchQuery.trim().length === 0) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>{t.searchResults}</h2>
          <p style={{color: '#666', fontSize: '16px', marginTop: '20px'}}>
            {language === 'ru' ? 'Начните вводить запрос в поисковой строке' : 
             language === 'pl' ? 'Zacznij wpisywać zapytanie w pasku wyszukiwania' : 
             'Start typing in the search bar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">      <div className="search-header">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h2>{t.resultsFor}: "{searchQuery}"</h2>
          <button 
            onClick={onHomeClick}
            style={{
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {language === 'ru' ? 'На главную' : 
             language === 'pl' ? 'Do strony głównej' : 
             'Home'}
          </button>
        </div>
        {products.length > 0 && (
          <p>{t.foundProducts}: {products.length}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <h3>{t.noResults}</h3>
          <p>{t.noResultsText}</p>
        </div>
      ) : (
        <div className="search-results">
          {products.map(product => (
            <div key={product.id} className="product-card">              <div className="product-image">
                <span className="product-emoji">{product.image}</span>
                {product.isNew && <span className="new-badge">NEW</span>}
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="discount-badge">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">
                  {language === 'ru' && product.nameRu ? product.nameRu :
                   language === 'pl' && product.namePl ? product.namePl :
                   product.name}
                </h3>
                
                <div className="product-rating">
                  <span>⭐ {product.rating}</span>
                </div>
                  <div className="product-price">
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="old-price">
                      {formatPriceWithCurrency ? formatPriceWithCurrency(product.oldPrice) : `${product.oldPrice}`}
                    </span>
                  )}
                  <span className="current-price">
                    {formatPriceWithCurrency ? formatPriceWithCurrency(product.price) : `${product.price}`}
                  </span>
                </div>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart && addToCart(product)}
                >
                  {t.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
