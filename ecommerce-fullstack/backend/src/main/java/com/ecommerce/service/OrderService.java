package com.ecommerce.service;

import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.OrderItemRequest;
import com.ecommerce.dto.UserUpdateRequest;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.User;
import com.ecommerce.model.Receipt;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ReceiptRepository receiptRepository;
      public List<Order> getUserOrders(String userId) {
        try {
            System.out.println("Fetching orders for user: " + userId);
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
            System.out.println("Found " + orders.size() + " orders in database");
            
            // Return real orders from database, don't mix with mock data
            return orders;
        } catch (Exception e) {
            System.err.println("Error fetching orders from database: " + e.getMessage());
            e.printStackTrace();
            // Return empty list on error instead of mock data
            return new ArrayList<>();
        }
    }

    public Page<Order> getUserOrdersPaginated(String userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId, pageable);
    }

    public List<Order> getUserOrdersByStatus(String userId, OrderStatus status) {
        return orderRepository.findByUserIdAndStatus(userId, status);
    }

    public Optional<Order> getOrderById(String orderId, String userId) {
        return orderRepository.findByIdAndUserId(orderId, userId);
    }

    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String orderId, String userId, OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findByIdAndUserId(orderId, userId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found or access denied");
    }

    public void cancelOrder(String orderId, String userId) {
        updateOrderStatus(orderId, userId, OrderStatus.CANCELLED);
    }

    public List<Order> getOrdersByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByUserIdAndOrderDateBetweenOrderByOrderDateDesc(userId, startDate, endDate);
    }    public double calculateTotalSpent(String userId) {
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, OrderStatus.DELIVERED);
        return orders.stream()
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum();
    }

    public long countUserOrders(String userId) {
        return orderRepository.countByUserId(userId);
    }    public Order createOrderFromRequest(CreateOrderRequest request, String userId) {
        // Get user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setTotalAmount(request.getTotalAmount());
        order.setCurrency(request.getCurrency());
        
        // Set delivery address
        String deliveryAddress = String.format("%s, %s, %s %s, %s", 
            request.getStreet() + (request.getApartment() != null ? ", " + request.getApartment() : ""),
            request.getCity(),
            request.getState() != null ? request.getState() + "," : "",
            request.getPostalCode(),
            request.getCountry());
        order.setShippingAddress(deliveryAddress);
        
        // Set payment information
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        order.setNotes(request.getNotes());
        
        // Convert and add order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(itemRequest.getProductId());
            orderItem.setProductName(itemRequest.getProductName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(itemRequest.getPrice());
            orderItem.setProductImage(itemRequest.getProductImage());
            order.getItems().add(orderItem);
        }
          // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Create receipt for the order
        createReceiptForOrder(savedOrder);
        
        // Update user address if requested
        if (request.isSaveDeliveryAddress()) {
            updateUserDeliveryAddress(user, request);
        }
        
        return savedOrder;
    }
    
      private void createReceiptForOrder(Order order) {
        try {
            Receipt receipt = new Receipt();
            receipt.setUserId(order.getUser().getId()); // Set direct userId field
            receipt.setUser(order.getUser());
            receipt.setOrder(order);
            receipt.setReceiptNumber(generateReceiptNumber());
            receipt.setTotalAmount(order.getTotalAmount());
            receipt.setCurrency(order.getCurrency());
            receipt.setPaymentMethod(order.getPaymentMethod());
              // Calculate tax and shipping (for now, use simple calculation)
            BigDecimal totalAmount = order.getTotalAmount();
            BigDecimal shippingAmount = new BigDecimal("9.99"); // Fixed shipping
            BigDecimal taxRate = new BigDecimal("0.08"); // 8% tax
            
            // Calculate tax from subtotal (total - shipping)
            BigDecimal subtotal = totalAmount.subtract(shippingAmount);
            BigDecimal taxAmount = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
            
            receipt.setTaxAmount(taxAmount);
            receipt.setShippingAmount(shippingAmount);
            receipt.setDiscountAmount(BigDecimal.ZERO);
            
            // Set payment transaction ID (for now, generate a dummy one)
            receipt.setPaymentTransactionId("TXN-" + System.currentTimeMillis());
            
            receipt.setIssuedAt(LocalDateTime.now());
            receipt.setEmailSent(false);
            
            receiptRepository.save(receipt);
            System.out.println("Receipt created for order: " + order.getOrderNumber());
        } catch (Exception e) {
            System.err.println("Failed to create receipt for order " + order.getOrderNumber() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String generateReceiptNumber() {
        return "RCP-" + System.currentTimeMillis();
    }
    
    private void updateUserDeliveryAddress(User user, CreateOrderRequest request) {
        try {
            UserUpdateRequest updateRequest = new UserUpdateRequest();
            updateRequest.setAddress(request.getStreet());
            updateRequest.setCity(request.getCity());
            updateRequest.setState(request.getState());
            updateRequest.setCountry(request.getCountry());
            updateRequest.setPostalCode(request.getPostalCode());
            updateRequest.setApartment(request.getApartment());
            
            userService.updateUser(user.getId(), updateRequest);
        } catch (Exception e) {
            // Log error but don't fail the order creation
            System.err.println("Failed to update user address: " + e.getMessage());
        }
    }
    
    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis();
    }
}
