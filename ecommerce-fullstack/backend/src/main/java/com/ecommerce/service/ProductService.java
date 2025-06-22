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

    public List<Product> getProducts(String category, String subcategory, String section, String search) {        try {
            if (isDatabaseAvailable) {
                // Добавим проверку общего количества продуктов
                long totalCount = productRepository.count();
                
                if (search != null && !search.isEmpty()) {
                    List<Product> result = productRepository.findByNameContainingIgnoreCase(search);
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
    
    public List<Product> getRandomProducts(int limit) {        try {
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
    }
}
