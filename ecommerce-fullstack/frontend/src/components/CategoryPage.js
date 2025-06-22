import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import './CategoryPage.css';

const CategoryPage = ({ language, categoryId, subcategoryId, addToCart, currency, formatPrice }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    if (newFilters.reset) {
      setFilters({});
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  };

  const getCategoryName = () => {
    const categories = {
      electronics: { ru: 'Электроника', en: 'Electronics', pl: 'Elektronika' },
      clothing: { ru: 'Одежда', en: 'Clothing', pl: 'Odzież' },
      home: { ru: 'Дом и сад', en: 'Home & Garden', pl: 'Dom i ogród' },
      sports: { ru: 'Спорт', en: 'Sports', pl: 'Sport' },
      books: { ru: 'Книги', en: 'Books', pl: 'Książki' },
      beauty: { ru: 'Красота', en: 'Beauty', pl: 'Uroda' }
    };

    const subcategories = {
      phones: { ru: 'Смартфоны', en: 'Smartphones', pl: 'Smartfony' },
      laptops: { ru: 'Ноутбуки', en: 'Laptops', pl: 'Laptopy' },
      tablets: { ru: 'Планшеты', en: 'Tablets', pl: 'Tablety' },
      headphones: { ru: 'Наушники', en: 'Headphones', pl: 'Słuchawki' },
      cameras: { ru: 'Камеры', en: 'Cameras', pl: 'Aparaty' },
      accessories: { ru: 'Аксессуары', en: 'Accessories', pl: 'Akcesoria' },
      'men-clothing': { ru: 'Мужская одежда', en: 'Men\'s Clothing', pl: 'Odzież męska' },
      'women-clothing': { ru: 'Женская одежда', en: 'Women\'s Clothing', pl: 'Odzież damska' },
      'kids-clothing': { ru: 'Детская одежда', en: 'Kids\' Clothing', pl: 'Odzież dziecięca' },
      shoes: { ru: 'Обувь', en: 'Shoes', pl: 'Buty' },
      bags: { ru: 'Сумки', en: 'Bags', pl: 'Torby' },
      jewelry: { ru: 'Украшения', en: 'Jewelry', pl: 'Biżuteria' },
      furniture: { ru: 'Мебель', en: 'Furniture', pl: 'Meble' },
      kitchen: { ru: 'Кухня', en: 'Kitchen', pl: 'Kuchnia' },
      bathroom: { ru: 'Ванная', en: 'Bathroom', pl: 'Łazienka' },
      garden: { ru: 'Сад', en: 'Garden', pl: 'Ogród' },
      decor: { ru: 'Декор', en: 'Decor', pl: 'Dekoracje' },
      tools: { ru: 'Инструменты', en: 'Tools', pl: 'Narzędzia' },
      fitness: { ru: 'Фитнес', en: 'Fitness', pl: 'Fitness' },
      outdoor: { ru: 'Активный отдых', en: 'Outdoor', pl: 'Outdoor' },
      'team-sports': { ru: 'Командные виды', en: 'Team Sports', pl: 'Sporty zespołowe' },
      'water-sports': { ru: 'Водные виды', en: 'Water Sports', pl: 'Sporty wodne' },
      fiction: { ru: 'Художественная литература', en: 'Fiction', pl: 'Beletrystyka' },
      education: { ru: 'Образование', en: 'Education', pl: 'Edukacja' },
      'children-books': { ru: 'Детские книги', en: 'Children\'s Books', pl: 'Książki dziecięce' },
      business: { ru: 'Бизнес', en: 'Business', pl: 'Biznes' },
      makeup: { ru: 'Макияж', en: 'Makeup', pl: 'Makijaż' },
      skincare: { ru: 'Уход за кожей', en: 'Skincare', pl: 'Pielęgnacja skóry' },
      haircare: { ru: 'Уход за волосами', en: 'Hair Care', pl: 'Pielęgnacja włosów' },
      perfume: { ru: 'Парфюмерия', en: 'Perfume', pl: 'Perfumy' }
    };

    if (subcategoryId) {
      return subcategories[subcategoryId]?.[language] || subcategoryId;
    }
    return categories[categoryId]?.[language] || categoryId;
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{getCategoryName()}</h1>
        <div className="breadcrumb">
          <span>Главная</span>
          <span>/</span>
          <span>{getCategoryName()}</span>
        </div>
      </div>
      
      <div className="category-content">
        <Sidebar 
          language={language}
          onFilterChange={handleFilterChange}
        />        <ProductGrid 
          language={language}
          filters={filters}
          categoryId={categoryId}
          subcategoryId={subcategoryId}
          addToCart={addToCart}
          currency={currency}
          formatPriceWithCurrency={formatPrice}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
