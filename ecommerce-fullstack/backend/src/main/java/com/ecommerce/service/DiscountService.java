package com.ecommerce.service;

import com.ecommerce.model.UserDiscount;
import com.ecommerce.repository.UserDiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {

    @Autowired
    private UserDiscountRepository discountRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<UserDiscount> getUserDiscounts(String userId) {
        try {
            List<UserDiscount> discounts = discountRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (discounts.isEmpty()) {
                System.out.println("No discounts found for user " + userId + ", using mock data as fallback");
                return mockService.getMockUserDiscounts(userId);
            }
            System.out.println("Found " + discounts.size() + " discounts for user: " + userId);
            return discounts;
        } catch (Exception e) {
            System.err.println("Error fetching discounts: " + e.getMessage());
            return mockService.getMockUserDiscounts(userId);
        }
    }

    public Page<UserDiscount> getUserDiscountsPaginated(String userId, Pageable pageable) {
        return discountRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<UserDiscount> getActiveUserDiscounts(String userId) {
        return discountRepository.findByUserIdAndIsUsedFalseAndValidUntilAfter(userId, LocalDateTime.now());
    }

    public List<UserDiscount> getUsedUserDiscounts(String userId) {
        return discountRepository.findByUserIdAndIsUsedTrue(userId);
    }

    public Optional<UserDiscount> getDiscountById(String discountId, String userId) {
        return discountRepository.findByIdAndUserId(discountId, userId);
    }

    public UserDiscount createDiscount(UserDiscount discount) {
        discount.setCreatedAt(LocalDateTime.now());
        discount.setUsed(false);
        return discountRepository.save(discount);
    }

    public UserDiscount useDiscount(String discountId, String userId, String orderId) {
        Optional<UserDiscount> discountOpt = discountRepository.findByIdAndUserId(discountId, userId);
        if (discountOpt.isPresent()) {
            UserDiscount discount = discountOpt.get();
            if (discount.isValid()) {
                discount.markAsUsed(orderId);
                return discountRepository.save(discount);
            } else {
                throw new RuntimeException("Discount is expired or already used");
            }
        }
        throw new RuntimeException("Discount not found or access denied");
    }

    public Optional<UserDiscount> findByCode(String discountCode) {
        return discountRepository.findByDiscountCode(discountCode);
    }

    public long countUserDiscounts(String userId) {
        return discountRepository.countByUserId(userId);
    }

    public long countActiveUserDiscounts(String userId) {
        return discountRepository.countByUserIdAndIsUsedFalse(userId);
    }

    public long countUsedUserDiscounts(String userId) {
        return discountRepository.countByUserIdAndIsUsedTrue(userId);
    }

    // Admin methods
    public List<UserDiscount> getAllDiscounts() {
        return discountRepository.findAllByOrderByCreatedAtDesc();
    }
}
