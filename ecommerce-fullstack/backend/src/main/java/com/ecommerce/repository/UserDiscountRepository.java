package com.ecommerce.repository;

import com.ecommerce.model.UserDiscount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDiscountRepository extends MongoRepository<UserDiscount, String> {
    
    @Query("{'user.$id': ?0}")
    List<UserDiscount> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    Page<UserDiscount> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    @Query("{'user.$id': ?0, 'isUsed': false}")
    List<UserDiscount> findByUserIdAndIsUsedFalse(String userId);
    
    @Query("{'user.$id': ?0, 'isUsed': false, 'validUntil': {'$gt': ?1}}")
    List<UserDiscount> findByUserIdAndIsUsedFalseAndValidUntilAfter(String userId, LocalDateTime now);
    
    @Query("{'user.$id': ?0, 'isUsed': true}")
    List<UserDiscount> findByUserIdAndIsUsedTrue(String userId);
    
    @Query("{'$and': [{'id': ?0}, {'user.$id': ?1}]}")
    Optional<UserDiscount> findByIdAndUserId(String discountId, String userId);
    
    Optional<UserDiscount> findByDiscountCode(String discountCode);
    
    @Query("{'user.$id': ?0}")
    long countByUserId(String userId);
    
    @Query("{'user.$id': ?0, 'isUsed': false}")
    long countByUserIdAndIsUsedFalse(String userId);
    
    @Query("{'user.$id': ?0, 'isUsed': true}")
    long countByUserIdAndIsUsedTrue(String userId);
    
    List<UserDiscount> findAllByOrderByCreatedAtDesc();
}
