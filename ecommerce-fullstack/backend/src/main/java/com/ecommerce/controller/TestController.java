package com.ecommerce.controller;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import com.ecommerce.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ReceiptRepository receiptRepository;
      @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ComplaintRepository complaintRepository;
    
    @Autowired
    private UserDiscountRepository userDiscountRepository;
    
    @Autowired
    private ReturnRepository returnRepository;
    
    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private DiscountService discountService;
    
    @Autowired
    private ReturnService returnService;
    
    @GetMapping("/database-status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Подсчитываем количество записей в каждой коллекции
            long usersCount = userRepository.count();
            long ordersCount = orderRepository.count();
            long receiptsCount = receiptRepository.count();
            long reviewsCount = reviewRepository.count();
            
            status.put("users", usersCount);
            status.put("orders", ordersCount);
            status.put("receipts", receiptsCount);
            status.put("reviews", reviewsCount);
            status.put("status", "connected");
            
            // Получаем тестового пользователя
            User testUser = userRepository.findByEmail("test@example.com").orElse(null);
            if (testUser != null) {
                status.put("testUserId", testUser.getId());
                
                // Получаем заказы тестового пользователя
                List<Order> userOrders = orderRepository.findByUserIdOrderByOrderDateDesc(testUser.getId());
                status.put("testUserOrders", userOrders.size());
                
                // Получаем чеки тестового пользователя
                List<Receipt> userReceipts = receiptRepository.findByUserIdOrderByIssuedAtDesc(testUser.getId());
                status.put("testUserReceipts", userReceipts.size());
                
                // Получаем отзывы тестового пользователя
                List<Review> userReviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId());
                status.put("testUserReviews", userReviews.size());
            }
            
        } catch (Exception e) {
            status.put("status", "error");
            status.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/test-user-data")
    public ResponseEntity<Map<String, Object>> getTestUserData() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            User testUser = userRepository.findByEmail("test@example.com").orElse(null);
            if (testUser == null) {
                data.put("error", "Test user not found");
                return ResponseEntity.notFound().build();
            }
            
            data.put("user", Map.of(
                "id", testUser.getId(),
                "email", testUser.getEmail(),
                "firstName", testUser.getFirstName(),
                "lastName", testUser.getLastName()
            ));
            
            // Получаем заказы
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(testUser.getId());
            data.put("orders", orders);
            
            // Получаем чеки
            List<Receipt> receipts = receiptRepository.findByUserIdOrderByIssuedAtDesc(testUser.getId());
            data.put("receipts", receipts);
            
            // Получаем отзывы
            List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId());
            data.put("reviews", reviews);
            
        } catch (Exception e) {
            data.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/test-user-profile-complete")
    public ResponseEntity<Map<String, Object>> getTestUserCompleteProfile() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            User testUser = userRepository.findByEmail("test@example.com").orElse(null);
            if (testUser == null) {
                data.put("error", "Test user not found");
                return ResponseEntity.notFound().build();
            }
            
            String userId = testUser.getId();
            
            data.put("user", Map.of(
                "id", testUser.getId(),
                "email", testUser.getEmail(),
                "firstName", testUser.getFirstName(),
                "lastName", testUser.getLastName()
            ));
            
            // Получаем заказы
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
            data.put("orders", orders.size() + " orders found");
            
            // Получаем чеки
            List<Receipt> receipts = receiptRepository.findByUserIdOrderByIssuedAtDesc(userId);
            data.put("receipts", receipts.size() + " receipts found");
            
            // Получаем отзывы
            List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
            data.put("reviews", reviews.size() + " reviews found");
            
            // Получаем жалобы через сервис
            List<Complaint> complaints = complaintService.getUserComplaints(userId);
            data.put("complaints", complaints.size() + " complaints found");
            
            // Получаем скидки через сервис
            List<UserDiscount> discounts = discountService.getUserDiscounts(userId);
            data.put("discounts", discounts.size() + " discounts found");
            
            // Получаем возвраты через сервис
            List<Return> returns = returnService.getUserReturns(userId);
            data.put("returns", returns.size() + " returns found");
            
            // Подсчитываем общее количество записей в коллекциях
            data.put("totalCollectionCounts", Map.of(
                "complaints", complaintRepository.count(),
                "discounts", userDiscountRepository.count(),
                "returns", returnRepository.count()
            ));
            
        } catch (Exception e) {
            data.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(data);
    }
}
