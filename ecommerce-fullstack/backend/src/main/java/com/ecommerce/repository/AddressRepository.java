package com.ecommerce.repository;

import com.ecommerce.model.Address;
import com.ecommerce.model.AddressType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends MongoRepository<Address, String> {
    
    List<Address> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Address> findByUserIdAndType(String userId, AddressType type);
    
    Optional<Address> findByUserIdAndIsDefaultTrue(String userId);
    
    long countByUserId(String userId);
}
