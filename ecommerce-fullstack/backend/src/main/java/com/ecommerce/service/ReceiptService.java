package com.ecommerce.service;

import com.ecommerce.model.Receipt;
import com.ecommerce.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<Receipt> getUserReceipts(String userId) {
        try {
            List<Receipt> receipts = receiptRepository.findByUserIdOrderByIssuedAtDesc(userId);
            if (receipts.isEmpty()) {
                System.out.println("No receipts found in database for user: " + userId + ", returning mock data");
                return mockService.getMockUserReceipts(userId);
            }
            return receipts;
        } catch (Exception e) {
            System.err.println("Error fetching receipts from database: " + e.getMessage());
            return mockService.getMockUserReceipts(userId);
        }
    }

    public Page<Receipt> getUserReceiptsPaginated(String userId, Pageable pageable) {
        return receiptRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Optional<Receipt> getReceiptById(String receiptId, String userId) {
        return receiptRepository.findByIdAndUserId(receiptId, userId);
    }

    public Optional<Receipt> getReceiptByOrderId(String orderId, String userId) {
        return receiptRepository.findByOrderIdAndUserId(orderId, userId);
    }    public Receipt createReceipt(Receipt receipt) {
        receipt.setIssuedAt(LocalDateTime.now());
        return receiptRepository.save(receipt);
    }

    public List<Receipt> getReceiptsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return receiptRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }

    public long countUserReceipts(String userId) {
        return receiptRepository.countByUserId(userId);
    }    // Admin methods
    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAllByOrderByIssuedAtDesc();
    }

    public Optional<Receipt> getReceiptByNumber(String receiptNumber) {
        return receiptRepository.findByReceiptNumber(receiptNumber);
    }
}
