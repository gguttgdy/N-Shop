package com.ecommerce.repository;

import com.ecommerce.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    @Query("{'user.$id': ?0}")
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    Page<Review> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    
    Page<Review> findByProductIdOrderByCreatedAtDesc(String productId, Pageable pageable);
    
    List<Review> findByProductId(String productId);
      @Query("{'$and': [{'id': ?0}, {'user.$id': ?1}]}")
    Optional<Review> findByIdAndUserId(String reviewId, String userId);
    
    @Query("{'$and': [{'user.$id': ?0}, {'productId': ?1}]}")
    List<Review> findByUserIdAndProductId(String userId, String productId);
    
    @Query("{'$and': [{'user.$id': ?0}, {'rating': ?1}]}")
    List<Review> findByUserIdAndRating(String userId, Integer rating);
    
    @Query("{'user.$id': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    List<Review> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{'user.$id': ?0}", count = true)
    long countByUserId(String userId);
    
    long countByProductId(String productId);
    
    double findAverageRatingByProductId(String productId);
}
