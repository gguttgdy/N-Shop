package com.ecommerce.repository;

import com.ecommerce.model.Return;
import com.ecommerce.model.ReturnStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRepository extends MongoRepository<Return, String> {
    
    @Query("{'user.$id': ?0}")
    List<Return> findByUserIdOrderByRequestedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    List<Return> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    Page<Return> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    @Query("{'user.$id': ?0, 'status': ?1}")
    List<Return> findByUserIdAndStatus(String userId, ReturnStatus status);
    
    @Query("{'$and': [{'id': ?0}, {'user.$id': ?1}]}")
    Optional<Return> findByIdAndUserId(String returnId, String userId);
    
    @Query("{'user.$id': ?0, 'requestedAt': {'$gte': ?1, '$lte': ?2}}")
    List<Return> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    Optional<Return> findByReturnNumber(String returnNumber);
    
    List<Return> findAllByOrderByRequestedAtDesc();
    
    List<Return> findByStatusOrderByRequestedAtDesc(ReturnStatus status);
    
    @Query("{'user.$id': ?0}")
    long countByUserId(String userId);
    
    @Query("{'user.$id': ?0, 'status': ?1}")
    long countByUserIdAndStatus(String userId, ReturnStatus status);
}
