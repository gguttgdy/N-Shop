package com.ecommerce.service;

import com.ecommerce.model.Product;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Component
public class MockDataService {
    
    private final List<Product> mockProducts;
    private final AtomicLong idGenerator = new AtomicLong(1);

    public MockDataService() {
        this.mockProducts = initializeMockProducts();
    }    public List<Product> getProducts(String category, String subcategory, String section, String search) {
        return mockProducts.stream()
                .filter(product -> category == null || category.equals(product.getCategoryId()))
                .filter(product -> subcategory == null || subcategory.equals(product.getSubcategoryId()))
                .filter(product -> section == null || section.equals(product.getSectionType()))
                .filter(product -> search == null || 
                    product.getName().toLowerCase().contains(search.toLowerCase()) ||
                    (product.getNameRu() != null && product.getNameRu().toLowerCase().contains(search.toLowerCase())) ||
                    (product.getNamePl() != null && product.getNamePl().toLowerCase().contains(search.toLowerCase())) ||
                    (product.getCategoryId() != null && product.getCategoryId().toLowerCase().contains(search.toLowerCase())) ||
                    (product.getSubcategoryId() != null && product.getSubcategoryId().toLowerCase().contains(search.toLowerCase())))
                .collect(Collectors.toList());
    }
    
    public List<Product> getProductsBySection(String section) {
        return mockProducts.stream()
                .filter(product -> section.equals(product.getSectionType()))
                .collect(Collectors.toList());
    }

    public Product getProductById(String id) {
        return mockProducts.stream()
                .filter(product -> id.equals(product.getId()))
                .findFirst()
                .orElse(null);
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(mockProducts);
    }

    private List<Product> initializeMockProducts() {
        List<Product> products = new ArrayList<>(Arrays.asList(
            // Electronics - Smartphones
            createMockProduct("iPhone 15 Pro", "iPhone 15 Pro", "iPhone 15 Pro", 999.99, "📱", "electronics", "smartphones", "new-arrivals", 4.8, true, 0),
            createMockProduct("Samsung Galaxy S24", "Samsung Galaxy S24", "Samsung Galaxy S24", 899.99, "📱", "electronics", "smartphones", "hot-deals", 4.7, false, 10),
            createMockProduct("Google Pixel 8", "Google Pixel 8", "Google Pixel 8", 699.99, "📱", "electronics", "smartphones", "recommended", 4.6, false, 15),
            
            // Electronics - Laptops
            createMockProduct("MacBook Pro M3", "MacBook Pro M3", "MacBook Pro M3", 1999.99, "💻", "electronics", "laptops", "new-arrivals", 4.9, true, 0),
            createMockProduct("Dell XPS 13", "Dell XPS 13", "Dell XPS 13", 1299.99, "💻", "electronics", "laptops", "recommended", 4.5, false, 5),
            createMockProduct("Lenovo ThinkPad", "Lenovo ThinkPad", "Lenovo ThinkPad", 1099.99, "💻", "electronics", "laptops", "discounts", 4.4, false, 20),
            
            // Electronics - Tablets
            createMockProduct("iPad Pro", "iPad Pro", "iPad Pro", 799.99, "📱", "electronics", "tablets", "new-arrivals", 4.7, true, 0),
            createMockProduct("Samsung Galaxy Tab", "Samsung Galaxy Tab", "Samsung Galaxy Tab", 549.99, "📱", "electronics", "tablets", "recommended", 4.4, false, 0),
            createMockProduct("Amazon Fire HD", "Amazon Fire HD", "Amazon Fire HD", 149.99, "📱", "electronics", "tablets", "hot-deals", 4.1, false, 25),
            
            // Fashion - Men
            createMockProduct("Men's Jacket", "Мужская куртка", "Kurtka męska", 129.99, "🧥", "fashion", "men", "hot-deals", 4.3, false, 25),
            createMockProduct("Men's Jeans", "Мужские джинсы", "Jeansy męskie", 79.99, "👖", "fashion", "men", "recommended", 4.2, false, 15),
            createMockProduct("Men's Sneakers", "Мужские кроссовки", "Sneakersy męskie", 149.99, "👟", "fashion", "men", "new-arrivals", 4.6, true, 0),
            
            // Fashion - Women
            createMockProduct("Women's Dress", "Женское платье", "Sukienka damska", 89.99, "👗", "fashion", "women", "hot-deals", 4.4, false, 30),
            createMockProduct("Women's Bag", "Женская сумка", "Torebka damska", 199.99, "👜", "fashion", "women", "recommended", 4.5, false, 0),
            createMockProduct("Women's Shoes", "Женские туфли", "Buty damskie", 119.99, "👠", "fashion", "women", "discounts", 4.3, false, 20),
            
            // Home - Furniture
            createMockProduct("Sofa Set", "Диван", "Zestaw mebli", 799.99, "🛋️", "home", "furniture", "recommended", 4.2, false, 10),
            createMockProduct("Dining Table", "Обеденный стол", "Stół jadalny", 599.99, "🪑", "home", "furniture", "hot-deals", 4.4, false, 15),
            createMockProduct("Wardrobe", "Шкаф", "Szafa", 499.99, "🗄️", "home", "furniture", "discounts", 4.1, false, 25),
            
            // Home - Kitchen
            createMockProduct("Coffee Machine", "Кофемашина", "Ekspres do kawy", 299.99, "☕", "home", "kitchen", "new-arrivals", 4.7, true, 0),
            createMockProduct("Blender", "Блендер", "Blender", 79.99, "🥤", "home", "kitchen", "hot-deals", 4.3, false, 20),
            createMockProduct("Microwave", "Микроволновка", "Kuchenka mikrofalowa", 149.99, "📡", "home", "kitchen", "recommended", 4.2, false, 5),
            
            // Sports - Equipment
            createMockProduct("Yoga Mat", "Коврик для йоги", "Mata do jogi", 29.99, "🧘", "sports", "equipment", "recommended", 4.1, false, 0),
            createMockProduct("Dumbbells Set", "Набор гантелей", "Zestaw hantli", 199.99, "🏋️", "sports", "equipment", "hot-deals", 4.5, false, 15),
            createMockProduct("Tennis Racket", "Теннисная ракетка", "Rakieta tenisowa", 129.99, "🎾", "sports", "equipment", "new-arrivals", 4.4, true, 0),
            
            // Sports - Clothing
            createMockProduct("Running Shoes", "Беговые кроссовки", "Buty do biegania", 159.99, "👟", "sports", "clothing", "recommended", 4.6, false, 10),
            createMockProduct("Sports T-shirt", "Спортивная футболка", "Koszulka sportowa", 39.99, "👕", "sports", "clothing", "hot-deals", 4.2, false, 25),
            createMockProduct("Yoga Pants", "Штаны для йоги", "Spodnie do jogi", 69.99, "🩱", "sports", "clothing", "discounts", 4.3, false, 30),
            
            // Books - Fiction
            createMockProduct("Mystery Novel", "Детективный роман", "Powieść kryminalna", 14.99, "📚", "books", "fiction", "new-arrivals", 4.3, true, 0),
            createMockProduct("Science Fiction", "Научная фантастика", "Fantastyka naukowa", 16.99, "📖", "books", "fiction", "recommended", 4.5, false, 0),
            createMockProduct("Romance Novel", "Романтический роман", "Romans", 12.99, "💕", "books", "fiction", "hot-deals", 4.2, false, 20)
        ));
        
        return products;
    }

    private Product createMockProduct(String name, String nameRu, String namePl, Double price, String image, 
                                     String categoryId, String subcategoryId, String sectionType, 
                                     Double rating, Boolean isNew, Integer discount) {
        Product product = new Product(name, nameRu, namePl, price, image, categoryId, subcategoryId);
        product.setId(String.valueOf(idGenerator.getAndIncrement()));
        product.setSectionType(sectionType);
        product.setRating(rating);
        product.setIsNew(isNew);
        product.setDiscount(discount);
        product.setIsActive(true);
        product.setStock(100);
        
        if (discount > 0) {
            product.setOldPrice(price);
            product.setPrice(price * (100 - discount) / 100);
        }
        
        return product;
    }
}
