package com.ecommerce.security;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

@Component
public class DataSanitizer {
    
    // Patterns for validation
    private static final Pattern XSS_PATTERN = Pattern.compile(
        "(?i)<script[^>]*>.*?</script>|javascript:|on\\w+\\s*=|<iframe|<object|<embed|<link|<meta|<style",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL
    );
    
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "(?i)(\\b(select|insert|update|delete|drop|create|alter|exec|union|script)\\b)" +
        "|(--)|(\\/\\*)|((\\')+(\\s)*(\\bor\\b|\\band\\b))|((\\')+(\\s)*(=))" +
        "|(\\bor\\b(\\s)+(\\d)+[=<>])", 
        Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]+>");
    
    /**
     * Sanitize string input to prevent XSS attacks
     */
    public String sanitizeForXSS(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove potential XSS patterns
        String sanitized = XSS_PATTERN.matcher(input).replaceAll("");
        
        // Encode HTML entities
        sanitized = sanitized.replace("<", "&lt;")
                            .replace(">", "&gt;")
                            .replace("\"", "&quot;")
                            .replace("'", "&#x27;")
                            .replace("/", "&#x2F;");
        
        return sanitized.trim();
    }
    
    /**
     * Sanitize string input to prevent SQL injection
     */
    public String sanitizeForSQL(String input) {
        if (input == null) {
            return null;
        }
        
        // Check for SQL injection patterns
        if (SQL_INJECTION_PATTERN.matcher(input).find()) {
            throw new IllegalArgumentException("Potentially malicious input detected");
        }
        
        // Escape single quotes for SQL
        return input.replace("'", "''").trim();
    }
    
    /**
     * Remove HTML tags from input
     */
    public String stripHtml(String input) {
        if (input == null) {
            return null;
        }
        
        return HTML_TAG_PATTERN.matcher(input).replaceAll("").trim();
    }
    
    /**
     * Validate email format
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        Pattern emailPattern = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        );
        
        return emailPattern.matcher(email).matches();
    }
    
    /**
     * Validate phone number format
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return true; // Optional field
        }
        
        Pattern phonePattern = Pattern.compile("^\\+?[1-9]\\d{1,14}$");
        return phonePattern.matcher(phoneNumber.replaceAll("[\\s-()]", "")).matches();
    }
    
    /**
     * Validate and sanitize text input
     */
    public String sanitizeText(String input) {
        if (input == null) {
            return null;
        }
        
        // First sanitize for XSS
        String sanitized = sanitizeForXSS(input);
        
        // Then sanitize for SQL injection
        sanitized = sanitizeForSQL(sanitized);
        
        // Remove extra whitespace
        sanitized = sanitized.replaceAll("\\s+", " ").trim();
        
        return sanitized;
    }
    
    /**
     * Validate string length
     */
    public boolean isValidLength(String input, int minLength, int maxLength) {
        if (input == null) {
            return minLength == 0;
        }
        
        int length = input.trim().length();
        return length >= minLength && length <= maxLength;
    }
    
    /**
     * Validate that string contains only allowed characters
     */
    public boolean containsOnlyAllowedChars(String input, String allowedCharsRegex) {
        if (input == null || input.trim().isEmpty()) {
            return true;
        }
        
        Pattern pattern = Pattern.compile(allowedCharsRegex);
        return pattern.matcher(input).matches();
    }
}
