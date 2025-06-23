package com.ecommerce.service;

import com.ecommerce.model.Complaint;
import com.ecommerce.model.ComplaintStatus;
import com.ecommerce.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;
    
    @Autowired
    private UserProfileMockService mockService;    public List<Complaint> getUserComplaints(String userId) {
        try {
            List<Complaint> complaints = complaintRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (complaints.isEmpty()) {
                System.out.println("No complaints found for user " + userId + ", using mock data as fallback");
                return mockService.getMockUserComplaints(userId);
            }
            System.out.println("Found " + complaints.size() + " complaints for user: " + userId);
            return complaints;
        } catch (Exception e) {
            System.err.println("Error fetching complaints: " + e.getMessage());
            return mockService.getMockUserComplaints(userId);
        }
    }

    public Page<Complaint> getUserComplaintsPaginated(String userId, Pageable pageable) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Complaint> getUserComplaintsByStatus(String userId, ComplaintStatus status) {
        return complaintRepository.findByUserIdAndStatus(userId, status);
    }

    public Optional<Complaint> getComplaintById(String complaintId, String userId) {
        return complaintRepository.findByIdAndUserId(complaintId, userId);
    }    public Complaint createComplaint(Complaint complaint) {
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.OPEN);
        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(String complaintId, String userId, ComplaintStatus status) {
        Optional<Complaint> complaintOpt = complaintRepository.findByIdAndUserId(complaintId, userId);
        if (complaintOpt.isPresent()) {
            Complaint complaint = complaintOpt.get();
            complaint.setStatus(status);
            complaint.setUpdatedAt(LocalDateTime.now());
            return complaintRepository.save(complaint);
        }
        throw new RuntimeException("Complaint not found or access denied");
    }    public Complaint addResponseToComplaint(String complaintId, String userId, String response) {
        Optional<Complaint> complaintOpt = complaintRepository.findByIdAndUserId(complaintId, userId);
        if (complaintOpt.isPresent()) {
            Complaint complaint = complaintOpt.get();
            complaint.setResolution(response);
            complaint.setStatus(ComplaintStatus.RESOLVED);
            complaint.setUpdatedAt(LocalDateTime.now());
            return complaintRepository.save(complaint);
        }
        throw new RuntimeException("Complaint not found or access denied");
    }

    public void deleteComplaint(String complaintId, String userId) {
        Optional<Complaint> complaintOpt = complaintRepository.findByIdAndUserId(complaintId, userId);
        if (complaintOpt.isPresent()) {
            complaintRepository.delete(complaintOpt.get());
        } else {
            throw new RuntimeException("Complaint not found or access denied");
        }
    }

    public List<Complaint> getComplaintsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return complaintRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }

    public long countUserComplaints(String userId) {
        return complaintRepository.countByUserId(userId);
    }

    public long countUserComplaintsByStatus(String userId, ComplaintStatus status) {
        return complaintRepository.countByUserIdAndStatus(userId, status);
    }

    // Admin methods
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatusOrderByCreatedAtDesc(status);
    }
}
