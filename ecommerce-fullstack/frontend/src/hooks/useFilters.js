import { useState, useEffect, useCallback } from 'react';
import filterService from '../services/FilterService';

const useFilters = (initialCategory = null, initialSubcategory = null, currency = 'USD') => {
  const [filters, setFilters] = useState({
    category: initialCategory,
    subcategory: initialSubcategory,
    section: null,
    search: '',
    priceRange: [0, 10000],
    selectedBrands: [],
    inStock: false,
    minRating: 0,
    isNew: false,
    hasDiscount: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    maxRating: 5,
    totalProducts: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencyInfo, setCurrencyInfo] = useState({
    currency: currency,
    currencySymbol: '$'
  });

  // Загрузка данных для фильтров
  const loadFilterData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await filterService.getFilterData(filters.category, filters.subcategory);
      setFilterData(data);
      
      // Обновляем диапазон цен в фильтрах
      setFilters(prev => ({
        ...prev,
        priceRange: [data.minPrice || 0, data.maxPrice || 10000]
      }));
    } catch (err) {
      setError('Failed to load filter data');
      console.error('Error loading filter data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.subcategory]);

  // Загрузка продуктов с фильтрами
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {
        category: filters.category,
        subcategory: filters.subcategory,
        section: filters.section,
        search: filters.search,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        brands: filters.selectedBrands.length > 0 ? filters.selectedBrands : null,
        inStock: filters.inStock || null,
        minRating: filters.minRating > 0 ? filters.minRating : null,
        isNew: filters.isNew || null,
        hasDiscount: filters.hasDiscount || null,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection
      };

      const result = await filterService.getFilteredProducts(filterParams, currency);
      
      setProducts(result.products || []);
      setCurrencyInfo({
        currency: result.currency || currency,
        currencySymbol: result.currencySymbol || '$'
      });

    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currency]);

  // Эффект для загрузки данных фильтров при изменении категории
  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  // Эффект для загрузки продуктов при изменении фильтров
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Обновление фильтра
  const updateFilter = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);

  // Обновление нескольких фильтров
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setFilters(prev => ({
      category: prev.category, // Сохраняем категорию
      subcategory: prev.subcategory, // Сохраняем подкатегорию
      section: null,
      search: '',
      priceRange: [filterData.minPrice || 0, filterData.maxPrice || 10000],
      selectedBrands: [],
      inStock: false,
      minRating: 0,
      isNew: false,
      hasDiscount: false,
      sortBy: 'name',
      sortDirection: 'asc'
    }));
  }, [filterData.minPrice, filterData.maxPrice]);

  // Поиск продуктов
  const searchProducts = useCallback((searchTerm) => {
    updateFilter('search', searchTerm);
  }, [updateFilter]);

  // Изменение категории
  const changeCategory = useCallback((category, subcategory = null) => {
    setFilters(prev => ({
      ...prev,
      category,
      subcategory,
      search: '', // Сбрасываем поиск при смене категории
      selectedBrands: [], // Сбрасываем бренды при смене категории
      priceRange: [0, 10000] // Временно, обновится после загрузки данных
    }));
  }, []);

  // Добавление/удаление бренда
  const toggleBrand = useCallback((brand) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  }, []);

  // Установка диапазона цен
  const setPriceRange = useCallback((min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  }, []);

  // Установка сортировки
  const setSorting = useCallback((sortBy, sortDirection = 'asc') => {
    updateFilters({ sortBy, sortDirection });
  }, [updateFilters]);

  return {
    // Состояние
    filters,
    products,
    filterData,
    loading,
    error,
    currencyInfo,

    // Методы обновления
    updateFilter,
    updateFilters,
    resetFilters,
    searchProducts,
    changeCategory,
    toggleBrand,
    setPriceRange,
    setSorting,

    // Методы перезагрузки
    loadProducts,
    loadFilterData,

    // Вычисляемые значения
    hasActiveFilters: filters.selectedBrands.length > 0 || 
                     filters.inStock || 
                     filters.minRating > 0 || 
                     filters.isNew || 
                     filters.hasDiscount ||
                     filters.search ||
                     filters.priceRange[0] > filterData.minPrice ||
                     filters.priceRange[1] < filterData.maxPrice,
    
    totalProducts: products.length
  };
};

export default useFilters;
