package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private MockDataService mockDataService;
    
    private boolean isDatabaseAvailable = true;

    public List<Product> getProducts(String category, String subcategory, String section, String search) {
        try {
            if (isDatabaseAvailable) {
                System.out.println("ProductService: category=" + category + ", subcategory=" + subcategory + ", section=" + section + ", search=" + search);
                
                // Добавим проверку общего количества продуктов
                long totalCount = productRepository.count();
                System.out.println("Total products in database: " + totalCount);
                
                if (search != null && !search.isEmpty()) {
                    List<Product> result = productRepository.findByNameContainingIgnoreCase(search);
                    System.out.println("Search results count: " + result.size());
                    return result;
                }
                
                if (category != null && subcategory != null) {
                    System.out.println("Searching for category=" + category + " AND subcategory=" + subcategory);
                    List<Product> result = productRepository.findByCategoryAndSubcategory(category, subcategory);
                    System.out.println("Found " + result.size() + " products for category=" + category + ", subcategory=" + subcategory);
                    
                    // Дополнительная отладка - посмотрим что есть в базе
                    List<Product> allProducts = productRepository.findAll();
                    System.out.println("All products in database:");
                    for (Product p : allProducts) {
                        System.out.println("Product: " + p.getName() + ", category: " + p.getCategoryId() + ", subcategory: " + p.getSubcategoryId());
                    }
                    
                    return result;
                }
                
                if (category != null) {
                    List<Product> result = productRepository.findByCategoryIdAndIsActiveTrue(category);
                    System.out.println("Found " + result.size() + " products for category=" + category);
                    return result;
                }
                
                if (subcategory != null) {
                    List<Product> result = productRepository.findBySubcategoryIdAndIsActiveTrue(subcategory);
                    System.out.println("Found " + result.size() + " products for subcategory=" + subcategory);
                    return result;
                }
                
                if (section != null) {
                    List<Product> result = productRepository.findBySectionTypeAndIsActiveTrue(section);
                    System.out.println("Found " + result.size() + " products for section=" + section);
                    return result;
                }
                
                List<Product> result = productRepository.findByIsActiveTrue();
                System.out.println("Found " + result.size() + " active products");
                return result;
            }
        } catch (Exception e) {
            System.err.println("Database unavailable, using mock data: " + e.getMessage());
            e.printStackTrace();
            isDatabaseAvailable = false;
        }
        
        // Fallback to mock data
        System.out.println("Using mock data service");
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
}
