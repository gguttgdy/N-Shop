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
    
    @Query("{'user.$id': ?0}")
    List<Receipt> findByUserIdOrderByIssuedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    List<Receipt> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    Page<Receipt> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    @Query("{'$and': [{'id': ?0}, {'user.$id': ?1}]}")
    Optional<Receipt> findByIdAndUserId(String receiptId, String userId);
    
    @Query("{'$and': [{'order.$id': ?0}, {'user.$id': ?1}]}")
    Optional<Receipt> findByOrderIdAndUserId(String orderId, String userId);
    
    @Query("{'user.$id': ?0, 'issuedAt': {'$gte': ?1, '$lte': ?2}}")
    List<Receipt> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    
    Optional<Receipt> findByOrderId(String orderId);
    
    List<Receipt> findByUserIdAndIssuedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Receipt> findAllByOrderByIssuedAtDesc();
    
    @Query("{'user.$id': ?0}")
    long countByUserId(String userId);
}
