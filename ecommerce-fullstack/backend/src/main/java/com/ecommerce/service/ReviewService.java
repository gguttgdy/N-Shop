package com.ecommerce.service;

import com.ecommerce.model.Review;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<Review> getUserReviews(String userId) {
        try {
            List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (reviews.isEmpty()) {
                System.out.println("No reviews found in database for user: " + userId + ", returning mock data");
                return mockService.getMockUserReviews(userId);
            }
            return reviews;
        } catch (Exception e) {
            System.err.println("Error fetching reviews from database: " + e.getMessage());
            return mockService.getMockUserReviews(userId);
        }
    }

    public Page<Review> getUserReviewsPaginated(String userId, Pageable pageable) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Review> getProductReviews(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Page<Review> getProductReviewsPaginated(String productId, Pageable pageable) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
    }

    public Optional<Review> getReviewById(String reviewId, String userId) {
        return reviewRepository.findByIdAndUserId(reviewId, userId);
    }

    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public Review updateReview(String reviewId, String userId, String comment, Integer rating) {
        Optional<Review> reviewOpt = reviewRepository.findByIdAndUserId(reviewId, userId);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            review.setComment(comment);
            review.setRating(rating);
            review.setUpdatedAt(LocalDateTime.now());
            return reviewRepository.save(review);
        }
        throw new RuntimeException("Review not found or access denied");
    }

    public void deleteReview(String reviewId, String userId) {
        Optional<Review> reviewOpt = reviewRepository.findByIdAndUserId(reviewId, userId);
        if (reviewOpt.isPresent()) {
            reviewRepository.delete(reviewOpt.get());
        } else {
            throw new RuntimeException("Review not found or access denied");
        }
    }

    public List<Review> getReviewsByRating(String userId, Integer rating) {
        return reviewRepository.findByUserIdAndRating(userId, rating);
    }

    public double getAverageRatingForProduct(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public long countReviewsForProduct(String productId) {
        return reviewRepository.countByProductId(productId);
    }

    public long countUserReviews(String userId) {
        return reviewRepository.countByUserId(userId);
    }

    public List<Review> getReviewsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return reviewRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }
}
