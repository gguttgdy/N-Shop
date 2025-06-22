// Сервис для работы с фильтрами продуктов
class FilterService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api/products';
  }

  // Получение данных для фильтров (категории, бренды, диапазон цен)
  async getFilterData(category = null, subcategory = null) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const response = await fetch(`${this.baseURL}/filter-data?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching filter data:', error);
      return {
        brands: [],
        minPrice: 0,
        maxPrice: 10000,
        minRating: 0,
        maxRating: 5,
        totalProducts: 0
      };
    }
  }

  // Получение отфильтрованных продуктов
  async getFilteredProducts(filters = {}, currency = 'USD') {
    try {
      const params = new URLSearchParams();
      
      // Основные параметры
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.section) params.append('section', filters.section);
      if (filters.search) params.append('search', filters.search);
      
      // Фильтры
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.brands && filters.brands.length > 0) {
        filters.brands.forEach(brand => params.append('brands', brand));
      }
      if (filters.inStock !== undefined) {
        params.append('inStock', filters.inStock.toString());
      }
      if (filters.minRating !== undefined && filters.minRating > 0) {
        params.append('minRating', filters.minRating.toString());
      }
      if (filters.isNew !== undefined) {
        params.append('isNew', filters.isNew.toString());
      }
      if (filters.hasDiscount !== undefined) {
        params.append('hasDiscount', filters.hasDiscount.toString());
      }
      
      // Сортировка
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
      
      // Валюта
      params.append('currency', currency);

      const response = await fetch(`${this.baseURL}/filter?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      return {
        products: [],
        currency: currency,
        currencySymbol: '$',
        totalCount: 0
      };
    }
  }

  // Получение продуктов с конвертацией валют (для совместимости)
  async getProductsWithCurrency(filters = {}, currency = 'USD') {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.section) params.append('section', filters.section);
      if (filters.search) params.append('search', filters.search);
      params.append('currency', currency);

      const response = await fetch(`${this.baseURL}/with-currency?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products with currency:', error);
      return {
        products: [],
        currency: currency,
        currencySymbol: '$'
      };
    }
  }

  // Получение случайных продуктов
  async getRandomProducts(section = null, limit = 4, currency = 'USD') {
    try {
      const params = new URLSearchParams();
      
      if (section) params.append('section', section);
      params.append('limit', limit.toString());
      params.append('currency', currency);

      const response = await fetch(`${this.baseURL}/random?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching random products:', error);
      return {
        products: [],
        currency: currency,
        currencySymbol: '$',
        section: section
      };
    }
  }

  // Конвертация цен существующих продуктов
  async convertPrices(products, currency = 'USD') {
    try {
      const response = await fetch(`${this.baseURL}/convert-prices?currency=${currency}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error converting prices:', error);
      return {
        products: products,
        currency: currency,
        currencySymbol: '$'
      };
    }
  }

  // Получение уникальных категорий из продуктов
  extractCategories(products) {
    const categories = new Set();
    products.forEach(product => {
      if (product.categoryId) {
        categories.add(product.categoryId);
      }
    });
    return Array.from(categories);
  }

  // Получение уникальных подкатегорий из продуктов
  extractSubcategories(products, category = null) {
    const subcategories = new Set();
    products
      .filter(product => !category || product.categoryId === category)
      .forEach(product => {
        if (product.subcategoryId) {
          subcategories.add(product.subcategoryId);
        }
      });
    return Array.from(subcategories);
  }

  // Получение диапазона цен из продуктов
  getPriceRange(products) {
    if (products.length === 0) {
      return { min: 0, max: 10000 };
    }

    const prices = products.map(product => product.price).filter(price => price != null);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Получение уникальных брендов из продуктов
  extractBrands(products) {
    const brands = new Set();
    products.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      } else if (product.name) {
        // Пытаемся извлечь бренд из названия
        const extractedBrand = this.extractBrandFromName(product.name);
        if (extractedBrand) {
          brands.add(extractedBrand);
        }
      }
    });
    return Array.from(brands).sort();
  }

  // Извлечение бренда из названия продукта
  extractBrandFromName(name) {
    const knownBrands = [
      'Apple', 'Samsung', 'Sony', 'Google', 'Xiaomi', 'OnePlus', 'Huawei',
      'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance',
      'Canon', 'Nikon', 'Fujifilm', 'GoPro',
      'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft',
      'Bose', 'JBL', 'Sennheiser', 'Beats'
    ];

    const lowerName = name.toLowerCase();
    for (const brand of knownBrands) {
      if (lowerName.includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return null;
  }

  // Фильтрация продуктов на клиенте (для резервного режима)
  filterProductsLocally(products, filters) {
    return products.filter(product => {
      // Фильтр по цене
      if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;

      // Фильтр по брендам
      if (filters.brands && filters.brands.length > 0) {
        const productBrand = product.brand || this.extractBrandFromName(product.name);
        if (!productBrand || !filters.brands.includes(productBrand)) return false;
      }

      // Фильтр по наличию
      if (filters.inStock && (!product.stock || product.stock <= 0)) return false;

      // Фильтр по рейтингу
      if (filters.minRating > 0 && (!product.rating || product.rating < filters.minRating)) return false;

      // Фильтр по новинкам
      if (filters.isNew && !product.isNew) return false;

      // Фильтр по скидкам
      if (filters.hasDiscount && (!product.discount || product.discount <= 0)) return false;

      return true;
    });
  }

  // Сортировка продуктов на клиенте
  sortProductsLocally(products, sortBy, sortDirection = 'asc') {
    const sorted = [...products];
    const isAscending = sortDirection === 'asc';

    sorted.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        case 'newest':
          aValue = a.isNew ? 1 : 0;
          bValue = b.isNew ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return isAscending ? -1 : 1;
      if (aValue > bValue) return isAscending ? 1 : -1;
      return 0;
    });

    return sorted;
  }
}

// Создаем и экспортируем единственный экземпляр
const filterService = new FilterService();
export default filterService;
