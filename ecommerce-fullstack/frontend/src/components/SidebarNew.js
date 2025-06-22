import React, { useState, useEffect } from 'react';
import './SidebarUnified.css';

const Sidebar = ({ language, onFilterChange, category, subcategory }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    selectedBrands: [],
    inStock: false,
    minRating: 0,
    isNew: false,
    hasDiscount: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const [filterData, setFilterData] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    maxRating: 5,
    totalProducts: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const translations = {
    ru: {
      filters: 'Фильтры',
      priceRange: 'Диапазон цен',
      brands: 'Бренды',
      availability: 'Наличие',
      inStock: 'В наличии',
      rating: 'Рейтинг',
      newProducts: 'Новинки',
      discounts: 'Скидки',
      sortBy: 'Сортировка',
      reset: 'Сбросить',
      apply: 'Применить',
      sortOptions: {
        name: 'По названию',
        price: 'По цене',
        rating: 'По рейтингу',
        newest: 'Новинки'
      },      from: 'от',
      to: 'до',
      andAbove: 'и выше',
      withDiscount: 'Со скидкой',
      productsFound: 'товаров найдено',
      anyRating: 'Любой рейтинг'
    },
    en: {
      filters: 'Filters',
      priceRange: 'Price Range',
      brands: 'Brands',
      availability: 'Availability',
      inStock: 'In Stock',
      rating: 'Rating',
      newProducts: 'New Products',
      discounts: 'Discounts',
      sortBy: 'Sort By',
      reset: 'Reset',
      apply: 'Apply',
      sortOptions: {
        name: 'By Name',
        price: 'By Price',
        rating: 'By Rating',
        newest: 'Newest'
      },      from: 'from',
      to: 'to',
      andAbove: 'and above',
      withDiscount: 'With Discount',
      productsFound: 'products found',
      anyRating: 'Any Rating'
    },
    pl: {
      filters: 'Filtry',
      priceRange: 'Zakres cen',
      brands: 'Marki',
      availability: 'Dostępność',
      inStock: 'Dostępne',
      rating: 'Ocena',
      newProducts: 'Nowości',
      discounts: 'Promocje',
      sortBy: 'Sortowanie',
      reset: 'Resetuj',
      apply: 'Zastosuj',
      sortOptions: {
        name: 'Według nazwy',
        price: 'Według ceny',
        rating: 'Według oceny',
        newest: 'Najnowsze'
      },      from: 'od',
      to: 'do',
      andAbove: 'i więcej',
      withDiscount: 'Z promocją',
      productsFound: 'produktów znaleziono',
      anyRating: 'Każda ocena'
    }
  };

  const t = translations[language];  // Загружаем данные для фильтров при изменении категории
  useEffect(() => {
    const loadFilterData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);

        const response = await fetch(`http://localhost:8080/api/products/filter-data?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFilterData(data);
          
          // Обновляем диапазон цен в фильтрах
          setFilters(prev => ({
            ...prev,
            priceRange: [data.minPrice || 0, data.maxPrice || 10000]
          }));
        }
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterData();
  }, [category, subcategory]);

  // Cleanup таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Автоматически применяем фильтры при изменении
    applyFilters(newFilters);
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    handleFilterChange('selectedBrands', newBrands);
  };
  const handlePriceChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    
    // Предотвращаем обновление если значение не изменилось
    if (filters.priceRange[index] === newValue) {
      return;
    }
    
    const newRange = [...filters.priceRange];
    newRange[index] = newValue;
    
    // Убеждаемся что min не больше max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    handleFilterChange('priceRange', newRange);
  };
  const applyFilters = (currentFilters = filters) => {
    // Очищаем предыдущий таймер
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Устанавливаем новый таймер для дебаунсинга
    const newTimer = setTimeout(() => {
      const filterParams = {
        minPrice: currentFilters.priceRange[0],
        maxPrice: currentFilters.priceRange[1],
        brands: currentFilters.selectedBrands,
        inStock: currentFilters.inStock,
        minRating: currentFilters.minRating,
        isNew: currentFilters.isNew,
        hasDiscount: currentFilters.hasDiscount,
        sortBy: currentFilters.sortBy,
        sortDirection: currentFilters.sortDirection
      };

      onFilterChange && onFilterChange(filterParams);
    }, 300); // 300ms задержка
    
    setDebounceTimer(newTimer);
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [filterData.minPrice || 0, filterData.maxPrice || 10000],
      selectedBrands: [],
      inStock: false,
      minRating: 0,
      isNew: false,
      hasDiscount: false,
      sortBy: 'name',
      sortDirection: 'asc'
    };
    
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  const ratingStars = [1, 2, 3, 4, 5];  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{t.filters}</h3>
        <button className="reset-button" onClick={resetFilters}>
          {t.reset}
        </button>
      </div>

      <div className="sidebar-content">
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Загрузка...</span>
          </div>
        )}

        {/* Сортировка */}
        <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.sortBy}</h4>
        </div>
        <div className="filter-content">
          <select 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="sort-select"
          >
            <option value="name">{t.sortOptions.name}</option>
            <option value="price">{t.sortOptions.price}</option>
            <option value="rating">{t.sortOptions.rating}</option>
            <option value="newest">{t.sortOptions.newest}</option>
          </select>
          <div className="sort-direction">
            <button
              type="button"
              className={`direction-button ${filters.sortDirection === 'asc' ? 'active' : ''}`}
              onClick={() => handleFilterChange('sortDirection', 'asc')}
            >
              ↑ A-Z
            </button>
            <button
              type="button"
              className={`direction-button ${filters.sortDirection === 'desc' ? 'active' : ''}`}
              onClick={() => handleFilterChange('sortDirection', 'desc')}
            >
              ↓ Z-A
            </button>
          </div>
        </div>
      </div>

      {/* Диапазон цен */}
      <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.priceRange}</h4>
        </div>
        <div className="filter-content">
          <div className="price-range">
            <div className="price-inputs">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                placeholder={t.from}
                min={filterData.minPrice}
                max={filterData.maxPrice}
                className="price-input"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                placeholder={t.to}
                min={filterData.minPrice}
                max={filterData.maxPrice}
                className="price-input"
              />
            </div>
            <div className="price-slider-container">
              <input
                type="range"
                min={filterData.minPrice}
                max={filterData.maxPrice}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="price-slider"
              />
              <input
                type="range"
                min={filterData.minPrice}
                max={filterData.maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="price-slider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Бренды */}
      {filterData.brands.length > 0 && (
        <div className="filter-section">
          <div className="section-header">
            <h4 className="section-title">{t.brands}</h4>
          </div>
          <div className="filter-content">
            <div className="brands-list">
              {filterData.brands.map(brand => (
                <div key={brand} className="brand-item">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    className="brand-checkbox"
                    checked={filters.selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <label htmlFor={`brand-${brand}`} className="brand-label">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}      {/* Рейтинг */}
      <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.rating}</h4>
        </div>
        <div className="filter-content">          <select 
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
            className="rating-select"
          >
            <option value={0}>{t.anyRating}</option>
            {ratingStars.map(rating => (
              <option key={rating} value={rating}>
                {'★'.repeat(rating)} {rating} {t.andAbove}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Наличие */}
      <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.availability}</h4>
        </div>
        <div className="filter-content">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            />
            <label htmlFor="inStock">{t.inStock}</label>
          </div>
        </div>
      </div>

      {/* Новинки */}
      <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.newProducts}</h4>
        </div>
        <div className="filter-content">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="isNew"
              checked={filters.isNew}
              onChange={(e) => handleFilterChange('isNew', e.target.checked)}
            />
            <label htmlFor="isNew">{t.newProducts}</label>
          </div>
        </div>
      </div>

      {/* Скидки */}
      <div className="filter-section">
        <div className="section-header">
          <h4 className="section-title">{t.discounts}</h4>
        </div>
        <div className="filter-content">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="hasDiscount"
              checked={filters.hasDiscount}
              onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
            />
            <label htmlFor="hasDiscount">{t.withDiscount}</label>
          </div>
        </div>
      </div>      {/* Счетчик товаров */}
      {filterData.totalProducts !== undefined && (
        <div className="products-count">
          <small>{filterData.totalProducts} {t.productsFound}</small>
        </div>
      )}
      </div>
    </div>
  );
};

export default Sidebar;
