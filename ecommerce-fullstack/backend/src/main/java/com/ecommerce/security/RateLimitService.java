package com.ecommerce.security;

import com.ecommerce.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RateLimitService {
    
    private final AppProperties appProperties;
    private final ConcurrentHashMap<String, ClientRequest> requests = new ConcurrentHashMap<>();
    
    @Autowired
    public RateLimitService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }
    
    /**
     * Check if the request is allowed based on rate limiting rules
     */
    public boolean isAllowed(String clientId) {
        long currentTime = System.currentTimeMillis();
        long windowSize = appProperties.getSecurity().getRateLimit().getWindow();
        int maxRequests = appProperties.getSecurity().getRateLimit().getRequests();
        
        ClientRequest clientRequest = requests.computeIfAbsent(clientId, k -> new ClientRequest());
        
        synchronized (clientRequest) {
            // Reset window if expired
            if (currentTime - clientRequest.windowStart.get() > windowSize) {
                clientRequest.windowStart.set(currentTime);
                clientRequest.requestCount.set(0);
            }
            
            // Check if request limit exceeded
            if (clientRequest.requestCount.get() >= maxRequests) {
                return false;
            }
            
            // Increment request count
            clientRequest.requestCount.incrementAndGet();
            return true;
        }
    }
    
    /**
     * Get remaining requests for a client
     */
    public int getRemainingRequests(String clientId) {
        int maxRequests = appProperties.getSecurity().getRateLimit().getRequests();
        ClientRequest clientRequest = requests.get(clientId);
        
        if (clientRequest == null) {
            return maxRequests;
        }
        
        long currentTime = System.currentTimeMillis();
        long windowSize = appProperties.getSecurity().getRateLimit().getWindow();
        
        synchronized (clientRequest) {
            // Reset window if expired
            if (currentTime - clientRequest.windowStart.get() > windowSize) {
                return maxRequests;
            }
            
            return Math.max(0, maxRequests - clientRequest.requestCount.get());
        }
    }
    
    /**
     * Get time until window reset
     */
    public long getTimeUntilReset(String clientId) {
        ClientRequest clientRequest = requests.get(clientId);
        
        if (clientRequest == null) {
            return 0;
        }
        
        long currentTime = System.currentTimeMillis();
        long windowSize = appProperties.getSecurity().getRateLimit().getWindow();
        long windowStart = clientRequest.windowStart.get();
        
        return Math.max(0, (windowStart + windowSize) - currentTime);
    }
    
    /**
     * Clear expired entries to prevent memory leaks
     */
    public void cleanup() {
        long currentTime = System.currentTimeMillis();
        long windowSize = appProperties.getSecurity().getRateLimit().getWindow();
        
        requests.entrySet().removeIf(entry -> {
            ClientRequest clientRequest = entry.getValue();
            return currentTime - clientRequest.windowStart.get() > windowSize * 2;
        });
    }
    
    private static class ClientRequest {
        private final AtomicLong windowStart;
        private final AtomicInteger requestCount;
        
        public ClientRequest() {
            this.windowStart = new AtomicLong(System.currentTimeMillis());
            this.requestCount = new AtomicInteger(0);
        }
    }
}
