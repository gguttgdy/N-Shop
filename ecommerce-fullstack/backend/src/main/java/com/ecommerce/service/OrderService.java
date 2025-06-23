package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<Order> getUserOrders(String userId) {
        try {
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
            if (orders.isEmpty()) {
                // If no orders found in database, return mock data for demo
                System.out.println("No orders found in database for user: " + userId + ", returning mock data");
                return mockService.getMockUserOrders(userId);
            }
            return orders;
        } catch (Exception e) {
            System.err.println("Error fetching orders from database: " + e.getMessage());
            // Fallback to mock data if database error occurs
            return mockService.getMockUserOrders(userId);
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
    }
}
