import { useState, useEffect } from 'react';
import currencyService from '../services/CurrencyService';

export const useCurrency = (language) => {
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      setLoading(true);
      try {
        // Получаем валюту для текущего языка
        const currencyData = await currencyService.getCurrencyForLanguage(language);
        setCurrency(currencyData.currency);
        setCurrencySymbol(currencyData.symbol);

        // Получаем актуальные курсы валют
        const rates = await currencyService.getExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error initializing currency:', error);
        // Устанавливаем значения по умолчанию
        const defaultCurrency = currencyService.getCurrencyForLanguageLocal(language);
        setCurrency(defaultCurrency);
        setCurrencySymbol(currencyService.getCurrencySymbol(defaultCurrency));
      }
      setLoading(false);
    };

    initializeCurrency();
  }, [language]);
  const convertPrice = (priceUSD) => {
    if (!exchangeRates[currency] || currency === 'USD') {
      return priceUSD;
    }
    return (priceUSD * exchangeRates[currency]).toFixed(2);
  };

  const formatPrice = (price) => {
    // Просто форматируем цену без конвертации (цена уже в нужной валюте)
    return currencyService.formatPrice(price, currency, currencySymbol);
  };

  const convertAndFormatPrice = (priceUSD) => {
    // Конвертируем из USD и форматируем
    const convertedPrice = convertPrice(priceUSD);
    return currencyService.formatPrice(convertedPrice, currency, currencySymbol);
  };

  return {
    currency,
    currencySymbol,
    exchangeRates,
    loading,
    convertPrice,
    formatPrice,
    convertAndFormatPrice
  };
};
