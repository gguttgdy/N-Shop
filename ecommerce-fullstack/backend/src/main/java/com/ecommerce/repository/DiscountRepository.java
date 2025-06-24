package com.ecommerce.repository;

import com.ecommerce.model.Discount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountRepository extends MongoRepository<Discount, String> {
    List<Discount> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Discount> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
}
