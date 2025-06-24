package com.ecommerce.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    
    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public RateLimitFilter(RateLimitService rateLimitService, ObjectMapper objectMapper) {
        this.rateLimitService = rateLimitService;
        this.objectMapper = objectMapper;
    }
      @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String clientId = getClientId(request);
        
        if (!rateLimitService.isAllowed(clientId)) {
            handleRateLimitExceeded(request, response, clientId);
            return;
        }
        
        // Add rate limit headers
        addRateLimitHeaders(response, clientId);
        
        filterChain.doFilter(request, response);
    }
    
    private String getClientId(HttpServletRequest request) {
        // Try to get user ID from JWT token first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // In a real implementation, you would extract user ID from JWT
            // For now, we'll use IP address
        }
        
        // Fallback to IP address
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private void handleRateLimitExceeded(HttpServletRequest request, HttpServletResponse response, 
                                       String clientId) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Rate limit exceeded");
        errorResponse.put("message", "Too many requests. Please try again later.");
        errorResponse.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
        errorResponse.put("timestamp", System.currentTimeMillis());
        errorResponse.put("path", request.getRequestURI());
        
        long timeUntilReset = rateLimitService.getTimeUntilReset(clientId);
        errorResponse.put("retryAfter", timeUntilReset / 1000); // in seconds
        
        // Add rate limit headers
        addRateLimitHeaders(response, clientId);
        response.setHeader("Retry-After", String.valueOf(timeUntilReset / 1000));
        
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
    
    private void addRateLimitHeaders(HttpServletResponse response, String clientId) {
        int remaining = rateLimitService.getRemainingRequests(clientId);
        long resetTime = rateLimitService.getTimeUntilReset(clientId);
        
        response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));
        response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + resetTime));
    }
      @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Don't apply rate limiting to health checks and static resources
        return path.startsWith("/actuator/") || 
               path.startsWith("/static/") || 
               path.startsWith("/css/") || 
               path.startsWith("/js/") || 
               path.startsWith("/images/");
    }
}
