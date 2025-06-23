package com.ecommerce.repository;

import com.ecommerce.model.Complaint;
import com.ecommerce.model.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    
    @Query("{'user.$id': ?0}")
    List<Complaint> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("{'user.$id': ?0}")
    Page<Complaint> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    @Query("{'user.$id': ?0, 'status': ?1}")
    List<Complaint> findByUserIdAndStatus(String userId, ComplaintStatus status);
    
    @Query("{'$and': [{'id': ?0}, {'user.$id': ?1}]}")
    Optional<Complaint> findByIdAndUserId(String complaintId, String userId);
    
    @Query("{'user.$id': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    List<Complaint> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Complaint> findAllByOrderByCreatedAtDesc();
    
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    
    @Query("{'user.$id': ?0}")
    long countByUserId(String userId);
    
    @Query("{'user.$id': ?0, 'status': ?1}")
    long countByUserIdAndStatus(String userId, ComplaintStatus status);
}
