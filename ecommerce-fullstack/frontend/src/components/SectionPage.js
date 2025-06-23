import React, { useState } from 'react';
import SidebarNew from './SidebarNew';
import ProductGrid from './ProductGrid';
import './SectionPage.css';

const SectionPage = ({ language, sectionType, addToCart, currency, formatPrice }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    if (newFilters.reset) {
      setFilters({});
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  };

  const translations = {
    ru: { home: 'Главная' },
    en: { home: 'Home' },
    pl: { home: 'Strona główna' }
  };

  const t = translations[language] || translations.en;

  const getSectionName = () => {
    const sections = {
      'hot-deals': { ru: 'Горячие предложения', en: 'Hot Deals', pl: 'Gorące oferty' },
      'new-arrivals': { ru: 'Новинки', en: 'New Arrivals', pl: 'Nowości' },
      'recommended': { ru: 'Рекомендуем для вас', en: 'Recommended for You', pl: 'Polecane dla Ciebie' },
      'discounts': { ru: 'Скидки до 70%', en: 'Discounts up to 70%', pl: 'Zniżki do 70%' }
    };

    return sections[sectionType]?.[language] || sectionType;
  };

  const getSectionIcon = () => {
    const icons = {
      'hot-deals': '🔥',
      'new-arrivals': '✨',
      'recommended': '💡',
      'discounts': '🏷️'
    };

    return icons[sectionType] || '📦';
  };

  return (
    <div className="section-page">
      <div className="section-header">
        <h1>
          <span className="section-icon">{getSectionIcon()}</span>
          {getSectionName()}
        </h1>        <div className="breadcrumb">
          <span>{t.home}</span>
          <span>/</span>
          <span>{getSectionName()}</span>
        </div>
      </div>
        <div className="section-content">        <SidebarNew 
          language={language}
          onFilterChange={handleFilterChange}
          currency={currency}
          formatPrice={formatPrice}
        /><ProductGrid 
          language={language}
          filters={filters}
          sectionType={sectionType}
          addToCart={addToCart}
          currency={currency}
          formatPriceWithCurrency={formatPrice}
        />
      </div>
    </div>
  );
};

export default SectionPage;
