package com.ecommerce.controller;

import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.ErrorResponse;
import com.ecommerce.dto.OrderCreatedResponse;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private JwtUtil jwtUtil;    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request, 
                                        HttpServletRequest httpRequest) {
        try {
            System.out.println("Received order request: " + request);
            String userId = getUserIdFromToken(httpRequest);
            System.out.println("User ID from token: " + userId);
            Order order = orderService.createOrderFromRequest(request, userId);
            
            return ResponseEntity.ok(new OrderCreatedResponse("Order created successfully", order.getOrderNumber(), order.getId()));
        } catch (RuntimeException e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserOrders(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return ResponseEntity.ok(orderService.getUserOrders(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId, HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            return orderService.getOrderById(orderId, userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
      private String getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header is missing or invalid");
        }
        
        String token = authHeader.substring(7);
        System.out.println("Token: " + token.substring(0, Math.min(token.length(), 20)) + "...");
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        
        return jwtUtil.getUserIdFromToken(token);
    }
}
