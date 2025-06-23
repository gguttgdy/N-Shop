package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "returns")
public class Return {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private Order order;
    
    private String returnNumber;
    private ReturnReason reason;
    private ReturnStatus status;
    private String description;
    private List<ReturnItem> items;
    private BigDecimal refundAmount;
    private String refundMethod;
    private String refundTransactionId;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime refundedAt;
    private LocalDateTime completedAt;
    private String trackingNumber;
    private String adminNotes;
    private List<String> returnImages;
    
    // Constructors
    public Return() {
        this.requestedAt = LocalDateTime.now();
        this.status = ReturnStatus.REQUESTED;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    
    public String getReturnNumber() { return returnNumber; }
    public void setReturnNumber(String returnNumber) { this.returnNumber = returnNumber; }
    
    public ReturnReason getReason() { return reason; }
    public void setReason(ReturnReason reason) { this.reason = reason; }
    
    public ReturnStatus getStatus() { return status; }
    public void setStatus(ReturnStatus status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<ReturnItem> getItems() { return items; }
    public void setItems(List<ReturnItem> items) { this.items = items; }
    
    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }
    
    public String getRefundMethod() { return refundMethod; }
    public void setRefundMethod(String refundMethod) { this.refundMethod = refundMethod; }
    
    public String getRefundTransactionId() { return refundTransactionId; }
    public void setRefundTransactionId(String refundTransactionId) { this.refundTransactionId = refundTransactionId; }
    
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getRefundedAt() { return refundedAt; }
    public void setRefundedAt(LocalDateTime refundedAt) { this.refundedAt = refundedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    
    public List<String> getReturnImages() { return returnImages; }
    public void setReturnImages(List<String> returnImages) { this.returnImages = returnImages; }
    
    public void approve() {
        this.status = ReturnStatus.APPROVED;
        this.approvedAt = LocalDateTime.now();
    }
    
    public void complete() {
        this.status = ReturnStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
    
    public void refund(String transactionId) {
        this.status = ReturnStatus.REFUNDED;
        this.refundTransactionId = transactionId;
        this.refundedAt = LocalDateTime.now();
    }
}

class ReturnItem {
    private String productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
    private String condition;
    
    // Constructors
    public ReturnItem() {}
    
    public ReturnItem(String productId, String productName, int quantity, BigDecimal price) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }
    
    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
}
