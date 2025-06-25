package com.ecommerce.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class InputValidator {
    
    // Email validation pattern (RFC 5322 compliant)
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    // Strong password pattern
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,50}$"
    );
    
    // Name pattern (letters, spaces, hyphens, apostrophes)
    private static final Pattern NAME_PATTERN = Pattern.compile(
        "^[a-zA-ZÀ-ÿ\\s\\-']{1,50}$"
    );
    
    // Phone number pattern (international format)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+?[1-9]\\d{1,14}$"
    );
    
    // UUID pattern
    private static final Pattern UUID_PATTERN = Pattern.compile(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    );
    
    // SQL injection patterns to detect
    private static final Pattern[] SQL_INJECTION_PATTERNS = {
        Pattern.compile(".*('|(\\-\\-)|(;)|(\\|)|(\\*)|(%))", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*(union|select|insert|delete|update|drop|create|alter|exec|execute)", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*(<script>|</script>|<iframe>|</iframe>|javascript:|vbscript:|onload|onerror)", Pattern.CASE_INSENSITIVE)
    };
    
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        email = email.trim().toLowerCase();
        return EMAIL_PATTERN.matcher(email).matches() && email.length() <= 254;
    }
    
    public boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }
    
    public boolean isValidName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return NAME_PATTERN.matcher(name.trim()).matches();
    }
    
    public boolean isValidPhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return true; // Phone is optional
        }
        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)]", "");
        return PHONE_PATTERN.matcher(cleanPhone).matches();
    }
    
    public boolean isValidUUID(String uuid) {
        if (uuid == null || uuid.trim().isEmpty()) {
            return false;
        }
        return UUID_PATTERN.matcher(uuid).matches();
    }
    
    public boolean containsSQLInjection(String input) {
        if (input == null) {
            return false;
        }
        
        for (Pattern pattern : SQL_INJECTION_PATTERNS) {
            if (pattern.matcher(input).matches()) {
                return true;
            }
        }
        return false;
    }
    
    public String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove potential XSS attacks
        input = input.replaceAll("<script[^>]*>.*?</script>", "")
                    .replaceAll("<iframe[^>]*>.*?</iframe>", "")
                    .replaceAll("javascript:", "")
                    .replaceAll("vbscript:", "")
                    .replaceAll("onload\\s*=", "")
                    .replaceAll("onerror\\s*=", "");
        
        // Limit length
        if (input.length() > 1000) {
            input = input.substring(0, 1000);
        }
        
        return input.trim();
    }
    
    public String sanitizeSearchTerm(String searchTerm) {
        if (searchTerm == null) {
            return null;
        }
        
        // Remove special characters that could be used for injection
        searchTerm = searchTerm.replaceAll("[<>\"'%;()&+]", "");
        
        // Limit length
        if (searchTerm.length() > 100) {
            searchTerm = searchTerm.substring(0, 100);
        }
        
        return searchTerm.trim();
    }
    
    public void validateUserInput(String firstName, String lastName, String email, String password) {
        if (!isValidName(firstName)) {
            throw new IllegalArgumentException("Invalid first name format");
        }
        
        if (!isValidName(lastName)) {
            throw new IllegalArgumentException("Invalid last name format");
        }
        
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (!isValidPassword(password)) {
            throw new IllegalArgumentException(
                "Password must be 8-50 characters long and contain at least one lowercase letter, " +
                "one uppercase letter, one digit, and one special character (@$!%*?&)"
            );
        }
        
        // Check for SQL injection attempts
        if (containsSQLInjection(firstName) || containsSQLInjection(lastName) || 
            containsSQLInjection(email) || containsSQLInjection(password)) {
            throw new IllegalArgumentException("Invalid input detected");
        }
    }
    
    public void validateProductSearch(String searchTerm) {
        if (searchTerm != null && containsSQLInjection(searchTerm)) {
            throw new IllegalArgumentException("Invalid search term");
        }
    }
}
