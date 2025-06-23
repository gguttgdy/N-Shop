package com.ecommerce.service;

import com.ecommerce.model.Return;
import com.ecommerce.model.ReturnStatus;
import com.ecommerce.repository.ReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReturnService {

    @Autowired
    private ReturnRepository returnRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<Return> getUserReturns(String userId) {
        try {
            List<Return> returns = returnRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (returns.isEmpty()) {
                System.out.println("No returns found for user " + userId + ", using mock data as fallback");
                return mockService.getMockUserReturns(userId);
            }
            System.out.println("Found " + returns.size() + " returns for user: " + userId);
            return returns;
        } catch (Exception e) {
            System.err.println("Error fetching returns: " + e.getMessage());
            return mockService.getMockUserReturns(userId);
        }
    }

    public Page<Return> getUserReturnsPaginated(String userId, Pageable pageable) {
        return returnRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Return> getUserReturnsByStatus(String userId, ReturnStatus status) {
        return returnRepository.findByUserIdAndStatus(userId, status);
    }

    public Optional<Return> getReturnById(String returnId, String userId) {
        return returnRepository.findByIdAndUserId(returnId, userId);
    }    public Return createReturn(Return returnItem) {
        returnItem.setRequestedAt(LocalDateTime.now());
        returnItem.setStatus(ReturnStatus.REQUESTED);
        return returnRepository.save(returnItem);
    }    public Return updateReturnStatus(String returnId, String userId, ReturnStatus status) {
        Optional<Return> returnOpt = returnRepository.findByIdAndUserId(returnId, userId);
        if (returnOpt.isPresent()) {
            Return returnItem = returnOpt.get();
            returnItem.setStatus(status);
            return returnRepository.save(returnItem);
        }
        throw new RuntimeException("Return not found or access denied");
    }

    public Return approveReturn(String returnId, String userId) {
        Return returnItem = updateReturnStatus(returnId, userId, ReturnStatus.APPROVED);
        returnItem.setApprovedAt(LocalDateTime.now());
        return returnRepository.save(returnItem);
    }    public Return rejectReturn(String returnId, String userId, String reason) {
        Optional<Return> returnOpt = returnRepository.findByIdAndUserId(returnId, userId);
        if (returnOpt.isPresent()) {
            Return returnItem = returnOpt.get();
            returnItem.setStatus(ReturnStatus.REJECTED);
            returnItem.setAdminNotes(reason); // using adminNotes instead of rejectReason
            return returnRepository.save(returnItem);
        }
        throw new RuntimeException("Return not found or access denied");
    }

    public Return processReturn(String returnId, String userId) {
        return updateReturnStatus(returnId, userId, ReturnStatus.IN_TRANSIT);
    }

    public Return completeReturn(String returnId, String userId) {
        Return returnItem = updateReturnStatus(returnId, userId, ReturnStatus.COMPLETED);
        returnItem.setCompletedAt(LocalDateTime.now());
        return returnRepository.save(returnItem);
    }

    public List<Return> getReturnsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return returnRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }

    public long countUserReturns(String userId) {
        return returnRepository.countByUserId(userId);
    }

    public long countUserReturnsByStatus(String userId, ReturnStatus status) {
        return returnRepository.countByUserIdAndStatus(userId, status);
    }    // Admin methods
    public List<Return> getAllReturns() {
        return returnRepository.findAllByOrderByRequestedAtDesc();
    }

    public List<Return> getReturnsByStatus(ReturnStatus status) {
        return returnRepository.findByStatusOrderByRequestedAtDesc(status);
    }
}
