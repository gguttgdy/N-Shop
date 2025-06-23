package com.ecommerce.dto;

public class SuccessResponse {
    
    private String message;
    private boolean success = true;
    private long timestamp;
    
    // Constructors
    public SuccessResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public SuccessResponse(String message) {
        this();
        this.message = message;
    }
    
    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
