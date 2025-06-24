package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.*;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ReceiptService receiptService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private DiscountService discountService;
    
    @Autowired
    private ReturnService returnService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            UserResponse userResponse = userService.getUserById(userId);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserUpdateRequest updateRequest, 
                                               HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            UserResponse userResponse = userService.updateUser(userId, updateRequest);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }      @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(HttpServletRequest request) {
        try {
            System.out.println("GET /api/users/orders - Getting user orders");
            String userId = getUserIdFromToken(request);
            System.out.println("User ID: " + userId);
            List<?> orders = orderService.getUserOrders(userId);
            System.out.println("Returning " + orders.size() + " orders");
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            System.err.println("Error in getUserOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/receipts")
    public ResponseEntity<?> getUserReceipts(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(receiptService.getUserReceipts(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/reviews")
    public ResponseEntity<?> getUserReviews(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(reviewService.getUserReviews(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/complaints")
    public ResponseEntity<?> getUserComplaints(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(complaintService.getUserComplaints(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/discounts")
    public ResponseEntity<?> getUserDiscounts(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(discountService.getUserDiscounts(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/returns")
    public ResponseEntity<?> getUserReturns(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(returnService.getUserReturns(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
      private String getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.err.println("Authorization header is missing or invalid");
            throw new RuntimeException("Authorization header is missing or invalid");
        }
        
        String token = authHeader.substring(7);
        System.out.println("Token: " + token.substring(0, Math.min(token.length(), 20)) + "...");
        if (!jwtUtil.validateToken(token)) {
            System.err.println("Token validation failed");
            throw new RuntimeException("Invalid or expired token");
        }
        
        String userId = jwtUtil.getUserIdFromToken(token);
        System.out.println("Extracted user ID: " + userId);
        return userId;
    }
}
