package com.ecommerce.repository;

import com.ecommerce.model.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends MongoRepository<Receipt, String> {
    
    // Use direct userId field for better performance and reliability
    List<Receipt> findByUserIdOrderByIssuedAtDesc(String userId);
    
    Page<Receipt> findByUserIdOrderByIssuedAtDesc(String userId, Pageable pageable);
    
    Optional<Receipt> findByIdAndUserId(String receiptId, String userId);
    
    @Query("{'$and': [{'order.$id': ?0}, {'userId': ?1}]}")
    Optional<Receipt> findByOrderIdAndUserId(String orderId, String userId);
    
    List<Receipt> findByUserIdAndIssuedAtBetweenOrderByIssuedAtDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);    
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    
    Optional<Receipt> findByOrderId(String orderId);
    
    List<Receipt> findByUserIdAndIssuedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Receipt> findAllByOrderByIssuedAtDesc();
    
    long countByUserId(String userId);
}
