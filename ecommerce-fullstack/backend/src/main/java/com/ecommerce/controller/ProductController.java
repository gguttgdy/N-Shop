package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.CurrencyService;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Products", description = "Product management and catalog operations")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private CurrencyService currencyService;
    
    @Autowired
    private ProductRepository productRepository;

    @Operation(summary = "Get products", description = "Retrieve products with optional filtering by category, subcategory, section, or search term")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Product.class)))
    })
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @Parameter(description = "Filter by category") @RequestParam(required = false) String category,
            @Parameter(description = "Filter by subcategory") @RequestParam(required = false) String subcategory,
            @Parameter(description = "Filter by section") @RequestParam(required = false) String section,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {
        
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
        
        System.out.println("Convert prices request: " + request);
        System.out.println("Currency: " + currency);
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> products = (List<Map<String, Object>>) request.get("products");
        
        System.out.println("Products received: " + (products != null ? products.size() : "null"));
        
        if (products == null || products.isEmpty()) {
            System.out.println("No products found in request, returning empty result");
            String currencySymbol = currencyService.getCurrencySymbol(currency);
            Map<String, Object> response = new HashMap<>();
            response.put("products", new ArrayList<>());
            response.put("currency", currency);
            response.put("currencySymbol", currencySymbol);
            return ResponseEntity.ok(response);
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

    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean hasDiscount,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDirection,
            @RequestParam(required = false, defaultValue = "USD") String currency) {
        
        List<Product> products = productService.getFilteredProducts(
            category, subcategory, section, search, minPrice, maxPrice, 
            brands, colors, sizes, inStock, minRating, isNew, hasDiscount, 
            sortBy, sortDirection
        );
        
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
    }

    @GetMapping("/filter-data")
    public ResponseEntity<Map<String, Object>> getFilterData(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory) {
        
        Map<String, Object> filterData = productService.getFilterData(category, subcategory);
        return ResponseEntity.ok(filterData);
    }

    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(schema = @Schema(implementation = Product.class))),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@Parameter(description = "Product ID") @PathVariable String id) {
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
            
            // Проверим также поиск по "fashion"
            List<Product> fashionProducts = productService.getProducts("fashion", null, null, null);
            debug.append("\nFashion products found: ").append(fashionProducts.size()).append("\n");
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/reinitialize")
    public ResponseEntity<String> reinitializeProducts() {
        try {
            // Очищаем все продукты
            productRepository.deleteAll();
            
            // Добавляем новые продукты с категорией fashion
            List<Product> fashionProducts = Arrays.asList(
                createFashionProduct("Men's Winter Jacket", "fashion", "men", 159.99, "🧥"),
                createFashionProduct("Women's Dress", "fashion", "women", 89.99, "👗"),
                createFashionProduct("Men's Jeans", "fashion", "men", 79.99, "👖"),
                createFashionProduct("Women's Boots", "fashion", "women", 129.99, "👢"),
                createFashionProduct("Men's T-Shirt", "fashion", "men", 29.99, "👕"),
                createFashionProduct("Women's Jacket", "fashion", "women", 149.99, "🧥")
            );
            
            productRepository.saveAll(fashionProducts);
            
            return ResponseEntity.ok("Products reinitialized successfully. Added " + fashionProducts.size() + " fashion products.");
        } catch (Exception e) {
            return ResponseEntity.ok("Error reinitializing products: " + e.getMessage());
        }
    }
    
    @PostMapping("/clear-all")
    public ResponseEntity<String> clearAllProducts() {
        try {
            productRepository.deleteAll();
            return ResponseEntity.ok("All products cleared successfully. Restart the application to reinitialize with full product data.");
        } catch (Exception e) {
            return ResponseEntity.ok("Error clearing products: " + e.getMessage());
        }
    }
    
    private Product createFashionProduct(String name, String categoryId, String subcategoryId, Double price, String image) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setImage(image);
        product.setCategoryId(categoryId);
        product.setSubcategoryId(subcategoryId);
        product.setStock(50);
        product.setIsActive(true);
        product.setIsNew(false);
        product.setRating(4.2);
        return product;
    }
}
