package com.ecommerce.service;

import com.ecommerce.model.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    }    // Mock data methods for user profile - DISABLED due to compilation errors
    // Use UserProfileMockService instead
    /*
    public List<Order> getMockUserOrders(String userId) {
        return Arrays.asList(
            createMockOrder("ORD-2024-001", userId, OrderStatus.DELIVERED, new BigDecimal("299.99"), LocalDateTime.now().minusDays(15)),
            createMockOrder("ORD-2024-002", userId, OrderStatus.SHIPPED, new BigDecimal("149.50"), LocalDateTime.now().minusDays(3)),
            createMockOrder("ORD-2024-003", userId, OrderStatus.PENDING, new BigDecimal("89.99"), LocalDateTime.now().minusHours(6))
        );
    }

    public List<Receipt> getMockUserReceipts(String userId) {
        return Arrays.asList(
            createMockReceipt("RCP-2024-001", userId, new BigDecimal("299.99"), LocalDateTime.now().minusDays(15)),
            createMockReceipt("RCP-2024-002", userId, new BigDecimal("149.50"), LocalDateTime.now().minusDays(3))
        );
    }

    public List<Review> getMockUserReviews(String userId) {
        return Arrays.asList(
            createMockReview("REV-001", userId, "1", "Wireless Headphones", 5, "Excellent sound quality!", LocalDateTime.now().minusDays(10)),
            createMockReview("REV-002", userId, "2", "Bluetooth Speaker", 4, "Good speaker but battery could be better", LocalDateTime.now().minusDays(5)),
            createMockReview("REV-003", userId, "3", "Smart Watch", 3, "Average smartwatch", LocalDateTime.now().minusDays(2))
        );
    }

    public List<Complaint> getMockUserComplaints(String userId) {
        return Arrays.asList(
            createMockComplaint("CMP-001", userId, "Defective product", "Headphones have crackling sound", ComplaintStatus.IN_PROGRESS, LocalDateTime.now().minusDays(5)),
            createMockComplaint("CMP-002", userId, "Late delivery", "Order arrived 5 days late", ComplaintStatus.RESOLVED, LocalDateTime.now().minusDays(12)),
            createMockComplaint("CMP-003", userId, "Wrong item", "Received red shirt instead of blue", ComplaintStatus.CLOSED, LocalDateTime.now().minusDays(20))
        );
    }    public List<UserDiscount> getMockUserDiscounts(String userId) {
        return Arrays.asList(
            createMockDiscount("DSC-001", userId, "SAVE20", "20% off on electronics", DiscountType.PERCENTAGE, new BigDecimal("20"), LocalDateTime.now().plusDays(30)),
            createMockDiscount("DSC-002", userId, "FREESHIP", "Free shipping", DiscountType.FIXED_AMOUNT, new BigDecimal("0"), LocalDateTime.now().plusDays(15)),
            createMockDiscount("DSC-003", userId, "WELCOME10", "Welcome discount", DiscountType.PERCENTAGE, new BigDecimal("10"), LocalDateTime.now().minusDays(5))
        );
    }

    public List<Return> getMockUserReturns(String userId) {
        return Arrays.asList(
            createMockReturn("RET-001", userId, "ORD-2024-100", "Defective", ReturnStatus.IN_TRANSIT, new BigDecimal("99.99"), LocalDateTime.now().minusDays(3)),
            createMockReturn("RET-002", userId, "ORD-2024-095", "Not as described", ReturnStatus.COMPLETED, new BigDecimal("79.99"), LocalDateTime.now().minusDays(10)),
            createMockReturn("RET-003", userId, "ORD-2024-090", "Changed mind", ReturnStatus.REQUESTED, new BigDecimal("199.99"), LocalDateTime.now().minusDays(1))
        );
    }

    // Helper methods for creating mock objects
    private Order createMockOrder(String orderNumber, String userId, OrderStatus status, BigDecimal amount, LocalDateTime orderDate) {
        Order order = new Order();
        order.setId(orderNumber);
        order.setUserId(userId);
        order.setOrderNumber(orderNumber);
        order.setStatus(status);
        order.setTotalAmount(amount);
        order.setOrderDate(orderDate);
        return order;
    }

    private Receipt createMockReceipt(String receiptNumber, String userId, BigDecimal amount, LocalDateTime date) {
        Receipt receipt = new Receipt();
        receipt.setId(receiptNumber);
        receipt.setUserId(userId);
        receipt.setReceiptNumber(receiptNumber);
        receipt.setTotalAmount(amount);
        receipt.setCreatedAt(date);
        return receipt;
    }

    private Review createMockReview(String id, String userId, String productId, String productName, Integer rating, String comment, LocalDateTime createdAt) {
        Review review = new Review();
        review.setId(id);
        review.setUserId(userId);
        review.setProductId(productId);
        review.setProductName(productName);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(createdAt);
        return review;
    }

    private Complaint createMockComplaint(String id, String userId, String subject, String description, ComplaintStatus status, LocalDateTime createdAt) {
        Complaint complaint = new Complaint();
        complaint.setId(id);
        complaint.setUserId(userId);
        complaint.setSubject(subject);
        complaint.setDescription(description);
        complaint.setStatus(status);
        complaint.setCreatedAt(createdAt);
        return complaint;
    }

    private UserDiscount createMockDiscount(String id, String userId, String code, String description, DiscountType type, BigDecimal value, LocalDateTime validUntil) {
        UserDiscount discount = new UserDiscount();
        discount.setId(id);
        discount.setUserId(userId);
        discount.setCode(code);
        discount.setDescription(description);
        discount.setDiscountType(type);
        discount.setValue(value);
        discount.setValidUntil(validUntil);
        discount.setIsActive(validUntil.isAfter(LocalDateTime.now()));
        return discount;
    }

    private Return createMockReturn(String id, String userId, String orderNumber, String reason, ReturnStatus status, BigDecimal amount, LocalDateTime createdAt) {
        Return returnItem = new Return();
        returnItem.setId(id);
        returnItem.setUserId(userId);
        returnItem.setOrderId(orderNumber);
        returnItem.setReason(ReturnReason.valueOf(reason.toUpperCase().replace(" ", "_")));
        returnItem.setStatus(status);
        returnItem.setReturnAmount(amount);        returnItem.setCreatedAt(createdAt);
        return returnItem;
    }
    */
}
