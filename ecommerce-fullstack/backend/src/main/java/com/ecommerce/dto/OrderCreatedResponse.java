package com.ecommerce.dto;

public class OrderCreatedResponse {
    
    private String message;
    private String orderNumber;
    private String orderId;
    private boolean success = true;
    private long timestamp;
    
    // Constructors
    public OrderCreatedResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public OrderCreatedResponse(String message, String orderNumber, String orderId) {
        this();
        this.message = message;
        this.orderNumber = orderNumber;
        this.orderId = orderId;
    }
    
    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
