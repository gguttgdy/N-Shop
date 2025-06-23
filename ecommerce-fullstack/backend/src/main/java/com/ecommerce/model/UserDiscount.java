package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "user_discounts")
public class UserDiscount {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private String discountCode;
    private String discountName;
    private DiscountType type;
    private BigDecimal value; // percentage or fixed amount
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private boolean isUsed;
    private LocalDateTime usedAt;
    private String usedOrderId;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime createdAt;
    
    // Constructors
    public UserDiscount() {
        this.createdAt = LocalDateTime.now();
        this.isUsed = false;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getDiscountCode() { return discountCode; }
    public void setDiscountCode(String discountCode) { this.discountCode = discountCode; }
    
    public String getDiscountName() { return discountName; }
    public void setDiscountName(String discountName) { this.discountName = discountName; }
    
    public DiscountType getType() { return type; }
    public void setType(DiscountType type) { this.type = type; }
    
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    
    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    
    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
    
    public boolean isUsed() { return isUsed; }
    public void setUsed(boolean used) { isUsed = used; }
    
    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
    
    public String getUsedOrderId() { return usedOrderId; }
    public void setUsedOrderId(String usedOrderId) { this.usedOrderId = usedOrderId; }
    
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return !isUsed && 
               (validFrom == null || now.isAfter(validFrom)) && 
               (validUntil == null || now.isBefore(validUntil));
    }
    
    public void markAsUsed(String orderId) {
        this.isUsed = true;
        this.usedAt = LocalDateTime.now();
        this.usedOrderId = orderId;
    }
    
    public BigDecimal calculateDiscountAmount(BigDecimal orderAmount) {
        if (!isValid() || (minOrderAmount != null && orderAmount.compareTo(minOrderAmount) < 0)) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal discountAmount;
        if (type == DiscountType.PERCENTAGE) {
            discountAmount = orderAmount.multiply(value).divide(BigDecimal.valueOf(100));
        } else {
            discountAmount = value;
        }
        
        if (maxDiscountAmount != null && discountAmount.compareTo(maxDiscountAmount) > 0) {
            discountAmount = maxDiscountAmount;
        }
        
        return discountAmount;
    }
}
