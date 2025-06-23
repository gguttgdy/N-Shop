package com.ecommerce.repository;

import com.ecommerce.model.PasswordResetToken;
import com.ecommerce.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    @Query("{'user.$id': ?0}")
    List<PasswordResetToken> findByUser(User user);
    
    @Query("{'user.$id': ?0, 'used': false}")
    List<PasswordResetToken> findByUserAndUsedFalse(User user);
    
    @Query("{'expiryDate': {'$lt': ?0}}")
    List<PasswordResetToken> findExpiredTokens(LocalDateTime currentDate);
    
    @Query("{'token': ?0, 'used': false, 'expiryDate': {'$gt': ?1}}")
    Optional<PasswordResetToken> findValidToken(String token, LocalDateTime currentDate);
    
    void deleteByExpiryDateBefore(LocalDateTime currentDate);
}
