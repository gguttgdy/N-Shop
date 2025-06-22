package com.ecommerce.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.HashMap;

@Service
public class CurrencyService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private CacheManager cacheManager;
    
    private final ObjectMapper objectMapper;
    
    // Используем бесплатный API для курсов валют
    private static final String EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
      // Резервные курсы на случай недоступности API (актуальные на 2025 год)
    private static final Map<String, Double> FALLBACK_RATES = Map.of(
        "USD", 1.0,
        "PLN", 4.2,
        "RUB", 95.0,
        "EUR", 0.92,
        "GBP", 0.78
    );
      public CurrencyService() {
        this.objectMapper = new ObjectMapper();
    }    @Cacheable(value = "exchangeRates", cacheManager = "cacheManager")
    public Map<String, Double> getExchangeRates() {
        try {
            String response = restTemplate.getForObject(EXCHANGE_RATE_API_URL, String.class);
            
            if (response == null || response.isEmpty()) {
                return new HashMap<>(FALLBACK_RATES);
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode rates = jsonNode.get("rates");
            
            if (rates == null) {
                return new HashMap<>(FALLBACK_RATES);
            }
            
            Map<String, Double> exchangeRates = new HashMap<>();
            exchangeRates.put("USD", 1.0); // Base currency
            
            if (rates.has("PLN")) {
                exchangeRates.put("PLN", rates.get("PLN").asDouble());
            }
            if (rates.has("RUB")) {
                exchangeRates.put("RUB", rates.get("RUB").asDouble());
            }
            if (rates.has("EUR")) {
                exchangeRates.put("EUR", rates.get("EUR").asDouble());
            }
            if (rates.has("GBP")) {
                exchangeRates.put("GBP", rates.get("GBP").asDouble());
            }
            
            return exchangeRates;
        } catch (Exception e) {
            // Возвращаем резервные курсы при ошибке
            return new HashMap<>(FALLBACK_RATES);
        }
    }
      public BigDecimal convertPrice(BigDecimal priceUSD, String targetCurrency) {
        if ("USD".equals(targetCurrency)) {
            return priceUSD;
        }
          Map<String, Double> rates = getExchangeRates();
        Double rate = rates.get(targetCurrency);
        
        if (rate == null) {
            // Возвращаем цену в USD если валюта не поддерживается
            return priceUSD;
        }
        
        BigDecimal converted = priceUSD.multiply(BigDecimal.valueOf(rate))
                                      .setScale(2, RoundingMode.HALF_UP);
        
        return converted;
    }
    
    public String getCurrencySymbol(String currencyCode) {
        switch (currencyCode.toUpperCase()) {
            case "USD": return "$";
            case "PLN": return "zł";
            case "RUB": return "₽";
            case "EUR": return "€";
            case "GBP": return "£";
            default: return currencyCode;
        }
    }
    
    public String getCurrencyForLanguage(String language) {
        switch (language) {
            case "en": return "USD";
            case "pl": return "PLN";
            case "ru": return "RUB";
            default: return "USD";
        }
    }
      @CacheEvict(value = "exchangeRates", allEntries = true)
    public void clearExchangeRatesCache() {
        // Очищаем кеш курсов валют
    }
    
    public Map<String, Double> forceRefreshExchangeRates() {
        clearExchangeRatesCache();
        return getExchangeRates();
    }
}
