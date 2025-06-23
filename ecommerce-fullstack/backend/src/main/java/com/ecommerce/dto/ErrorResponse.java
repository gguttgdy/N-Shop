package com.ecommerce.dto;

public class ErrorResponse {
    
    private String message;
    private int status;
    private long timestamp;
    
    // Constructors
    public ErrorResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public ErrorResponse(String message) {
        this();
        this.message = message;
        this.status = 400;
    }
    
    public ErrorResponse(String message, int status) {
        this();
        this.message = message;
        this.status = status;
    }
    
    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
