package com.ecommerce.service;

import com.ecommerce.model.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserProfileMockService {

    // Mock data methods for testing - these should be replaced with real data
    public List<Order> getMockUserOrders(String userId) {
        List<Order> orders = new ArrayList<>();
        
        Order order1 = new Order();
        order1.setId("ORD-2024-001");
        order1.setOrderNumber("ORD-2024-001");
        order1.setStatus(OrderStatus.DELIVERED);
        order1.setTotalAmount(new BigDecimal("299.99"));
        order1.setOrderDate(LocalDateTime.now().minusDays(15));
        orders.add(order1);
        
        Order order2 = new Order();
        order2.setId("ORD-2024-002");
        order2.setOrderNumber("ORD-2024-002");
        order2.setStatus(OrderStatus.SHIPPED);
        order2.setTotalAmount(new BigDecimal("149.50"));
        order2.setOrderDate(LocalDateTime.now().minusDays(3));
        orders.add(order2);
        
        Order order3 = new Order();
        order3.setId("ORD-2024-003");
        order3.setOrderNumber("ORD-2024-003");
        order3.setStatus(OrderStatus.PENDING);
        order3.setTotalAmount(new BigDecimal("89.99"));
        order3.setOrderDate(LocalDateTime.now().minusHours(6));
        orders.add(order3);
        
        return orders;
    }

    public List<Receipt> getMockUserReceipts(String userId) {
        List<Receipt> receipts = new ArrayList<>();
        
        Receipt receipt1 = new Receipt();
        receipt1.setId("RCP-2024-001");
        receipt1.setReceiptNumber("RCP-2024-001");
        receipt1.setTotalAmount(new BigDecimal("299.99"));
        receipt1.setIssuedAt(LocalDateTime.now().minusDays(15));
        receipts.add(receipt1);
        
        Receipt receipt2 = new Receipt();
        receipt2.setId("RCP-2024-002");
        receipt2.setReceiptNumber("RCP-2024-002");
        receipt2.setTotalAmount(new BigDecimal("149.50"));
        receipt2.setIssuedAt(LocalDateTime.now().minusDays(3));
        receipts.add(receipt2);
        
        return receipts;
    }

    public List<Review> getMockUserReviews(String userId) {
        List<Review> reviews = new ArrayList<>();
        
        Review review1 = new Review();
        review1.setId("REV-001");
        review1.setProductId("1");
        review1.setProductName("Wireless Headphones");
        review1.setRating(5);
        review1.setComment("Excellent sound quality!");
        review1.setCreatedAt(LocalDateTime.now().minusDays(10));
        reviews.add(review1);
        
        Review review2 = new Review();
        review2.setId("REV-002");
        review2.setProductId("2");
        review2.setProductName("Bluetooth Speaker");
        review2.setRating(4);
        review2.setComment("Good speaker but battery could be better");
        review2.setCreatedAt(LocalDateTime.now().minusDays(5));
        reviews.add(review2);
        
        Review review3 = new Review();
        review3.setId("REV-003");
        review3.setProductId("3");
        review3.setProductName("Smart Watch");
        review3.setRating(3);
        review3.setComment("Average smartwatch");
        review3.setCreatedAt(LocalDateTime.now().minusDays(2));
        reviews.add(review3);
        
        return reviews;
    }

    public List<Complaint> getMockUserComplaints(String userId) {
        List<Complaint> complaints = new ArrayList<>();
        
        Complaint complaint1 = new Complaint();
        complaint1.setId("CMP-001");
        complaint1.setSubject("Defective product");
        complaint1.setDescription("Headphones have crackling sound");
        complaint1.setStatus(ComplaintStatus.IN_PROGRESS);
        complaint1.setCreatedAt(LocalDateTime.now().minusDays(5));
        complaints.add(complaint1);
        
        Complaint complaint2 = new Complaint();
        complaint2.setId("CMP-002");
        complaint2.setSubject("Late delivery");
        complaint2.setDescription("Order arrived 5 days late");
        complaint2.setStatus(ComplaintStatus.RESOLVED);
        complaint2.setCreatedAt(LocalDateTime.now().minusDays(12));
        complaints.add(complaint2);
        
        Complaint complaint3 = new Complaint();
        complaint3.setId("CMP-003");
        complaint3.setSubject("Wrong item");
        complaint3.setDescription("Received red shirt instead of blue");
        complaint3.setStatus(ComplaintStatus.CLOSED);
        complaint3.setCreatedAt(LocalDateTime.now().minusDays(20));
        complaints.add(complaint3);
        
        return complaints;
    }

    public List<UserDiscount> getMockUserDiscounts(String userId) {
        List<UserDiscount> discounts = new ArrayList<>();
        
        UserDiscount discount1 = new UserDiscount();
        discount1.setId("DSC-001");
        discount1.setDiscountCode("SAVE20");
        discount1.setDiscountName("20% off on electronics");
        discount1.setType(DiscountType.PERCENTAGE);
        discount1.setValue(new BigDecimal("20"));
        discount1.setValidUntil(LocalDateTime.now().plusDays(30));
        discount1.setUsed(false);
        discounts.add(discount1);
        
        UserDiscount discount2 = new UserDiscount();
        discount2.setId("DSC-002");
        discount2.setDiscountCode("FREESHIP");
        discount2.setDiscountName("Free shipping");
        discount2.setType(DiscountType.FIXED_AMOUNT);
        discount2.setValue(new BigDecimal("0"));
        discount2.setValidUntil(LocalDateTime.now().plusDays(15));
        discount2.setUsed(false);
        discounts.add(discount2);
        
        UserDiscount discount3 = new UserDiscount();
        discount3.setId("DSC-003");
        discount3.setDiscountCode("WELCOME10");
        discount3.setDiscountName("Welcome discount");
        discount3.setType(DiscountType.PERCENTAGE);
        discount3.setValue(new BigDecimal("10"));
        discount3.setValidUntil(LocalDateTime.now().minusDays(5));
        discount3.setUsed(true);
        discounts.add(discount3);
        
        return discounts;
    }

    public List<Return> getMockUserReturns(String userId) {
        List<Return> returns = new ArrayList<>();
          Return return1 = new Return();
        return1.setId("RET-001");
        return1.setReturnNumber("RET-001");
        return1.setReason(ReturnReason.DEFECTIVE_PRODUCT);
        return1.setStatus(ReturnStatus.IN_TRANSIT);
        return1.setRefundAmount(new BigDecimal("99.99"));
        return1.setRequestedAt(LocalDateTime.now().minusDays(3));
        returns.add(return1);
        
        Return return2 = new Return();
        return2.setId("RET-002");
        return2.setReturnNumber("RET-002");
        return2.setReason(ReturnReason.NOT_AS_DESCRIBED);
        return2.setStatus(ReturnStatus.COMPLETED);
        return2.setRefundAmount(new BigDecimal("79.99"));
        return2.setRequestedAt(LocalDateTime.now().minusDays(10));
        returns.add(return2);
        
        Return return3 = new Return();
        return3.setId("RET-003");
        return3.setReturnNumber("RET-003");
        return3.setReason(ReturnReason.CHANGED_MIND);
        return3.setStatus(ReturnStatus.REQUESTED);
        return3.setRefundAmount(new BigDecimal("199.99"));
        return3.setRequestedAt(LocalDateTime.now().minusDays(1));
        returns.add(return3);
        
        return returns;
    }
}
