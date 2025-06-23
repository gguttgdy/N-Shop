import React, { useState, useEffect } from 'react';
import './Sidebar.css';

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
      },
      from: 'от',
      to: 'до',
      andAbove: 'и выше',
      withDiscount: 'Со скидкой',
      productsFound: 'товаров найдено'
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
      },
      from: 'from',
      to: 'to',
      andAbove: 'and above',
      withDiscount: 'With Discount',
      productsFound: 'products found'
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
      },
      from: 'od',
      to: 'do',
      andAbove: 'i więcej',
      withDiscount: 'Z promocją',
      productsFound: 'produktów znaleziono'
    }
  };

  const t = translations[language];

  // Загружаем данные для фильтров при изменении категории
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
    const newRange = [...filters.priceRange];
    newRange[index] = parseFloat(value) || 0;
    handleFilterChange('priceRange', newRange);
  };

  const applyFilters = (currentFilters = filters) => {
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

  const ratingStars = [1, 2, 3, 4, 5];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{t.filters}</h3>
        <button className="reset-btn" onClick={resetFilters}>
          {t.reset}
        </button>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}

      {/* Сортировка */}
      <div className="filter-section">
        <h4>{t.sortBy}</h4>
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
          <label className="radio-label">
            <input
              type="radio"
              name="sortDirection"
              value="asc"
              checked={filters.sortDirection === 'asc'}
              onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
            />
            <span>↑ A-Z / 1-9</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="sortDirection"
              value="desc"
              checked={filters.sortDirection === 'desc'}
              onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
            />
            <span>↓ Z-A / 9-1</span>
          </label>
        </div>
      </div>

      {/* Диапазон цен */}
      <div className="filter-section">
        <h4>{t.priceRange}</h4>
        <div className="price-range">
          <div className="price-inputs">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              placeholder={t.from}
              min={filterData.minPrice}
              max={filterData.maxPrice}
            />
            <span>-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              placeholder={t.to}
              min={filterData.minPrice}
              max={filterData.maxPrice}
            />
          </div>
          <div className="price-slider-container">
            <input
              type="range"
              min={filterData.minPrice}
              max={filterData.maxPrice}
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="price-slider price-slider-min"
            />
            <input
              type="range"
              min={filterData.minPrice}
              max={filterData.maxPrice}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="price-slider price-slider-max"
            />
          </div>
        </div>
      </div>

      {/* Бренды */}
      {filterData.brands.length > 0 && (
        <div className="filter-section">
          <h4>{t.brands}</h4>
          <div className="brand-list">
            {filterData.brands.map(brand => (
              <label key={brand} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Рейтинг */}
      <div className="filter-section">
        <h4>{t.rating}</h4>
        <div className="rating-filter">
          {ratingStars.map(rating => (
            <label key={rating} className="radio-label">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
              />
              <span className="rating-stars">
                {'★'.repeat(rating)}{'☆'.repeat(5-rating)} {t.andAbove}
              </span>
            </label>
          ))}
          <label className="radio-label">
            <input
              type="radio"
              name="rating"
              value={0}
              checked={filters.minRating === 0}
              onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
            />
            <span>{t.reset}</span>
          </label>
        </div>
      </div>

      {/* Наличие */}
      <div className="filter-section">
        <h4>{t.availability}</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          />
          <span>{t.inStock}</span>
        </label>
      </div>

      {/* Новинки */}
      <div className="filter-section">
        <h4>{t.newProducts}</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(e) => handleFilterChange('isNew', e.target.checked)}
          />
          <span>{t.newProducts}</span>
        </label>
      </div>

      {/* Скидки */}
      <div className="filter-section">
        <h4>{t.discounts}</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.hasDiscount}
            onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
          />
          <span>{t.withDiscount}</span>
        </label>
      </div>

      {/* Информация о количестве товаров */}
      {filterData.totalProducts > 0 && (
        <div className="products-count">
          <small>{filterData.totalProducts} {t.productsFound}</small>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
         
