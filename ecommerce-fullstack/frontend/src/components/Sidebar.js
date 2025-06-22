import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ language, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStock, setInStock] = useState(false);

  const translations = {
    ru: {
      filters: 'Фильтры',
      priceRange: 'Диапазон цен',
      brands: 'Бренды',
      availability: 'Наличие',
      inStock: 'В наличии',
      reset: 'Сбросить'
    },
    en: {
      filters: 'Filters',
      priceRange: 'Price Range',
      brands: 'Brands',
      availability: 'Availability',
      inStock: 'In Stock',
      reset: 'Reset'
    },
    pl: {
      filters: 'Filtry',
      priceRange: 'Zakres cen',
      brands: 'Marki',
      availability: 'Dostępność',
      inStock: 'Dostępne',
      reset: 'Resetuj'
    }
  };

  const t = translations[language];

  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Xiaomi'];

  const handleBrandChange = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    onFilterChange && onFilterChange({ brands: newBrands });
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
    onFilterChange && onFilterChange({ priceRange: newRange });
  };

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setInStock(false);
    onFilterChange && onFilterChange({ reset: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{t.filters}</h3>
        <button className="reset-btn" onClick={resetFilters}>
          {t.reset}
        </button>
      </div>

      <div className="filter-section">
        <h4>{t.priceRange}</h4>
        <div className="price-range">
          <div className="price-inputs">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              placeholder="от"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              placeholder="до"
            />
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="price-slider"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>{t.brands}</h4>
        <div className="brand-list">
          {brands.map(brand => (
            <label key={brand} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>{t.availability}</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span>{t.inStock}</span>
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
         
