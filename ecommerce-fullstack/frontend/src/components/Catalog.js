import React, { useState } from 'react';
import './Catalog.css';

const Catalog = ({ language, onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const translations = {
    ru: {
      viewAll: 'Посмотреть все'
    },
    en: {
      viewAll: 'View All'
    },
    pl: {
      viewAll: 'Zobacz wszystkie'
    }
  };

  const categories = [
    {
      id: 'electronics',
      name: { ru: 'Электроника', en: 'Electronics', pl: 'Elektronika' },
      icon: '📱',
      subcategories: [
        { id: 'phones', name: { ru: 'Смартфоны', en: 'Smartphones', pl: 'Smartfony' } },
        { id: 'laptops', name: { ru: 'Ноутбуки', en: 'Laptops', pl: 'Laptopy' } },
        { id: 'tablets', name: { ru: 'Планшеты', en: 'Tablets', pl: 'Tablety' } },
        { id: 'headphones', name: { ru: 'Наушники', en: 'Headphones', pl: 'Słuchawki' } },
        { id: 'cameras', name: { ru: 'Камеры', en: 'Cameras', pl: 'Aparaty' } },
        { id: 'accessories', name: { ru: 'Аксессуары', en: 'Accessories', pl: 'Akcesoria' } }
      ]
    },
    {
      id: 'clothing',
      name: { ru: 'Одежда', en: 'Clothing', pl: 'Odzież' },
      icon: '👕',
      subcategories: [
        { id: 'men-clothing', name: { ru: 'Мужская одежда', en: 'Men\'s Clothing', pl: 'Odzież męska' } },
        { id: 'women-clothing', name: { ru: 'Женская одежда', en: 'Women\'s Clothing', pl: 'Odzież damska' } },
        { id: 'kids-clothing', name: { ru: 'Детская одежда', en: 'Kids\' Clothing', pl: 'Odzież dziecięca' } },
        { id: 'shoes', name: { ru: 'Обувь', en: 'Shoes', pl: 'Buty' } },
        { id: 'bags', name: { ru: 'Сумки', en: 'Bags', pl: 'Torby' } },
        { id: 'jewelry', name: { ru: 'Украшения', en: 'Jewelry', pl: 'Biżuteria' } }
      ]
    },
    {
      id: 'home',
      name: { ru: 'Дом и сад', en: 'Home & Garden', pl: 'Dom i ogród' },
      icon: '🏠',
      subcategories: [
        { id: 'furniture', name: { ru: 'Мебель', en: 'Furniture', pl: 'Meble' } },
        { id: 'kitchen', name: { ru: 'Кухня', en: 'Kitchen', pl: 'Kuchnia' } },
        { id: 'bathroom', name: { ru: 'Ванная', en: 'Bathroom', pl: 'Łazienka' } },
        { id: 'garden', name: { ru: 'Сад', en: 'Garden', pl: 'Ogród' } },
        { id: 'decor', name: { ru: 'Декор', en: 'Decor', pl: 'Dekoracje' } },
        { id: 'tools', name: { ru: 'Инструменты', en: 'Tools', pl: 'Narzędzia' } }
      ]
    },
    {
      id: 'sports',
      name: { ru: 'Спорт', en: 'Sports', pl: 'Sport' },
      icon: '⚽',
      subcategories: [
        { id: 'fitness', name: { ru: 'Фитнес', en: 'Fitness', pl: 'Fitness' } },
        { id: 'outdoor', name: { ru: 'Активный отдых', en: 'Outdoor', pl: 'Outdoor' } },
        { id: 'team-sports', name: { ru: 'Командные виды', en: 'Team Sports', pl: 'Sporty zespołowe' } },
        { id: 'water-sports', name: { ru: 'Водные виды', en: 'Water Sports', pl: 'Sporty wodne' } }
      ]
    },
    {
      id: 'books',
      name: { ru: 'Книги', en: 'Books', pl: 'Książki' },
      icon: '📚',
      subcategories: [
        { id: 'fiction', name: { ru: 'Художественная литература', en: 'Fiction', pl: 'Beletrystyka' } },
        { id: 'education', name: { ru: 'Образование', en: 'Education', pl: 'Edukacja' } },
        { id: 'children-books', name: { ru: 'Детские книги', en: 'Children\'s Books', pl: 'Książki dziecięce' } },
        { id: 'business', name: { ru: 'Бизнес', en: 'Business', pl: 'Biznes' } }
      ]
    },
    {
      id: 'beauty',
      name: { ru: 'Красота', en: 'Beauty', pl: 'Uroda' },
      icon: '💄',
      subcategories: [
        { id: 'makeup', name: { ru: 'Макияж', en: 'Makeup', pl: 'Makijaż' } },
        { id: 'skincare', name: { ru: 'Уход за кожей', en: 'Skincare', pl: 'Pielęgnacja skóry' } },
        { id: 'haircare', name: { ru: 'Уход за волосами', en: 'Hair Care', pl: 'Pielęgnacja włosów' } },
        { id: 'perfume', name: { ru: 'Парфюмерия', en: 'Perfume', pl: 'Perfumy' } }
      ]
    }
  ];

  const t = translations[language];
  const handleCategoryEnter = (categoryId) => {
    if (!isNavigating) {
      setActiveCategory(categoryId);
    }
  };

  const handleCatalogLeave = () => {
    if (!isNavigating) {
      setActiveCategory(null);
    }
  };
  const handleCategoryClick = (categoryId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setIsNavigating(true);
    onCategorySelect(categoryId);
    // Задержка перед сбросом флага навигации
    setTimeout(() => {
      setIsNavigating(false);
      setActiveCategory(null);
    }, 100);
  };

  const handleSubcategoryClick = (categoryId, subcategoryId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setIsNavigating(true);
    onCategorySelect(categoryId, subcategoryId);
    // Задержка перед сбросом флага навигации
    setTimeout(() => {
      setIsNavigating(false);
      setActiveCategory(null);
    }, 100);
  };

  return (
    <div className="catalog" onMouseLeave={handleCatalogLeave}>
      <div className="catalog-container">        <nav className="catalog-nav">
          {categories.map(category => (            <div
              key={category.id}
              className={`catalog-item ${activeCategory === category.id ? 'active' : ''}`}
              onMouseEnter={() => handleCategoryEnter(category.id)}
              onClick={(e) => handleCategoryClick(category.id, e)}
              style={{ cursor: 'pointer' }}
            >
              <span className="catalog-item-icon">{category.icon}</span>
              <span className="catalog-item-text">{category.name[language]}</span>
            </div>
          ))}
        </nav>
        
        {activeCategory && (
          <div className="catalog-mega-menu">
            <div className="mega-menu-content">
              <div className="view-all-section">                <button 
                  className="view-all-btn"
                  onClick={(e) => handleCategoryClick(activeCategory, e)}
                >
                  <span className="view-all-icon">
                    {categories.find(cat => cat.id === activeCategory)?.icon}
                  </span>
                  <div>
                    <div className="view-all-title">
                      {categories.find(cat => cat.id === activeCategory)?.name[language]}
                    </div>
                    <div className="view-all-subtitle">{t.viewAll}</div>
                  </div>
                </button>
              </div>
                <div className="subcategories-grid">
                {categories.find(cat => cat.id === activeCategory)?.subcategories.map(subcat => (                  <div 
                    key={subcat.id} 
                    className="subcategory-link"
                    onClick={(e) => handleSubcategoryClick(activeCategory, subcat.id, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    {subcat.name[language]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
