package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private CurrencyService currencyService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String search) {
        
        List<Product> products = productService.getProducts(category, subcategory, section, search);
        return ResponseEntity.ok(products);
    }    @GetMapping("/with-currency")
    public ResponseEntity<Map<String, Object>> getProductsWithCurrency(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "USD") String currency) {
        
        List<Product> products = productService.getProducts(category, subcategory, section, search);
        String currencySymbol = currencyService.getCurrencySymbol(currency);
        
        // Получаем курсы валют один раз для всех товаров
        Map<String, Double> exchangeRates = currencyService.getExchangeRates();
        Double rate = exchangeRates.get(currency);
        
        // Конвертируем цены для каждого продукта
        products.forEach(product -> {
            BigDecimal originalPrice = BigDecimal.valueOf(product.getPrice());
            // Сохраняем оригинальную цену в USD
            product.setOriginalPrice(originalPrice.doubleValue());
            
            if (rate != null && !"USD".equals(currency)) {
                BigDecimal convertedPrice = originalPrice.multiply(BigDecimal.valueOf(rate))
                                                        .setScale(2, RoundingMode.HALF_UP);
                product.setPrice(convertedPrice.doubleValue());
            }
            
            // Конвертируем также старую цену, если она есть
            if (product.getOldPrice() != null && product.getOldPrice() > 0) {
                BigDecimal originalOldPrice = BigDecimal.valueOf(product.getOldPrice());
                // Сохраняем оригинальную старую цену
                product.setOriginalOldPrice(originalOldPrice.doubleValue());
                
                if (rate != null && !"USD".equals(currency)) {
                    BigDecimal convertedOldPrice = originalOldPrice.multiply(BigDecimal.valueOf(rate))
                                                                 .setScale(2, RoundingMode.HALF_UP);
                    product.setOldPrice(convertedOldPrice.doubleValue());
                }
            }
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("currency", currency);
        response.put("currencySymbol", currencySymbol);
        
        return ResponseEntity.ok(response);
    }@GetMapping("/random")
    public ResponseEntity<Map<String, Object>> getRandomProducts(
            @RequestParam(required = false) String section,
            @RequestParam(required = false, defaultValue = "4") int limit,
            @RequestParam(required = false, defaultValue = "USD") String currency) {
        
        List<Product> products;
        
        if (section != null && !section.isEmpty()) {
            products = productService.getRandomProductsBySection(section, limit);
        } else {
            products = productService.getRandomProducts(limit);
        }
          String currencySymbol = currencyService.getCurrencySymbol(currency);
        
        // Получаем курсы валют один раз для всех товаров
        Map<String, Double> exchangeRates = currencyService.getExchangeRates();
        Double rate = exchangeRates.get(currency);
        
        // Конвертируем цены для каждого продукта
        products.forEach(product -> {
            BigDecimal originalPrice = BigDecimal.valueOf(product.getPrice());
            // Сохраняем оригинальную цену в USD
            product.setOriginalPrice(originalPrice.doubleValue());
            
            if (rate != null && !"USD".equals(currency)) {
                BigDecimal convertedPrice = originalPrice.multiply(BigDecimal.valueOf(rate))
                                                        .setScale(2, RoundingMode.HALF_UP);
                product.setPrice(convertedPrice.doubleValue());
            }
            
            // Конвертируем также старую цену, если она есть
            if (product.getOldPrice() != null && product.getOldPrice() > 0) {
                BigDecimal originalOldPrice = BigDecimal.valueOf(product.getOldPrice());
                // Сохраняем оригинальную старую цену
                product.setOriginalOldPrice(originalOldPrice.doubleValue());
                
                if (rate != null && !"USD".equals(currency)) {
                    BigDecimal convertedOldPrice = originalOldPrice.multiply(BigDecimal.valueOf(rate))
                                                                 .setScale(2, RoundingMode.HALF_UP);
                    product.setOldPrice(convertedOldPrice.doubleValue());
                }
            }
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("currency", currency);
        response.put("currencySymbol", currencySymbol);
        response.put("section", section);
        
        return ResponseEntity.ok(response);
    }    @PostMapping("/convert-prices")
    public ResponseEntity<Map<String, Object>> convertPrices(
            @RequestBody Map<String, Object> request,
            @RequestParam(required = false, defaultValue = "USD") String currency) {
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> products = (List<Map<String, Object>>) request.get("products");
        
        if (products == null || products.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
          String currencySymbol = currencyService.getCurrencySymbol(currency);
        
        // Получаем курсы валют один раз для всех товаров
        Map<String, Double> exchangeRates = currencyService.getExchangeRates();
        Double rate = exchangeRates.get(currency);
        
        // Конвертируем цены для каждого продукта
        products.forEach(productMap -> {
            // Конвертируем основную цену
            Object priceObj = productMap.get("originalPrice");
            if (priceObj != null) {
                BigDecimal originalPrice = new BigDecimal(priceObj.toString());
                if (rate != null && !"USD".equals(currency)) {
                    BigDecimal convertedPrice = originalPrice.multiply(BigDecimal.valueOf(rate))
                                                            .setScale(2, RoundingMode.HALF_UP);
                    productMap.put("price", convertedPrice.doubleValue());
                } else {
                    productMap.put("price", originalPrice.doubleValue());
                }
            }
            
            // Конвертируем старую цену, если она есть
            Object oldPriceObj = productMap.get("originalOldPrice");
            if (oldPriceObj != null) {
                BigDecimal originalOldPrice = new BigDecimal(oldPriceObj.toString());
                if (rate != null && !"USD".equals(currency)) {
                    BigDecimal convertedOldPrice = originalOldPrice.multiply(BigDecimal.valueOf(rate))
                                                                 .setScale(2, RoundingMode.HALF_UP);
                    productMap.put("oldPrice", convertedOldPrice.doubleValue());
                } else {
                    productMap.put("oldPrice", originalOldPrice.doubleValue());
                }
            }
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("currency", currency);
        response.put("currencySymbol", currencySymbol);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debugProducts() {
        try {
            List<Product> allProducts = productService.getAllProducts();
            StringBuilder debug = new StringBuilder();
            debug.append("Total products: ").append(allProducts.size()).append("\n");
            
            for (Product product : allProducts) {
                debug.append("Product: ").append(product.getName())
                     .append(", Category: ").append(product.getCategoryId())
                     .append(", Subcategory: ").append(product.getSubcategoryId())
                     .append(", Active: ").append(product.getIsActive())
                     .append("\n");
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }
}
