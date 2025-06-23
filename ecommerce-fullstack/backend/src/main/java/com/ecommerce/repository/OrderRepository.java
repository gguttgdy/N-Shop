package com.ecommerce.repository;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
    
    Page<Order> findByUserIdOrderByOrderDateDesc(String userId, Pageable pageable);
    
    List<Order> findByUserIdAndStatus(String userId, OrderStatus status);
    
    Optional<Order> findByIdAndUserId(String orderId, String userId);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUserIdAndOrderDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByUserIdAndOrderDateBetweenOrderByOrderDateDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    long countByUserId(String userId);
}
