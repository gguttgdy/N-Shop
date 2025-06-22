import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class CurrencyService {
  async getExchangeRates() {
    try {
      const response = await axios.get(`${API_BASE_URL}/currency/rates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Возвращаем базовые курсы при ошибке
      return {
        USD: 1.0,
        PLN: 4.0,
        RUB: 90.0,
        EUR: 0.85,
        GBP: 0.75
      };
    }
  }

  async getCurrencyForLanguage(language) {
    try {
      const response = await axios.get(`${API_BASE_URL}/currency/for-language/${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting currency for language:', error);
      // Возвращаем USD по умолчанию
      return {
        currency: 'USD',
        symbol: '$'
      };
    }
  }

  async convertPrice(price, currency) {
    try {
      const response = await axios.get(`${API_BASE_URL}/currency/convert`, {
        params: { price, currency }
      });
      return response.data;
    } catch (error) {
      console.error('Error converting price:', error);
      return {
        originalPrice: price,
        convertedPrice: price,
        currency: 'USD',
        symbol: '$'
      };
    }
  }  async convertProductPrices(products, currency) {
    try {
      const response = await axios.post(`${API_BASE_URL}/products/convert-prices`, {
        products: products
      }, {
        params: { currency }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error converting product prices:', error);
      // Возвращаем исходные данные при ошибке
      return {
        products: products,
        currency: currency,
        currencySymbol: this.getCurrencySymbol(currency)
      };
    }
  }

  getCurrencySymbol(currency) {
    const symbols = {
      'USD': '$',
      'PLN': 'zł',
      'RUB': '₽',
      'EUR': '€',
      'GBP': '£'
    };
    return symbols[currency] || currency;
  }

  getCurrencyForLanguageLocal(language) {
    const currencyMap = {
      'en': 'USD',
      'pl': 'PLN',
      'ru': 'RUB'
    };
    return currencyMap[language] || 'USD';
  }

  formatPrice(price, currency, symbol) {
    const formattedPrice = parseFloat(price).toFixed(2);
    
    // Разные форматы для разных валют
    switch (currency) {
      case 'USD':
      case 'EUR':
      case 'GBP':
        return `${symbol}${formattedPrice}`;
      case 'PLN':
        return `${formattedPrice} ${symbol}`;
      case 'RUB':
        return `${formattedPrice} ${symbol}`;
      default:
        return `${symbol}${formattedPrice}`;
    }
  }
}

const currencyService = new CurrencyService();
export default currencyService;
export { currencyService, CurrencyService };
export const convertProductPrices = currencyService.convertProductPrices.bind(currencyService);
