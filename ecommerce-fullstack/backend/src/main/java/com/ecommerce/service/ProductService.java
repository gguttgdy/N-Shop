package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private MockDataService mockDataService;
    
    private boolean isDatabaseAvailable = true;    public List<Product> getProducts(String category, String subcategory, String section, String search) {        try {
            if (isDatabaseAvailable) {
                if (search != null && !search.isEmpty()) {
                    List<Product> result = productRepository.findBySearchTermIgnoreCase(search);
                    return result;
                }
                
                if (category != null && subcategory != null) {
                    List<Product> result = productRepository.findByCategoryAndSubcategory(category, subcategory);
                    return result;
                }
                  if (category != null) {
                    List<Product> result = productRepository.findByCategoryIdAndIsActiveTrue(category);
                    return result;
                }
                  if (subcategory != null) {
                    List<Product> result = productRepository.findBySubcategoryIdAndIsActiveTrue(subcategory);
                    return result;
                }
                  if (section != null) {
                    List<Product> result = productRepository.findBySectionTypeAndIsActiveTrue(section);
                    return result;
                }
                  List<Product> result = productRepository.findByIsActiveTrue();
                return result;
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, using mock data: " + e.getMessage());
            e.printStackTrace();
            isDatabaseAvailable = false;
        }
          // Fallback to mock data
        return mockDataService.getProducts(category, subcategory, section, search);
    }

    public Product getProductById(String id) {
        try {
            if (isDatabaseAvailable) {
                return productRepository.findById(id).orElse(null);
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, using mock data: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback to mock data
        return mockDataService.getProductById(id);
    }

    public Product saveProduct(Product product) {
        try {
            if (isDatabaseAvailable) {
                return productRepository.save(product);
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, cannot save product: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        throw new RuntimeException("Database unavailable - cannot save products in demo mode");
    }

    public void deleteProduct(String id) {
        try {
            if (isDatabaseAvailable) {
                productRepository.deleteById(id);
                return;
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, cannot delete product: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        throw new RuntimeException("Database unavailable - cannot delete products in demo mode");
    }

    public List<Product> getAllProducts() {
        try {
            if (isDatabaseAvailable) {
                return productRepository.findAll();
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, using mock data: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback to mock data
        return mockDataService.getAllProducts();
    }
    
    public boolean isDatabaseAvailable() {
        return isDatabaseAvailable;
    }

    public List<Product> getRandomProductsBySection(String section, int limit) {        try {
            if (isDatabaseAvailable) {
                List<Product> sectionProducts = productRepository.findBySectionType(section);
                
                // Перемешиваем список и берем нужное количество
                java.util.Collections.shuffle(sectionProducts);
                
                if (sectionProducts.size() > limit) {
                    return sectionProducts.subList(0, limit);
                }
                
                return sectionProducts;
            }
        } catch (Exception e) {
            System.err.println("Error getting random products for section " + section + ": " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback к моковым данным
        return mockDataService.getProductsBySection(section).subList(0, Math.min(limit, 4));
    }
    
    public List<Product> getRandomProducts(int limit) {
        try {
            if (isDatabaseAvailable) {
                List<Product> allProducts = productRepository.findAll();
                
                // Перемешиваем список и берем нужное количество
                java.util.Collections.shuffle(allProducts);
                
                if (allProducts.size() > limit) {
                    return allProducts.subList(0, limit);
                }
                
                return allProducts;
            }
        } catch (Exception e) {
            System.err.println("Error getting random products: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback к моковым данным
        return mockDataService.getAllProducts().subList(0, Math.min(limit, 4));
    }    // Новый метод для расширенной фильтрации
    public List<Product> getFilteredProducts(String category, String subcategory, String section, String search,
                                           Double minPrice, Double maxPrice, List<String> brands, List<String> colors, List<String> sizes,
                                           Boolean inStock, Double minRating, Boolean isNew, Boolean hasDiscount,
                                           String sortBy, String sortDirection) {
        try {
            if (isDatabaseAvailable) {
                List<Product> products = productRepository.findFilteredProducts(
                    category, subcategory, section, search, minPrice, maxPrice,
                    brands, colors, sizes, inStock, minRating, isNew, hasDiscount
                );
                
                // Применяем сортировку
                if (sortBy != null && !sortBy.isEmpty()) {
                    products = sortProducts(products, sortBy, sortDirection);
                }
                
                return products;
            }
        } catch (Exception e) {
            System.err.println("Error getting filtered products: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback к моковым данным с простой фильтрацией
        return mockDataService.getProducts(category, subcategory, section, search);
    }

    // Получение данных для фильтров
    public Map<String, Object> getFilterData(String category, String subcategory) {
        Map<String, Object> filterData = new HashMap<>();
        
        try {
            if (isDatabaseAvailable) {
                // Получаем все активные продукты для указанной категории/подкатегории
                List<Product> products;
                if (category != null && subcategory != null) {
                    products = productRepository.findByCategoryAndSubcategory(category, subcategory);
                } else if (category != null) {
                    products = productRepository.findByCategoryIdAndIsActiveTrue(category);
                } else {
                    products = productRepository.findByIsActiveTrue();
                }
                
                // Извлекаем уникальные бренды из названий продуктов
                Set<String> brands = extractBrands(products);
                  // Находим диапазон цен (используем актуальные цены)
                DoubleSummaryStatistics priceStats = products.stream()
                    .mapToDouble(Product::getActualPrice)
                    .summaryStatistics();
                
                // Находим диапазон рейтингов
                DoubleSummaryStatistics ratingStats = products.stream()
                    .filter(p -> p.getRating() != null)
                    .mapToDouble(Product::getRating)
                    .summaryStatistics();
                
                filterData.put("brands", new ArrayList<>(brands));
                filterData.put("minPrice", priceStats.getMin());
                filterData.put("maxPrice", priceStats.getMax());
                filterData.put("minRating", ratingStats.getMin());
                filterData.put("maxRating", ratingStats.getMax());
                filterData.put("totalProducts", products.size());
                
                return filterData;
            }
        } catch (Exception e) {
            System.err.println("Error getting filter data: " + e.getMessage());
            isDatabaseAvailable = false;
        }
        
        // Fallback данные
        filterData.put("brands", Arrays.asList("Apple", "Samsung", "Sony", "Nike", "Adidas", "Xiaomi"));
        filterData.put("minPrice", 0.0);
        filterData.put("maxPrice", 10000.0);
        filterData.put("minRating", 0.0);
        filterData.put("maxRating", 5.0);
        filterData.put("totalProducts", 0);
        
        return filterData;
    }

    // Извлечение брендов из названий продуктов
    private Set<String> extractBrands(List<Product> products) {
        Set<String> brands = new HashSet<>();
        
        for (Product product : products) {
            String name = product.getName().toLowerCase();
            
            // Список известных брендов для извлечения
            String[] knownBrands = {
                "apple", "samsung", "sony", "google", "xiaomi", "oneplus", "huawei",
                "nike", "adidas", "puma", "reebok", "new balance",
                "canon", "nikon", "fujifilm", "gopro",
                "dell", "hp", "lenovo", "asus", "acer", "microsoft",
                "bose", "jbl", "sennheiser", "beats"
            };
            
            for (String brand : knownBrands) {
                if (name.contains(brand)) {
                    brands.add(capitalizeFirst(brand));
                }
            }
        }
        
        return brands;
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    // Сортировка продуктов
    private List<Product> sortProducts(List<Product> products, String sortBy, String sortDirection) {
        boolean ascending = !"desc".equalsIgnoreCase(sortDirection);
        
        switch (sortBy.toLowerCase()) {
            case "price":
                products.sort(ascending ? 
                    Comparator.comparing(Product::getPrice) : 
                    Comparator.comparing(Product::getPrice).reversed());
                break;
            case "rating":
                products.sort(ascending ? 
                    Comparator.comparing(Product::getRating, Comparator.nullsLast(Comparator.naturalOrder())) : 
                    Comparator.comparing(Product::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                break;
            case "name":
                products.sort(ascending ? 
                    Comparator.comparing(Product::getName) : 
                    Comparator.comparing(Product::getName).reversed());
                break;
            case "newest":
                products.sort(ascending ? 
                    Comparator.comparing(Product::getIsNew, Comparator.nullsLast(Comparator.naturalOrder())) : 
                    Comparator.comparing(Product::getIsNew, Comparator.nullsLast(Comparator.reverseOrder())));
                break;
        }
        
        return products;
    }
}
