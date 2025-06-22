package com.ecommerce.controller;

import com.ecommerce.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "http://localhost:3000")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @GetMapping("/rates")
    public ResponseEntity<Map<String, Double>> getExchangeRates() {
        Map<String, Double> rates = currencyService.getExchangeRates();
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertPrice(
            @RequestParam BigDecimal price,
            @RequestParam String currency) {
        
        BigDecimal convertedPrice = currencyService.convertPrice(price, currency);
        String symbol = currencyService.getCurrencySymbol(currency);
        
        Map<String, Object> response = Map.of(
            "originalPrice", price,
            "convertedPrice", convertedPrice,
            "currency", currency,
            "symbol", symbol
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/symbol/{currency}")
    public ResponseEntity<Map<String, String>> getCurrencySymbol(@PathVariable String currency) {
        String symbol = currencyService.getCurrencySymbol(currency);
        return ResponseEntity.ok(Map.of("symbol", symbol));
    }

    @GetMapping("/for-language/{language}")
    public ResponseEntity<Map<String, String>> getCurrencyForLanguage(@PathVariable String language) {
        String currency = currencyService.getCurrencyForLanguage(language);
        String symbol = currencyService.getCurrencySymbol(currency);
        
        Map<String, String> response = Map.of(
            "currency", currency,
            "symbol", symbol
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rates/refresh")
    public ResponseEntity<Map<String, Object>> refreshExchangeRates() {
        try {
            Map<String, Double> rates = currencyService.forceRefreshExchangeRates();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("rates", rates);
            response.put("message", "Exchange rates refreshed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
